from django import forms

from exchanges.models import Item
from users.models import User


class ItemReviewForm(forms.Form):

    item = forms.ModelChoiceField(
        queryset=Item.objects.all(),
        required=True,
    )
    stars = forms.IntegerField(required=True)
    comments = forms.CharField(required=True)
    user_from = forms.ModelChoiceField(
        required=True,
        queryset=User.objects.all(),
    )
    user_to = forms.ModelChoiceField(
        required=False,
        queryset=User.objects.all(),
    )

    def clean(self):
        data = self.cleaned_data
        if "item" in data:
            self.cleaned_data["user_to"] = data["item"].owner

        return self.cleaned_data
