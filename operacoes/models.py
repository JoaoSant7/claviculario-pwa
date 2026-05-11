from django.db import models


class Operacao(models.Model):
	usuario = models.ForeignKey("usuarios.Usuario", on_delete=models.PROTECT)
