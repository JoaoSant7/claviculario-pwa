from django import forms
from .models import Emprestimo, Devolucao


class EmprestimoForm(forms.ModelForm):
    class Meta:
        model = Emprestimo
        fields = ["usuario", "chave"]


class DevolucaoForm(forms.ModelForm):
    class Meta:
        model = Devolucao
        fields = ["emprestimo"]
