# MyCAD
MyCAD project

Test: http://127.0.0.1:8000/main/

Prod: https://AlexeyMyCAD.pythonanywhere.com/main/

Virtual environment:

source ./virtenv/bin/activate
deactivate


Run server:

python3 ./manage.py runserver


Test vs Prod:

settings.py -> DEBUG = True/False
deploy.py -> deploy = development/production
