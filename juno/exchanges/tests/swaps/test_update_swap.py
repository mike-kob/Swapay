import pytest
from django.utils import timezone
from freezegun import freeze_time
from model_mommy import mommy

from exchanges.models import Swap
from juno.constants import DEAL_TYPE
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

UPDATE_SWAP_MUTATION = """
mutation (
  $id: ID!
  $type: String,
  $accepted: Boolean  
) {
  updateSwap (
    id: $id,
    data: {
        type: $type,
        accepted: $accepted,
  }) {
    ok
    errors
    swap {
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
}
"""


def test_unauthorized_create_swap():
    swap = mommy.make("exchanges.Swap")
    executed = gql().execute(UPDATE_SWAP_MUTATION, variable_values={"id": swap.id})

    assert not executed["data"]["updateSwap"]["ok"]
    assert executed["data"]["updateSwap"]["errors"]


def test_update_swap_success():
    user = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user, _fill_optional=True)
    swap = mommy.make("exchanges.Swap", owner=user, item=item, type=DEAL_TYPE.PURCHASE, _fill_optional=True)

    executed = gql(user=user).execute(
        UPDATE_SWAP_MUTATION,
        variable_values={
            "id": swap.id,
            "type": "E",
            "accepted": True,
        },
    )

    assert executed["data"]["updateSwap"]["ok"]
    swap.refresh_from_db()

    assert swap.type == DEAL_TYPE.EXCHANGE
    assert swap.accepted is True

    assert executed["data"]["updateSwap"]["swap"] == {
        "id": str(swap.id),
        "owner": {"id": str(swap.owner_id)},
        "client": {"id": str(swap.client_id)},
        "item": {"id": str(swap.item_id)},
        "type": swap.type,
        "accepted": True,
        "created": int(swap.created.timestamp()),
    }
