from django import forms
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError

from users.models import User


class ChangePasswordForm(forms.Form):

    user = forms.ModelChoiceField(required=True, queryset=User.objects.all())
    password1 = forms.CharField(required=True)
    password2 = forms.CharField(required=True)

    def clean(self):
        cleaned_data = super().clean()
        if "password1" not in cleaned_data:
            return cleaned_data

        password1 = cleaned_data["password1"]
        password2 = cleaned_data["password2"]
        if password1 != password2:
            raise forms.ValidationError("Passwords do not match")

        return cleaned_data

    def clean_password1(self):
        password = self.cleaned_data["password1"]
        try:
            password_validation.validate_password(password)
        except ValidationError as e:
            raise forms.ValidationError(e)

        return password

    def clean_user(self):
        user = self.cleaned_data["user"]
        if user.social_uid is not None:
            raise forms.ValidationError("Cannot set password for social account")

        return user

    def save(self):
        user = self.cleaned_data["user"]
        password = self.cleaned_data["password1"]

        user.set_password(password)
        user.save()
