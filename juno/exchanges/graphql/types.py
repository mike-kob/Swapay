import math

import graphene
from django.conf import settings
from django.db.models import Max, Min
from django.utils.translation import gettext_lazy
from graphene_django.types import DjangoObjectType

from exchanges.bl.search.search import search_gql, get_stats_qs
from exchanges.models import Item, ItemPhoto, Swap, GameTag

from juno.constants import DEAL_TYPE, PAGE_SIZE


class DealType(graphene.Enum):
    E = "E"
    R = "R"
    P = "P"


class PhotoAccessType(graphene.Enum):
    PRIVATE = "Private"
    PUBLIC = "Public"


class ItemPhotoType(DjangoObjectType):
    public_id = graphene.String()

    class Meta:
        model = ItemPhoto
        fields = (
            "id",
            "main",
            "item",
        )

    def resolve_public_id(self: ItemPhoto, info):
        return self.guid


class GameTagType(DjangoObjectType):
    translated_name = graphene.String(required=True)
    games = graphene.List(lambda: ItemType)

    class Meta:
        model = GameTag
        fields = (
            "id",
            "alias",
            "name",
            "uk_name",
            "en_name",
            "uk_slug",
            "en_slug",
            "uk_content",
            "en_content",
            "uk_meta_description",
            "en_meta_description",
            "tag_type",
            "translated_name",
            "published",
        )

    def resolve_translated_name(self, info):
        return gettext_lazy(self.name)

    def resolve_games(self: GameTag, info):
        return self.tags.filter(activated=True).order_by("-created")


class ItemPhotoInput(graphene.InputObjectType):
    name = graphene.String(required=False)
    guid = graphene.String(required=False)
    item = graphene.Int(required=True)


class ItemPhotoUpdateInput(graphene.InputObjectType):
    main = graphene.Boolean(required=False)


class ItemType(DjangoObjectType):

    uk_title = graphene.String(required=True)
    uk_preview = graphene.String()
    uk_description = graphene.String()

    photos = graphene.List(ItemPhotoType)
    types = graphene.List(
        DealType,
        required=True,
    )
    tags = graphene.List(GameTagType, required=True)
    reviews = graphene.List("users.graphql.profile.types.UserReviewType", required=True)

    class Meta:
        model = Item
        fields = (
            "id",
            "rent_price",
            "sell_price",
            "exchange_description",
            "deposit",
            "title",
            "en_title",
            "preview",
            "en_preview",
            "types",
            "description",
            "en_description",
            "age",
            "language",
            "avg_game_time",
            "owner",
            "photos",
        )

    def resolve_photos(self: Item, info):
        return self.itemphoto_set.all()

    def resolve_types(self: Item, info):
        types = []
        if DEAL_TYPE.EXCHANGE in self.types:
            types.append(DealType.E)
        if DEAL_TYPE.RENT in self.types:
            types.append(DealType.R)
        if DEAL_TYPE.PURCHASE in self.types:
            types.append(DealType.P)
        return types

    def resolve_reviews(self: Item, info):
        return self.owner.received_reviews.all()

    def resolve_tags(self: Item, info):
        return self.tags.all()

    def resolve_uk_title(self: Item, info):
        return self.title

    def resolve_uk_preview(self: Item, info):
        return self.preview

    def resolve_uk_description(self: Item, info):
        return self.description


class PrivateItemType(ItemType):

    created = graphene.Int()
    last_activated = graphene.Int()
    photos = graphene.List(ItemPhotoType, required=True)
    tags = graphene.List(GameTagType, required=True)

    uk_title = graphene.String(required=True)
    uk_preview = graphene.String()
    uk_description = graphene.String()

    class Meta:
        model = Item
        fields = (
            "id",
            "rent_price",
            "sell_price",
            "exchange_description",
            "deposit",
            "title",
            "en_title",
            "preview",
            "en_preview",
            "description",
            "en_description",
            "types",
            "tags",
            "age",
            "language",
            "avg_game_time",
            "owner",
            "photos",
            "activated",
            "last_activated",
            "created",
        )

    def resolve_created(self, info):
        return int(self.created.timestamp())

    def resolve_last_activated(self, info):
        return int(self.last_activated.timestamp()) if self.last_activated else None

    def resolve_photos(self, info):
        return self.itemphoto_set.all()

    def resolve_tags(self, info):
        return self.tags.all()

    def resolve_uk_title(self: Item, info):
        return self.title

    def resolve_uk_preview(self: Item, info):
        return self.preview

    def resolve_uk_description(self: Item, info):
        return self.description


