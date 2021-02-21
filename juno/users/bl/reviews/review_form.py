from django import forms

from users.models import User


class UserReviewForm(forms.Form):

    user_to = forms.ModelChoiceField(
        queryset=User.objects.all(),
        required=True,
    )
    stars = forms.IntegerField(required=True)
    comments = forms.CharField(required=True)
