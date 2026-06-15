from django.contrib import admin
from .models import Emprestimo, Devolucao


@admin.register(Emprestimo)
class EmprestimoAdmin(admin.ModelAdmin):
    list_display = ["usuario", "chave", "retirado_em", "limite_devolucao", "atraso_registrado"]


@admin.register(Devolucao)
class DevolucaoAdmin(admin.ModelAdmin):
    list_display = ["emprestimo", "feito_em"]
