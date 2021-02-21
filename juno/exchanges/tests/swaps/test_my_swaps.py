import pytest
from model_mommy import mommy

from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

SWAPS_QUERY = """
query {
  swaps {
    id
    owner {
      id
    }
    client {
      id
    }
    item {
      id
    }
    type
    accepted
    created
  }
}
"""


def test_unauthorized_my_swaps():
    executed = gql().execute(SWAPS_QUERY)

    assert executed["data"] is None


def test_one_my_swap():
    user = mommy.make("users.User", _fill_optional=True)
    swap = mommy.make("exchanges.Swap", owner=user)
    executed = gql(user=user).execute(SWAPS_QUERY)

    assert len(executed["data"]["swaps"]) == 1
    assert executed["data"]["swaps"][0]["id"] == str(swap.id)


def test_many_my_swaps():
    user = mommy.make("users.User")
    swap1 = mommy.make("exchanges.Swap", owner=user)
    swap2 = mommy.make("exchanges.Swap", client=user)
    executed = gql(user=user).execute(SWAPS_QUERY)

    assert len(executed["data"]["swaps"]) == 2
    assert executed["data"]["swaps"][0]["id"] == str(swap1.id)
    assert executed["data"]["swaps"][1]["id"] == str(swap2.id)
