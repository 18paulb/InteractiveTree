from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.http import JsonResponse
import json
from django.template import loader
from json import dumps
from django.core import serializers
from .models import Node


# Create your views here.

def index(request):
    return render(request, 'tree/index.html')


def refactor(request):
    return render(request, 'tree/refactor.html')

def tree(request):
    node_list = Node.objects.all()
    return render(request, 'tree/tree.html', {'node_list': node_list})


def getNodes(request):
    if request.is_ajax:
        node_list = serializers.serialize("json", Node.objects.all())
        node_list = json.loads(node_list)
        return JsonResponse(node_list, safe=False)
        #return HttpResponse(node_list)

#def getNodes(request):
#    if request.is_ajax:
#        if request.method == 'GET':
#            node_list = list(Node.objects.all().values())
#            return JsonResponse({'data': node_list});
#        return JsonResponse({'status': 'Invalid Request'}, status=400)
#    else:
#        return HttpResponseBadRequest('Invalid request', content-type:'application/json')


def chart(request):
    return render(request, 'tree/chart.html')

def delete(request): 
    return render(request, 'tree/delete.html')