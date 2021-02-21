import pytest
from model_mommy import mommy

from exchanges.models import ItemPhoto
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

DELETE_ITEM_PHOTO_MUTATION = """
mutation (
  $id: ID!,
) {
  deleteItemPhoto (id: $id) {
    ok
    errors
  }
}
"""


def test_unauthorized_delete_photo():
    item = mommy.make("exchanges.Item")
    item_photo = mommy.make("exchanges.ItemPhoto", item=item)
    executed = gql().execute(DELETE_ITEM_PHOTO_MUTATION, variables={"id": item_photo.id})

    assert not executed["data"]["deleteItemPhoto"]["ok"]
    assert executed["data"]["deleteItemPhoto"]["errors"]


def test_not_owned_delete_item_photo():
    user1 = mommy.make("users.User")
    user2 = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user1)
    item_photo = mommy.make("exchanges.ItemPhoto", item=item)
    executed = gql(user=user2).execute(DELETE_ITEM_PHOTO_MUTATION, variables={"id": item_photo.id})

    assert not executed["data"]["deleteItemPhoto"]["ok"]
    assert executed["data"]["deleteItemPhoto"]["errors"]


def test_delete_item_photo_success():
    user = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user)
    item_photo = mommy.make("exchanges.ItemPhoto", item=item)

    executed = gql(user=user).execute(DELETE_ITEM_PHOTO_MUTATION, variables={"id": item_photo.id})
    assert executed["data"]["deleteItemPhoto"]["ok"]
    assert not executed["data"]["deleteItemPhoto"]["errors"]

    assert ItemPhoto.objects.count() == 0
