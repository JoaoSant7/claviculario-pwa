from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.permissions import IsCoordenacao

from .models import Autorizacao
from .serializers import AutorizacaoSerializer


class AutorizacaoViewSet(ModelViewSet):
	queryset = Autorizacao.objects.select_related("usuario", "sala", "concedida_por").all()
	serializer_class = AutorizacaoSerializer
	permission_classes = [IsCoordenacao]
	filterset_fields = ["ativa", "sala", "usuario"]
	search_fields = ["usuario__matricula", "usuario__nome", "motivo"]

	@action(detail=True, methods=["post"])
	def revogar(self, request, pk=None):
		autorizacao = self.get_object()
		autorizacao.revogar()
		return Response(self.get_serializer(autorizacao).data)
