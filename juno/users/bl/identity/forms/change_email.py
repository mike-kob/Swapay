from django import forms

from users.bl.identity.logging import log_account_event
from users.bl.identity.utils import (
    send_verify_email,
    validate_email_token,
)
from users.models import User, AccountHistoryLog


class ChangeEmailRequestForm(forms.Form):

    user = forms.ModelChoiceField(required=True, queryset=User.objects.all())
    new_email = forms.EmailField(required=True)

    def clean_new_email(self):
        new_email = self.cleaned_data["new_email"]
        if User.objects.filter(email__iexact=new_email).exists():
            raise forms.ValidationError("Email in use")

        return new_email

    def save(self):
        user = self.cleaned_data["user"]
        new_email = self.cleaned_data["new_email"]

        send_verify_email(user, new_email)

        extra = {"new_email": new_email}
        log_account_event(user, AccountHistoryLog.ACTIONS.CHANGE_EMAIL_REQUEST, extra)


class ChangeEmailRefreshForm(forms.Form):
    token = forms.CharField(required=True)

    def clean_token(self):
        token = self.cleaned_data["token"]
        conf = validate_email_token(token)
        self.cleaned_data["user"] = conf.user
        self.cleaned_data["new_email"] = conf.email

        conf.delete()
        return token

    def save(self):
        user = self.cleaned_data["user"]
        new_email = self.cleaned_data["new_email"]

        user.email = new_email
        user.verified = True
        user.save()

        extra = {"new_email": new_email}
        log_account_event(user, AccountHistoryLog.ACTIONS.CHANGE_EMAIL_SUCCESS, extra)
