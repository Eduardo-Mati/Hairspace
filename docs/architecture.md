# Arquitetura

## Visão geral

O repositório contém duas aplicações independentes:

```text
Frontend (React/Vite) -> HTTP/JSON -> Backend (Express) -> PostgreSQL
```

O frontend usa `VITE_API_URL` e não acessa o banco. `src/app.js` monta os
routers; `index.js` inicia o servidor. O backend valida entradas nos
controllers e concentra SQL nos models.

## Backend

- `src/routes/` define método, URL e middleware.
- `src/controllers/` valida a requisição e monta a resposta.
- `src/models/` executa queries via o pool compartilhado.
- `src/middlewares/` contém autenticação JWT e tratamento de erros.
- `src/app.js` monta o Express e os routers; `index.js` inicia o servidor HTTP.
- `db/schema.sql` e `db/seed.sql` são a fonte do schema e dos dados locais.
- Cada barbearia tem um admin; serviços e reservas pertencem a uma barbearia,
  enquanto produtos e fotos do portfólio continuam globais.
- O banco restringe a reserva por barbearia/data/horário e garante que o
  serviço da reserva pertença à mesma barbearia.
- As rotas administrativas resolvem a barbearia pelo `id` do usuário no JWT e
  pelo `owner_id`; identificadores enviados pelo cliente não definem escopo.

Rotas públicas incluem catálogo e criação/consulta de agendamento. Listagem e
alteração de status de agendamentos exigem JWT.

## Frontend

`src/App.jsx` define as rotas de tela. Cada fluxo fica em uma pasta de tela e
os componentes compartilhados estão em `src/components/`. `src/lib/api.js`
centraliza as chamadas HTTP e `src/lib/format.js` concentra formatação.

## Limites

Não há fila, cache, ORM, serviço de observabilidade ou pipeline de CI
versionado observado. PostgreSQL é uma dependência real do backend, mas os
checks estáticos não exigem uma conexão.
