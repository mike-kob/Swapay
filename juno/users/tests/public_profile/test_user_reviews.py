import pytest
from model_mommy import mommy

from utils.helpers import gql
from users.models import Review

pytestmark = [pytest.mark.django_db]

WRITE_REVIEW_MUTATION = """
mutation(
  $userTo: ID!,
  $stars: Int!,
  $comments: String,
) {
  writeUserReview(data: {
    userTo: $userTo,
    stars: $stars,
    comments: $comments
  }) {
    ok
    errors
    userReview {
      id
      userFrom {
        id
      }
      userTo {
        id
      }
      stars
      comments
      created
    }
  }
}
"""


def test_unauthorized_write_review():
    user1 = mommy.make("users.User")
    executed = gql().execute(
        WRITE_REVIEW_MUTATION, variables={"userTo": user1.id, "stars": 5, "comments": "Lalala"}
    )

    assert not executed["data"]["writeUserReview"]["ok"]
    assert executed["data"]["writeUserReview"]["errors"]
    assert not executed["data"]["writeUserReview"]["userReview"]


def test_write_not_existing_user_review():
    user = mommy.make("users.User", _fill_optional=True)
    executed = gql(user=user).execute(
        WRITE_REVIEW_MUTATION, variables={"userTo": -1, "stars": 5, "comments": "Lalala"}
    )

    assert not executed["data"]["writeUserReview"]["ok"]
    assert executed["data"]["writeUserReview"]["errors"]


def test_write_review_success():
    user1 = mommy.make("users.User")
    user2 = mommy.make("users.User")

    executed = gql(user=user1).execute(
        WRITE_REVIEW_MUTATION, variables={"userTo": user2.id, "stars": 5, "comments": "Cool"}
    )

    assert Review.objects.count() == 1
    review = Review.objects.first()

    assert review.stars == 5
    assert review.user_to_id == user2.id
    assert review.comments == "Cool"

    assert executed["data"]["writeUserReview"]["ok"]
    assert executed["data"]["writeUserReview"]["userReview"] == {
        "id": str(review.id),
        "userFrom": {"id": str(user1.id)},
        "userTo": {"id": str(user2.id)},
        "stars": review.stars,
        "comments": review.comments,
        "created": int(review.created.timestamp()),
    }
