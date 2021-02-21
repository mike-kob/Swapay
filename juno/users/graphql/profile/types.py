import graphene
from django.db.models import Q
from django.utils.translation import gettext_lazy
from graphene import ObjectType
from graphene_django.types import DjangoObjectType

from chat.models import Message
from exchanges.models import Swap
from exchanges.graphql.types import ItemType, SwapType
from users.models import User, City, Review, CustomNotification


class CityType(DjangoObjectType):
    class Meta:
        model = City
        fields = (
            "id",
            "name",
        )

    def resolve_name(self, info):
        return gettext_lazy(self.name)


class NotificationType(ObjectType):
    type = graphene.String(required=True)
    swap = graphene.Field(lambda: SwapType, required=False)

    custom_title = graphene.String()
    custom_text = graphene.String()
    custom_link = graphene.String()
    custom_icon = graphene.String()


class PrivateProfileType(DjangoObjectType):
    items = graphene.List(ItemType, required=True)
    telegram = graphene.Boolean(required=True)
    social = graphene.Boolean(required=True)
    avatar = graphene.String(required=False)
    notifications = graphene.List(
        graphene.NonNull(NotificationType),
        required=True,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "city",
            "email",
            "verified",
            "phone",
            "username",
            "first_name",
            "last_name",
            "items",
            "telegram",
            "social",
            "avatar",
            "notifications",
        )

    def resolve_items(self: User, info):
        return self.item_set.all()

    def resolve_telegram(self: User, info):
        return bool(self.related_services.get("telegram"))

    def resolve_social(self: User, info):
        return bool(self.social_uid)

    def resolve_avatar(self: User, info):
        return ""

    def resolve_notifications(self: User, info):
        swaps = Swap.objects.filter(Q(owner_id=self.id) | Q(client_id=self.id)).values("id")

        swaps = Swap.objects.filter(
            id__in=Message.objects.filter(
                swap_id__in=swaps,
                seen=False,
            )
            .exclude(author_id=self.id)
            .values("swap_id")
        )

        data = [{"type": "NEW_MSG" if swap.seen else "NEW_SWAP", "swap": swap} for swap in swaps]

        custom = CustomNotification.objects.filter(active=True).exclude(users_exclude__contains=[self.id])
        for notification in custom:
            data.append(
                {
                    "type": "CUSTOM",
                    "custom_title": notification.title,
                    "custom_text": notification.text,
                    "custom_link": notification.link,
                    "custom_icon": notification.icon,
                }
            )
        return data


class UserType(DjangoObjectType):
    items = graphene.List(ItemType, required=True)
    full_name = graphene.String(required=False)
    date_joined = graphene.Int()
    avatar = graphene.String(required=False)

    class Meta:
        model = User
        fields = (
            "id",
            "city",
            "username",
            "first_name",
            "last_name",
            "items",
            "full_name",
            "date_joined",
            "avatar",
        )

    def resolve_items(self, info):
        return self.item_set.filter(activated=True)

    def resolve_full_name(self, info):
        return self.get_full_name()

    def resolve_date_joined(self, info):
        return int(self.date_joined.timestamp())

    def resolve_avatar(self: User, info):
        return ""


class UserCityInput(graphene.InputObjectType):
    id = graphene.Int(required=False)
    name = graphene.String(required=True)


class UserInput(graphene.InputObjectType):
    username = graphene.String()
    photo = graphene.String()
    photo_file = graphene.String()
    email = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    phone = graphene.String()
    city = graphene.Field(UserCityInput)


class UserReviewType(DjangoObjectType):
    created = graphene.Int()

    class Meta:
        model = Review
        fields = (
            "id",
            "user_from",
            "user_to",
            "stars",
            "comments",
            "created",
        )

    def resolve_created(self: Review, info):
        return int(self.created.timestamp())


class UserReviewInput(graphene.InputObjectType):
    user_to = graphene.ID()
    stars = graphene.Int()
    comments = graphene.String()
