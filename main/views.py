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

#IN
'''
{
	"theme": {
		"objects": {
			"red": 0.1,
			"green": 0.2,
			"blue": 0.3
		},
		"highlight": {
			"red": 0.4,
			"green": 0.5,
			"blue": 0.6
		},
		"nodes": {
			"red": 0.7,
			"green": 0.8,
			"blue": 0.9
		}
	},
	"thickness": 0.15,
	"nodesMode": true
}
'''

#IN
'''
{
	"cuts": [
		{
			"start": {
				"x": 1,
				"y": 2
			},
			"end": {
				"x": 3,
				"y": 4
			}
		}
	]
}
'''

def OpenDocument(request):
	if request.method == 'POST':
		styleJson = request.POST['data']
		styleObject = json.loads(styleJson)

		objects = wrapper.CColor()
		objects.red = styleObject['theme']['objects']['red']
		objects.green = styleObject['theme']['objects']['green']
		objects.blue = styleObject['theme']['objects']['blue']

		highlight = wrapper.CColor()
		highlight.red = styleObject['theme']['highlight']['red']
		highlight.green = styleObject['theme']['highlight']['green']
		highlight.blue = styleObject['theme']['highlight']['blue']

		nodes = wrapper.CColor()
		nodes.red = styleObject['theme']['nodes']['red']
		nodes.green = styleObject['theme']['nodes']['green']
		nodes.blue = styleObject['theme']['nodes']['blue']

		theme = wrapper.CColorTheme()
		theme.objects = objects
		theme.highlight = highlight
		theme.nodes = nodes

		style = wrapper.CStyleData()
		style.theme = theme
		style.thickness = styleObject['thickness']
		style.nodesMode = styleObject['nodesMode']

		result = wrapper.OpenSessionAPI()

		filePath = os.path.join(os.getcwd(), 'data', 'document.json')
		f = open(filePath, "r")
		dataJson = f.read()
		f.close()

		if len(dataJson) == 0:
			docId = wrapper.CreateDocumentAPI(style)
		else:
			dataObject = json.loads(dataJson)

			data = []
			for cut in dataObject['cuts']:
				data.append(wrapper.CCut(wrapper.CPosition(cut['start']['x'], cut['start']['y']),
					wrapper.CPosition(cut['end']['x'], cut['end']['y'])))

			docId = wrapper.OpenDocumentAPI(style, data)

		response = JsonResponse({ "result": result, "docId": docId })
		return response

def CloseDocument(request, docId):
	data = wrapper.CloseDocumentAPI(docId)

	dataObject = {}
	dataObject['cuts'] = []

	for item in data:
		cut = {}
		cut['start'] = {}
		cut['start']['x'] = item.start.x
		cut['start']['y'] = item.start.y
		cut['end'] = {}
		cut['end']['x'] = item.end.x
		cut['end']['y'] = item.end.y

		dataObject['cuts'].append(cut)

	dataJson = json.dumps(dataObject)

	filePath = os.path.join(os.getcwd(), 'data', 'document.json')
	f = open(filePath, "w")
	f.write(dataJson)
	f.close()

	result = wrapper.CloseSessionAPI()

	response = JsonResponse({ "result": result })
	return response

def SetStyleData(request):
	if request.method == 'POST':
		docId = int(request.POST['docId'])

		styleJson = request.POST['data']
		styleObject = json.loads(styleJson)

		result = 0

		if 'theme' in styleObject:
			objects = wrapper.CColor()
			objects.red = styleObject['theme']['objects']['red']
			objects.green = styleObject['theme']['objects']['green']
			objects.blue = styleObject['theme']['objects']['blue']

			highlight = wrapper.CColor()
			highlight.red = styleObject['theme']['highlight']['red']
			highlight.green = styleObject['theme']['highlight']['green']
			highlight.blue = styleObject['theme']['highlight']['blue']

			nodes = wrapper.CColor()
			nodes.red = styleObject['theme']['nodes']['red']
			nodes.green = styleObject['theme']['nodes']['green']
			nodes.blue = styleObject['theme']['nodes']['blue']

			theme = wrapper.CColorTheme()
			theme.objects = objects
			theme.highlight = highlight
			theme.nodes = nodes

			result = wrapper.SetColorThemeAPI(docId, theme)

		elif 'thickness' in styleObject:
			result = wrapper.SetThicknessAPI(docId, styleObject['thickness'])

		elif 'nodesMode' in styleObject:
			result = wrapper.SetNodesModeAPI(docId, styleObject['nodesMode'])

		response = JsonResponse({ "result": result })
		return response

#OUT
'''
{
	"result": 0,
	"data": {
		"Indices": [
			{ "Figure": "triangles", "Offset": 0, "Count": 6 },
			{ "Figure": "triangles", "Offset": 0, "Count": 6 },
			{ "Figure": "points", "Offset": 18, "Count": 6 }
		],
		"ObjectsColor": { "R": 0.85, "G": 0.87, "B": 0.91 },
		"HighlightColor": { "R": 0.98, "G": 0.68, "B": 0.35 },
		"NodesColor": { "R": 0.98, "G": 0.68, "B": 0.35 },
		"Thickness": 0.01,
		"NodesMode": false,
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
}
'''

