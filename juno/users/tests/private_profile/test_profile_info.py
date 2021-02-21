import pytest
from model_mommy import mommy

from utils.helpers import gql

pytestmark = [pytest.mark.django_db]


def test_unauthorized_private_info():
    executed = gql().execute(
        """
        query {
            user {
                id
                username
                firstName
                lastName
                phone
            }
        }
        """
    )

    assert not executed["data"]["user"]


def test_get_basic_private_info():
    user = mommy.make("users.User", _fill_optional=True)
    executed = gql(user=user).execute(
        """
        query {
            user {
                id
                username
                firstName
                lastName
                phone
            }
        }
        """
    )

    assert executed["data"]["user"] == {
        "id": str(user.id),
        "username": user.username,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "phone": user.phone,
    }


def test_get_extended_private_info():
    user = mommy.make("users.User", _fill_optional=True)
    mommy.make("exchanges.Item", owner=user, _quantity=5, _fill_optional=True)
    executed = gql(user=user).execute(
        """
        query {
          user {
            id
            items {
              id
            }
            city {
              name
            }
          }
        }
        """
    )

    assert executed["data"]["user"]
    assert executed["data"]["user"]["city"]
    assert len(executed["data"]["user"]["items"]) == 5


MUTATION_QUERY = """
        mutation (
          $phone: String,
          $username: String,
          $firstName: String,
          $lastName: String
        )
        {
          updateUser(data: {
            username: $username,
            firstName: $firstName,
            lastName: $lastName,
            phone: $phone
          }) {
            ok
            errors
            user {
              username
              firstName
              lastName
              phone
            }
          }
        }
"""


def test_unauthorized_mutate_private_info():
    executed = gql().execute(MUTATION_QUERY, variables={"phone": "12345", "username": "username"})

    assert not executed["data"]["updateUser"]["ok"]
    assert not executed["data"]["updateUser"]["user"]


def test_mutate_private_info():
    user = mommy.make("users.User", _fill_optional=True)
    executed = gql(user=user).execute(MUTATION_QUERY, variables={"phone": "12345", "username": "username"})

    res = executed["data"]["updateUser"]
    assert res["ok"]
    assert res["user"]["phone"] == "12345"
    assert res["user"]["username"] == "username"


def test_not_mutate_private_info():
    user = mommy.make("users.User", _fill_optional=True)
    executed = gql(user=user).execute(
        MUTATION_QUERY,
    )

    res = executed["data"]["updateUser"]
    assert res["ok"]
    assert res["user"]["phone"] == user.phone
    assert res["user"]["username"] == user.username
