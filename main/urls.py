from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('OpenDocument/', views.OpenDocument, name='OpenDocument'),
    path('CloseDocument/<int:docId>/', views.CloseDocument, name='CloseDocument'),

    path('SetStyleData/', views.SetStyleData, name='SetStyleData'),
    path('GetRenderingData/<int:docId>/', views.GetRenderingData, name='GetRenderingData'),

    path('Undo/<int:docId>/', views.Undo, name='Undo'),
    path('Redo/<int:docId>/', views.Redo, name='Redo'),
    path('Commit/<int:docId>/', views.Commit, name='Commit'),
    path('Rollback/<int:docId>/', views.Commit, name='Rollback'),

    path('CreateLine/', views.CreateLine, name='CreateLine'),
    path('EditLine/', views.EditLine, name='EditLine'),
    path('DeleteLine/<int:docId>/<int:objId>/', views.DeleteLine, name='DeleteLine'),

    path('GetLineNode/<int:docId>/<int:objId>/<int:index>/', views.GetLineNode, name='GetLineNode'),
    path('GetLineLength/<int:docId>/<int:objId>/', views.GetLineLength, name='GetLineLength'),
    path('GetLineAngle/<int:docId>/<int:objId>/', views.GetLineAngle, name='GetLineAngle'),
    path('IsLineUnderCursor/', views.IsLineUnderCursor, name='IsLineUnderCursor'),

    path('GetAllObjects/<int:docId>/', views.GetAllObjects, name='GetAllObjects'),
    path('HighlightObject/<int:docId>/<int:objId>/', views.HighlightObject, name='HighlightObject')
]
