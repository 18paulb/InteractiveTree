from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from json import dumps
from .models import Node

# Create your views here.

def index(request):
    return render(request, 'tree/index.html')


def refactor(request):
    return render(request, 'tree/refactor.html')

def tree(request):
    node_list = Node.objects.all()
    #node_dump = dumps(node_list)
    return render(request, 'tree/tree.html', {'node_list': node_list})
    #return render(request, 'tree/tree.html', {'node_list': node_dump})

#TEST, DOES NOT WORK
def getNodes(request):
    data
    if request.is_ajax and request.method  == "GET":
        data = request.GET.Node.objects.all()
    return data;

def chart(request):
    return render(request, 'tree/chart.html')

def delete(request): 
    return render(request, 'tree/delete.html')