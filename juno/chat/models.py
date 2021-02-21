from django.db import models
from django.conf import settings

from exchanges.models import Swap


class Message(models.Model):
    swap = models.ForeignKey(Swap, on_delete=models.CASCADE, null=True, blank=True, related_name="messages")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
    )
    time_sent = models.DateTimeField()
    seen = models.BooleanField(default=False)

    body = models.TextField()

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
