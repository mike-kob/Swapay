# Generated by Django 3.0.2 on 2020-04-12 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exchanges', '0007_auto_20200408_1057'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemphoto',
            name='main',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
