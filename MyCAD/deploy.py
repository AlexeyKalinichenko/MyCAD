development = {
	'url': 'http://127.0.0.1:8000/',
	'core_path': './core/build/',
	'db_name': 'Statistics',
	'host': 'localhost',
	'user': 'django_user',
	'password': 'django_passwd',
	'db_engine': 'mysql_cymysql',
	'debug': True
}

production = {
	'url': 'https://alexeymycad.pythonanywhere.com/',
	'core_path': '/home/AlexeyMyCAD/MyCAD/core/build/',
	'db_name': 'AlexeyMyCAD$mycaddb',
	'host': 'AlexeyMyCAD.mysql.pythonanywhere-services.com',
	'user': 'AlexeyMyCAD',
	'password': 'mycad_prod',
	'db_engine': 'django.db.backends.mysql',
	'debug': False
}

# development if local
# production if internet
deploy = production
