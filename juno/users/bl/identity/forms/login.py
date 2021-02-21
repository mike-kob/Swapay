from django import forms
from django.contrib.auth import authenticate, login as django_login

from users.bl.identity.logging import log_account_event
from users.bl.identity.utils import get_client_ip
from users.models import AccountHistoryLog


class ModelLoginForm(forms.Form):

    username = forms.CharField(required=True)
    password = forms.CharField(required=True)

    def clean(self):
        cleaned_data = super().clean()
        user = authenticate(username=cleaned_data["username"], password=cleaned_data["password"])
        if not user:
            raise forms.ValidationError("Incorrect password/username")

        cleaned_data["user"] = user
        return cleaned_data

    def login(self, request):
        user = self.cleaned_data["user"]
        django_login(request, user)

        extra = {"ip_address": get_client_ip(request)}
        log_account_event(user, AccountHistoryLog.ACTIONS.LOGIN, extra)
        return user
