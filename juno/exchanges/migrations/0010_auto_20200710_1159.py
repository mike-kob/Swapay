# Generated by Django 3.0.7 on 2020-07-10 11:59

from django.db import migrations, models
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('exchanges', '0009_auto_20200605_2103'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemphoto',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='item',
            name='types',
            field=multiselectfield.db.fields.MultiSelectField(choices=[('E', 'Exchange'), ('R', 'Rent'), ('P', 'Sell')], default='E', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='swap',
            name='type',
            field=models.CharField(choices=[('E', 'Exchange'), ('R', 'Rent'), ('P', 'Sell')], default='E', max_length=10, null=True),
        ),
    ]
