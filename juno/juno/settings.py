"""
Django settings for juno project.

Generated by 'django-admin startproject' using Django 3.0.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os

import sentry_sdk
from dotenv import load_dotenv
from sentry_sdk.integrations.django import DjangoIntegration
import django_heroku

load_dotenv()


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUN_ENV = os.environ.get("RUN_ENV")


SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-#-key")

DEBUG = RUN_ENV == 'DEV'

DEFAULT_HOST = os.environ.get("DEFAULT_HOST")

ALLOWED_HOSTS = ["*"]

# Application definition
INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.sitemaps",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.admin",
    "corsheaders",
    "graphene_django",
    "users.apps.UsersConfig",
    "chat.apps.ChatConfig",
    "exchanges.apps.ExchangesConfig",
    "gqlapi.apps.GqlapiConfig",
    "utils.apps.UtilsConfig",
    "support.apps.SupportConfig",
]


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "juno.urls"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, "templates"),
        ],
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
            "loaders": [
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
        },
    },
]

WSGI_APPLICATION = "juno.wsgi.application"

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "users.bl.identity.backends.email_backend.EmailAuthBackend",
)


AUTH_USER_MODEL = "users.User"
LOGIN_REDIRECT_URL = "/social/login"

GRAPHENE = {"SCHEMA": "gqlapi.schema.schema"}

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")

# Logging
sentry_sdk.init(dsn=os.getenv("SENTRY_DNS"), integrations=[DjangoIntegration()], send_default_pii=True)


STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = "/teammates/static/"


LANGUAGE_CODE = "uk"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = False

USE_TZ = True

SITE_ID = 1

LANGUAGES = [
    ("uk", "Ukrainian"),
    ("ru", "Russian"),
]

LOCALE_PATHS = [os.path.join(BASE_DIR, "locale")]

django_heroku.settings(locals())
