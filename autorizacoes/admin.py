from django.contrib import admin
from .models import Autorizacao


@admin.register(Autorizacao)
class AutorizacaoAdmin(admin.ModelAdmin):
    list_display = ["usuario", "sala", "concedida_por", "valida_de", "valida_ate", "ativa"]
