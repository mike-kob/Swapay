from django import forms
from django.contrib.auth import login as django_login

from users.constants import SOCIAL_PROVIDERS
from users.bl.identity.logging import log_account_event
from users.bl.identity.utils import validate_id_token, get_client_ip
from users.models import User, AccountHistoryLog


class GoogleLoginForm(forms.Form):

    id_token = forms.CharField(required=True)

    def clean_id_token(self):
        id_token = self.cleaned_data["id_token"]
        id_info = validate_id_token(id_token)

        self.cleaned_data["info"] = id_info
        return id_token

    def clean(self):
        cleaned_data = super().clean()
        if "info" not in cleaned_data:
            return cleaned_data

        info = cleaned_data["info"]
        try:
            user = User.objects.get(social_provider=SOCIAL_PROVIDERS.GOOGLE, social_uid=info["sub"])
        except User.DoesNotExist:
            raise forms.ValidationError("User does not exist")

        cleaned_data["user"] = user
        return cleaned_data

    def login(self, request):
        user = self.cleaned_data["user"]
        user.backend = "django.contrib.auth.backends.ModelBackend"
        django_login(request, user)

        extra = {"ip_address": get_client_ip(request)}
        log_account_event(user, AccountHistoryLog.ACTIONS.S_LOGIN, extra)
        return user
