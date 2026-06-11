# Frontend de Teste - Painel Administrativo

Este frontend foi criado para testar o backend real do Claviculario sem Postman ou Insomnia.

Ele usa Django Templates, CSS e JavaScript moderno. A escolha foi feita porque o projeto atual e um monolito Django e nao possui pipeline Node/Vite configurado. Assim, o painel roda junto com o backend, sem CORS e sem build separado.

## Como acessar

Rode o backend:

```powershell
uv run python manage.py runserver
```

Acesse:

```text
http://127.0.0.1:8000/painel/
```

Tambem funciona em:

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/teste/
```

## Login

Use o usuario criado com:

```powershell
uv run python manage.py createsuperuser
```

O painel autentica em:

```text
POST /api/auth/token/
```

O token JWT fica salvo no navegador via `localStorage`.

## Telas criadas

- Login
- Dashboard
- Usuarios
- Turmas
- Salas
- Chaves
- Autorizacoes
- Timetable
- Eventos
- Emprestimos
- Operacoes
- Relatorios
- Hardware
- Configuracoes

## Funcionalidades

- Login JWT
- Logout
- Cards de resumo
- Tabelas com busca local
- Criar, editar, visualizar e excluir quando o backend permite
- Estados de carregamento
- Toasts de sucesso e erro
- Modais para formulario e detalhes
- Operacoes de retirada, devolucao e panico
- Relatorios GET
- Testes dos endpoints tecnicos de hardware com `X-HARDWARE-TOKEN`
- WebSocket em `/ws/eventos/`
- Configuracao visual da base URL da API

## WebSocket

Para testar tempo real, abra a tela `Operacoes`, clique em `Conectar` e depois dispare um panico.

Se o WebSocket nao funcionar com `runserver`, rode:

```powershell
uv run daphne -b 127.0.0.1 -p 8000 config.asgi:application
```

## Observacoes

- A tela `Configuracoes` salva a Base URL apenas no navegador. Nao existe endpoint de configuracao persistente no backend.
- Eventos e emprestimos sao somente leitura porque os viewsets do backend foram criados como `ReadOnlyModelViewSet`.
- O painel nao altera regras de negocio do backend; ele apenas consome a API existente.
