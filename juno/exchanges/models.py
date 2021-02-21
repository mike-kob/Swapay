from django.db import models
from django.utils import timezone
from model_utils import Choices

from juno.constants import DEAL_TYPE
from django.conf import settings
from multiselectfield import MultiSelectField


class GameTag(models.Model):
    TAG_TYPES = Choices(
        ("CATEGORY", "CATEGORY", "Category"),
        ("TOPIC", "TOPIC", "Topic"),
    )

    alias = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        unique=True,
    )
    name = models.CharField(max_length=200, null=False, blank=False)

    uk_slug = models.SlugField(
        null=True,
        blank=False,
    )
    en_slug = models.SlugField(
        null=True,
        blank=False,
    )

    uk_name = models.CharField(max_length=200, null=True, blank=False)

    en_name = models.CharField(max_length=200, null=True, blank=False)

    tag_type = models.CharField(
        max_length=20,
        null=False,
        blank=False,
        choices=TAG_TYPES,
    )

    published = models.BooleanField(null=False, blank=False, default=False)

    uk_meta_description = models.TextField(
        max_length=200,
        null=True,
        blank=True,
    )

    en_meta_description = models.TextField(
        max_length=200,
        null=True,
        blank=True,
    )

    uk_content = models.TextField(null=True, blank=True)

    en_content = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Tag: {self.alias}"


class Item(models.Model):
    rent_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
    )
    sell_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
    )
    exchange_description = models.TextField(
        null=True,
        blank=True,
    )
    deposit = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
    )

    title = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )
    en_title = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )
    preview = models.CharField(null=True, blank=True, max_length=200)
    en_preview = models.CharField(null=True, blank=True, max_length=200)
    types = MultiSelectField(
        max_length=10,
        choices=DEAL_TYPE,
        default=DEAL_TYPE.EXCHANGE,
        null=True,
    )
    description = models.TextField(
        null=True,
        blank=True,
    )
    en_description = models.TextField(
        null=True,
        blank=True,
    )
    age = models.CharField(
        null=True,
        blank=True,
        max_length=50,
    )
    avg_game_time = models.CharField(
        null=True,
        blank=True,
        max_length=20,
    )
    language = models.CharField(
        null=True,
        blank=True,
        max_length=50,
    )
    tags = models.ManyToManyField(
        GameTag,
        blank=True,
        related_name="tags",
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    activated = models.BooleanField(
        default=False,
    )
    last_activated = models.DateTimeField(
        null=True,
        blank=True,
    )
    slug = models.SlugField(null=True, blank=True, max_length=100)

    created = models.DateTimeField(default=timezone.now)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.id})"

    class Meta:
        verbose_name = "Game"
        verbose_name_plural = "Games"


class ItemPhoto(models.Model):
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
    )

    guid = models.CharField(null=True, blank=True, max_length=100)

    description = models.TextField(null=True, blank=True)
    main = models.BooleanField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


class Swap(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owner_deals",
    )
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="client_deals",
    )
    item = models.ForeignKey(
        Item,
        on_delete=models.PROTECT,
        related_name="+",
    )
    type = models.CharField(
        max_length=10,
        choices=DEAL_TYPE,
        default=DEAL_TYPE.EXCHANGE,
        null=True,
    )
    exchange_item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+",
    )

    accepted = models.BooleanField(
        null=True,
        blank=True,
    )
    seen = models.BooleanField(
        null=False,
        blank=False,
        default=False,
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
