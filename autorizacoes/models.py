from django.db import models
from django.utils import timezone


class Autorizacao(models.Model):
	"""
	Autorização concedida pela coordenação para retirada de chave fora das regras padrão.

	RF-18: coordenação autoriza alunos específicos (com validade).
	RF-19: coordenação autoriza professores fora do horário (com validade).
	RF-27: coordenação pode editar/revogar a qualquer momento.
	"""

	usuario = models.ForeignKey(
		"usuarios.Usuario",
		on_delete=models.CASCADE,
		related_name="autorizacoes",
		verbose_name="Usuário autorizado",
	)
	sala = models.ForeignKey(
		"salas.Sala",
		on_delete=models.CASCADE,
		related_name="autorizacoes",
		null=True,
		blank=True,
		verbose_name="Sala",
		help_text="Deixe em branco para autorizar acesso a qualquer sala",
	)
	concedida_por = models.ForeignKey(
		"usuarios.Coordenador",
		on_delete=models.PROTECT,
		related_name="autorizacoes_concedidas",
		verbose_name="Concedida por",
	)
	valida_de = models.DateTimeField(
		default=timezone.now,
		verbose_name="Válida de",
	)
	valida_ate = models.DateTimeField(
		null=True,
		blank=True,
		verbose_name="Válida até",
		help_text="Deixe em branco para autorização sem expiração",
	)
	ativa = models.BooleanField(default=True, db_index=True, verbose_name="Ativa")
	motivo = models.TextField(
		blank=True,
		verbose_name="Motivo",
		help_text="Justificativa opcional da autorização",
	)
	criada_em = models.DateTimeField(auto_now_add=True)

	# ------------------------------------------------------------------ #
	# Helpers                                                              #
	# ------------------------------------------------------------------ #

	def esta_vigente(self) -> bool:
		"""Retorna True se a autorização está ativa e dentro do prazo de validade."""
		if not self.ativa:
			return False
		agora = timezone.now()
		if agora < self.valida_de:
			return False
		if self.valida_ate is not None and agora > self.valida_ate:
			return False
		return True

	def revogar(self):
		"""Desativa a autorização imediatamente sem alterar outros campos."""
		self.ativa = False
		self.save(update_fields=["ativa"])

	def __str__(self):
		sala_str = self.sala.codigo if self.sala else "qualquer sala"
		validade_str = (
			f"até {self.valida_ate:%d/%m/%Y %H:%M}" if self.valida_ate else "sem expiração"
		)
		estado = "ativa" if self.ativa else "revogada"
		return f"Autorização: {self.usuario} → {sala_str} ({validade_str}) [{estado}]"

	class Meta:
		verbose_name = "Autorização"
		verbose_name_plural = "Autorizações"
		ordering = ["-criada_em"]
		indexes = [
			# Usado na verificação de autorização em tempo real (RF-12)
			models.Index(fields=["usuario", "ativa"], name="idx_autorizacao_usuario_ativa"),
		]