from django.core.validators import RegexValidator
from django.db import models


class Chave(models.Model):
	STATUS_CHOICES = [
		("disponivel", "Disponível"),
		("emprestada", "Emprestada"),
		("manutencao", "Manutenção"),
	]

	sala = models.ForeignKey(
		"salas.Sala",
		on_delete=models.PROTECT,
		related_name="chaves",
		verbose_name="Sala",
	)
	numero = models.CharField(
		max_length=4,
		validators=[
			RegexValidator(
				regex=r"^\d{4}$",
				message="O número deve conter exatamente 4 dígitos",
			)
		],
	)
	rfid_tag = models.CharField(
		max_length=64,
		unique=True,
		verbose_name="Tag RFID",
		help_text="Hash da tag RFID colada na chave",
	)
	slot_x = models.PositiveSmallIntegerField(verbose_name="Slot X")
	slot_y = models.PositiveSmallIntegerField(verbose_name="Slot Y")
	descricao = models.CharField(max_length=255)
	status = models.CharField(
		max_length=20, choices=STATUS_CHOICES, default="disponivel"
	)

	def __str__(self):
		return f"Chave {self.numero} - {self.sala} [{self.get_status_display()}]"

	class Meta:
		verbose_name = "Chave"
		verbose_name_plural = "Chaves"
		unique_together = [("sala", "numero")]