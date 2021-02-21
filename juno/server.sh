#!/bin/bash

echo "Collecting static files"
python3 manage.py collectstatic --noinput

echo "Migrating database"
python3 manage.py migrate --noinput

echo "Compiling translations"
python3 manage.py compilemessages


python3 manage.py runserver 0.0.0.0:8000
