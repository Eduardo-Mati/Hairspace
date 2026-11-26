# Hairspace — Backend

## Arquitetura

```
src/app.js              → cria o app Express e monta os routers
index.js                → inicia o servidor HTTP
src/routes/*.routes.js  → só define URL + método HTTP, chama o controller
src/controllers/*.js    → recebe req, valida entrada, chama o model, monta a resposta
src/models/*.model.js   → toda query SQL fica aqui (usa o pool do src/config/db.js)
src/middlewares/*.js    → auth (JWT) e tratamento de erro central
db/schema.sql           → cria as tabelas
db/seed.sql             → popula cinco barbearias fictícias, serviços e catálogo
```

Fluxo de uma requisição, por exemplo `GET /services`:

`index.js` → `src/app.js` → `services.routes.js` → `services.controller.js` (chama o model) → `services.model.js` (faz o SELECT) → volta pro controller → `res.json(...)`.

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

### Testes automatizados

`npm test` executa testes HTTP com `node --test`. Crie `hairspace_test` como
banco UTF-8 no PostgreSQL local, usando `template0` e `encoding=UTF8`. A
variável `DATABASE_URL` deve ser definida somente na sessão do terminal e
apontar para esse banco. A suíte recusa outro host ou nome de banco e limpa as
tabelas desse banco antes de cada caso e ao final da execução.

Inicialize o schema do banco de teste uma vez com `npm run db:reset`, depois
de confirmar que a URL da sessão aponta para localhost e para
`hairspace_test`. Não use o banco de desenvolvimento para os testes.

## Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/barbershops` | não | Lista barbearias ativas, coordenadas e cores |
| GET | `/barbershops/:id` | não | Detalha a barbearia ativa e seus serviços ativos |
| GET | `/services` | não | Lista serviços ativos de barbearias ativas |
| GET | `/portfolio` | não | Lista as fotos do portfólio global |
| GET | `/products` | não | Lista os produtos globais ativos |
| GET | `/bookings/available?barbershop_id=&date=AAAA-MM-DD` | não | Retorna grade, horários livres e ocupados da barbearia |
| POST | `/bookings` | não | Cria reserva com `barbershop_id` e `service_id` |
| GET | `/bookings/:id?code=...` | não | Consulta reserva, barbearia, serviço e cores pelo código |
| POST | `/auth/login` | não | Login; retorna JWT com `id` e `role` |
| GET | `/admin/barbershop` | admin | Consulta a barbearia vinculada ao usuário autenticado |
| PATCH | `/admin/barbershop` | admin | Atualiza somente `name`, `primary_color` e `accent_color` |
| GET | `/admin/bookings?date=AAAA-MM-DD` | admin | Lista as reservas da própria barbearia na data |
| PATCH | `/admin/bookings/:id/status` | admin | Altera status somente de reserva da própria barbearia |

As rotas administrativas exigem `Authorization: Bearer <token>`. Ausência ou
invalidade do token responde 401; papel diferente de `admin` responde 403.
Reservas de outra barbearia em uma alteração administrativa respondem 404.

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
