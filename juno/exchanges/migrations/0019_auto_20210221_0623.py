# Generated by Django 3.0.7 on 2021-02-21 06:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('exchanges', '0018_auto_20210221_0620'),
    ]

    operations = [
        migrations.RenameField(
            model_name='item',
            old_name='ru_preview',
            new_name='en_preview',
        ),
    ]
