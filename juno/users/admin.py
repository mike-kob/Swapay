from django.contrib import admin

from users.models import User, City, CustomNotification


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "is_active", "city")

    search_fields = (
        "username",
        "email",
    )

    list_select_related = ("city",)

    fields = (
        "username",
        "first_name",
        "last_name",
        "email",
        "is_staff",
        "is_active",
        "groups",
        "phone",
        "city",
        "verified",
        "social_provider",
        "social_uid",
        "last_login",
        "date_joined",
        "related_services",
    )

    readonly_fields = (
        "last_login",
        "date_joined",
        "social_provider",
        "social_uid",
    )


class CityAdmin(admin.ModelAdmin):
    pass


class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "title",
        "text",
        "icon",
    ]


admin.site.register(CustomNotification, NotificationAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(City, CityAdmin)
