from django.urls import path

from . import views

#from . views import DraggablePageView

urlpatterns = [
    path('', views.index, name='index'),
    path('draggable/', views.draggable, name='draggable'),
    path('tree/', views.tree, name='tree'),
]