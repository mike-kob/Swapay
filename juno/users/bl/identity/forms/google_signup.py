import random

from django import forms

from users.constants import SOCIAL_PROVIDERS
from users.bl.identity.logging import log_account_event
from users.bl.identity.utils import validate_id_token, send_greeting_email
from users.models import User, AccountHistoryLog


class GoogleSignupForm(forms.Form):

    id_token = forms.CharField(required=True)

    def clean_id_token(self):
        id_token = self.cleaned_data["id_token"]
        id_info = validate_id_token(id_token)

        exists = User.objects.filter(
            social_provider=SOCIAL_PROVIDERS.GOOGLE, social_uid=id_info["sub"]
        ).exists()
        if exists:
            raise forms.ValidationError("User already signed up")

        self.cleaned_data["info"] = id_info
        return id_token

    def save(self):
        data = self.cleaned_data["info"]
        username = data["email"].split("@")[0]
        while User.objects.filter(username=username).exists():
            username += str(random.randint(10))

        user = User.objects.create_user(
            username=username,
            email=data["email"],
            password=None,
            first_name=data.get("given_name"),
            last_name=data.get("family_name"),
            verified=True,
            social_provider=SOCIAL_PROVIDERS.GOOGLE,
            social_uid=data["sub"],
        )
        send_greeting_email(user, data["email"])
        log_account_event(user, AccountHistoryLog.ACTIONS.S_SIGNUP)
        return user
