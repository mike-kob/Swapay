from datetime import timedelta

import pytest
from django.utils import timezone
from freezegun import freeze_time
from model_mommy import mommy

from users.bl.identity.constants import EMAIL_EXPIRE_PERIOD
from users.bl.identity import ChangeEmailRequestForm, ChangeEmailRefreshForm
from users.models import EmailConfirmation, AccountHistoryLog

pytestmark = [pytest.mark.django_db]


def test_change_email_exists():
    mommy.make("users.User", email="valid@example.com")
    user = mommy.make("users.User")
    form = ChangeEmailRequestForm(data={"user": user, "new_email": "valid@example.com"})

    assert not form.is_valid()
    assert form.errors.get("new_email")


def test_change_email_success(mocker):
    user = mommy.make("users.User", email="valid2@example.com")
    form = ChangeEmailRequestForm(data={"user": user, "new_email": "valid@example.com"})
    mock = mocker.patch("users.bl.identity.utils.email_service")

    assert form.is_valid()
    form.save()

    assert EmailConfirmation.objects.count() == 1
    assert EmailConfirmation.objects.first().email == "valid@example.com"

    mock.send_email.assert_called()
    assert AccountHistoryLog.objects.count() == 1
    log = AccountHistoryLog.objects.first()
    assert log.action == AccountHistoryLog.ACTIONS.CHANGE_EMAIL_REQUEST


def test_change_email_with_expired_token(mocker):
    user = mommy.make("users.User", email="old@example.com")
    time = timezone.now() - EMAIL_EXPIRE_PERIOD - timedelta(seconds=1)
    with freeze_time(time):
        conf = mommy.make("users.EmailConfirmation", email="new@example.com", user=user)

    form = ChangeEmailRefreshForm(data={"token": conf.token})

    assert not form.is_valid()
    assert form.errors.get("token")


def test_change_email_with_invalid_token():
    form = ChangeEmailRefreshForm(data={"token": "invalid_token"})

    assert not form.is_valid()
    assert form.errors.get("token")


def test_change_email_with_token_success(mocker):
    user = mommy.make("users.User", email="old@example.com")
    conf = mommy.make("users.EmailConfirmation", email="new@example.com", user=user)

    form = ChangeEmailRefreshForm(data={"token": conf.token})

    assert form.is_valid()
    form.save()

    user.refresh_from_db()
    assert user.verified
    assert user.email == "new@example.com"

    assert AccountHistoryLog.objects.count() == 1
    assert AccountHistoryLog.objects.first().action == AccountHistoryLog.ACTIONS.CHANGE_EMAIL_SUCCESS
