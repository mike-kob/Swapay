from users.models import City


def add_custom_city(data):
    name = data["name"]
    city, _ = City.objects.get_or_create(name=name)
    return city
