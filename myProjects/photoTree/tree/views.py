from django.shortcuts import render
from django.http import HttpResponse
#from django.views.generic import TemplateView

# Create your views here.

def index(request):
    return render(request, 'tree/index.html')


def draggable(request):
    return render(request, 'tree/draggable.html')

#class DraggablePageView(TemplateView):
#    template_name = 'draggable.html'