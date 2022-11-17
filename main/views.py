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
	response = JsonResponse({ "result": 0 })
	return response

def MouseMoveEvent(request, x, y):
	response = JsonResponse({ "result": 0 })
	return response

def SendIntData(request, value):
	response = JsonResponse({ "result": 0 })
	return response

def SendStringData(request, value):
	response = JsonResponse({ "result": 0 })
	return response

def IsDocumentChanged(request):
	response = JsonResponse({ "result": 0, "isChanged": True })
	return response

def GetDataForRendering(request):
	response = JsonResponse({
		"result": 0,
		"buffer": {
			"Indices": [
        		{ "Figure": "triangles", "Offset": 0, "Count": 6 },	# need change count
        		{ "Figure": "triangles", "Offset": 0, "Count": 6 },	# need change count
        		{ "Figure": "points", "Offset": 18, "Count": 6 }	# need change count
    		],
    		"ObjectsColor": { "R": 0.85, "G": 0.87, "B": 0.91 },
    		"HighlightColor": { "R": 0.98, "G": 0.68, "B": 0.35 },
    		"NodesColor": { "R": 0.98, "G": 0.68, "B": 0.35 },
			"Thickness": 0.01,
			"NodesMode": False,
    		"Vertices": [
        		{ "X": -0.4, "Y": 0.4012, "Z": 0.0 },
        		{ "X":  0.4, "Y":    0.4, "Z": 0.0 },
        		{ "X": -0.4, "Y":    0.4, "Z": 0.0 },
        		{ "X":  0.4, "Y":    0.4, "Z": 0.0 },
        		{ "X":  0.4, "Y": 0.4012, "Z": 0.0 },
        		{ "X": -0.4, "Y": 0.4012, "Z": 0.0 },
        		{ "X": -0.4, "Y": 0.3025, "Z": 0.0 },
        		{ "X":  0.4, "Y":    0.3, "Z": 0.0 },
        		{ "X": -0.4, "Y":    0.3, "Z": 0.0 },
        		{ "X":  0.4, "Y":    0.3, "Z": 0.0 },
        		{ "X":  0.4, "Y": 0.3025, "Z": 0.0 },
        		{ "X": -0.4, "Y": 0.3025, "Z": 0.0 },
        		{ "X": -0.4, "Y":  0.205, "Z": 0.0 },
        		{ "X":  0.4, "Y":    0.2, "Z": 0.0 },
        		{ "X": -0.4, "Y":    0.2, "Z": 0.0 },
        		{ "X":  0.4, "Y":    0.2, "Z": 0.0 },
        		{ "X":  0.4, "Y":  0.205, "Z": 0.0 },
        		{ "X": -0.4, "Y":  0.205, "Z": 0.0 },
        		{ "X":  0.4, "Y": 0.4006, "Z": 0.0 },
        		{ "X": -0.4, "Y": 0.4006, "Z": 0.0 },
        		{ "X":  0.4, "Y": 0.3012, "Z": 0.0 },
        		{ "X": -0.4, "Y": 0.3012, "Z": 0.0 },
        		{ "X":  0.4, "Y": 0.2025, "Z": 0.0 },
        		{ "X": -0.4, "Y": 0.2025, "Z": 0.0 } 
    		]
		}
	})
	return response

def GetDocumentInfo(request):
	response = JsonResponse({
		"result": 0,
		"info": {
			"colorTheme": "dark",
			"thickness": "two",
			"nodeMode": "off",
			"objects": 123
		}
	})
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
