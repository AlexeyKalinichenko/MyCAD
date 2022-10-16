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

## CyMySQL

import cymysql

conn = cymysql.connect(host='127.0.0.1', user='root', passwd='...', db='...')

cur = conn.cursor()

cur.execute('select * from tb')

for r in cur.fetchall(): print(r[0], r[1])