def GetRenderingData(request, docId):
	sourceData = wrapper.GetRenderingDataAPI(docId)

	targetData = {}
	targetData['ObjectsColor'] = {}
	targetData['ObjectsColor']['R'] = sourceData['theme'].objects.red
	targetData['ObjectsColor']['G'] = sourceData['theme'].objects.green
	targetData['ObjectsColor']['B'] = sourceData['theme'].objects.blue

	targetData['HighlightColor'] = {}
	targetData['HighlightColor']['R'] = sourceData['theme'].highlight.red
	targetData['HighlightColor']['G'] = sourceData['theme'].highlight.green
	targetData['HighlightColor']['B'] = sourceData['theme'].highlight.blue

	targetData['NodesColor'] = {}
	targetData['NodesColor']['R'] = sourceData['theme'].nodes.red
	targetData['NodesColor']['G'] = sourceData['theme'].nodes.green
	targetData['NodesColor']['B'] = sourceData['theme'].nodes.blue

	targetData['Thickness'] = sourceData['thickness']
	targetData['NodesMode'] = sourceData['nodesMode']

	targetData['Indices'] = []
	for item in sourceData['indices']:
		index = {}
		index['Figure'] = 'triangles' if item.figure == 0 else 'points' 
		index['Offset'] = item.offset
		index['Count'] = item.count
		targetData['Indices'].append(index)

	targetData['Vertices'] = []
	for item in sourceData['vertices']:
		vertex = {}
		vertex['X'] = item.x
		vertex['Y'] = item.y
		vertex['Z'] = item.z
		targetData['Vertices'].append(vertex)

	response = JsonResponse({ "result": 0, "data": targetData })
	return response

def Undo(request, docId):
	result = wrapper.UndoAPI(docId)
	response = JsonResponse({ "result": result })
	return response

def Redo(request, docId):
	result = wrapper.RedoAPI(docId)
	response = JsonResponse({ "result": result })
	return response

def Commit(request, docId):
	result = wrapper.CommitAPI(docId)
	response = JsonResponse({ "result": result })
	return response

def Rollback(request, docId):
	result = wrapper.RollbackAPI(docId)
	response = JsonResponse({ "result": result })
	return response

#IN
'''
{
	"positions": [
		{
			"x": 1,
			"y": 2
		},
		{
			"x": 3,
			"y": 4
		}
	]
}
'''

def CreateLine(request):
	if request.method != 'POST':
		return

	docId = int(request.POST['docId'])
	data = json.loads(request.POST['data'])

	start = wrapper.CPosition(data['positions'][0]['x'], data['positions'][0]['y'])
	end = wrapper.CPosition(data['positions'][1]['x'], data['positions'][1]['y'])

	objId = wrapper.CreateLineAPI(docId, start, end)

	response = JsonResponse({ "result": 0, "objId": objId })
	return response

#IN
'''
{
	"index": 1,
	"position": {
		"x": 1,
		"y": 2
	}
}
'''

def EditLine(request):
	if request.method != 'POST':
		return

	docId = int(request.POST['docId'])
	objId = int(request.POST['objId'])
	data = json.loads(request.POST['data'])

	pos = wrapper.CPosition(data['position']['x'], data['position']['y'])

	result = wrapper.EditLineAPI(docId, objId, data['index'], pos)

	response = JsonResponse({ "result": result })
	return response

def DeleteLine(request, docId, objId):
	result = wrapper.DeleteLineAPI(docId, objId)
	response = JsonResponse({ "result": result })
	return response

#OUT
'''
{
	"result": 0,
	"position": {
		"x": 1,
		"y": 2
	}
}
'''

def GetLineNode(request, docId, objId, index):
	node = wrapper.GetLineNodeAPI(docId, objId, index)

	pos = {}
	pos['x'] = node.x
	pos['y'] = node.y

	response = JsonResponse({ "result": 0, "position": pos })
	return response

def GetLineLength(request, docId, objId):
	length = wrapper.GetLineLengthAPI(docId, objId)
	response = JsonResponse({ "result": 0, "length": length })
	return response

def GetLineAngle(request, docId, objId):
	angle = wrapper.GetLineAngleAPI(docId, objId)
	response = JsonResponse({ "result": 0, "angle": angle })
	return response

#IN
'''
{
	"radius": 0.15,
	"position": {
		"x": 1,
		"y": 2
	}
}
'''

def IsLineUnderCursor(request):
	if request.method != 'POST':
		return

	docId = int(request.POST['docId'])
	objId = int(request.POST['objId'])
	data = json.loads(request.POST['data'])

	pos = wrapper.CPosition(data['position']['x'], data['position']['y'])

	topology = wrapper.IsLineUnderCursorAPI(docId, objId, pos, data['radius'])

	response = JsonResponse({ "result": 0, "topology": topology })
	return response

#OUT
'''
{
	"result": 0,
	"objects": [0, 1, 2, 3]
}
'''

def GetAllObjects(request, docId):
	objects = wrapper.GetAllObjectsAPI(docId)
	response = JsonResponse({ "result": 0, "objects": objects })
	return response

def HighlightObject(request, docId, objId):
	result = wrapper.HighlightObjectAPI(docId, objId)
	response = JsonResponse({ "result": result })
	return response
