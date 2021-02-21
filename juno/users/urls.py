from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView

react_view = ensure_csrf_cookie(TemplateView.as_view(template_name="index.html"))

urlpatterns = [
    path("reset-password/<str:token>/", react_view, name="auth-forgot-password"),
    path("confirm-email/<str:token>/", react_view, name="auth-confirm-email"),
]
