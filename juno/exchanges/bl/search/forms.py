from django import forms

from exchanges.models import GameTag
from users.models import City
from juno.constants import DEAL_TYPE


class SearchForm(forms.Form):

    keywords = forms.CharField(required=False, strip=True)

    types = forms.ChoiceField(
        required=False,
        choices=DEAL_TYPE,
    )

    rent_price_low = forms.CharField(
        required=False,
    )

    rent_price_high = forms.CharField(
        required=False,
    )

    sell_price_low = forms.CharField(
        required=False,
    )

    sell_price_high = forms.CharField(
        required=False,
    )

    meeting_place = forms.CharField(
        required=False,
    )
    city = forms.ModelChoiceField(
        City.objects.filter(searchable=True),
        required=False,
    )

    page = forms.IntegerField(
        required=True,
    )

    tags = forms.ModelMultipleChoiceField(required=False, queryset=GameTag.objects.all())
