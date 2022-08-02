from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('getdata/', views.getSceneData, name='getSceneData'),
    path('setdata/', views.setSceneData, name='setSceneData')
]
