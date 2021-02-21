import pytest
from model_mommy import mommy

from exchanges.models import Item
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

DELETE_ITEM_MUTATION = """
mutation (
  $id: ID!,
) {
  deleteItem (id: $id) {
    ok
    errors
  }
}
"""


def test_unauthorized_delete_item():
    item = mommy.make("exchanges.Item")
    executed = gql().execute(DELETE_ITEM_MUTATION, variables={"id": item.id})

    assert not executed["data"]["deleteItem"]["ok"]
    assert executed["data"]["deleteItem"]["errors"]


def test_not_owned_item():
    user1 = mommy.make("users.User")
    user2 = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user1)
    executed = gql(user=user2).execute(DELETE_ITEM_MUTATION, variables={"id": item.id})

    assert not executed["data"]["deleteItem"]["ok"]
    assert executed["data"]["deleteItem"]["errors"]


def test_delete_item_success():
    user = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user)

    executed = gql(user=user).execute(DELETE_ITEM_MUTATION, variables={"id": item.id})
    assert executed["data"]["deleteItem"]["ok"]
    assert not executed["data"]["deleteItem"]["errors"]

    assert Item.objects.count() == 0
