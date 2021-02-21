import pytest
from model_mommy import mommy

from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

PUBLIC_PROFILE_QUERY = """
query(
  $ids: [ID]!
) {
  profiles(ids: $ids) {
    id
    username
    firstName
    lastName
    items {
      id
    }
  }
}
"""


def test_get_public_profile_info():
    user = mommy.make("users.User", _fill_optional=True)
    mommy.make("exchanges.Item", owner=user, activated=True, _quantity=5, _fill_optional=True)
    executed = gql().execute(PUBLIC_PROFILE_QUERY, variables={"ids": [user.id]})

    assert len(executed["data"]["profiles"]) == 1
    assert len(executed["data"]["profiles"][0]["items"]) == 5


def test_no_private_info():
    user = mommy.make("users.User", _fill_optional=True)
    mommy.make("exchanges.Item", owner=user, _quantity=5, _fill_optional=True)
    executed = gql().execute(
        """
        query(
          $ids: [ID]!
        ) {
          profiles(ids: $ids) {
            id
            username
            firstName
            lastName
            email
            items {
              id
            }
          }
        }
        """,
        variables={"ids": [user.id]},
    )

    assert executed["errors"]
    assert not executed.get("data")
