# Generated by Django 3.0.7 on 2020-07-01 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_review_item'),
    ]

    operations = [
        migrations.AddField(
            model_name='city',
            name='searchable',
            field=models.BooleanField(default=False),
        ),
    ]
