from graphene import ObjectType

from exchanges.graphql.mutations import (
    CreateItemPhotoMutation,
    CreateItemMutation,
    UpdateItemMutation,
    ActivateItemMutation,
    DeleteItemMutation,
    DeleteItemPhotoMutation,
    CreateSwapMutation,
    UpdateSwapMutation,
    UpdateItemPhotoMutation,
)
from exchanges.graphql.queries import (
    PublicItemQuery,
    PrivateItemQuery,
    MySwapsItemQuery,
    MyPrivateItemsQuery,
    GameTagsQuery,
    PaginatedSearch,
    RecommendationsQuery,
)


class ExchangesQuery(
    MyPrivateItemsQuery,
    PublicItemQuery,
    PrivateItemQuery,
    MySwapsItemQuery,
    GameTagsQuery,
    PaginatedSearch,
    RecommendationsQuery,
    ObjectType,
):
    pass


class ExchangesMutation(ObjectType):
    create_item_photo = CreateItemPhotoMutation.Field()
    update_item_photo = UpdateItemPhotoMutation.Field()
    create_item = CreateItemMutation.Field()
    update_item = UpdateItemMutation.Field()
    item_activation = ActivateItemMutation.Field()

    delete_item = DeleteItemMutation.Field()
    delete_item_photo = DeleteItemPhotoMutation.Field()

    create_swap = CreateSwapMutation.Field()
    update_swap = UpdateSwapMutation.Field()
