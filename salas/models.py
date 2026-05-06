import uuid
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

# Sala
###  - id (UUID)
#   - codigo (CharField, unique)  ← ex: "301A"
#  - andar (IntegerField)
#  - descricao (CharField)


class Sala(models.Model):
	andar = models.PositiveSmallIntegerField(
		validators=[MinValueValidator(0), MaxValueValidator(22)], verbose_name="Andar"
	)
	numero = models.PositiveSmallIntegerField(
		validators=[MinValueValidator(1), MaxValueValidator(6)]
	)
	descricao = models.CharField(max_length=100)

	@property
	def codigo(self):
		return f"{self.andar}{self.numero:02d}"
