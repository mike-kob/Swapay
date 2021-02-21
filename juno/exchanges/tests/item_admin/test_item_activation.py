import pytest
from django.utils import timezone
from model_mommy import mommy
from freezegun import freeze_time
from utils.helpers import gql

pytestmark = [pytest.mark.django_db]

ACTIVATE_ITEM_MUTATION = """
mutation (
  $id: ID!,
  $activate: Boolean!
) {
  itemActivation (id: $id, activate: $activate) {
    ok
    errors
  }
}
"""


def test_unauthorized_add_photo():
    item = mommy.make("exchanges.Item")
    executed = gql().execute(
        ACTIVATE_ITEM_MUTATION,
        variables={
            "id": item.id,
            "activate": True,
        },
    )

    assert not executed["data"]["itemActivation"]["ok"]
    assert executed["data"]["itemActivation"]["errors"]


def test_not_owned_activate_item():
    user1 = mommy.make("users.User")
    user2 = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user1)
    executed = gql(user=user2).execute(
        ACTIVATE_ITEM_MUTATION,
        variables={
            "id": item.id,
            "activate": True,
        },
    )

    assert not executed["data"]["itemActivation"]["ok"]
    assert executed["data"]["itemActivation"]["errors"]


def test_activate_item_without_photos():
    user = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user)
    executed = gql(user=user).execute(
        ACTIVATE_ITEM_MUTATION,
        variables={
            "id": item.id,
            "activate": True,
        },
    )
    assert not executed["data"]["itemActivation"]["ok"]
    assert executed["data"]["itemActivation"]["errors"]


def test_activate_item_success():
    user = mommy.make("users.User", city=mommy.make("users.City"), _fill_optional=True)
    item = mommy.make("exchanges.Item", owner=user, activated=False, _fill_optional=True)
    mommy.make("exchanges.ItemPhoto", item=item, _quantity=3)
    time = timezone.now()
    with freeze_time(time):
        executed = gql(user=user).execute(
            ACTIVATE_ITEM_MUTATION,
            variables={
                "id": item.id,
                "activate": True,
            },
        )

    # TODO: add tests with verified email
    # assert executed['data']['itemActivation']['ok']
    #
    # item.refresh_from_db()
    # assert item.activated
    # assert item.last_activated == time


def test_deactivate_item_success():
    user = mommy.make("users.User")
    item = mommy.make("exchanges.Item", owner=user, activated=True, _fill_optional=True)
    executed = gql(user=user).execute(
        ACTIVATE_ITEM_MUTATION,
        variables={
            "id": item.id,
            "activate": False,
        },
    )

    assert executed["data"]["itemActivation"]["ok"]

    item.refresh_from_db()
    assert not item.activated
