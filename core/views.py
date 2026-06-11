from django.shortcuts import render


def teste_backend(request):
	return render(request, "core/teste_backend.html")
