import pytest
from django.contrib.auth import authenticate
from django.utils import timezone
from freezegun import freeze_time
from model_mommy import mommy

from users.bl.identity import ModelSignupForm
from users.models import User, EmailConfirmation, AccountHistoryLog

pytestmark = [pytest.mark.django_db]


def test_signup_invalid_password():
    form = ModelSignupForm(
        data={
            "username": "valid_username",
            "email": "example@example.com",
            "password1": "dlkp3o42p k0-0kffs0kf[p",
            "password2": "dlasjlkjlkdjaso io2eu90",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("__all__")


def test_signup_weak_password1():
    form = ModelSignupForm(
        data={
            "username": "valid_username",
            "email": "example@example.com",
            "password1": "12345678",
            "password2": "12345678",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("password1")


def test_signup_weak_password2():
    form = ModelSignupForm(
        data={
            "username": "valid_username",
            "email": "example@example.com",
            "password1": "4ip*k p",
            "password2": "4ip*k p",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("password1")


def test_signup_duplicate_email():
    email = "example@example.com"
    mommy.make("users.User", username="valid_username", email=email)

    form = ModelSignupForm(
        data={
            "username": "valid_username2",
            "email": email,
            "password1": "r0jp32rj 324",
            "password2": "r0jp32rj 324",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("email")


def test_signup_duplicate_username():
    username = "username1"
    mommy.make("users.User", username=username)

    form = ModelSignupForm(
        data={
            "username": username,
            "email": "valid@example.com",
            "password1": "r0jp32rj 324",
            "password2": "r0jp32rj 324",
        }
    )

    assert not form.is_valid()
    assert form.errors.get("username")


def test_signup_success(mocker):
    mock = mocker.patch("users.bl.identity.utils.email_service")
    form = ModelSignupForm(
        data={
            "username": "valid.username",
            "email": "valid@example.com",
            "password1": "r0jp32rj 324",
            "password2": "r0jp32rj 324",
        }
    )
    time = timezone.now()

    assert form.is_valid()
    with freeze_time(time):
        form.save()

    # Check email sent
    assert len(mock.send_email.call_args_list) == 2
    assert mock.send_email.call_args_list[0][0][0] == "valid@example.com"

    # Check user created
    assert User.objects.count() == 1
    user = User.objects.first()
    assert user.username == "valid.username"
    assert user.email == "valid@example.com"
    assert user.created == time

    # Check user will be able to login
    user2 = authenticate(username="valid.username", password="r0jp32rj 324")
    assert user.id == user2.id

    # Check email confirmation created
    assert EmailConfirmation.objects.count() == 1
    conf = EmailConfirmation.objects.first()
    assert conf.email == "valid@example.com"
    assert conf.created == time

    # Check account log created
    assert AccountHistoryLog.objects.count() == 1
    log = AccountHistoryLog.objects.first()
    assert log.action == AccountHistoryLog.ACTIONS.SIGNUP
    assert log.created == time
