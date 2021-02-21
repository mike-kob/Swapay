from django.contrib.auth.models import AnonymousUser
from graphene.test import Client


from gqlapi.schema import schema
from django.test import RequestFactory


def gql(**kwargs):
    request = RequestFactory(**kwargs)
    request.post("/gql/")
    if "user" in kwargs:
        request.user = kwargs["user"]
    else:
        request.user = AnonymousUser()
    return Client(schema, context=request)
