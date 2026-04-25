from django.core.validators import RegexValidator
from django.db import models

# Classes


class Professor(models.Model):
	nome_professor = models.CharField(max_length=30, verbose_name="Primeiro Nome")
	sobrenome_professor = models.CharField(max_length=30, verbose_name="Segundo Nome")
	matricula_professor = models.CharField(
		max_length=10,
		validators=[
			RegexValidator(
				regex=r"\d{10}$",
				message="A matrícula deve conter exatamente 10 dígitos",
			)
		],
	)
	email_professor = models.EmailField(
		max_length=50,
		validators=[
			RegexValidator(
				regex=r"^[\w\.-]+@edu\.pe\.senac\.br$",
				message="Use um email institucional da Faculdade Senac.",
			)
		],
	)
	telefone_professor = models.CharField(
		max_length=11,
		validators=[
			RegexValidator(
				regex=r"\d{11}$",
				message="O número de telefone do usuário deve conter 11 dígitos",
			)
		],
	)


class Aluno(models.Model):
	nome_aluno = models.CharField(max_length=30)
	sobrenome_aluno = models.CharField(max_length=30)
	matricula_aluno = models.CharField(
		max_length=10,
		validators=[
			RegexValidator(
				regex=r"\d{10}$",
				message="A matrícula deve conter exatamente 10 dígitos",
			)
		],
	)
	email_aluno = models.EmailField(
		max_length=50,
		validators=[
			RegexValidator(
				regex=r"^[\w\.-]+@edu\.pe\.senac\.br$",
				message="Use um email institucional da Faculdade Senac.",
			)
		],
	)
	telefone_aluno = models.CharField(
		max_length=11,
		validators=[
			RegexValidator(
				regex=r"\d{11}$",
				message="O número de telefone do usuário deve conter 11 dígitos",
			)
		],
	)
