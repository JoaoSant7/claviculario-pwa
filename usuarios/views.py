from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet

from core.permissions import IsCoordenacao

from .models import Turma, Usuario
from .serializers import TurmaSerializer, UsuarioSerializer


class UsuarioViewSet(ModelViewSet):
	queryset = Usuario.objects.all().order_by("matricula")
	serializer_class = UsuarioSerializer
	permission_classes = [IsCoordenacao]
	filterset_fields = ["papel", "ativo"]
	search_fields = ["matricula", "nome", "sobrenome", "email"]


class TurmaViewSet(ModelViewSet):
	queryset = Turma.objects.all().order_by("codigo")
	serializer_class = TurmaSerializer
	permission_classes = [IsCoordenacao]
	filterset_fields = ["ativa"]
	search_fields = ["codigo", "descricao"]
