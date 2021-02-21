import pytest
from model_mommy import mommy

from users.constants import SOCIAL_PROVIDERS
from users.bl.identity import GoogleSignupForm
from users.models import User, AccountHistoryLog

pytestmark = [pytest.mark.django_db]


def test_g_signup_invalid_token(mocker):
    mocker.patch("users.bl.identity.utils.id_token.verify_oauth2_token", side_effect=Exception())
    form = GoogleSignupForm(
        data={
            "id_token": "invalid_token",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("id_token")


def test_g_signup_token_wrong_issuer(mocker):
    mocker.patch("users.bl.identity.utils.id_token.verify_oauth2_token", return_value={"iss": "wrong_issuer"})
    form = GoogleSignupForm(
        data={
            "id_token": "wrong_token",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("id_token")


def test_g_signup_token_success(mocker):
    user_info = {
        "email": "valid.valid@example.com",
        "given_name": "Name1",
        "family_name": "Name2",
        "iss": "https://accounts.google.com",
        "sub": "1",
    }
    mocker.patch("users.bl.identity.utils.id_token.verify_oauth2_token", return_value=user_info)
    form = GoogleSignupForm(
        data={
            "id_token": "valid_token",
        }
    )

    assert form.is_valid()
    form.save()
    assert User.objects.count() == 1
    user = User.objects.first()
    assert user.email == "valid.valid@example.com"
    assert user.username == "valid.valid"
    assert user.first_name == "Name1"
    assert user.last_name == "Name2"
    assert user.social_provider == SOCIAL_PROVIDERS.GOOGLE
    assert user.social_uid == "1"

    assert AccountHistoryLog.objects.count() == 1


def test_g_signup_token_success_duplicate_username(mocker):
    mommy.make("users.User", username="valid.valid")
    user_info = {
        "email": "valid.valid@example.com",
        "given_name": "Name1",
        "family_name": "Name2",
        "iss": "https://accounts.google.com",
        "sub": "1",
    }
    mocker.patch("users.bl.identity.utils.id_token.verify_oauth2_token", return_value=user_info)
    mocker.patch("users.bl.identity.forms.google_signup.random.randint", return_value=5)
    form = GoogleSignupForm(
        data={
            "id_token": "valid_token",
        }
    )

    assert form.is_valid()
    form.save()
    assert User.objects.count() == 2
    user = User.objects.latest("id")
    assert user.email == "valid.valid@example.com"
    assert user.username == "valid.valid5"
    assert user.first_name == "Name1"
    assert user.last_name == "Name2"
    assert user.social_provider == SOCIAL_PROVIDERS.GOOGLE
    assert user.social_uid == "1"

    assert AccountHistoryLog.objects.count() == 1
