from typing import Any, Dict

from django import forms
from django.conf import settings
from django.urls import reverse
from django.utils import timezone
from google.auth.transport import requests
from google.oauth2 import id_token

from exchanges.models import Swap
from juno.utils import get_full_url
from users.bl.identity.constants import EMAIL_EXPIRE_PERIOD, FORGOT_PASSWORD_EXPIRE_PERIOD
from users.models import User, EmailConfirmation, RefreshToken
from users.bl.notifications import email_service
from users.bl.notifications.email_constants import (
    SIGNUP_TEMPLATE,
    FORGOT_PASSWORD_TEMPLATE,
    CHANGE_EMAIL_NOTIFICATION_TEMPLATE,
    GREETING_TEMPLATE,
    NEW_SWAP_TEMPLATE,
)


def send_greeting_email(user: User, email: str) -> None:
    data = {"username": user.username}
    email_service.send_email(email, GREETING_TEMPLATE, data)


def send_verify_email(user: User, email: str) -> None:
    EmailConfirmation.objects.filter(user=user, email__iexact=email).delete()
    token = EmailConfirmation.objects.create(user=user, email=email)
    data = {"confirm_url": get_full_url(reverse("auth-confirm-email", args=(token.token,)))}
    email_service.send_email(email, SIGNUP_TEMPLATE, data)


def validate_email_token(token: str) -> EmailConfirmation:
    try:
        conf = EmailConfirmation.objects.get(token=token)
    except EmailConfirmation.DoesNotExist:
        raise forms.ValidationError("Invalid token")

    if conf.created < timezone.now() - EMAIL_EXPIRE_PERIOD:
        raise forms.ValidationError("Token expired")

    return conf


def validate_id_token(token: str) -> Dict[str, Any]:
    try:
        id_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except Exception:
        raise forms.ValidationError("Invalid token")

    if id_info.get("iss") not in ["accounts.google.com", "https://accounts.google.com"]:
        raise forms.ValidationError("Wrong token issuer")

    return id_info


def send_forgot_password(user: User):
    RefreshToken.objects.filter(user=user).delete()
    token = RefreshToken.objects.create(user=user)
    data = {"confirm_url": get_full_url(f"/auth/reset-password/{token.token}")}
    email_service.send_email(user.email, FORGOT_PASSWORD_TEMPLATE, data)


def validate_forgot_password_token(token: str) -> RefreshToken:
    try:
        r_token = RefreshToken.objects.get(token=token)
    except RefreshToken.DoesNotExist:
        raise forms.ValidationError("Invalid token")

    if r_token.created < timezone.now() - FORGOT_PASSWORD_EXPIRE_PERIOD:
        raise forms.ValidationError("Token expired")

    return r_token


def get_client_ip(request) -> str:
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip


def send_new_swap_email(swap: Swap):
    user = swap.owner
    if user.email and user.verified:
        data = {
            "username": user.username,
            "client_username": swap.client.username,
            "swap_id": swap.id,
        }

        email_service.send_email(user.email, NEW_SWAP_TEMPLATE, data)
