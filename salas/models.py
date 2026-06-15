from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Sala(models.Model):
	class TipoSalaChoices(models.TextChoices):
		LABORATORIO = "LAB", "Laboratório"
		SALA_AULA = "SALA", "Sala de Aula"
		COZINHA = "COZINHA", "Cozinha"
		AUDITORIO = "AUDITORIO", "Auditório"

	andar = models.PositiveSmallIntegerField(
		validators=[MinValueValidator(0), MaxValueValidator(22)], verbose_name="Andar"
	)

	numero = models.CharField(max_length=4, verbose_name="Número da Sala")

	descricao = models.CharField(
		max_length=100,
		verbose_name="Descrição",
		help_text="MAaqueteria, Inovação, etc.",
		)
	
	tipo_sala = models.CharField(
		max_length=10,
		choices=TipoSalaChoices.choices,
		default=TipoSalaChoices.SALA_AULA,
		verbose_name="Tipo de Sala",
	)

	em_manutencao = models.BooleanField(default=False, verbose_name="Em Manutenção")

	class Meta:
		verbose_name = "Sala"
		verbose_name_plural = "Salas"
		ordering = ["andar", "numero"]
	
	@property
	def codigo(self):
		return f"{self.andar}{self.numero}"
	
	def __str__(self):	
		status = " [EM MANUTENÇÃO]" if self.em_manutencao else ""
		return f"Sala {self.codigo} - {self.get_tipo_sala_display()}{status}"
	
