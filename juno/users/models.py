from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField, ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.conf import settings
from model_utils import Choices

from exchanges.models import Item
from users.constants import SOCIAL_PROVIDERS
from users.model_utils import generate_confirmation_token


class City(models.Model):

    name = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        unique=True,
    )

    searchable = models.BooleanField(
        null=False,
        blank=False,
        default=False,
    )

    def __str__(self):
        return f"City: {self.name}"

    class Meta:
        verbose_name_plural = "cities"


class User(AbstractUser):
    phone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
    )

    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )
    verified = models.BooleanField(null=False, blank=False, default=False, help_text="Email was verified")

    social_provider = models.CharField(max_length=20, null=True, blank=True, choices=SOCIAL_PROVIDERS)

    social_uid = models.CharField(max_length=200, null=True, blank=True)

    related_services = JSONField(null=False, blank=True, default=dict)

    created = models.DateTimeField(auto_now_add=True, null=True)
    modified = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        unique_together = ["social_provider", "social_uid"]

    def __str__(self):
        return f"{self.username}: {self.email}"


class Review(models.Model):
    user_from = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="written_reviews",
    )
    user_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="received_reviews"
    )
    item = models.ForeignKey(
        Item,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    stars = models.IntegerField(validators=[MaxValueValidator(5), MinValueValidator(1)])
    comments = models.TextField(null=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


class EmailConfirmation(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)

    email = models.EmailField(null=False, blank=False)

    token = models.CharField(
        max_length=200,
        default=generate_confirmation_token,
        null=False,
        blank=False,
        unique=True,
    )

    created = models.DateTimeField(auto_now_add=True)


class RefreshToken(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)

    token = models.CharField(
        max_length=200,
        default=generate_confirmation_token,
        null=False,
        blank=False,
        unique=True,
    )

    created = models.DateTimeField(auto_now_add=True)


class AccountHistoryLog(models.Model):

    ACTIONS = Choices(
        ("SIGNUP", "SIGNUP", "Signup with username/password"),
        ("S_SIGNUP", "S_SIGNUP", "Social signup"),
        ("LOGIN", "LOGIN", "Login with username/password"),
        ("S_LOGIN", "S_LOGIN", "Social login"),
        ("CHANGE_EMAIL_REQUEST", "CHANGE_EMAIL_REQUEST", "Change email request"),
        ("CHANGE_EMAIL_SUCCESS", "CHANGE_EMAIL_SUCCESS", "Change email success"),
        ("CHANGE_PASSWORD_REQUEST", "CHANGE_PASSWORD_REQUEST", "Change password request"),
        ("CHANGE_PASSWORD_SUCCESS", "CHANGE_PASSWORD_SUCCESS", "Change password success"),
        ("FORGOT_PASSWORD_REQUEST", "FORGOT_PASSWORD_REQUEST", "Forgot password request"),
        ("FORGOT_PASSWORD_SUCCESS", "FORGOT_PASSWORD_SUCCESS", "Forgot password success"),
    )

    user = models.ForeignKey(User, on_delete=models.PROTECT, null=False, blank=False)

    action = models.CharField(max_length=30, null=False, blank=False, choices=ACTIONS)

    extra = JSONField(null=False, blank=True, default=dict)

    created = models.DateTimeField(null=False, blank=False, auto_now_add=True)


class CustomNotification(models.Model):

    active = models.BooleanField(null=False, blank=False, default=False)

    title = models.CharField(max_length=50, null=False, blank=False)
    link = models.CharField(max_length=512, null=True, blank=True)
    text = models.TextField(null=False, blank=False)
    icon = models.CharField(max_length=100, null=True, blank=True)

    users_exclude = ArrayField(models.BigIntegerField(), blank=True)

    def __str__(self):
        return f"Custom Notification <{self.title}>"
