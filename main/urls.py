from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('OpenDocument/', views.OpenDocument, name='OpenDocument'),
    path('CloseDocument/', views.CloseDocument, name='CloseDocument'),
    path('RunOperation/<int:operationId>/', views.RunOperation, name='RunOperation'),

    path('ButtonEvent/<int:buttonId>/<int:state>/', views.ButtonEvent, name='ButtonEvent'),
    path('MouseMoveEvent/<int:x>/<int:y>/', views.MouseMoveEvent, name='MouseMoveEvent'),

    path('SendIntData/<int:value>/', views.SendIntData, name='SendIntData'),
    path('SendStringData/<str:value>/', views.SendStringData, name='SendStringData'),

    path('IsDocumentChanged/', views.IsDocumentChanged, name='IsDocumentChanged'),
    path('GetDataForRendering/', views.GetDataForRendering, name='GetDataForRendering'),
    path('GetDocumentInfo/', views.GetDocumentInfo, name='GetDocumentInfo'),

    # Old API #
    path('getdata/', views.getSceneData, name='getSceneData'),
    path('setdata/', views.setSceneData, name='setSceneData'),
    path('clearScene/', views.clearSceneData, name='clearSceneData'),
    path('getStatistics/', views.getStatistics, name='getStatistics')
    # Old API #
]
