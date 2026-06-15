import uuid
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Sala(models.Model):
    class TipoSalaChoices(models.TextChoices):
        LABORATORIO = "LAB", "Laboratório"
        SALA_AULA = "SALA", "Sala de Aula"
        COZINHA = "Cozinha", "Cozinha"
        AUDITORIO = "Auditório", "Auditório"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    codigo = models.CharField(max_length=10, unique=True, blank=True)
    andar = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(22)], verbose_name="Andar"
    )
    numero = models.CharField(max_length=4, verbose_name="Número da Sala")
    descricao = models.CharField(max_length=100, verbose_name="Descrição", help_text="Maqueteria, Inovação, etc.")
    tipo_sala = models.CharField(
        max_length=10,
        choices=TipoSalaChoices.choices,
        default=TipoSalaChoices.SALA_AULA,
        verbose_name="Tipo de Sala",
    )

    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = f"{self.andar}{self.numero}".upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Sala {self.codigo}"

    class Meta:
        ordering = ["andar", "numero"]
