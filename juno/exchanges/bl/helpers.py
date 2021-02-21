TYPES_PAGES_MAP = {"sell": "P", "exchange": "E", "rent": "R"}


def prepare_search_params(request, type_page):
    params = {}

    # Price
    price = request.GET.get("price")
    if price:
        prices = price.split("-")
        if len(prices) == 2:
            params["sell_price_low"] = prices[0]
            params["sell_price_high"] = prices[1]

    # Tags
    tags = request.GET.get("tags")
    if tags:
        params["tags"] = tags.split(",")

    params.update(
        {
            "keywords": request.GET.get("k"),
            "page": request.GET.get("p") or "1",
            "types": TYPES_PAGES_MAP[type_page],
            "city": request.GET.get("city") or "1",
        }
    )

    return params
