from graphene_django.views import GraphQLView
from django.contrib.auth.mixins import PermissionRequiredMixin


class GraphiqlView(PermissionRequiredMixin, GraphQLView):

    graphiql = True

    def has_permission(self):
        return True
