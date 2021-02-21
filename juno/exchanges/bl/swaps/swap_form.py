from django import forms

from exchanges.models import Item
from juno.constants import DEAL_TYPE


class SwapForm(forms.Form):

    item = forms.ModelChoiceField(
        queryset=Item.objects.all(),
        required=False,
    )
    type = forms.ChoiceField(required=False, choices=DEAL_TYPE)
    accepted = forms.BooleanField(required=False)


class SwapMessageForm(forms.Form):

    msg = forms.CharField(required=False)
