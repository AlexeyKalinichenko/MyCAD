from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('OpenDocument/', views.OpenDocument, name='OpenDocument'),
    path('CloseDocument/<int:docId>/', views.CloseDocument, name='CloseDocument'),

    path('SetStyleData/', views.SetStyleData, name='SetStyleData'),
    path('GetRenderingData/<int:docId>/', views.GetRenderingData, name='GetRenderingData'), #todo

    path('Undo/<int:docId>/', views.Undo, name='Undo'),
    path('Redo/<int:docId>/', views.Redo, name='Redo'),
    path('Commit/<int:docId>/', views.Commit, name='Commit'),

    path('CreateLine/', views.CreateLine, name='CreateLine'), #todo
    path('EditLine/', views.EditLine, name='EditLine'), #todo
    path('DeleteLine/', views.DeleteLine, name='DeleteLine'), #todo

    path('GetLineNode/<int:docId>/<int:objId>/<int:index>/', views.GetLineNode, name='GetLineNode'), #todo
    path('GetLineLength/<int:docId>/<int:objId>/', views.GetLineLength, name='GetLineLength'), #todo
    path('GetLineAngle/<int:docId>/<int:objId>/', views.GetLineAngle, name='GetLineAngle'), #todo
    path('IsLineUnderCursor/', views.IsLineUnderCursor, name='IsLineUnderCursor'), #todo

    path('GetAllObjects/<int:docId>/', views.GetAllObjects, name='GetAllObjects'), #todo
    path('HighlightObject/<int:docId>/<int:objId>/', views.HighlightObject, name='HighlightObject'), #todo


    # Old1 API #
    #path('OpenDocument/', views.OpenDocument, name='OpenDocument'),
    #path('CloseDocument/', views.CloseDocument, name='CloseDocument'),
    #path('RunOperation/<int:operationId>/', views.RunOperation, name='RunOperation'),

    #path('ButtonEvent/<int:buttonId>/<int:state>/', views.ButtonEvent, name='ButtonEvent'),
    #path('MouseMoveEvent/<int:x>/<int:y>/', views.MouseMoveEvent, name='MouseMoveEvent'),

    #path('SendIntData/<int:value>/', views.SendIntData, name='SendIntData'),
    #path('SendStringData/<str:value>/', views.SendStringData, name='SendStringData'),

    #path('IsDocumentChanged/', views.IsDocumentChanged, name='IsDocumentChanged'),
    #path('GetDataForRendering/', views.GetDataForRendering, name='GetDataForRendering'),
    #path('GetDocumentInfo/', views.GetDocumentInfo, name='GetDocumentInfo'),
    # Old1 API #

    # Old2 API #
    #path('getdata/', views.getSceneData, name='getSceneData'),
    #path('setdata/', views.setSceneData, name='setSceneData'),
    #path('clearScene/', views.clearSceneData, name='clearSceneData'),
    #path('getStatistics/', views.getStatistics, name='getStatistics')
    # Old2 API #
]
