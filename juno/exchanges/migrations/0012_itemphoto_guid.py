# Generated by Django 3.0.7 on 2020-09-01 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exchanges', '0011_swap_seen'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemphoto',
            name='guid',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
