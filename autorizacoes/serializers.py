from rest_framework import serializers

from .models import Autorizacao


class AutorizacaoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Autorizacao
		fields = [
			"id",
			"usuario",
			"sala",
			"concedida_por",
			"valida_de",
			"valida_ate",
			"ativa",
			"motivo",
			"criada_em",
		]
		read_only_fields = ["id", "criada_em"]
