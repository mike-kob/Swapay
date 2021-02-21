import pytest
from model_mommy import mommy

from chat.models import Message
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

POST_MESSAGE_MUTATION = """
mutation(
  $swap: Int!,
  $body: String!,
) {
  postMessage(data: {
    swap: $swap,
    body: $body
  }) {
    ok
    errors
    message {
      id
      author {
        id
      }
      timeSent
      body
      
    }
  }
}
"""


def test_unauthorized_post_message():
    swap = mommy.make("exchanges.Swap")
    executed = gql().execute(POST_MESSAGE_MUTATION, variables={"swap": swap.id, "body": "La"})

    assert not executed["data"]["postMessage"]["ok"]


def test_post_message_success():
    user1 = mommy.make("users.User")
    user2 = mommy.make("users.User")
    swap = mommy.make("exchanges.Swap", owner=user1, client=user2)
    executed = gql(user=user1).execute(
        POST_MESSAGE_MUTATION,
        variables={
            "swap": swap.id,
            "body": "La",
        },
    )

    assert Message.objects.count() == 1

    msg = Message.objects.first()

    assert msg.author_id == user1.id
    assert msg.body == "La"

    assert executed["data"]["postMessage"]["message"] == {
        "id": str(msg.id),
        "author": {"id": str(user1.id)},
        "timeSent": int(msg.time_sent.timestamp()),
        "body": msg.body,
    }
