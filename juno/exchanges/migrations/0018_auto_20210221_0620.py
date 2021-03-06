# Generated by Django 3.0.7 on 2021-02-21 06:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('exchanges', '0017_auto_20201020_1305'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gametag',
            old_name='ru_content',
            new_name='en_content',
        ),
        migrations.RenameField(
            model_name='gametag',
            old_name='ru_meta_description',
            new_name='en_meta_description',
        ),
        migrations.RenameField(
            model_name='gametag',
            old_name='ru_name',
            new_name='en_name',
        ),
        migrations.RenameField(
            model_name='gametag',
            old_name='ru_slug',
            new_name='en_slug',
        ),
        migrations.RenameField(
            model_name='item',
            old_name='ru_description',
            new_name='en_description',
        ),
        migrations.RenameField(
            model_name='item',
            old_name='ru_title',
            new_name='en_title',
        ),
        migrations.RemoveField(
            model_name='itemphoto',
            name='file',
        ),
    ]
