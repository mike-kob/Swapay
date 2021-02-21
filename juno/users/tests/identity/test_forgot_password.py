from datetime import timedelta

import pytest
from django.contrib.auth import authenticate
from django.utils import timezone
from freezegun import freeze_time
from model_mommy import mommy

from users.bl.identity.constants import FORGOT_PASSWORD_EXPIRE_PERIOD
from users.bl.identity import (
    ForgotPasswordRequestForm,
    ForgotPasswordRefreshForm,
)
from users.models import AccountHistoryLog, RefreshToken

pytestmark = [pytest.mark.django_db]


def test_forgot_password_doesnt_exist(mocker):
    form = ForgotPasswordRequestForm(data={"email": "not_valid@example.com"})
    mock = mocker.patch("users.bl.identity.utils.email_service")

    assert form.is_valid()
    form.save()

    assert RefreshToken.objects.count() == 0
    mock.send_email.assert_not_called()


def test_forgot_password_request_success(mocker):
    user = mommy.make("users.User", email="valid@example.com", verified=True)
    form = ForgotPasswordRequestForm(data={"email": "valid@example.com"})
    mock = mocker.patch("users.bl.identity.utils.email_service")

    assert form.is_valid()
    form.save()

    assert RefreshToken.objects.count() == 1
    assert RefreshToken.objects.first().user.id == user.id
    mock.send_email.assert_called_once()

    assert AccountHistoryLog.objects.count() == 1
    assert AccountHistoryLog.objects.first().action == AccountHistoryLog.ACTIONS.FORGOT_PASSWORD_REQUEST


def test_forgot_password_invalid_token():
    form = ForgotPasswordRefreshForm(
        data={
            "token": "invalid_token",
            "password1": "31kc;,9j;jasd",
            "password2": "31kc;,9j;jasd",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("token")


def test_forgot_password_expired_token():
    user = mommy.make("users.User")
    time = timezone.now() - FORGOT_PASSWORD_EXPIRE_PERIOD - timedelta(seconds=1)
    with freeze_time(time):
        token = mommy.make("users.RefreshToken", user=user)

    form = ForgotPasswordRefreshForm(
        data={
            "token": token.token,
            "password1": "31kc;,9j;jasd",
            "password2": "31kc;,9j;jasd",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("token")


def test_forgot_password_token_success():
    user = mommy.make("users.User", username="valid_username")
    token = mommy.make("users.RefreshToken", user=user)

    form = ForgotPasswordRefreshForm(
        data={
            "token": token.token,
            "password1": "31kc;,9j;jasd",
            "password2": "31kc;,9j;jasd",
        }
    )

    assert form.is_valid()
    form.save()
    user2 = authenticate(username="valid_username", password="31kc;,9j;jasd")
    assert user.id == user2.id

    assert AccountHistoryLog.objects.count() == 1
    assert AccountHistoryLog.objects.first().action == AccountHistoryLog.ACTIONS.FORGOT_PASSWORD_SUCCESS
