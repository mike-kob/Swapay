import graphene
from django.core.exceptions import ValidationError

from users.graphql.profile.types import (
    UserInput,
    UserReviewInput,
    UserReviewType,
    PrivateProfileType,
)
from users.bl.city import add_custom_city
from users.bl.reviews.review_form import UserReviewForm
from users.models import Review
from utils.forms import get_gql_errors_dict


class UpdateUserMutation(graphene.Mutation):
    class Arguments:
        data = UserInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    errors_json = graphene.JSONString(required=False)
    user = graphene.Field(PrivateProfileType)

    def mutate(self, info, data):
        if not info.context.user.is_authenticated:
            return UpdateUserMutation(ok=False)

        user = info.context.user
        for k, v in data.items():
            if k == "city":
                if v and v.id:
                    user.city_id = v.id
                elif v and v.id is None and v.name is not None:
                    city = add_custom_city(v)
                    user.city_id = city.id
            elif k == "email":
                pass
            elif k == "photo":
                user.photo_id = v
            elif k == "photo_file":
                user.photo_file = v
                user.photo_id = None
            else:
                if v:
                    setattr(user, k, v)

        try:
            user.full_clean()
            user.save()
        except ValidationError as e:
            return UpdateUserMutation(ok=False, errors_json=get_gql_errors_dict(e.message_dict))

        return UpdateUserMutation(ok=True, user=user)


class WriteUserReviewMutation(graphene.Mutation):
    class Arguments:
        data = UserReviewInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    user_review = graphene.Field(UserReviewType)

    def mutate(self, info, data):
        if not info.context.user.is_authenticated:
            return WriteUserReviewMutation(ok=False, errors="Only authenticated users can write " "reviews")

        user = info.context.user
        form = UserReviewForm(data=data)
        if not form.is_valid():
            return WriteUserReviewMutation(ok=False, errors=form.errors.as_text())

        try:
            review = Review.objects.create(user_from=user, **form.cleaned_data)
        except Exception as e:
            return WriteUserReviewMutation(ok=False, errors=str(e))

        return WriteUserReviewMutation(ok=True, user_review=review)
