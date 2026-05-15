from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Sala(models.Model):
	class TipoSalaChoices(models.TextChoices):
		LABORATORIO = "LAB", "Laboratório"
		SALA_AULA = "SALA", "Sala de Aula"
		COZINHA = "Cozinha", "cozinha"
		AUDITORIO = "Auditório", "auditorio"

	andar = models.PositiveSmallIntegerField(
		validators=[MinValueValidator(0), MaxValueValidator(22)], verbose_name="Andar"
	)

	numero = models.CharField(max_length=4, verbose_name="Número da Sala")

	descricao = models.CharField(
		max_length=100,
		verbose_name="Descrição",
		help_text="MAaqueteria, Inovação, etc.",
		)

	@property
	def codigo(self):
		return f"{self.andar}{self.numero:02d}"
