# claviculario-pwa
PWA do Projeto Integrador do 4° Período de ADS Faculdade SENAC


## Boas Práticas

### Estrutura do projeto

- Sempre execute comandos a partir da **raiz do projeto**;
- Mantenha o código organizado em apps (ex: `users`, `keys`, `loans`);
- Evite lógica complexa em `views`

### Ambiente e Dependências

- Utilize o **uv** Para adicionar novas dependências;
- Não utilize o `pip install` diretamente. Utilize:
```bash
  uv add nome-da-biblioteca
```
- Sempre rode:
```bash
  uv sync
```
- Nunca versione:
```
.venv/
__pycache__/
db.sqlite3
```

### Execução do Projeto

- Utilize preferencialmente:
```bash
  uv run python manage.py runserver
```
- Evite depender da ativação manual do ambiente virtual.

### Banco de Dados

- Sempre aplique migrações antes de rodar o projeto:
```bash
  uv run python manage.py migrate
```
- Ao criar ou alterar modelos:
```bash
  python manage.py makemigrations
  python manage.py migrate
```
### Código

- Siga padrões de código consistentes (PEP 8);
- Use nomes claros e descritivos (ex: `snake_case.py`);
- Evite código duplicado;
- Prefira funções pequenas e com responsabilidade única.

### Segurança

- Nunca suba arquivos sensíveis (senhas, tokens, .env);
- Utilize variáveis de ambiente para configurações sensíveis.

### Git

- Faça commits pequenos e descritivos;

Exemplo:
```
feat: adicionar modelo de empréstimo
fix: corrigir o erro na autenticação do professor
```

- Sempre crie uma branch para desenvolver novas funcionalidades ou correções;
- Sempre atualize sua branch antes de começar.


### Colaboração
- Antes de começar uma tarefa, verifique se já não está sendo feita;
- Documente mudanças importantes no projeto;
- Mantenha o README atualizado.

### Dicas Gerais
- Teste suas alterações antes de subir código;
- Evite quebrar funcionalidades existentes;
- Em caso de dúvida, pergunte antes de implementar mudanças grandes.

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
