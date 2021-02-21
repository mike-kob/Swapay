from django import forms

from exchanges.models import Item


class AddPhotoForm(forms.Form):

    name = forms.CharField(required=False)
    item = forms.ModelChoiceField(required=True, queryset=Item.objects.all())

    guid = forms.CharField(required=False)
