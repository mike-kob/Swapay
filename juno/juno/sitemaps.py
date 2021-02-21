from django.contrib.sitemaps import Sitemap

from exchanges.models import Item
from support.models import BlogPost, BlogCategory

pages = {
    "Home Uk": "/uk",
    "Home Ru": "/ru",
    "Catalog Uk": "/uk/catalog",
    "Catalog Ru": "/ru/catalog",
    "Blog home Uk": "/uk/blog",
    "Blog home Ru": "/ru/blog",
}


class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = "daily"
    protocol = "https"

    def items(self):
        return list(pages.keys())

    def location(self, item):
        return pages.get(item, "/")


class UkGamesSitemap(Sitemap):
    changefreq = "never"
    protocol = "https"

    def items(self):
        return Item.objects.filter(activated=True).order_by("id")

    def lastmod(self, obj):
        return obj.modified

    def location(self, obj):
        return f"/uk/game/{obj.id}"


class RuGamesSitemap(Sitemap):
    changefreq = "never"
    protocol = "https"

    def items(self):
        return Item.objects.filter(activated=True).order_by("id")

    def lastmod(self, obj):
        return obj.modified

    def location(self, obj):
        return f"/ru/game/{obj.id}"


class BlogPostSitemap(Sitemap):
    changefreq = "weekly"
    protocol = "https"

    def items(self):
        return BlogPost.objects.select_related("category").filter(published=True).order_by("id")

    def location(self, obj):
        return f"/{obj.language.lower()}/blog/{obj.category.slug}/{obj.slug}"


class BlogCategoriesSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.4
    protocol = "https"

    def items(self):
        return BlogCategory.objects.filter(posts__isnull=False).distinct().order_by("id")

    def location(self, obj):
        return f"/{obj.language.lower()}/blog/{obj.slug}"


sitemaps = {
    "static": StaticViewSitemap,
    "uk_games": UkGamesSitemap,
    "ru_games": RuGamesSitemap,
    "blog_posts": BlogPostSitemap,
    "blog_categories": BlogCategoriesSitemap,
}
