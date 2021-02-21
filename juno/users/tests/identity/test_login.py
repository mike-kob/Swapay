from unittest import mock

import pytest
from model_mommy import mommy

from users.bl.identity import ModelLoginForm
from users.models import AccountHistoryLog

pytestmark = [pytest.mark.django_db]


def test_login_invalid_password():
    user = mommy.make("users.User", username="valid_username")
    user.set_password("valid_password")
    user.save()

    form = ModelLoginForm(
        data={
            "username": "valid_username",
            "password": "not_valid_password",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("__all__")


def test_login_success(mocker):
    user = mommy.make("users.User", username="valid_username")
    user.set_password("valid_password")
    user.save()
    mocker.patch("users.bl.identity.forms.login.get_client_ip", return_value="")

    form = ModelLoginForm(
        data={
            "username": "valid_username",
            "password": "valid_password",
        }
    )

    assert form.is_valid()
    user2 = form.login(mock.MagicMock())
    assert user.id == user2.id

    assert AccountHistoryLog.objects.count() == 1
    assert AccountHistoryLog.objects.first().action == AccountHistoryLog.ACTIONS.LOGIN
