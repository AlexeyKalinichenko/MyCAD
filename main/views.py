from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.template import loader
from MyCAD.deploy import deploy
from .models import getUserData, addUserData, resetUserData

from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

import core.wrapper as wrapper

import os
import json

def index(request):
	template = loader.get_template('index.html')
	context = { 'url': deploy['url'] }
	return HttpResponse(template.render(context, request))

def OpenDocument(request):
	response = JsonResponse({ "result": 0 })
	return response

def CloseDocument(request):
	response = JsonResponse({ "result": 0 })
	return response

def RunOperation(request, operationId):
	response = JsonResponse({ "result": 0 })
	return response

def ButtonEvent(request, buttonId, state):
	return HttpResponseRedirect(deploy['url'])

def MouseMoveEvent(request, x, y):
	return HttpResponseRedirect(deploy['url'])

def SendIntData(request, value):
	return HttpResponseRedirect(deploy['url'])

def SendStringData(request, value):
	return HttpResponseRedirect(deploy['url'])

def IsDocumentChanged(request):
	response = JsonResponse({ "result": 0, "IsDocumentChanged": True })
	return response

def GetDataForRendering(request):
	response = JsonResponse({ "result": 0, "data": "qwerty" })
	return response

def GetDocumentInfo(request):
	response = JsonResponse({ "result": 0, "data": "qwerty" })
	return response

# Old API #
def getSceneData(request):
	filePath = os.path.join(os.getcwd(), 'data', 'data.json')

	f = open(filePath, "r")
	jsonData = f.read()
	f.close()

	if len(jsonData) != 0:
		data = json.loads(jsonData)
		vertices = data['vertices']
		indices = data['indices']
		counter = data['counter']
	else:
		vertices = []
		indices = []
		counter = 0

	response = JsonResponse({
			'vertices': vertices,
			'indices': indices,
			'counter': counter
		})

	return response

#@csrf_exempt
def setSceneData(request):
	if request.method == 'POST':
		data = [ request.POST['vertices'], request.POST['indices'], request.POST['counter'] ]

		vertices = [float(x) for x in data[0].split(',')]
		indices = [int(x) for x in data[1].split(',')]
		counter = int(data[2])

		jsonData = json.dumps({ 'vertices': vertices, 'indices': indices, 'counter': counter},
			indent = 4)
		filePath = os.path.join(os.getcwd(), 'data', 'data.json')

		f = open(filePath, "w")
		f.write(jsonData)
		f.close()

	return HttpResponseRedirect(deploy['url'])

def clearSceneData(request):
	filePath = os.path.join(os.getcwd(), 'data', 'data.json')

	f = open(filePath, "w")
	f.write('')
	f.close()

	resetUserData()

	return HttpResponseRedirect(deploy['url'])

def getStatistics(request):
	filePath = os.path.join(os.getcwd(), 'data', 'data.json')

	f = open(filePath, "r")
	jsonData = f.read()
	f.close()

	if len(jsonData) != 0:
		data = json.loads(jsonData)
		counter = data['counter']
	else:
		counter = 0

	result = wrapper.statisticsWrapper(counter)

	addUserData(result)

	table = getUserData()
	for line in table:
		print(line)

	response = JsonResponse({ 'objects': result })

	return response
# Old API #
