from graphene import ObjectType

from support.graphql.queries import BlogCategories, BlogPosts


class SupportQuery(BlogCategories, BlogPosts, ObjectType):
    pass
