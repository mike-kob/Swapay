import random

from django.core.management.base import BaseCommand, CommandError
from model_mommy import mommy
from faker import Faker

from users.models import User

fake = Faker()
Faker.seed(1234)

SM_FILE = "placeholder-100.jpg"
MD_FILE = "placeholder-250.jpg"
ORIGINAL_FILE = "placeholder-original.jpg"


def create_helpers():
    print("Creating helpers")
    city = mommy.make("users.City", id=1, name="Kyiv")
    print("\tCreated city", city)


def create_users():
    print("Creating users")
    num_users = 10
    for _ in range(num_users):
        name = fake.name()
        fields = {
            "first_name": name.split()[0],
            "last_name": name.split()[1],
            "email": fake.email(domain="example.com"),
            "city_id": 1,
            "username": fake.simple_profile()["username"],
        }
        user = mommy.prepare("users.User", **fields)
        user.set_password("valid_password")
        try:
            user.save()
            print("\tCreated user", user)
        except Exception:
            print("Error creating test models")


def create_items():
    print("Creating items")
    options = [
        {"types": "R,P", "sell_price": 100, "rent_price": 10, "activated": True, "photo_count": 3},
        {"types": "R", "rent_price": 10, "activated": True, "photo_count": 1},
        {
            "types": "",
            "sell_price": 100,
            "rent_price": 10,
            "activated": False,
            "photo_count": 0,
        },
        {
            "types": "R,P,E",
            "sell_price": 100,
            "rent_price": 10,
            "exchange_description": fake.paragraph(),
            "activated": True,
            "photo_count": 5,
        },
        {
            "types": "R,P,E",
            "sell_price": 100,
            "rent_price": 10,
            "exchange_description": "Lorem ipsum",
            "activated": True,
            "photo_count": 10,
        },
        {
            "types": "R,P,E",
            "sell_price": 100,
            "rent_price": 10,
            "exchange_description": "\n".join(fake.paragraphs(nb=10)),
            "activated": True,
            "photo_count": 1,
        },
        {"types": "P", "sell_price": 100, "rent_price": 10, "activated": True, "photo_count": 1},
    ]
    users = list(User.objects.all())
    for option in options:
        count = option["photo_count"]
        del option["photo_count"]

        fields = {
            "title": fake.text(max_nb_chars=20),
            "description": fake.text(max_nb_chars=100),
            "owner": random.choice(users),
        }
        try:
            item = mommy.make("exchanges.Item", **fields, **option)
            print("\tCreated item", item)
            for i in range(count):
                file = mommy.make("cloud.File", sm_file=SM_FILE, md_file=MD_FILE, original_file=ORIGINAL_FILE)
                photo = mommy.prepare("exchanges.ItemPhoto", item=item, photo=file)
                if i == 0:
                    photo.main = True

                photo.save()
                print("\t\tCreated itemphoto", photo)

        except Exception as e:
            print("Error creating test models")


def create_swaps():
    print("Crating swaps")


def create_reviews():
    print("Creating reviews")


class Command(BaseCommand):
    help = "Populate database for e2e tests"

    def handle(self, *args, **options):
        create_helpers()
        create_users()
        create_items()
        create_swaps()
        create_reviews()
