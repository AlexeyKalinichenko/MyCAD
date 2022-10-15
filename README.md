# MyCAD project

Prod: https://AlexeyMyCAD.pythonanywhere.com/main/

Test: http://127.0.0.1:8000/main/

## Virtual environment

source ./virtenv/bin/activate

deactivate


## Run server

python3 ./manage.py runserver


## Test vs Prod

settings.py -> DEBUG = True/False

deploy.py -> deploy = development/production

## MySQL

mysql -u root -p

mysql> show databases;

mysql> create database mytest;

mysql> drop database mytest;

mysql> use mytest;

mysql> show tables;

mysql> exit;
