from exchanges.models import Item, ItemPhoto, Swap


def delete_item(item_id):
    Swap.objects.filter(item_id=item_id).delete()
    ItemPhoto.objects.filter(item_id=item_id).delete()
    Item.objects.filter(id=item_id).delete()
