from django.utils import timezone

from chat.models import Message
from exchanges.models import Swap
from users.models import User


def post_message(sender: User, swap: Swap, body: str):
    return Message.objects.create(
        author=sender,
        swap=swap,
        time_sent=timezone.now(),
        body=body,
    )
