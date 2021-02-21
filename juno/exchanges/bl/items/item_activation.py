from django.utils import timezone

from exchanges.bl.exceptions import ItemActivationException
from exchanges.models import Item


def _validate_user(item: Item):
    user = item.owner

    if not user.city_id or not user.email or not user.verified:
        raise ItemActivationException(
            "To activate item, verify email, fill in phone and city in profile"
        )


def _validate_photos(item: Item):

    if not item.itemphoto_set.exists():
        raise ItemActivationException("Cannot activate without photos")


def _validate_item(item: Item):

    if not (item.sell_price or item.exchange_description or item.rent_price):
        raise ItemActivationException("Tell what yuo what to do with the item "
                                      "(rent, sell, exchange)")


def activate_item(item: Item):
    _validate_user(item)
    _validate_photos(item)
    _validate_item(item)

    item.activated = True
    item.last_activated = timezone.now()
    item.save()


def deactivate_item(item: Item):
    item.activated = False
    item.save()
