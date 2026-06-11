# Claviculario PWA - Backend Django

Backend do projeto Claviculario Automatizado. O projeto usa Django, Django REST Framework, JWT, Django Admin, Channels/WebSocket, Celery e Celery Beat.

Tambem existe um painel visual de teste em `/painel/`, criado para validar o backend localmente sem Postman.

## Requisitos

- Git
- Python 3.12
- VSCode
- uv
- Docker Desktop opcional, apenas se quiser subir PostgreSQL, Redis e Mosquitto por container

Instalar o `uv`:

```powershell
pip install uv
```

## Baixar o projeto

Se for baixar do repositorio original:

```powershell
git clone https://github.com/JoaoSant7/claviculario-pwa.git
cd claviculario-pwa
```

Se for baixar uma branch especifica do fork:

```powershell
git clone -b codex/backend-completo https://github.com/kadusemk/claviculario-pwa.git
cd claviculario-pwa
```

## Preparar o ambiente

Na raiz do projeto:

```powershell
uv sync
```

Crie o arquivo `.env` copiando o exemplo:

```powershell
copy .env.example .env
```

Para teste simples local, deixe o banco como SQLite no `.env`:

```env
SECRET_KEY=django-insecure-local-dev
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
HARDWARE_TOKEN=token-local
DATABASE_URL=sqlite:///db.sqlite3
```

## Preparar o banco

```powershell
uv run python manage.py migrate
```

## Criar o usuario administrador

```powershell
uv run python manage.py createsuperuser
```

Use um email institucional, por exemplo:

```text
nome@edu.pe.senac.br
```

Observacao: ao digitar a senha, o terminal nao mostra caracteres. Isso e normal.

## Rodar o servidor

```powershell
uv run python manage.py runserver
```

Depois acesse:

```text
http://127.0.0.1:8000/
```

Links uteis:

```text
http://127.0.0.1:8000/teste/
http://127.0.0.1:8000/painel/
http://127.0.0.1:8000/admin/
http://127.0.0.1:8000/api/
```

## Como testar pelo painel `/painel/`

1. Abra `http://127.0.0.1:8000/painel/`.
2. Em `Usuario`, coloque o username criado no `createsuperuser`.
3. Em `Senha`, coloque a senha criada.
4. Clique em `Entrar`.
5. Use o menu lateral para acessar Dashboard, Usuarios, Salas, Chaves, Autorizacoes, Timetable, Operacoes, Relatorios e Hardware.
6. Para criar dados rapidamente, use as telas de Salas e Chaves.
7. Para testar alerta, abra `Operacoes` e dispare `Panico`.
8. Para consultar resultados, abra `Dashboard`, `Eventos` ou `Relatorios`.

Se quiser testar WebSocket:

1. Clique em `Conectar WebSocket`.
2. Clique em `Disparar panico`.
3. A area de resposta deve mostrar o evento recebido.

Se o WebSocket nao funcionar com `runserver`, rode o projeto com Daphne:

```powershell
uv run daphne -b 127.0.0.1 -p 8000 config.asgi:application
```

## Criar usuarios pelo Admin

1. Acesse `http://127.0.0.1:8000/admin/`.
2. Entre com o superusuario.
3. Va em `Usuarios`.
4. Crie usuarios com os papeis:
   - `professor`
   - `aluno`
   - `porteiro`
   - `coordenacao`
   - `funcionario`

Campos importantes:

- `nome`
- `sobrenome`
- `matricula`
- `email`
- `papel`
- `ativo`
- `rfid_tag`, quando quiser testar RFID

O RFID e salvo como hash automaticamente.

## Testar login JWT manualmente

No PowerShell:

```powershell
$body = @{
  username = "SEU_USUARIO"
  password = "SUA_SENHA"
} | ConvertTo-Json

$resposta = Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/api/auth/token/" `
  -ContentType "application/json" `
  -Body $body

$resposta
```

Salvar o token:

```powershell
$token = $resposta.access
```

Testar um endpoint protegido:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:8000/api/relatorios/status-chaves/" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Rodar testes automatizados

```powershell
uv run python manage.py test
```

Resultado esperado:

```text
23 tests OK
```

Tambem e recomendado rodar:

```powershell
uv run python manage.py check
uv run python manage.py makemigrations --check --dry-run
uv run python manage.py migrate --plan
```

## Testar atrasos manualmente

```powershell
uv run python manage.py verificar_atrasos
```

Se aparecer `Atrasos registrados: 0`, esta normal quando nao existem emprestimos atrasados.

## Docker opcional

Para subir PostgreSQL, Redis e Mosquitto:

```powershell
docker compose up db redis mosquitto
```

Para subir tudo pelo Docker:

```powershell
docker compose up --build
```

Com Docker, use no `.env`:

```env
DATABASE_URL=postgres://claviculario:claviculario@localhost:5432/claviculario
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

## Celery opcional

Celery precisa de Redis rodando.

Terminal 1:

```powershell
uv run celery -A config worker -l info
```

Terminal 2:

```powershell
uv run celery -A config beat -l info
```

O Celery Beat agenda a verificacao de atrasos a cada 5 minutos.

## Principais rotas

- `GET /painel/`
- `GET /teste/`
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `/api/usuarios/`
- `/api/turmas/`
- `/api/salas/`
- `/api/chaves/`
- `/api/autorizacoes/`
- `/api/timetable/`
- `POST /api/timetable/importar/`
- `POST /api/operacoes/retirada/`
- `POST /api/operacoes/devolucao/`
- `POST /api/operacoes/panico/`
- `GET /api/relatorios/status-chaves/`
- `GET /api/relatorios/eventos-recentes/`
- `WS /ws/eventos/`

## Observacoes

- O painel `/painel/` e apenas para testes locais e apresentacao.
- A rota `/teste/` tambem aponta para o painel.
- O frontend oficial do projeto ainda pode ser feito por outro grupo.
- Nao versionar `.env`, `.venv`, `db.sqlite3` ou `__pycache__`.
