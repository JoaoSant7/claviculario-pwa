from django.db import models


class Evento(models.Model):
	"""
	Registro imutável de tudo que acontece no sistema.

	RF-35: todos os eventos persistidos com timestamp.
	RF-36: histórico consultável por chave ou usuário.
	RF-37: base para sincronização near real-time via WebSocket.
	"""

	class TipoChoices(models.TextChoices):
		RETIRADA = "retirada", "Retirada"
		DEVOLUCAO = "devolucao", "Devolução"
		PANICO = "panico", "Pânico"
		AUTORIZACAO = "autorizacao", "Autorização"

	tipo = models.CharField(
		max_length=20,
		choices=TipoChoices.choices,
		verbose_name="Tipo",
		db_index=True,
	)
	usuario = models.ForeignKey(
		"usuarios.Usuario",
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name="eventos",
		verbose_name="Usuário",
	)
	chave = models.ForeignKey(
		"chaves.Chave",
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name="eventos",
		verbose_name="Chave",
	)
	sala = models.ForeignKey(
		"salas.Sala",
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name="eventos",
		verbose_name="Sala",
	)
	timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
	detalhes = models.JSONField(
		default=dict,
		blank=True,
		verbose_name="Detalhes",
		help_text="Dados extras do evento (ex: slot destino, origem do pânico)",
	)

	def __str__(self):
		return f"[{self.get_tipo_display()}] {self.timestamp:%d/%m/%Y %H:%M} — {self.usuario}"

	class Meta:
		verbose_name = "Evento"
		verbose_name_plural = "Eventos"
		ordering = ["-timestamp"]
		indexes = [
			# Relatórios por período (RF-31)
			models.Index(fields=["timestamp"], name="idx_evento_timestamp"),
			# Histórico por chave (RF-36)
			models.Index(fields=["chave", "timestamp"], name="idx_evento_chave_timestamp"),
			# Histórico por usuário (RF-36)
			models.Index(fields=["usuario", "timestamp"], name="idx_evento_usuario_timestamp"),
		]