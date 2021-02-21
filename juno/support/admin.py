from django.contrib import admin

from support.models import BlogPost, BlogCategory


class BlogPostAdmin(admin.ModelAdmin):
    search_fields = ("id", "slug", "title")
    list_display = (
        "title",
        "slug",
        "language",
        "category",
        "published",
        "featured",
    )

    list_filter = ("language", "category")


class BlogCategoryAdmin(admin.ModelAdmin):
    list_filter = ("language",)
    pass


admin.site.register(BlogPost, BlogPostAdmin)
admin.site.register(BlogCategory, BlogCategoryAdmin)
