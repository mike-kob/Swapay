from unittest import mock

import pytest
from model_mommy import mommy

from users.constants import SOCIAL_PROVIDERS
from users.bl.identity import GoogleLoginForm
from users.models import AccountHistoryLog

pytestmark = [pytest.mark.django_db]


def test_g_login_invalid_token(mocker):
    mocker.patch("users.bl.identity.utils.id_token.verify_oauth2_token", side_effect=Exception())
    form = GoogleLoginForm(
        data={
            "id_token": "invalid_token",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("id_token")


def test_g_login_success(mocker):
    user = mommy.make("users.User", social_provider=SOCIAL_PROVIDERS.GOOGLE, social_uid="1")
    user_info = {
        "email": "valid.valid@example.com",
        "given_name": "Name1",
        "family_name": "Name2",
        "iss": "https://accounts.google.com",
        "sub": "1",
    }
    mocker.patch("users.bl.identity.utils.id_token.verify_oauth2_token", return_value=user_info)
    mocker.patch("users.bl.identity.forms.google_login.get_client_ip", return_value="")
    form = GoogleLoginForm(
        data={
            "id_token": "valid_token",
        }
    )

    assert form.is_valid()
    user2 = form.login(mock.MagicMock())
    assert user.id == user2.id

    assert AccountHistoryLog.objects.count() == 1
    assert AccountHistoryLog.objects.first().action == AccountHistoryLog.ACTIONS.S_LOGIN
