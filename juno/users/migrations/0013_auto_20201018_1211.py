# Generated by Django 3.0.7 on 2020-10-18 12:11

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_auto_20200829_0833'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accounthistorylog',
            name='extra',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict),
        ),
        migrations.AlterField(
            model_name='user',
            name='related_services',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict),
        ),
    ]
