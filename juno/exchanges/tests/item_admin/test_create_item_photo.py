from uuid import uuid4
import pytest
from model_mommy import mommy

from exchanges.models import Item, ItemPhoto
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

CREATE_ITEM_PHOTO_MUTATION = """
mutation (
  $guid: String!, 
  $item: Int!
) {
  createItemPhoto(data: {
    guid: $guid, 
    item: $item
  }) {
    ok
    errors
    itemPhoto {
      id
      file
      item {
        id
      }
    }
  }
}
"""


def test_unauthorized_delete_item():
    item = mommy.make("exchanges.Item")
    executed = gql().execute(
        CREATE_ITEM_PHOTO_MUTATION,
        variables={
            "guid": "some-guid",
            "item": item.id,
        },
    )

    assert not executed["data"]["createItemPhoto"]["ok"]
    assert executed["data"]["createItemPhoto"]["errors"]


def test_not_owned_add_photo():
    user1 = mommy.make("users.User")
    user2 = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user1)
    executed = gql(user=user2).execute(
        CREATE_ITEM_PHOTO_MUTATION,
        variables={
            "guid": "some-guid",
            "item": item.id,
        },
    )

    assert not executed["data"]["createItemPhoto"]["ok"]
    assert executed["data"]["createItemPhoto"]["errors"]


def test_add_photo_success():
    user = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user)
    executed = gql(user=user).execute(
        CREATE_ITEM_PHOTO_MUTATION,
        variables={
            "guid": "some-guid",
            "item": item.id,
        },
    )

    assert ItemPhoto.objects.count() == 1

    item_photo = ItemPhoto.objects.first()
    assert item_photo.guid == "some-guid"
    assert item_photo.item_id == item.id

    assert executed["data"]["createItemPhoto"]["ok"]
    assert executed["data"]["createItemPhoto"]["itemPhoto"]["id"] == str(item_photo.id)
