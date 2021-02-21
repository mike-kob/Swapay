import graphene
from django.db.models import Q

from chat.models import Message
from exchanges.models import Swap
from chat.graphql.types import MessageType

MSG_PAGE_SIZE = 100


class MessagesQuery:

    messages = graphene.List(lambda: MessageType, swap_id=graphene.NonNull(graphene.Int), page=graphene.Int())

    def resolve_messages(self, info, swap_id, page=0):
        if not info.context.user.is_authenticated:
            return []
        try:
            swap = Swap.objects.filter(Q(owner=info.context.user) | Q(client=info.context.user)).get(
                id=swap_id
            )

        except Swap.DoesNotExist:
            return []

        start = page * MSG_PAGE_SIZE
        end = (page + 1) * MSG_PAGE_SIZE
        qs = Message.objects.filter(swap=swap).order_by("-time_sent")[start:end]

        Message.objects.filter(id__in=qs.values("id")).exclude(author=info.context.user).update(seen=True)

        Swap.objects.filter(id=swap_id).exclude(client=info.context.user).update(seen=True)

        return qs
