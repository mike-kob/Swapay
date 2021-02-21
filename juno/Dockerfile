FROM python:3.7

WORKDIR /project

COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock

RUN pip install pipenv
RUN pipenv install --system --deploy

RUN apt-get update && apt-get -y install gettext

COPY . .
