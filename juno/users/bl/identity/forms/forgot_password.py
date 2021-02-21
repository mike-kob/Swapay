from django import forms
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError

from users.bl.identity.logging import log_account_event
from users.bl.identity.utils import send_forgot_password, validate_forgot_password_token
from users.models import User, AccountHistoryLog


class ForgotPasswordRequestForm(forms.Form):
    email = forms.EmailField(required=True)

    def save(self):
        email = self.cleaned_data["email"]
        try:
            user = User.objects.get(email__iexact=email, verified=True)
        except User.DoesNotExist:
            return

        send_forgot_password(user)
        log_account_event(user, AccountHistoryLog.ACTIONS.FORGOT_PASSWORD_REQUEST, {"email": email})


class ForgotPasswordRefreshForm(forms.Form):
    token = forms.CharField(required=True)

    password1 = forms.CharField(required=True)
    password2 = forms.CharField(required=True)

    def clean_token(self):
        token = self.cleaned_data["token"]
        r_token = validate_forgot_password_token(token)
        self.cleaned_data["user"] = r_token.user

        self.cleaned_data["token_obj"] = r_token
        return token

    def clean_password1(self):
        password = self.cleaned_data["password1"]
        try:
            password_validation.validate_password(password)
        except ValidationError as e:
            raise forms.ValidationError(e)

        return password

    def clean(self):
        cleaned_data = super().clean()
        if "password1" not in cleaned_data:
            return cleaned_data

        password1 = cleaned_data["password1"]
        password2 = cleaned_data["password2"]
        if password1 != password2:
            raise forms.ValidationError("Passwords do not match")

        return cleaned_data

    def save(self):
        password = self.cleaned_data["password1"]
        user = self.cleaned_data["user"]
        token_obj = self.cleaned_data["token_obj"]
        user.set_password(password)

        user.save()
        token_obj.delete()
        log_account_event(user, AccountHistoryLog.ACTIONS.FORGOT_PASSWORD_SUCCESS)
