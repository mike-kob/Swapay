from graphene import ObjectType

from users.graphql.auth.mutations import (
    LoginMutation,
    GoogleLoginMutation,
    LogoutMutation,
    SignupMutation,
    GoogleSignupMutation,
    ForgotPasswordRequestMutation,
    ForgotPasswordRefreshMutation,
    ChangeEmailRequestMutation,
    ChangeEmailRefreshMutation,
    ChangePasswordMutation,
)
from users.graphql.profile.mutations import (
    UpdateUserMutation,
    WriteUserReviewMutation,
)
from users.graphql.profile.queries import (
    CityQuery,
    UserQuery,
    ProfilesQuery,
)


class UsersQuery(CityQuery, UserQuery, ProfilesQuery, ObjectType):
    pass


class UsersMutation(ObjectType):
    update_user = UpdateUserMutation.Field()
    write_user_review = WriteUserReviewMutation.Field()

    login = LoginMutation.Field()
    google_login = GoogleLoginMutation.Field()

    logout = LogoutMutation.Field()

    signup = SignupMutation.Field()
    google_signup = GoogleSignupMutation.Field()

    forgot_password_request = ForgotPasswordRequestMutation.Field()
    forgot_password_confirm = ForgotPasswordRefreshMutation.Field()

    change_email_request = ChangeEmailRequestMutation.Field()
    change_email_confirm = ChangeEmailRefreshMutation.Field()

    change_password = ChangePasswordMutation.Field()
