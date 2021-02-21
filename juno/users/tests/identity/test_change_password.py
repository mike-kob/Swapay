import pytest
from django.contrib.auth import authenticate
from model_mommy import mommy

from users.bl.identity import ChangePasswordForm

pytestmark = [pytest.mark.django_db]


def test_change_password_weak():
    user = mommy.make("users.User")
    form = ChangePasswordForm(data={"user": user, "password1": "1234", "password2": "1234"})

    assert not form.is_valid()
    assert form.errors.get("password1")


def test_change_password_dont_match():
    user = mommy.make("users.User")
    form = ChangePasswordForm(data={"user": user, "password1": "aoksopipk;l,f", "password2": "fl;asjkflj"})

    assert not form.is_valid()
    assert form.errors.get("__all__")


def test_change_password_success():
    user = mommy.make("users.User")
    form = ChangePasswordForm(data={"user": user, "password1": "aoksopipk;l,f", "password2": "aoksopipk;l,f"})

    assert form.is_valid()
    form.save()

    user2 = authenticate(username=user.username, password="aoksopipk;l,f")
    assert user.id == user2.id
