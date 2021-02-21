#!/bin/bash

echo "Collecting static files"
python3 manage.py collectstatic --noinput

echo "Migrating database"
python3 manage.py migrate --noinput

echo "Compiling translations"
python3 manage.py compilemessages


gunicorn juno.wsgi:application --bind 0.0.0.0:8000
