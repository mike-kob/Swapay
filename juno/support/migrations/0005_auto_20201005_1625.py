# Generated by Django 3.0.7 on 2020-10-05 16:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('support', '0004_blogcategory_blogpost'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogpost',
            name='categories',
        ),
        migrations.AddField(
            model_name='blogpost',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='support.BlogCategory'),
        ),
    ]
