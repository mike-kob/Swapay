# Generated by Django 3.0.7 on 2020-10-10 05:26

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('support', '0007_auto_20201009_1704'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='author',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=dict),
        ),
    ]