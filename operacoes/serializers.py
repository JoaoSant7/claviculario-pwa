from rest_framework import serializers

from .models import Devolucao, Emprestimo


class EmprestimoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Emprestimo
		fields = [
			"id",
			"usuario",
			"chave",
			"retirado_em",
			"devolvido_em",
			"limite_devolucao",
			"atraso_registrado",
		]
		read_only_fields = fields


class DevolucaoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Devolucao
		fields = ["id", "feito_em", "emprestimo"]
		read_only_fields = fields


class RetiradaSerializer(serializers.Serializer):
	rfid_usuario = serializers.CharField(required=False)
	usuario_id = serializers.UUIDField(required=False)
	codigo_sala = serializers.CharField(required=False)
	chave_id = serializers.UUIDField(required=False)


class DevolucaoInputSerializer(serializers.Serializer):
	rfid_chave = serializers.CharField(required=False)
	chave_id = serializers.UUIDField(required=False)


class PanicoInputSerializer(serializers.Serializer):
	codigo_sala = serializers.CharField()
	origem = serializers.CharField(default="api")
