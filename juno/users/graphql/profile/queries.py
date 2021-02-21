import graphene
from graphql import GraphQLError

from users.graphql.profile.types import CityType, UserType, PrivateProfileType
from users.models import City, User


class CityQuery:

    city = graphene.NonNull(graphene.List(CityType), id=graphene.Int())

    def resolve_city(self, into, **kwargs):
        if "id" in kwargs:
            try:
                return City.objects.get(id=kwargs["id"])
            except City.DoesNotExist:
                raise GraphQLError("Not found")

        return City.objects.filter(searchable=True)


class UserQuery:
    user = graphene.Field(PrivateProfileType)

    def resolve_user(self, info, **kwargs):
        if not info.context.user.is_authenticated:
            raise GraphQLError("Unauthorized")
        return info.context.user


class ProfilesQuery:
    profiles = graphene.List(
        UserType,
        ids=graphene.List(graphene.ID, required=True),
    )

    def resolve_profiles(self, info, ids):
        return User.objects.filter(id__in=ids)
