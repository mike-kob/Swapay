from django import forms

from exchanges.models import Item, GameTag
from juno.constants import DEAL_TYPE


class ItemForm(forms.Form):

    rent_price = forms.DecimalField(required=False)
    deposit = forms.DecimalField(required=False)
    sell_price = forms.DecimalField(required=False)
    exchange_description = forms.CharField(required=False)

    en_description = forms.CharField(required=False)
    description = forms.CharField(required=False)
    en_preview = forms.CharField(required=False)
    preview = forms.CharField(required=False)

    avg_game_time = forms.CharField(required=False)
    language = forms.CharField(required=False)
    age = forms.CharField(required=False)

    en_title = forms.CharField(required=False, max_length=200)
    title = forms.CharField(required=False, max_length=200)
    types = forms.MultipleChoiceField(choices=DEAL_TYPE, required=False)
    tags = forms.ModelMultipleChoiceField(
        queryset=GameTag.objects.all(),
        required=False,
    )
