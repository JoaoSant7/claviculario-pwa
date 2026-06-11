# Relatorio Backend - Claviculario

## Entrega local

Repositorio preparado localmente em `C:\Users\Kadu\Documents\Pi 4 periodo\claviculario-pwa`.
Nada foi enviado para o GitHub.

## Itens concluidos

- Corrigida a heranca de `Devolucao` para `models.Model`.
- Adotado UUID como chave primaria nos models principais.
- Persistido `Sala.codigo` como campo unico.
- Criado model `Timetable`.
- Criado model `Turma`, removendo turmas fixas do model `Aluno`.
- Refatorado `Usuario` herdando de `AbstractUser`.
- Configurado `AUTH_USER_MODEL`.
- Movidas configuracoes sensiveis para variaveis de ambiente.
- Criado `.env.example`.
- Configurado `DATABASE_URL` com suporte a PostgreSQL.
- Instalado/configurado `psycopg2-binary`.
- Criado `Dockerfile`.
- Criado `docker-compose.yml` com Django web, PostgreSQL, Redis, Celery, Celery Beat e Mosquitto.
- Instalado/configurado Django REST Framework.
- Instalado/configurado SimpleJWT.
- Criados endpoints `token` e `token/refresh`.
- Criadas permissions por papel: coordenacao, porteiro/coordenacao, professor/aluno/coordenacao.
- Criados serializers dos modelos base.
- Criados viewsets DRF para usuarios, turmas, salas, chaves, autorizacoes, eventos, emprestimos e timetable.
- Criado endpoint de importacao em lote do timetable via JSON.
- Criados endpoints de operacoes para retirada, devolucao e panico.
- Mantidos endpoints tecnicos de hardware protegidos por `X-HARDWARE-TOKEN`.
- Criados endpoints GET de relatorios.
- Configurado Django Channels.
- Criado consumer WebSocket em `/ws/eventos/`.
- Eventos de sistema sao publicados no grupo WebSocket `eventos`.
- Configurado Celery.
- Configurado Celery Beat com tarefa a cada 5 minutos para verificar atrasos.
- Registrados models principais no Django Admin.
- Criadas e validadas migrations.

## Principais rotas

- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `/api/usuarios/`
- `/api/turmas/`
- `/api/salas/`
- `/api/chaves/`
- `/api/autorizacoes/`
- `/api/autorizacoes/{id}/revogar/`
- `/api/eventos/`
- `/api/emprestimos/`
- `/api/timetable/`
- `POST /api/timetable/importar/`
- `POST /api/operacoes/retirada/`
- `POST /api/operacoes/devolucao/`
- `POST /api/operacoes/panico/`
- `GET /api/relatorios/status-chaves/`
- `GET /api/relatorios/eventos-recentes/`
- `GET /api/relatorios/chaves-emprestadas/`
- `GET /api/relatorios/chaves-em-atraso/`
- `GET /api/relatorios/usuarios/{usuario_id}/historico/`
- `GET /api/relatorios/chaves/{chave_id}/historico/`
- `GET /api/relatorios/retiradas/`
- `GET /api/relatorios/uso-por-sala/`
- `POST /api/hardware/rfid-usuario/`
- `POST /api/hardware/rfid-chave/`
- `POST /api/hardware/panico/`
- `POST /api/hardware/status-slot/`
- `WS /ws/eventos/`

## Validacao executada

```powershell
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py test
```

Resultado: 23 testes passando.

## Observacao sobre Docker

O arquivo `docker-compose.yml` foi criado, mas o comando `docker` nao estava disponivel no PATH desta maquina durante a validacao. Por isso a sintaxe/execucao do Docker Compose nao foi rodada localmente nesta sessao.
