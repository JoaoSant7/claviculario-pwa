from django.db import models


class Operacao(models.Model):
	usuario = models.ForeignKey("usuarios.Usuario", on_delete=models.PROTECT)
	chave = models.ForeignKey("chaves.Chave", on_delete=models.PROTECT)

	class Meta:
		abstract = False

	def __str__(self):
		return f"Operação #{self.pk} - {self.usuario}"


class Emprestimo(Operacao):
	feito_em = models.DateTimeField(auto_now_add=True)
	devolvido_em = models.DateTimeField(null=True, blank=True)

	@property
	def esta_ativo(self):
		return self.devolvido_em is None

	def __strg__(self):
		return f"Empréstimo #{self.pk} - Chave: {self.chave}"


class Devolucao:
	feito_em = models.DateTimeField(auto_now_add=True)
	emprestimo = models.OneToOneField(
		Emprestimo, on_delete=models.PROTECT, related_name="devolucao"
	)

	def __str__(self):
		return f"Devolucao do Empréstimo #{self.emprestimo.pk}"
