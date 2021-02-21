import pytest
from model_mommy import mommy

from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

PUBLIC_ITEM_QUERY = """
query(
   $id: Int!
) {
  publicItem(id: $id) {
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

"""


def test_get_public_item_info():
    item = mommy.make("exchanges.Item", _fill_optional=True)
    executed = gql().execute(PUBLIC_ITEM_QUERY, variables={"id": item.id})

    assert executed["data"]["publicItem"] == {
        "id": str(item.id),
        "rentPrice": float(item.rent_price),
        "sellPrice": float(item.sell_price),
        "exchangeDescription": item.exchange_description,
        "description": item.description,
        "title": item.title,
        "owner": {"id": str(item.owner_id)},
        "types": list(item.types),
    }
