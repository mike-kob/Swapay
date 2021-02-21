import pytest
from django.utils import timezone
from freezegun import freeze_time
from model_mommy import mommy

from exchanges.models import Swap
from juno.constants import DEAL_TYPE
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

CREATE_SWAP_MUTATION = """
mutation (
  $item: ID!,
  $type: String,
  $message: String!,
) {
  createSwap (data: {
    item: $item,
    type: $type,
    message: $message,
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
    item = mommy.make("exchanges.Item")
    executed = gql().execute(CREATE_SWAP_MUTATION, variable_values={"item": item.id, "message": "Hi"})

    assert not executed["data"]["createSwap"]["ok"]
    assert executed["data"]["createSwap"]["errors"]


def test_create_swap_success():
    user1 = mommy.make("users.User")
    user2 = mommy.make("users.User")

    item = mommy.make("exchanges.Item", owner=user1)
    time = timezone.now()
    with freeze_time(time):
        executed = gql(user=user2).execute(
            CREATE_SWAP_MUTATION,
            variable_values={
                "item": item.id,
                "type": "E",
                "message": "Hi",
            },
        )

    assert executed["data"]["createSwap"]["ok"]

    assert Swap.objects.count() == 1

    swap = Swap.objects.first()
    assert swap.owner_id == user1.id
    assert swap.client_id == user2.id
    assert swap.type == DEAL_TYPE.EXCHANGE
    assert swap.accepted is None
    assert swap.created == time

    assert executed["data"]["createSwap"]["swap"] == {
        "id": str(swap.id),
        "owner": {"id": str(swap.owner_id)},
        "client": {"id": str(swap.client_id)},
        "item": {"id": str(swap.item_id)},
        "type": swap.type,
        "accepted": None,
        "created": int(swap.created.timestamp()),
    }
