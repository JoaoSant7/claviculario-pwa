from django.core.validators import RegexValidator
from django.db import models


class Chave(models.Model):
	STATUS_CHOICES = [
		("disponivel", "Disponível"),
		("emprestada", "Emprestada"),
		("manutencao", "Manutenção"),
	]

	numero = models.CharField(
		max_length=4,
		validators=[
			RegexValidator(
				regex=r"^\d{4}$",
				message="O número da sala segue um formato de 3 a 4 dígitos",
			)
		],
	)
	descricao = models.CharField(max_length=255)
	status = models.CharField(
		max_length=20, choices=STATUS_CHOICES, default="disponivel"
	)
