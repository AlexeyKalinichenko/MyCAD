from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('getdata/', views.getSceneData, name='getSceneData'),
    path('setdata/', views.setSceneData, name='setSceneData'),
    path('clearScene/', views.clearSceneData, name='clearSceneData'),
    path('getStatistics/', views.getStatistics, name='getStatistics')
]
