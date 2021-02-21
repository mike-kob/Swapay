from graphene import ObjectType, Schema

from chat.graphql.schema import ChatQuery, ChatMutation
from support.graphql.schema import SupportQuery
from users.graphql.schema import UsersQuery, UsersMutation
from exchanges.graphql.schema import ExchangesMutation, ExchangesQuery


class Query(ExchangesQuery, UsersQuery, ChatQuery, SupportQuery, ObjectType):
    # This class will inherit from multiple Queries
    # as we begin to add more apps to our project
    pass


class Mutation(ExchangesMutation, ChatMutation, UsersMutation, ObjectType):
    # This class will inherit from multiple Mutations
    # as we begin to add more apps to our project
    pass


schema = Schema(query=Query, mutation=Mutation)
