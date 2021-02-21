import pytest
from model_mommy import mommy

from exchanges.models import Item
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

UPDATE_ITEM_MUTATION = """
mutation(
  $id: ID!
  $rentPrice: Decimal,  
  $sellPrice: Decimal,
  $exchangeDescription: String
  $description: String,
  $title: String,
  $types: [DealType],
) {
  updateItem(
    id: $id,
    data: {
        rentPrice: $rentPrice,
        sellPrice: $sellPrice,
        exchangeDescription: $exchangeDescription,
        description: $description,
        title: $title,
        types: $types
  }) {
    ok
    errors
    item {
      id
      rentPrice
      sellPrice
      exchangeDescription
      description
      title
      owner {
        id
      }
      types
    }

  }
}
"""


def test_unauthorized_update_item():
    item = mommy.make("exchanges.Item")
    executed = gql().execute(UPDATE_ITEM_MUTATION, variables={"id": item.id})

    assert not executed["data"]["updateItem"]["ok"]
    assert executed["data"]["updateItem"]["errors"]


def test_update_not_existing_item():
    user = mommy.make("users.User")
    executed = gql(user=user).execute(UPDATE_ITEM_MUTATION, variables={"id": -1})

    assert not executed["data"]["updateItem"]["ok"]
    assert executed["data"]["updateItem"]["errors"]


def test_update_wrong_item():
    user = mommy.make("users.User")
    user2 = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user2)
    executed = gql(user=user).execute(
        UPDATE_ITEM_MUTATION,
        variables={
            "id": item.id,
            "rentPrice": 100,
            "sellPrice": 1000,
            "exchangeDescription": "Lalala",
            "description": "Lalala",
            "title": "Lalala",
            "types": ["E", "R", "P"],
        },
    )
    assert not executed["data"]["updateItem"]["ok"]
    assert executed["data"]["updateItem"]["errors"]


def test_update_item():
    user = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user)
    executed = gql(user=user).execute(
        UPDATE_ITEM_MUTATION,
        variables={
            "id": item.id,
            "rentPrice": 10,
            "sellPrice": 100,
            "exchangeDescription": "Lalala",
            "description": "Lalala",
            "title": "Lalala",
            "types": ["E", "R", "P"],
        },
    )

    item.refresh_from_db()
    assert item.rent_price == 10
    assert item.sell_price == 100
    assert item.exchange_description == "Lalala"
    assert item.title == "Lalala"
    assert item.description == "Lalala"
    assert not item.activated
    assert set(item.types) == {"E", "R", "P"}

    assert executed["data"]["updateItem"]["item"] == {
        "id": str(item.id),
        "rentPrice": item.rent_price,
        "sellPrice": item.sell_price,
        "exchangeDescription": item.exchange_description,
        "description": item.description,
        "title": item.title,
        "owner": {"id": str(item.owner_id)},
        "types": ["E", "R", "P"],
    }
