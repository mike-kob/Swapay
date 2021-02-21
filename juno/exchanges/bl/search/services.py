from django.db.models import Q

from exchanges.models import Item
from exchanges.bl.search.forms import SearchForm
from django.contrib.postgres.search import TrigramSimilarity


class SearchService:
    def is_valid(self):
        raise NotImplementedError

    def get_queryset(self):
        raise NotImplementedError


class DefaultSearchService(SearchService):
    """
    This is the class that implements search algorithm. After all params are validated
    in Django form it produces SQL query (with Q objects) and returns QuerySet that corresponds to user's query
    """

    def __init__(self, search_params):
        self._form = SearchForm(search_params)

    def is_valid(self):
        return self._form.is_valid()

    @property
    def params(self):
        return self._form.cleaned_data

    def get_queryset(self):
        data = self._form.cleaned_data

        query = Q(activated=True)

        if data.get("rent_price_low"):
            query &= Q(rent_price__gte=data["rent_price_low"]) | Q(rent_price__isnull=True)
        if data.get("rent_price_high"):
            query &= Q(rent_price__lte=data["rent_price_high"]) | Q(rent_price__isnull=True)

        if data.get("sell_price_low"):
            query &= Q(sell_price__gte=data["sell_price_low"]) | Q(sell_price__isnull=True)
        if data.get("sell_price_high"):
            query &= Q(sell_price__lte=data["sell_price_high"]) | Q(sell_price__isnull=True)

        if data.get("types"):
            query &= Q(types__contains=data["types"])

        if data.get("tags"):
            query &= Q(tags__id__in=data["tags"])

        if data.get("city"):
            query &= Q(owner__city=data["city"])

        if data.get("keywords"):
            test = data.get("keywords")
            qs = Item.objects.filter(query)
            qs = qs.annotate(
                t_sim=TrigramSimilarity("title", test),
                d_sim=TrigramSimilarity("description", test),
            )
            qs = qs.filter(Q(t_sim__gt=0.01) | Q(d_sim__gt=0.01))
            qs = qs.order_by("-t_sim", "-d_sim")
            return qs
        else:
            return Item.objects.filter(query)


class StatsSearchAdapter(DefaultSearchService):
    def get_queryset(self):
        data = self._form.cleaned_data

        query = Q(activated=True)

        if data.get("types"):
            query &= Q(types__contains=data["types"])

        if data.get("tags"):
            query &= Q(tags__id__in=data["tags"])

        if data.get("city"):
            query &= Q(owner__city=data["city"])

        if data.get("keywords"):
            test = data.get("keywords")
            qs = Item.objects.filter(query)
            qs = qs.annotate(
                t_sim=TrigramSimilarity("title", test),
                d_sim=TrigramSimilarity("description", test),
            )
            qs = qs.filter(Q(t_sim__gt=0.01) | Q(d_sim__gt=0.01))
            qs = qs.order_by("-t_sim", "-d_sim")
            return qs
        else:
            return Item.objects.filter(query)
