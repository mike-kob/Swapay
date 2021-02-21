import pytest
from model_mommy import mommy

from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

MESSAGES_QUERY = """
query(
   $swapId: Int!
) {
  messages(swapId: $swapId) {
    id
    author {
      id
    }
    timeSent
    seen
    body
  }
}
"""


def test_unauthorized_messages():
    swap = mommy.make("exchanges.Swap")
    mommy.make("chat.Message", swap=swap)
    executed = gql().execute(MESSAGES_QUERY, variables={"swapId": swap.id})

    assert len(executed["data"]["messages"]) == 0


def test_messages_many():
    user = mommy.make("users.User")
    swap = mommy.make("exchanges.Swap", owner=user, _fill_optional=True)
    mommy.make("chat.Message", swap=swap, author=user, _quantity=3, _fill_optional=True)
    mommy.make("chat.Message", swap=swap, author=swap.client, _quantity=5, _fill_optional=True)

    executed = gql(user=user).execute(MESSAGES_QUERY, variables={"swapId": swap.id})

    assert len(executed["data"]["messages"]) == 8


def test_messages_detailed():
    user = mommy.make("users.User")
    swap = mommy.make("exchanges.Swap", owner=user, _fill_optional=True)
    msg = mommy.make("chat.Message", swap=swap, author=user, _fill_optional=True)

    executed = gql(user=user).execute(MESSAGES_QUERY, variables={"swapId": swap.id})

    assert len(executed["data"]["messages"]) == 1
    assert executed["data"]["messages"][0] == {
        "id": str(msg.id),
        "author": {"id": str(user.id)},
        "timeSent": int(msg.time_sent.timestamp()),
        "seen": msg.seen,
        "body": msg.body,
    }
