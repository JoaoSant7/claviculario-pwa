import json
import tempfile
from datetime import timedelta

from django.core.exceptions import PermissionDenied, ValidationError
from django.core.management import call_command
from django.test import Client, TestCase, override_settings
from django.utils import timezone

from autorizacoes.models import Autorizacao
from chaves.models import Chave
from eventos.models import Evento
from hardware.services import processar_rfid_usuario
from salas.models import Sala
from shared.security import hash_rfid
from timetable.models import Timetable
from usuarios.models import Usuario

from .models import Emprestimo
from .services import (
	registrar_devolucao,
	registrar_panico,
	registrar_retirada,
	verificar_autorizacao,
	verificar_chaves_em_atraso,
)


class RegrasBackendTests(TestCase):
	def setUp(self):
		self.agora = timezone.now().replace(hour=10, minute=0, second=0, microsecond=0)
		self.coordenador = self.usuario("0000000001", "coord", "coordenacao", "coord")
		self.professor = self.usuario("0000000002", "prof", "professor", "prof")
		self.aluno = self.usuario("0000000003", "aluno", "aluno", "aluno")
		self.porteiro = self.usuario("0000000004", "port", "porteiro", "port")
		self.inativo = self.usuario("0000000005", "inat", "professor", "inat", ativo=False)
		self.sala = Sala.objects.create(codigo="301A", andar=3, numero="01A")
		self.chave = Chave.objects.create(
			sala=self.sala,
			numero="0001",
			rfid_tag="rfid-chave",
			slot_x=1,
			slot_y=2,
		)

	def usuario(self, matricula, nome, papel, rfid, ativo=True):
		return Usuario.objects.create(
			nome=nome,
			sobrenome="Teste",
			matricula=matricula,
			email=f"{nome}@edu.pe.senac.br",
			papel=papel,
			rfid_tag=rfid,
			ativo=ativo,
		)

	def criar_timetable(self):
		Timetable.objects.create(
			professor=self.professor,
			sala=self.sala,
			dia_semana=self.agora.weekday(),
			hora_inicio=(self.agora - timedelta(hours=1)).time(),
			hora_fim=(self.agora + timedelta(hours=1)).time(),
			vigencia_inicio=self.agora.date(),
		)

	def autorizar(self, usuario):
		agora_real = timezone.now()
		inicio = min(self.agora, agora_real) - timedelta(minutes=5)
		fim = max(self.agora, agora_real) + timedelta(hours=2)
		return Autorizacao.objects.create(
			usuario=usuario,
			sala=self.sala,
			concedida_por=self.coordenador,
			valida_de=inicio,
			valida_ate=fim,
		)

	def test_usuario_inexistente_tentando_retirar(self):
		autorizado, motivo, _ = verificar_autorizacao(None, self.chave, self.agora)
		self.assertFalse(autorizado)
		self.assertIn("inexistente", motivo)

	def test_usuario_inativo_tentando_retirar(self):
		with self.assertRaises(PermissionDenied):
			registrar_retirada(self.inativo, self.chave, self.agora)
		self.assertTrue(Evento.objects.filter(tipo="negado").exists())

	def test_professor_dentro_do_horario(self):
		self.criar_timetable()
		emprestimo = registrar_retirada(self.professor, self.chave, self.agora)
		self.assertTrue(emprestimo.esta_ativo)
		self.chave.refresh_from_db()
		self.assertEqual(self.chave.status, "emprestada")

	def test_professor_fora_do_horario_sem_autorizacao(self):
		with self.assertRaises(PermissionDenied):
			registrar_retirada(self.professor, self.chave, self.agora)

	def test_professor_fora_do_horario_com_autorizacao(self):
		self.autorizar(self.professor)
		emprestimo = registrar_retirada(self.professor, self.chave, self.agora)
		self.assertIsNotNone(emprestimo.pk)

	def test_aluno_sem_autorizacao(self):
		with self.assertRaises(PermissionDenied):
			registrar_retirada(self.aluno, self.chave, self.agora)

	def test_aluno_com_autorizacao(self):
		self.autorizar(self.aluno)
		emprestimo = registrar_retirada(self.aluno, self.chave, self.agora)
		self.assertIsNotNone(emprestimo.pk)

	def test_porteiro_tentando_retirar(self):
		with self.assertRaises(PermissionDenied):
			registrar_retirada(self.porteiro, self.chave, self.agora)

	def test_chave_ja_emprestada(self):
		self.autorizar(self.aluno)
		registrar_retirada(self.aluno, self.chave, self.agora)
		with self.assertRaises(PermissionDenied):
			registrar_retirada(self.coordenador, self.chave, self.agora)

	def test_devolucao_com_emprestimo_ativo(self):
		registrar_retirada(self.coordenador, self.chave, self.agora)
		devolucao = registrar_devolucao(self.chave, self.agora + timedelta(minutes=5))
		self.assertIsNotNone(devolucao.pk)
		self.chave.refresh_from_db()
		self.assertEqual(self.chave.status, "disponivel")

	def test_devolucao_sem_emprestimo_ativo(self):
		with self.assertRaises(ValidationError):
			registrar_devolucao(self.chave, self.agora)

	def test_panico(self):
		evento = registrar_panico(self.sala, origem="botao")
		self.assertEqual(evento.tipo, "panico")
		self.assertEqual(evento.detalhes["andar"], 3)

	def test_eventos_criados(self):
		registrar_retirada(self.coordenador, self.chave, self.agora)
		registrar_devolucao(self.chave, self.agora + timedelta(minutes=1))
		registrar_panico(self.sala)
		self.assertTrue(Evento.objects.filter(tipo="retirada").exists())
		self.assertTrue(Evento.objects.filter(tipo="devolucao").exists())
		self.assertTrue(Evento.objects.filter(tipo="panico").exists())

	def test_importacao_de_timetable(self):
		payload = [
			{
				"professor_matricula": self.professor.matricula,
				"sala_codigo": self.sala.codigo,
				"dia_semana": self.agora.weekday(),
				"hora_inicio": "08:00",
				"hora_fim": "10:00",
				"vigencia_inicio": str(self.agora.date()),
				"vigencia_fim": None,
			}
		]
		with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as arquivo:
			json.dump(payload, arquivo)
			caminho = arquivo.name
		call_command("importar_timetable", caminho)
		self.assertEqual(Timetable.objects.count(), 1)

	def test_deteccao_de_atraso_sem_duplicar(self):
		emprestimo = Emprestimo.objects.create(
			usuario=self.coordenador,
			chave=self.chave,
			limite_devolucao=self.agora - timedelta(hours=1),
		)
		atrasados = verificar_chaves_em_atraso(self.agora)
		novos = verificar_chaves_em_atraso(self.agora)
		self.assertEqual(atrasados, [emprestimo])
		self.assertEqual(novos, [])
		self.assertEqual(Evento.objects.filter(tipo="atraso").count(), 1)

	def test_rfid_salvo_com_hash(self):
		self.assertEqual(len(self.professor.rfid_tag), 64)
		self.assertEqual(self.professor.rfid_tag, hash_rfid("prof"))

	@override_settings(HARDWARE_TOKEN="segredo")
	def test_token_invalido_no_hardware(self):
		resposta = Client().post(
			"/api/hardware/panico/",
			data={"codigo_sala": self.sala.codigo},
			content_type="application/json",
			HTTP_X_HARDWARE_TOKEN="errado",
		)
		self.assertEqual(resposta.status_code, 403)

	@override_settings(HARDWARE_TOKEN="segredo")
	def test_token_valido_no_hardware(self):
		resposta = Client().post(
			"/api/hardware/panico/",
			data={"codigo_sala": self.sala.codigo},
			content_type="application/json",
			HTTP_X_HARDWARE_TOKEN="segredo",
		)
		self.assertEqual(resposta.status_code, 200)

	def test_processar_rfid_usuario(self):
		self.autorizar(self.aluno)
		dados = processar_rfid_usuario("aluno", self.sala.codigo)
		self.assertEqual(dados["slot_x"], self.chave.slot_x)
