from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet

from core.permissions import IsCoordenacao

from .models import Sala
from .serializers import SalaSerializer


class SalaViewSet(ModelViewSet):
	queryset = Sala.objects.all().order_by("codigo")
	serializer_class = SalaSerializer
	permission_classes = [IsCoordenacao]
	filterset_fields = ["andar", "tipo_sala"]
	search_fields = ["codigo", "numero", "descricao"]
