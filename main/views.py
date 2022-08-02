from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from MyCAD.deploy import deploy

import os
import json

def index(request):
	template = loader.get_template('index.html')
	context = { 'url': deploy['url'] }
	return HttpResponse(template.render(context, request))

def getSceneData(request):
	filePath = os.path.join(os.getcwd(), 'data', 'data.json')

	f = open(filePath, "r")
	jsonData = f.read()
	f.close()

	data = json.loads(jsonData)

	response = JsonResponse({
			'vertices': data['vertices'],
			'indices': data['indices'],
			'counter': data['counter']
		})

	return response
