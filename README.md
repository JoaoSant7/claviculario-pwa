# claviculario-pwa
PWA do Projeto Integrador do 4° Período de ADS Faculdade SENAC


## Boas Práticas

- Usar snake_case;

## Observações

- Sempre execute os comandos na raíz do projeto;
- Não versionar a pasta `.venv/`
- Para adicionar novas dependências:
  `uv add nome-da-biblioteca`
- Para desativar o ambiente virtual:
  `deactivate`


## Setup do projeto com uv

Para gerenciamento de pacotes e dependência de nosso projeto estaremos usando **uv** package manager.

Abaixo segue um tutorial para instalação e uso do uv neste repositório.

### 1. Instalar o uv

Para instalar o uv:

```bash
pip install uv
```

### 2. Criar o ambiente virtual

Na raíz do projeto: 

```bash
uv venv
```
### 3. Ativar o ambiente virtual

Este procedimento varia de acordo com seu sistema operacional.

Linux/Mac:

```bash
source .venv/bin/activate
```
Windows:

```powershell
.venv\Scripts\Activate.ps1
```

**ATENÇÃO**: Se aparecer erro de permissão no Windows, rode o seguinte código:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
 
### 4. Instalar dependências

```bash
uv sync
````

### 5. Aplicar migrações

```bash
python manage.py migrate
````

### 6. Rodar o servidor

```bash
python manage.py runserver
````
