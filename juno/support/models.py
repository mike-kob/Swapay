from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils import timezone

from juno import settings


class BlogCategory(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False)
    slug = models.SlugField(null=False, blank=False)

    language = models.CharField(max_length=5, null=True, blank=False, choices=settings.LANGUAGES)

    title = models.CharField(max_length=200, null=False, blank=False)
    image = models.URLField(null=True, blank=True)
    image350 = models.URLField(null=True, blank=True)
    preview = models.CharField(max_length=240, null=False, blank=False)
    content = models.TextField(null=False, blank=False)

    meta_description = models.CharField(max_length=140, null=True, blank=True)
    meta_robots = models.CharField(max_length=140, null=True, blank=True)

    open_graph = JSONField(null=False, blank=True, default=dict)

    modified = models.DateTimeField(
        auto_now=True,
        null=False,
        blank=False,
    )
    created = models.DateTimeField(
        default=timezone.now,
        null=False,
        blank=False,
    )

    def __str__(self):
        return f"Category: {self.name}"

    class Meta:
        verbose_name_plural = "categories"
        unique_together = (
            "language",
            "slug",
        )


class BlogPost(models.Model):
    slug = models.SlugField(null=False, blank=False)

    language = models.CharField(max_length=5, null=True, blank=False, choices=settings.LANGUAGES)

    title = models.CharField(max_length=200, null=False, blank=False)
    image = models.URLField(null=True, blank=True)
    image350 = models.URLField(null=True, blank=True)
    preview = models.CharField(max_length=240, null=False, blank=False)
    content = models.TextField(null=False, blank=False)

    published = models.BooleanField(null=False, blank=False)
    featured = models.BooleanField(null=False, blank=False)

    category = models.ForeignKey(
        BlogCategory, on_delete=models.PROTECT, null=True, blank=False, related_name="posts"
    )

    meta_description = models.CharField(max_length=140, null=True, blank=True)
    meta_robots = models.CharField(max_length=140, null=True, blank=True)

    open_graph = JSONField(null=False, blank=True, default=dict)
    author = JSONField(null=False, blank=True, default=dict)

    created = models.DateTimeField(
        default=timezone.now,
        null=False,
        blank=False,
    )
    modified = models.DateTimeField(
        auto_now=True,
        null=False,
        blank=False,
    )

    def __str__(self):
        return f"Post: {self.title}"

    class Meta:
        unique_together = (
            "language",
            "slug",
        )
