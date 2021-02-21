from graphene import ObjectType

from chat.graphql.queries import (
    MessagesQuery,
)
from chat.graphql.mutations import (
    PostMessageMutation,
)


class ChatQuery(
    MessagesQuery,
    ObjectType,
):
    pass


class ChatMutation(ObjectType):

    post_message = PostMessageMutation.Field()
