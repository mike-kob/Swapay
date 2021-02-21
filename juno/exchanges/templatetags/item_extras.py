import urllib
from urllib.parse import urlencode, quote

from django import template

register = template.Library()


@register.simple_tag
def get_cover_photo(item, size_attr):
    photo = item.itemphoto_set.filter(main=True).first()
    if not photo:
        photo = item.itemphoto_set.first()

    if not photo:
        return ""

    if photo.file:
        return photo.file.url

    file = getattr(photo.photo, size_attr)
    if not file:
        return ""

    return file.url


@register.simple_tag(takes_context=True)
def get_current_url(context, **kwargs):
    path = context["request"].path
    params = {
        **context["request"].GET,
        **kwargs,
    }
    query = urlencode(params)
    if query:
        query = f"?{query}"

    return quote(f"{path}{query}", safe="")


@register.simple_tag
def resolve_item_photo(item_photo):
    if item_photo.file:
        return item_photo.file.url

    if item_photo.photo_id:
        return item_photo.photo.original_file.url

    return ""
