from django.urls import path

from . import views

#from . views import DraggablePageView

urlpatterns = [
    path('', views.index, name='index'),
    path('refactor/', views.refactor, name='refactor'),
    path('tree/', views.tree, name='tree'),
    path('chart/', views.chart, name='tree'),
    path('delete/', views.delete, name='delete')
]