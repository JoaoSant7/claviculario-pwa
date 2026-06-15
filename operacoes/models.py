import uuid
from datetime import timedelta
from django.db import models
from django.utils import timezone


class Emprestimo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(
        "usuarios.Usuario", on_delete=models.PROTECT, related_name="emprestimos"
    )
    chave = models.ForeignKey(
        "chaves.Chave", on_delete=models.PROTECT, related_name="emprestimos"
    )
    retirado_em = models.DateTimeField(auto_now_add=True)
    limite_devolucao = models.DateTimeField(null=True, blank=True)
    atraso_registrado = models.BooleanField(default=False)

    @property
    def esta_ativo(self):
        return not hasattr(self, "devolucao")

    def save(self, *args, **kwargs):
        if not self.limite_devolucao:
            self.limite_devolucao = timezone.now() + timedelta(hours=4)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Empréstimo de {self.chave} para {self.usuario}"


class Devolucao(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    feito_em = models.DateTimeField(auto_now_add=True)
    emprestimo = models.OneToOneField(
        Emprestimo, on_delete=models.PROTECT, related_name="devolucao"
    )

    def __str__(self):
        return f"Devolução do Empréstimo {self.emprestimo}"
