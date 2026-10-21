# Multi API TodoList

Sistema de tarefas distribuído em três APIs de linguagens diferentes, que compartilham um banco PostgreSQL, mais um frontend em HTML/CSS/JS puro. Tem cadastro e login com JWT, CRUD de tarefas por usuário, estatísticas e registro de logs.

| Serviço | Tecnologias | Porta | Função |
|---|---|---|---|
| API-Tarefas | Node.js, Express, TypeScript, Prisma | `3000` | Usuários, autenticação JWT e tarefas |
| Gerador-de-Logs | PHP, Laravel, Eloquent | `8000` | Recebe e grava logs enviados pela API-Tarefas |
| Contador | Python, FastAPI, SQLAlchemy | `8001` | Estatísticas das tarefas do usuário logado |
| Frontend | HTML, CSS, JavaScript | `5500` | Interface (Live Server) |

## Estrutura

```text
Multi-API-TodoList/
├── API-Tarefas/        # Express + Prisma (src/server.ts, prisma/schema.prisma)
├── Contador/           # FastAPI (app/main.py, requirements.txt)
├── Gerador-de-Logs/    # Laravel (routes/api.php, app/Http/...)
└── Frontend/           # index.html, css/, js/api.js
```

## Pré-requisitos

[Node.js](https://nodejs.org/) · [Python 3](https://www.python.org/) · [PHP 8.2+](https://www.php.net/) com a extensão `pdo_pgsql` · [Composer](https://getcomposer.org/) · [PostgreSQL](https://www.postgresql.org/) · VS Code com a extensão **Live Server**

## 1. Banco de dados

Crie um banco vazio chamado `todo_list` (pelo pgAdmin ou pelo terminal):

```bash
psql -U postgres -c "CREATE DATABASE todo_list;"
```

Os três serviços usam esse mesmo banco. O Prisma cria as tabelas `usuarios` e `tarefas`, e o Laravel cria a `log_sistemas`.

## 2. Chaves compartilhadas

Antes de configurar os `.env`, defina dois valores secretos. Eles precisam ser **idênticos** entre os serviços:

| Variável | Onde vai | Para quê |
|---|---|---|
| `JWT_SECRET` | `API-Tarefas/.env` e `Contador/.env` | O Contador valida o token emitido pela API-Tarefas (HS256) |
| `LOG_SERVICE_KEY` | `API-Tarefas/.env` e `Gerador-de-Logs/.env` | Enviada no header `X-Integration-Key` para autorizar o envio de logs |

> Nos `.env` copiados dos `.env.example`, troque `SEU_USUARIO` e `SUA_SENHA` pelas credenciais do seu PostgreSQL.
> Em todos os passos abaixo, use `Copy-Item .env.example .env` no PowerShell ou `cp .env.example .env` no Linux/macOS.

## 3. Gerador de Logs (Laravel): porta 8000

```bash
cd Gerador-de-Logs
cp .env.example .env          # preencha DB_USERNAME, DB_PASSWORD e LOG_SERVICE_KEY
composer install
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
```

Rota de integração: `POST http://127.0.0.1:8000/api/logs` (exige o header `X-Integration-Key`).

## 4. API de Tarefas (Express): porta 3000

Em outro terminal:

```bash
cd API-Tarefas
cp .env.example .env          # preencha DATABASE_URL, JWT_SECRET e LOG_SERVICE_KEY
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Para testar, abra `http://localhost:3000/` no navegador. A resposta deve ser `{ "mensagem": "API de Tarefas funcionando." }`.

| Método | Rota | Auth |
|---|---|---|
| POST | `/auth/cadastro` | — |
| POST | `/auth/login` | — |
| GET | `/tarefas` | Bearer |
| POST | `/tarefas` | Bearer |
| PATCH | `/tarefas/:id` | Bearer |
| PATCH | `/tarefas/:id/concluir` | Bearer |
| DELETE | `/tarefas/:id` | Bearer |

## 5. Contador (FastAPI): porta 8001

Em outro terminal:

```bash
cd Contador
python -m venv .venv
```

Ative o ambiente virtual:

```bash
.\.venv\Scripts\Activate.ps1     # Windows (PowerShell)
source .venv/bin/activate        # Linux/macOS
```

Depois:

```bash
pip install -r requirements.txt
cp .env.example .env             # preencha DATABASE_URL e JWT_SECRET
uvicorn app.main:app --reload --port 8001
```

> Rode o `uvicorn` de dentro da pasta `Contador`: o módulo é `app.main`, não `main`.
> No `DATABASE_URL` do Contador, mantenha o prefixo `postgresql+psycopg://`.

- `GET http://127.0.0.1:8001/stats` (Bearer) devolve `total`, `concluidas` e `pendentes`.
- A documentação interativa fica em `http://127.0.0.1:8001/docs`.

## 6. Frontend: porta 5500

Abra a pasta `Frontend` no VS Code, clique com o botão direito em `index.html` e escolha **Open with Live Server**. A página abre em `http://127.0.0.1:5500`.

As URLs das APIs ficam em `Frontend/js/api.js`. O CORS da API-Tarefas e do Contador só aceita as origens `127.0.0.1:5500` e `localhost:5500`. Se usar outra porta, ajuste o CORS em `API-Tarefas/src/server.ts` e em `Contador/app/main.py`.

## Ordem de inicialização

Use um terminal para cada serviço:

1. PostgreSQL
2. Gerador de Logs (`8000`)
3. API de Tarefas (`3000`)
4. Contador (`8001`)
5. Frontend (Live Server)

## Problemas comuns

| Sintoma | Verifique |
|---|---|
| Erro de conexão com o banco | O PostgreSQL está rodando, o banco `todo_list` existe e as credenciais dos `.env` estão corretas |
| Estatísticas retornam 401 | O `JWT_SECRET` do Contador é igual ao da API-Tarefas (o token expira em 1h; se for o caso, faça login de novo) |
| `Falha ao registrar log. HTTP 401` no console da API | O `LOG_SERVICE_KEY` é igual na API-Tarefas e no Gerador-de-Logs |
| Erro de CORS no navegador | O frontend está aberto na porta 5500 |
| `could not find driver` no Laravel | Habilite `pdo_pgsql` no `php.ini` |
