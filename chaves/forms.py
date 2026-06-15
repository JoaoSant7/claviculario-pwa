from django import forms
from .models import Chave


class ChaveForm(forms.ModelForm):
    class Meta:
        model = Chave
        fields = ["sala", "numero", "rfid_tag", "slot_x", "slot_y", "slot_ocupado", "status"]

    def clean_rfid_tag(self):
        rfid = self.cleaned_data.get("rfid_tag", "").strip()
        if not rfid:
            raise forms.ValidationError("RFID não pode ser vazio.")
        return rfid
