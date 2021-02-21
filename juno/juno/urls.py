from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.views.generic import TemplateView
from graphene_django.views import GraphQLView

from gqlapi.views import GraphiqlView

urlpatterns = static(
    settings.STATIC_URL, document_root=settings.STATIC_ROOT
) + [
    # Admin panel
    path("teammates/", include("support.urls")),
    # Graphql
    path("giql/", GraphiqlView.as_view()),
    path("gql/", GraphQLView.as_view()),
    # Helping auth urls
    path("auth/", include("users.urls")),
    # Helping robots.txt file
    path("robots.txt", TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
]
