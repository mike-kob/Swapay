# Generated by Django 3.0.2 on 2020-04-25 12:13

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import users.model_utils


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20200323_2228'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={},
        ),
        migrations.AddField(
            model_name='user',
            name='social_provider',
            field=models.CharField(blank=True, choices=[('google', 'Google')], max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='social_uid',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='verified',
            field=models.BooleanField(default=False, help_text='Email was verified'),
        ),
        migrations.AlterField(
            model_name='city',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterUniqueTogether(
            name='user',
            unique_together={('social_provider', 'social_uid')},
        ),
        migrations.CreateModel(
            name='RefreshToken',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(default=users.model_utils.generate_confirmation_token, max_length=200, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='EmailConfirmation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('token', models.CharField(default=users.model_utils.generate_confirmation_token, max_length=200, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AccountHistoryLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(choices=[('SIGNUP', 'Signup with username/password'), ('S_SIGNUP', 'Social signup'), ('LOGIN', 'Login with username/password'), ('S_LOGIN', 'Social login'), ('CHANGE_EMAIL_REQUEST', 'Change email request'), ('CHANGE_EMAIL_SUCCESS', 'Change email success'), ('CHANGE_PASSWORD_REQUEST', 'Change password request'), ('CHANGE_PASSWORD_SUCCESS', 'Change password success'), ('FORGOT_PASSWORD_REQUEST', 'Forgot password request'), ('FORGOT_PASSWORD_SUCCESS', 'Forgot password success')], max_length=30)),
                ('extra', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
