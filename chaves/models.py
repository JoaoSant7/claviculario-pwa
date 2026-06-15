from django.core.validators import RegexValidator
from django.db import models
from shared.security import hash_rfid


class Chave(models.Model):
    class StatusChoices(models.TextChoices):
        DISPONIVEL = "disponivel", "Disponível"
        EMPRESTADA = "emprestada", "Emprestada"
        EM_TRANSITO = "em_transito", "Em trânsito"
        MANUTENCAO = "manutencao", "Manutenção"

    sala = models.ForeignKey(
        "salas.Sala",
        on_delete=models.PROTECT,
        related_name="chaves",
        verbose_name="Sala",
    )
    numero = models.CharField(
        max_length=4,
        validators=[RegexValidator(regex=r"^\d{4}$", message="O número deve conter exatamente 4 dígitos")],
    )
    rfid_tag = models.CharField(max_length=64, unique=True, verbose_name="Tag RFID")
    slot_x = models.PositiveSmallIntegerField(verbose_name="Slot X")
    slot_y = models.PositiveSmallIntegerField(verbose_name="Slot Y")
    slot_ocupado = models.BooleanField(default=True)
    descricao = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.DISPONIVEL,
    )

    def save(self, *args, **kwargs):
        if self.rfid_tag and len(self.rfid_tag) != 64:
            self.rfid_tag = hash_rfid(self.rfid_tag)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Chave {self.numero} - {self.sala} [{self.get_status_display()}]"

    class Meta:
        verbose_name = "Chave"
        verbose_name_plural = "Chaves"
        unique_together = [("sala", "numero")]
