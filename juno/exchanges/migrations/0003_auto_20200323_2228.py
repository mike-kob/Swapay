# Generated by Django 3.0.2 on 2020-03-23 20:28

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('exchanges', '0002_exchange_accepted'),
    ]

    operations = [
        migrations.RenameField(
            model_name='item',
            old_name='rentPrice',
            new_name='rent_price',
        ),
        migrations.RenameField(
            model_name='item',
            old_name='sellPrice',
            new_name='sell_price',
        ),
        migrations.AddField(
            model_name='item',
            name='exchange_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='created',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]