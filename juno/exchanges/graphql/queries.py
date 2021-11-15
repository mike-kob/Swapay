import graphene
from django.db.models import Q
from graphql import GraphQLError

from exchanges.bl.search.search import search_gql, get_stats_qs
from exchanges.models import Item, Swap, GameTag
from exchanges.graphql.types import (
    ItemType,
    PrivateItemType,
    SwapType,
    GameTagType,
    SearchPaginationType,
)


class PublicItemQuery:

    public_item = graphene.Field(
        ItemType,
        id=graphene.Int(required=True),
    )

    def resolve_public_item(self, info, id, **kwargs):
        try:
            item = Item.objects.get(id=id)
        except Item.DoesNotExist:
            return None

        return item


class PrivateItemQuery:

    private_item = graphene.Field(
        PrivateItemType,
        id=graphene.Int(required=True),
    )

    def resolve_private_item(self, info, id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError("Unauthorized")

        try:
            item = Item.objects.get(id=id, owner=user)
        except Item.DoesNotExist:
            return None

        return item


class MySwapsItemQuery:

    swaps = graphene.List(SwapType, required=True)

    swap = graphene.Field(SwapType, required=False, id=graphene.Int(required=True))

    def resolve_swaps(self, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError("Unauthorized")

        swaps = Swap.objects.filter(Q(owner=user) | Q(client=user)).order_by("created")

        return swaps

    def resolve_swap(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError("Unauthorized")

        swap = Swap.objects.filter(Q(owner=user) | Q(client=user)).get(id=id)

        return swap


class MyPrivateItemsQuery:

    private_items = graphene.List(PrivateItemType, required=True)

    def resolve_private_items(self, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError("Unauthorized")

        items = Item.objects.filter(owner=user)
        return items


class GameTagsQuery:

    game_tags = graphene.List(GameTagType, required=True)

    game_tag = graphene.Field(
        GameTagType,
        language=graphene.NonNull(graphene.String),
        slug=graphene.NonNull(graphene.String),
    )

    def resolve_game_tags(self, info):
        return GameTag.objects.filter(
            published=True
        )

    def resolve_game_tag(self, info, language, slug):
        tags = GameTag.objects.none()
        if language == "uk":
            tags = GameTag.objects.filter(uk_slug=slug)
        if language == "en":
            tags = GameTag.objects.filter(en_slug=slug)

        return tags.filter(published=True).first()


class PaginatedSearch:

    search = graphene.NonNull(
        SearchPaginationType,
        k=graphene.String(),
        swap_type=graphene.String(),
        low_rent_price=graphene.Decimal(),
        high_rent_price=graphene.Decimal(),
        low_sell_price=graphene.Decimal(),
        high_sell_price=graphene.Decimal(),
        city=graphene.String(),
        page=graphene.Int(required=True),
        tags=graphene.List(graphene.ID),
    )

    def resolve_search(self, info, page, **kwargs):
        data = {}
        if "swap_type" in kwargs:
            data["types"] = kwargs["swap_type"]
        if "k" in kwargs:
            data["keywords"] = kwargs["k"]
        if "low_rent_price" in kwargs:
            data["rent_price_low"] = kwargs["low_rent_price"]
        if "high_rent_price" in kwargs:
            data["rent_price_high"] = kwargs["high_rent_price"]
        if "low_sell_price" in kwargs:
            data["purchase_price_low"] = kwargs["low_sell_price"]
        if "high_sell_price" in kwargs:
            data["purchase_price_high"] = kwargs["high_sell_price"]
        if "city" in kwargs:
            data["city"] = kwargs["city"]
        if "tags" in kwargs:
            data["tags"] = kwargs["tags"]

        data["page"] = page
        qs = search_gql(data)
        qs_stats = get_stats_qs(data)
        return SearchPaginationType(
            qs=qs,
            qs_stats=qs_stats,
            page=page,
        )


class RecommendationsQuery:

    recommended_games = graphene.List(
        graphene.NonNull(ItemType),
        required=True,
        source=graphene.String(required=True),
        num=graphene.Int(required=False),
    )

    def resolve_recommended_games(self, info, source, num=5):
        if num > 10:
            num = 10

        res = []
        if source == "general":
            res = Item.objects.filter(activated=True).order_by("-created")[:num]

        return res
