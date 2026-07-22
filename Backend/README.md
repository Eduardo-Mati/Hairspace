# Hairspace — Backend

## Arquitetura

```
index.js                → só cria o app Express e monta os routers
src/routes/*.routes.js  → só define URL + método HTTP, chama o controller
src/controllers/*.js    → recebe req, valida entrada, chama o model, monta a resposta
src/models/*.model.js   → toda query SQL fica aqui (usa o pool do src/config/db.js)
src/middlewares/*.js    → auth (JWT) e tratamento de erro central
db/schema.sql           → cria as tabelas
db/seed.sql             → popula com os mesmos dados que hoje estão fixos no front
```

Fluxo de uma requisição, por exemplo `GET /services`:

`index.js` → `services.routes.js` → `services.controller.js` (chama o model) → `services.model.js` (faz o SELECT) → volta pro controller → `res.json(...)`.

Nenhum router chama o banco diretamente, e nenhum model sabe nada sobre req/res do Express — cada camada só conhece a camada logo abaixo dela.

## Setup

1. Copie `.env.example` para `.env` e preencha `DATABASE_URL` com a string de conexão do seu Postgres (local, Supabase, Neon, etc).
2. Instale as dependências: `npm install`
3. Crie as tabelas: `npm run db:setup`
4. Popule com dados de exemplo: `npm run db:seed`
5. Suba o servidor: `npm run dev` (reinicia sozinho a cada alteração) ou `npm start`

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

Login de exemplo criado pelo seed: `admin@hairspace.com` / `troque-esta-senha` — troque antes de ir pra produção.
