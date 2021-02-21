from exchanges.bl.search.services import DefaultSearchService, StatsSearchAdapter
from juno.constants import PAGE_SIZE


def search(data):

    adapter = DefaultSearchService(data)
    if not adapter.is_valid():
        raise ValueError("Incorrect query")

    qs = adapter.get_queryset()
    p = adapter.params["page"] - 1
    qs = qs[p * PAGE_SIZE : (p + 1) * PAGE_SIZE]
    return qs


def search_gql(data):

    adapter = DefaultSearchService(data)
    if not adapter.is_valid():
        raise ValueError("Incorrect query")

    return adapter.get_queryset()


def get_stats_qs(data):

    adapter = StatsSearchAdapter(data)
    if not adapter.is_valid():
        raise ValueError("Incorrect query")

    qs = adapter.get_queryset()
    return qs
