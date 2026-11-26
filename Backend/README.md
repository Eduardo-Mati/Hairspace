# Hairspace — Backend

## Arquitetura

```
index.js                → só cria o app Express e monta os routers
src/routes/*.routes.js  → só define URL + método HTTP, chama o controller
src/controllers/*.js    → recebe req, valida entrada, chama o model, monta a resposta
src/models/*.model.js   → toda query SQL fica aqui (usa o pool do src/config/db.js)
src/middlewares/*.js    → auth (JWT) e tratamento de erro central
db/schema.sql           → cria as tabelas
db/seed.sql             → popula cinco barbearias fictícias, serviços e catálogo
```

Fluxo de uma requisição, por exemplo `GET /services`:

`index.js` → `services.routes.js` → `services.controller.js` (chama o model) → `services.model.js` (faz o SELECT) → volta pro controller → `res.json(...)`.

Nenhum router chama o banco diretamente, e nenhum model sabe nada sobre req/res do Express, cada camada só conhece a camada logo abaixo dela.

## Setup

1. Copie `.env.example` para `.env` e configure `DATABASE_URL` para um PostgreSQL local.
2. Instale as dependências: `npm install`
3. Inicialize o banco de desenvolvimento: `npm run db:reset`
4. Suba o servidor: `npm run dev` (reinicia sozinho a cada alteração) ou `npm start`

`npm run db:reset` apaga e recria o schema `public` e executa o seed. O comando
recusa qualquer `DATABASE_URL` que não aponte para localhost; use apenas um
banco local descartável. `npm run db:setup` e `npm run db:seed` continuam
disponíveis para execução manual.

## Endpoints

| Método | Rota                    | Auth | Descrição                                   |
|--------|-------------------------|------|----------------------------------------------|
| GET    | /services               | não  | Lista os serviços ativos                      |
| GET    | /portfolio              | não  | Lista as fotos do portfólio                   |
| GET    | /products               | não  | Lista os produtos ativos                      |
| GET    | /bookings/available     | não  | Horários livres numa data (`?date=AAAA-MM-DD`)|
| POST   | /bookings               | não  | Cria uma solicitação de agendamento           |
| GET    | /bookings/:id           | não  | Consulta um agendamento (usado na Confirmação)|
| GET    | /bookings               | sim  | Lista todos os agendamentos (painel do barbeiro)|
| PATCH  | /bookings/:id/status    | sim  | Confirma ou recusa um agendamento             |
| POST   | /auth/login             | não  | Login do barbeiro/admin, devolve um JWT       |

### Credenciais do seed — desenvolvimento somente

| Barbearia | E-mail |
|---|---|
| Barbearia Horizonte | `admin.horizonte@hairspace.test` |
| Navalha Fina | `admin.navalha@hairspace.test` |
| Ponto e Corte | `admin.pontoecorte@hairspace.test` |
| Casa do Barbeiro | `admin.casa@hairspace.test` |
| Oficina da Barba | `admin.oficina@hairspace.test` |

Senha compartilhada: `HairspaceDevOnly2026!`. Essas credenciais servem somente
para desenvolvimento local; nunca as use em produção.
