"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from hardware import views as hardware_views

urlpatterns = [
	path("admin/", admin.site.urls),
	path("api/hardware/rfid-usuario/", hardware_views.rfid_usuario, name="hardware-rfid-usuario"),
	path("api/hardware/rfid-chave/", hardware_views.rfid_chave, name="hardware-rfid-chave"),
	path("api/hardware/panico/", hardware_views.panico, name="hardware-panico"),
	path("api/hardware/status-slot/", hardware_views.status_slot, name="hardware-status-slot"),
]
