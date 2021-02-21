import graphene
from django.contrib.auth import logout, authenticate
from graphql import GraphQLError

from users.graphql.auth.types import (
    LoginInput,
    RegistrationInput,
    ForgotPasswordInput,
    ForgotPasswordRefreshInput,
    ChangePasswordInput,
)
from users.bl import identity
from utils.forms import get_gql_errors_dict, get_gql_errors


class LoginMutation(graphene.Mutation):
    class Arguments:
        data = LoginInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    errors_json = graphene.JSONString(required=False)

    def mutate(self, info, data):
        form = identity.ModelLoginForm(data={"username": data.username, "password": data.password})
        if not form.is_valid():
            return LoginMutation(ok=False, errors=form.errors.as_json())

        form.login(info.context)
        return LoginMutation(ok=True)


class GoogleLoginMutation(graphene.Mutation):
    class Arguments:
        id_token = graphene.String(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, id_token):
        form = identity.GoogleLoginForm(
            data={
                "id_token": id_token,
            }
        )
        if not form.is_valid():
            return GoogleLoginMutation(ok=False, errors=form.errors.as_json())

        form.login(info.context)
        return GoogleLoginMutation(ok=True)


class SignupMutation(graphene.Mutation):
    class Arguments:
        data = RegistrationInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    errors_json = graphene.JSONString(required=False)

    def mutate(self, info, data):
        form = identity.ModelSignupForm(data=data)
        if not form.is_valid():
            return SignupMutation(ok=False, errors_json=get_gql_errors_dict(form.errors))

        form.save()

        login_form = identity.ModelLoginForm(data={"username": data.username, "password": data.password1})
        if not login_form.is_valid():
            return SignupMutation(ok=False)

        login_form.login(info.context)
        return SignupMutation(ok=True)


class GoogleSignupMutation(graphene.Mutation):
    class Arguments:
        id_token = graphene.String(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, id_token):
        form = identity.GoogleSignupForm(data={"id_token": id_token})

        if not form.is_valid():
            return GoogleSignupMutation(ok=False, errors=get_gql_errors(form.errors))
        form.save()

        login_form = identity.GoogleLoginForm(data={"id_token": id_token})
        if not login_form.is_valid():
            return GoogleSignupMutation(ok=False)

        login_form.login(info.context)
        return GoogleSignupMutation(ok=True)


class LogoutMutation(graphene.Mutation):
    class Arguments:
        pass

    ok = graphene.Boolean(required=True)

    def mutate(self, info):
        logout(info.context)

        return LogoutMutation(ok=True)


class ForgotPasswordRequestMutation(graphene.Mutation):
    class Arguments:
        data = ForgotPasswordInput(required=True)

    ok = graphene.Boolean(required=True)

    def mutate(self, info, data):
        form = identity.ForgotPasswordRequestForm(data=data)

        if not form.is_valid():
            # Don't let know a user if the email actually exists
            return ForgotPasswordRequestMutation(ok=True)

        form.save()
        return ForgotPasswordRequestMutation(ok=True)


class ForgotPasswordRefreshMutation(graphene.Mutation):
    class Arguments:
        data = ForgotPasswordRefreshInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, data):
        form = identity.ForgotPasswordRefreshForm(data=data)

        if not form.is_valid():
            return ForgotPasswordRefreshMutation(ok=False, errors=get_gql_errors(form.errors))

        form.save()
        return ForgotPasswordRefreshMutation(ok=True)


class ChangeEmailRequestMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, email):
        if not info.context.user.is_authenticated:
            raise GraphQLError("Unauthorized")
        form = identity.ChangeEmailRequestForm(data={"user": info.context.user, "new_email": email})

        if not form.is_valid():
            return ChangeEmailRequestMutation(ok=False, errors=get_gql_errors(form.errors))

        form.save()
        return ChangeEmailRequestMutation(ok=True)


class ChangeEmailRefreshMutation(graphene.Mutation):
    class Arguments:
        token = graphene.String(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)

    def mutate(self, info, token):
        form = identity.ChangeEmailRefreshForm(data={"token": token})

        if not form.is_valid():
            return ChangeEmailRefreshMutation(ok=False, errors=get_gql_errors(form.errors))

        form.save()
        return ChangeEmailRefreshMutation(ok=True)


class ChangePasswordMutation(graphene.Mutation):
    class Arguments:
        data = ChangePasswordInput(required=True)

    ok = graphene.Boolean(required=True)
    errors = graphene.String(required=False)
    errors_json = graphene.JSONString(required=False)

    def mutate(self, info, data):
        if not info.context.user.is_authenticated:
            raise GraphQLError("Unauthorized")

        user = info.context.user
        user2 = authenticate(username=user.username, password=data.old_password)
        if not user2 or user.id != user2.id:
            raise GraphQLError("Невірний пароль")

        form = identity.ChangePasswordForm(
            data={"user": info.context.user, "password1": data.password1, "password2": data.password2}
        )

        if not form.is_valid():
            return ChangePasswordMutation(ok=False, errors_json=get_gql_errors_dict(form.errors))

        form.save()
        return ChangePasswordMutation(ok=True)
