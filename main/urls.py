from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('OpenDocument/', views.OpenDocument, name='OpenDocument'),
    path('CloseDocument/<int:docId>/', views.CloseDocument, name='CloseDocument'),

    path('SetStyleData/', views.SetStyleData, name='SetStyleData'),
    path('GetRenderingData/<int:docId>/', views.GetRenderingData, name='GetRenderingData'), #check

    path('Undo/<int:docId>/', views.Undo, name='Undo'),
    path('Redo/<int:docId>/', views.Redo, name='Redo'),
    path('Commit/<int:docId>/', views.Commit, name='Commit'),

    path('CreateLine/', views.CreateLine, name='CreateLine'),
    path('EditLine/', views.EditLine, name='EditLine'),
    path('DeleteLine/<int:docId>/<int:objId>/', views.DeleteLine, name='DeleteLine'),

    path('GetLineNode/<int:docId>/<int:objId>/<int:index>/', views.GetLineNode, name='GetLineNode'), #check
    path('GetLineLength/<int:docId>/<int:objId>/', views.GetLineLength, name='GetLineLength'), #check
    path('GetLineAngle/<int:docId>/<int:objId>/', views.GetLineAngle, name='GetLineAngle'), #check
    path('IsLineUnderCursor/', views.IsLineUnderCursor, name='IsLineUnderCursor'), #check

    path('GetAllObjects/<int:docId>/', views.GetAllObjects, name='GetAllObjects'), #check
    path('HighlightObject/<int:docId>/<int:objId>/', views.HighlightObject, name='HighlightObject') #check
]
