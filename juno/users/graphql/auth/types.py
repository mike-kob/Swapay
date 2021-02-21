import graphene


class AuthInfoType(graphene.ObjectType):

    token = graphene.String(required=True)


class RegistrationInput(graphene.InputObjectType):

    username = graphene.String(required=True)
    email = graphene.String(required=True)
    password1 = graphene.String(required=True)
    password2 = graphene.String(required=True)


class LoginInput(graphene.InputObjectType):

    username = graphene.String(required=True)
    password = graphene.String(required=True)


class ForgotPasswordInput(graphene.InputObjectType):

    email = graphene.String(required=True)


class ForgotPasswordRefreshInput(graphene.InputObjectType):

    token = graphene.String(required=True)
    password1 = graphene.String(required=True)
    password2 = graphene.String(required=True)


class ChangePasswordInput(graphene.InputObjectType):
    old_password = graphene.String(required=True)
    password1 = graphene.String(required=True)
    password2 = graphene.String(required=True)
