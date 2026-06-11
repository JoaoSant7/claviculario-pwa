# Endpoints integrados no frontend

## Autenticacao

- `POST /api/auth/token/` - login JWT
- `POST /api/auth/token/refresh/` - refresh JWT, disponivel no backend

## CRUDs e listagens

- `/api/usuarios/` - CRUD visual de usuarios
- `/api/turmas/` - CRUD visual de turmas
- `/api/salas/` - CRUD visual de salas
- `/api/chaves/` - CRUD visual de chaves
- `/api/autorizacoes/` - CRUD visual de autorizacoes
- `/api/autorizacoes/{id}/revogar/` - acao de revogar autorizacao
- `/api/timetable/` - CRUD visual do timetable
- `POST /api/timetable/importar/` - importacao em lote, endpoint integrado no backend e documentado
- `/api/eventos/` - listagem somente leitura
- `/api/emprestimos/` - listagem somente leitura

## Operacoes

- `POST /api/operacoes/retirada/`
- `POST /api/operacoes/devolucao/`
- `POST /api/operacoes/panico/`

## Relatorios

- `GET /api/relatorios/status-chaves/`
- `GET /api/relatorios/eventos-recentes/`
- `GET /api/relatorios/chaves-emprestadas/`
- `GET /api/relatorios/chaves-em-atraso/`
- `GET /api/relatorios/retiradas/`
- `GET /api/relatorios/uso-por-sala/`

Tambem existem no backend:

- `GET /api/relatorios/usuarios/{usuario_id}/historico/`
- `GET /api/relatorios/chaves/{chave_id}/historico/`

## Hardware

Todos usam o header `X-HARDWARE-TOKEN`.

- `POST /api/hardware/rfid-usuario/`
- `POST /api/hardware/rfid-chave/`
- `POST /api/hardware/panico/`
- `POST /api/hardware/status-slot/`

## Tempo real

- `WS /ws/eventos/`

## Preparado visualmente, mas sem endpoint especifico

- Configuracoes persistentes do frontend no servidor. A Base URL e salva apenas no navegador via `localStorage`.
- Tela de importacao visual por upload de arquivo JSON. O backend possui `POST /api/timetable/importar/`, mas o painel atual usa os CRUDs e documenta o endpoint; upload de arquivo pode ser acrescentado depois.
