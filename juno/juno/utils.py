import urllib.parse

from django.conf import settings


def get_full_url(path: str) -> str:
    return urllib.parse.urljoin(settings.DEFAULT_HOST, path)
