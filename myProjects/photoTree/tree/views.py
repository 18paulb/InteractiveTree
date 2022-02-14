from django.shortcuts import render
from django.http import HttpResponse
#from django.views.generic import TemplateView

# Create your views here.

def index(request):
    return render(request, 'tree/index.html')


def refactor(request):
    return render(request, 'tree/refactor.html')

def tree(request):
    return render(request, 'tree/tree.html')

def chart(request):
    return render(request, 'tree/chart.html')

def delete(request):
    return render(request, 'tree/delete.html')