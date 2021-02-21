import graphene
from graphene_django.types import DjangoObjectType

from chat.models import Message


class MessageType(DjangoObjectType):
    time_sent = graphene.Int(required=True)

    class Meta:
        model = Message
        fields = (
            "id",
            "author",
            "swap",
            "time_sent",
            "seen",
            "body",
        )

    def resolve_time_sent(self: Message, info):
        return int(self.time_sent.timestamp())


class MessageInput(graphene.InputObjectType):
    swap = graphene.Int(required=True)
    body = graphene.String(required=True)
