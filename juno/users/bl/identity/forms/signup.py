from django import forms
from django.contrib.auth import password_validation
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError

from users.bl.identity.logging import log_account_event
from users.bl.identity.utils import send_verify_email, send_greeting_email
from users.models import User, AccountHistoryLog


class ModelSignupForm(forms.Form):
    username_validator = UnicodeUsernameValidator()

    username = forms.CharField(required=True, validators=[username_validator])
    email = forms.EmailField(required=True)

    password1 = forms.CharField(required=True)
    password2 = forms.CharField(required=True)

    def clean_username(self):
        username = self.cleaned_data["username"]
        username = User.normalize_username(username)
        if User.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError("Username taken")

        return username

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("Email taken")

        return email

    def clean_password1(self):
        password = self.cleaned_data["password1"]
        try:
            password_validation.validate_password(password)
        except ValidationError as e:
            raise forms.ValidationError(e)

        return password

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")
        if password1 != password2:
            raise forms.ValidationError("Passwords do not match")

        return cleaned_data

    def save(self):
        data = self.cleaned_data
        user = User.objects.create_user(
            username=data["username"], password=data["password1"], email=data["email"]
        )
        send_verify_email(user, data["email"])
        send_greeting_email(user, data["email"])

        log_account_event(user, AccountHistoryLog.ACTIONS.SIGNUP)
        return user
