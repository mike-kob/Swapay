import pytest
from model_mommy import mommy

from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

PRIVATE_ITEM_QUERY = """
query ($id: Int!) {
  privateItem(id: $id) {
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
    activated
    lastActivated
    created
    photos {
      id
    }
  }
}

"""


def test_unauthorized_private_item():
    item = mommy.make("exchanges.Item")
    executed = gql().execute(
        PRIVATE_ITEM_QUERY,
        variables={
            "id": item.id,
        },
    )

    assert not executed["data"]["privateItem"]


def test_not_owned_private_item():
    user1 = mommy.make("users.User")
    user2 = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user2)
    executed = gql(user=user1).execute(
        PRIVATE_ITEM_QUERY,
        variables={
            "id": item.id,
        },
    )

    assert not executed["data"]["privateItem"]


def test_private_item_success():
    user = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user, _fill_optional=True)
    executed = gql(user=user).execute(
        PRIVATE_ITEM_QUERY,
        variables={
            "id": item.id,
        },
    )

    assert executed["data"]["privateItem"] == {
        "id": str(item.id),
        "rentPrice": float(item.rent_price),
        "sellPrice": float(item.sell_price),
        "exchangeDescription": item.exchange_description,
        "description": item.description,
        "title": item.title,
        "owner": {"id": str(item.owner_id)},
        "types": list(item.types),
        "activated": item.activated,
        "lastActivated": int(item.last_activated.timestamp()),
        "created": int(item.created.timestamp()),
        "photos": [],
    }
