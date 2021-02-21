import graphene

from chat.bl.messaging import post_message
from exchanges.models import Swap
from chat.graphql.types import MessageInput, MessageType


class PostMessageMutation(graphene.Mutation):
    class Arguments:
        data = MessageInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    message = graphene.Field(lambda: MessageType)

    def mutate(self, info, data):
        user = info.context.user
        if not user.is_authenticated:
            return PostMessageMutation(ok=False)
        try:
            swap = Swap.objects.get(id=data.swap)
        except Swap.DoesNotExist:
            return PostMessageMutation(ok=False, errors="Swap does not exist")

        msg = post_message(info.context.user, swap, data.body)
        return PostMessageMutation(ok=True, message=msg)