class ItemInput(graphene.InputObjectType):
    rent_price = graphene.Decimal(required=False)
    deposit = graphene.Decimal(required=False)
    sell_price = graphene.Decimal(required=False)
    exchange_description = graphene.String(required=False)

    en_description = graphene.String(required=False)
    description = graphene.String(required=False)
    en_title = graphene.String(required=False)
    title = graphene.String(required=False)
    en_preview = graphene.String(required=False)
    preview = graphene.String(required=False)
    types = graphene.List(DealType, required=False)
    tags = graphene.List(graphene.ID, required=False)
    age = graphene.String(required=False)
    language = graphene.String(required=False)
    avg_game_time = graphene.String(required=False)


class ItemReviewInput(graphene.InputObjectType):

    item = graphene.ID()
    comment = graphene.String()
    stars = graphene.Int()


class SwapType(DjangoObjectType):

    created = graphene.Int()
    item = graphene.Field(ItemType)
    type = graphene.String()
    accepted = graphene.Boolean(required=False)
    has_updates = graphene.Boolean(required=True, default_value=False)
    client_contacts = graphene.String(required=False)

    class Meta:
        model = Swap
        fields = (
            "id",
            "owner",
            "client",
            "item",
            "type",
            "seen",
            "accepted",
            "created",
            "client_contacts",
        )

    def resolve_messages(self, info):
        return self.messages.all()

    def resolve_created(self, info):
        return int(self.created.timestamp())

    def resolve_has_updates(self: Swap, info):
        return self.messages.filter(seen=False).exists()

    def resolve_client_contacts(self: Swap, info):
        if self.accepted and info.context.user.is_authenticated:
            if self.client.id == info.context.user.id:
                return self.owner.phone
            else:
                return self.client.phone

        return ""


class CreateSwapInput(graphene.InputObjectType):

    item = graphene.ID()
    type = graphene.String()
    message = graphene.String()


class UpdateSwapInput(graphene.InputObjectType):

    type = graphene.String()
    accepted = graphene.Boolean(required=False)


class StatsType(graphene.ObjectType):
    max_rent_price = graphene.Float(required=True)
    min_rent_price = graphene.Float(required=True)
    max_sell_price = graphene.Float(required=True)
    min_sell_price = graphene.Float(required=True)


class SearchPaginationType(graphene.ObjectType):
    total = graphene.Int(description="Total number of results")
    pages = graphene.Int(required=True, description="Total number of pages")
    page = graphene.Int(required=True, description="Current page (starting from 0)")
    stats = graphene.Field(StatsType, required=True)

    results = graphene.List(ItemType, required=True)

    def resolve_total(self, info):
        return self._qs.count()

    def resolve_pages(self, info):
        p_size = PAGE_SIZE
        count = self._qs.count()

        return math.ceil(count / p_size)

    def resolve_page(self, info):
        return self._page

    def resolve_results(self, info):
        p = self._page
        p_size = PAGE_SIZE

        start = p * p_size
        end = start + p_size
        return self._qs[start:end]

    def resolve_stats(self, info):
        qs = self._qs_stats.aggregate(
            max_r_pr=Max("rent_price"),
            min_r_pr=Min("rent_price"),
            max_p_pr=Max("sell_price"),
            min_p_pr=Min("sell_price"),
        )

        return StatsType(
            max_rent_price=qs["max_r_pr"] or 1000,
            min_rent_price=qs["min_r_pr"] or 0,
            max_sell_price=qs["max_p_pr"] or 1000,
            min_sell_price=qs["min_p_pr"] or 0,
        )

    def __init__(self, qs, qs_stats, page, page_size=PAGE_SIZE, *args, **kwargs):
        self._qs = qs
        self._qs_stats = qs_stats
        self._page = page - 1
        super().__init__(*args, **kwargs)
