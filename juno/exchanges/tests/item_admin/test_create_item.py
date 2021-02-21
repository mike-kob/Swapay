import pytest
from model_mommy import mommy

from exchanges.models import Item
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

CREATE_ITEM_MUTATION = """
mutation(
  $rentPrice: Decimal,  
  $sellPrice: Decimal,
  $exchangeDescription: String
  $description: String,
  $title: String,
  $types: [DealType],
) {
  createItem(data: {
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


def test_unauthorized_create_item():
    executed = gql().execute(CREATE_ITEM_MUTATION)

    assert not executed["data"]["createItem"]["ok"]
    assert executed["data"]["createItem"]["errors"]


def test_create_empty_item():
    user = mommy.make("users.User", _fill_optional=True)
    executed = gql(user=user).execute(CREATE_ITEM_MUTATION)

    assert executed["data"]["createItem"]["ok"]

    assert Item.objects.count() == 1
    item = Item.objects.first()
    assert item.owner_id == user.id


def test_create_item():
    user = mommy.make("users.User", _fill_optional=True)
    executed = gql(user=user).execute(
        CREATE_ITEM_MUTATION,
        variables={
            "rentPrice": 100,
            "sellPrice": 1000,
            "exchangeDescription": "Lalala",
            "description": "Lalala",
            "title": "Lalala",
            "types": ["E", "R", "P"],
        },
    )

    assert Item.objects.count() == 1

    item = Item.objects.first()
    assert item.owner_id == user.id
    assert item.rent_price == 100
    assert item.sell_price == 1000
    assert item.exchange_description == "Lalala"
    assert item.title == "Lalala"
    assert item.description == "Lalala"
    assert not item.activated
    assert set(item.types) == {"E", "R", "P"}

    assert executed["data"]["createItem"]["item"] == {
        "id": str(item.id),
        "rentPrice": item.rent_price,
        "sellPrice": item.sell_price,
        "exchangeDescription": item.exchange_description,
        "description": item.description,
        "title": item.title,
        "owner": {"id": str(item.owner_id)},
        "types": ["E", "R", "P"],
    }
