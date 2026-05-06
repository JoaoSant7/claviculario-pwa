from django.core.validators import RegexValidator
from django.db import models


class Usuario(models.Model):
	nome = models.CharField(max_length=30, verbose_name="Primeiro Nome")
	sobrenome = models.CharField(max_length=30, verbose_name="Sobrenome")
	matricula = models.CharField(
		max_length=10,
		unique=True,
		validators=[
			RegexValidator(
				regex=r"^\d{10}$",
				message="A matrícula deve conter exatamente 10 dígitos",
			)
		],
	)
	email = models.EmailField(
		max_length=50,
		unique=True,
		validators=[
			RegexValidator(
				regex=r"^[\w\.-]+@edu\.pe\.senac\.br$",
				message="Use um email institucional da Faculdade Senac.",
			)
		],
	)
	telefone = models.CharField(
		max_length=11,
		validators=[
			RegexValidator(
				regex=r"^\d{11}$",
				message="O número de telefone do usuário deve conter 11 dígitos",
			)
		],
	)

	class Meta:
		abstract = True
		verbose_name = "Usuário"
		verbose_name_plural = "Usuários"
		ordering = ["nome", "sobrenome"]

	def __str__(self):
		return f"{self.nome} - {self.matricula}"


class Aluno(Usuario):
	class TurmaChoices(models.TextChoices):
		ADS039 = "ADS039", "ADS 039"
		ADS040 = "ADS040", "ADS 040"
		ADS041 = "ADS041", "ADS 041"

	turma = models.CharField(
		max_length=10,
		choices=TurmaChoices.choices,
		verbose_name="Turma",
	)


class Coordenador(Usuario):
	curso = models.CharField(max_length=100, verbose_name="Curso")


class Professor(Usuario):
	materias = models.CharField(max_length=100, verbose_name="Matéria")
