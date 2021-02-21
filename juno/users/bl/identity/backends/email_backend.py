from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend


class EmailAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        model_cls = get_user_model()
        try:
            user = model_cls.objects.get(email=username)
            if user.check_password(raw_password=password):
                return user
            return None
        except model_cls.DoesNotExist:
            return None

    def get_user(self, user_id):
        model_cls = get_user_model()
        try:
            return model_cls.objects.get(pk=user_id)
        except model_cls.DoesNotExist:
            return None
