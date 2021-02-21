import graphene
from django.core.exceptions import ValidationError
from graphql import GraphQLError

from chat.bl.messaging import post_message
from exchanges.bl.exceptions import ItemActivationException
from exchanges.bl.items.add_photo_form import AddPhotoForm
from exchanges.bl.items.create_item_form import ItemForm
from exchanges.bl.items.delete_item import delete_item
from exchanges.bl.items.item_activation import activate_item, deactivate_item
from exchanges.bl.swaps.swap_form import SwapForm
from exchanges.models import ItemPhoto, Item, Swap
from exchanges.graphql.types import (
    ItemPhotoType,
    ItemPhotoInput,
    ItemInput,
    SwapType,
    CreateSwapInput,
    UpdateSwapInput,
    ItemPhotoUpdateInput,
    PrivateItemType,
)
from users.bl.identity.utils import send_new_swap_email


class CreateItemPhotoMutation(graphene.Mutation):
    class Arguments:
        data = ItemPhotoInput(required=True)

    item_photo = graphene.Field(ItemPhotoType)
    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, data):
        if not info.context.user.is_authenticated:
            return CreateItemPhotoMutation(ok=False, errors="Not authorized")
        if not Item.objects.filter(id=data.item, owner=info.context.user).exists():
            return CreateItemPhotoMutation(ok=False, errors="Not found")
        if not data.guid and ItemPhoto.objects.filter(file=data.name).exists():
            return CreateItemPhotoMutation(ok=False, errors="The photo is already used")

        form = AddPhotoForm(data=data)
        if not form.is_valid():
            return CreateItemPhotoMutation(ok=False, errors=form.errors.as_text())

        item = form.cleaned_data["item"]
        main = not ItemPhoto.objects.filter(item=item, main=True).exists()
        item_photo = ItemPhoto.objects.create(main=main, item=item)
        if form.cleaned_data["guid"]:
            item_photo.guid = form.cleaned_data["guid"]
        else:
            item_photo.file = form.cleaned_data["name"]
        item_photo.save()
        return CreateItemPhotoMutation(ok=True, item_photo=item_photo)


class UpdateItemPhotoMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        data = ItemPhotoUpdateInput(required=True)

    item_photo = graphene.Field(ItemPhotoType)
    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, id, data):
        if not info.context.user.is_authenticated:
            raise GraphQLError("Unauthorized")

        try:
            item_photo = ItemPhoto.objects.get(id=id, item__owner=info.context.user)
        except ItemPhoto.DoesNotExist:
            return UpdateItemPhotoMutation(ok=False, errors="Not found")

        if data.get("main"):
            ItemPhoto.objects.filter(item=item_photo.item).update(main=False)
            item_photo.main = True
            item_photo.save()

        return UpdateItemPhotoMutation(ok=True, item_photo=item_photo)


class CreateItemMutation(graphene.Mutation):
    class Arguments:
        data = ItemInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    item = graphene.Field(PrivateItemType)

    def mutate(self, info, data):
        if not info.context.user.is_authenticated:
            return CreateItemMutation(ok=False, errors="Not authorized")

        form = ItemForm(data=data)
        if not form.is_valid():
            return CreateItemMutation(ok=False, errors=form.errors.as_text())

        if "tags" in form.cleaned_data:
            del form.cleaned_data["tags"]

        item = Item.objects.create(owner=info.context.user, **form.cleaned_data)
        return CreateItemMutation(ok=True, item=item)


class UpdateItemMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        data = ItemInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    item = graphene.Field(PrivateItemType)

    def mutate(self, info, id, data):
        if not info.context.user.is_authenticated:
            return UpdateItemMutation(ok=False, errors="Not authorized")

        user = info.context.user
        try:
            item = Item.objects.get(id=id, owner=user)
        except Item.DoesNotExist:
            return UpdateItemMutation(ok=False, errors="Not found")

        form = ItemForm(data=data)
        if not form.is_valid():
            return UpdateItemMutation(ok=False, errors=form.errors.as_text())

        for k, v in form.cleaned_data.items():
            if k == "tags":
                item.tags.set(v)
            else:
                setattr(item, k, v)

        try:
            item.clean()
        except ValidationError as e:
            return UpdateItemMutation(ok=False, errors=str(e))

        item.save()
        return CreateItemMutation(ok=True, item=item)


class ActivateItemMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        activate = graphene.Boolean(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, id, activate):
        if not info.context.user.is_authenticated:
            return ActivateItemMutation(ok=False, errors="Not authorized")

        user = info.context.user
        try:
            item = Item.objects.get(id=id, owner=user)
        except Item.DoesNotExist:
            return ActivateItemMutation(ok=False, errors="Not found")

        try:
            if activate:
                activate_item(item)
            else:
                deactivate_item(item)

        except ItemActivationException as e:
            return ActivateItemMutation(ok=False, errors=str(e))

        return ActivateItemMutation(ok=True)


class DeleteItemMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, id):
        if not info.context.user.is_authenticated:
            return DeleteItemMutation(ok=False, errors="Not authorized")

        user = info.context.user
        try:
            item = Item.objects.get(id=id, owner=user)
        except Item.DoesNotExist:
            return DeleteItemMutation(ok=False, errors="Not found")

        try:
            delete_item(item.id)
        except Exception as e:
            return DeleteItemMutation(ok=False, errors=str(e))

        return DeleteItemMutation(ok=True)


class DeleteItemPhotoMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, id):
        if not info.context.user.is_authenticated:
            return DeleteItemPhotoMutation(ok=False, errors="Not authorized")

        user = info.context.user
        try:
            item_photo = ItemPhoto.objects.get(id=id, item__owner=user)
        except ItemPhoto.DoesNotExist:
            return DeleteItemPhotoMutation(ok=False, errors="Not found")

        try:
            item_photo.delete()
        except Exception as e:
            return DeleteItemPhotoMutation(ok=False, errors=str(e))

        return DeleteItemPhotoMutation(ok=True)


class CreateSwapMutation(graphene.Mutation):
    class Arguments:
        data = CreateSwapInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    swap = graphene.Field(SwapType)

    def mutate(self, info, data):
        if not info.context.user.is_authenticated:
            return CreateSwapMutation(ok=False, errors="Not authorized")

        user = info.context.user
        form = SwapForm(data=data)
        if not form.is_valid():
            return CreateSwapMutation(ok=False, errors=form.errors.as_text())

        form.cleaned_data["accepted"] = None
        item = form.cleaned_data["item"]
        swap = Swap.objects.create(owner_id=item.owner_id, client=user, **form.cleaned_data)
        post_message(user, swap, data.message)

        send_new_swap_email(swap)
        return CreateSwapMutation(ok=True, swap=swap)


class UpdateSwapMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        data = UpdateSwapInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    swap = graphene.Field(SwapType)

    def mutate(self, info, id, data):
        user = info.context.user
        if not user.is_authenticated:
            return UpdateSwapMutation(ok=False, errors="Not authorized")

        try:
            swap = Swap.objects.get(id=id, owner=user)
        except Swap.DoesNotExist:
            return UpdateSwapMutation(ok=False, errors="Not found")

        form = SwapForm(data=data)
        if not form.is_valid():
            return UpdateSwapMutation(ok=False, errors=form.errors.as_text())

        if data.get("type"):
            swap.type = form.cleaned_data["type"]

        if "accepted" in data:
            swap.accepted = form.cleaned_data["accepted"]

        try:
            swap.clean()
        except ValidationError as e:
            return UpdateSwapMutation(ok=False, errors=str(e))

        swap.save()
        return UpdateSwapMutation(ok=True, swap=swap)
