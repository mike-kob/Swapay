from django.contrib import admin
from django.utils.html import format_html

from exchanges.models import GameTag, Item, ItemPhoto, Swap
from users.models import Review


class ItemPhotoInline(admin.TabularInline):
    model = ItemPhoto
    extra = 0

    fields = (
        "id",
        "main",
        "description",
        "photo_file",
    )
    readonly_fields = ("photo_file",)

    def photo_file(self, obj):
        return format_html(
            f'<a href="{obj.photo.original_file.url}" target="_blank">'
            f'<img src="{obj.photo.md_file.url}" width="250px">'
            f"</a>"
        )


class GameTagAdmin(admin.ModelAdmin):
    list_display = (
        "alias",
        "uk_name",
        "en_name",
        "tag_type",
    )


class ItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "owner",
        "title",
        "available_types",
        "activated",
        "set_tags",
    )

    search_fields = (
        "owner__email",
        "id",
        "title",
    )

    readonly_fields = (
        "owner",
        "last_activated",
        "created",
    )

    inlines = (ItemPhotoInline,)

    list_select_related = ("owner",)

    def available_types(self, obj):
        return obj.get_types_display()

    def set_tags(self, obj):
        return ", ".join(obj.tags.values_list("alias", flat=True))


class SwapAdmin(admin.ModelAdmin):
    list_display = ("owner", "client", "type", "item", "accepted")

    readonly_fields = ("owner", "client", "item")


class ReviewAdmin(admin.ModelAdmin):
    list_display = ("user_from", "user_to", "item")

    readonly_fields = (
        "user_from",
        "user_to",
        "item",
    )

    search_fields = ("item_id",)


admin.site.register(Swap, SwapAdmin)
admin.site.register(GameTag, GameTagAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(Review, ReviewAdmin)
