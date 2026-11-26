# Onboarding

## Pré-requisitos

- Node.js compatível com as dependências instaladas.
- npm.
- PostgreSQL para executar os endpoints que consultam ou alteram dados.

## Instalação

1. No backend, copie `.env.example` para `.env` e configure `DATABASE_URL` para
   um PostgreSQL local. Nunca versione o `.env`.
2. Instale e inicialize o banco:

   ```powershell
   Push-Location Backend
   npm install
   npm run db:reset
   Pop-Location
   ```

   `db:reset` apaga e recria o schema `public`, aplica o seed e recusa URLs que
   não apontem para localhost. Use somente um banco local descartável.

3. Em um terminal, execute `Push-Location Backend; npm run dev`.
4. Em outro terminal, execute `Push-Location Frontend; npm install; npm run dev`.
5. Abra o endereço exibido pelo Vite. A API responde em `/health`.

## Verificação sem banco

O lint/build do frontend e `node --check` do backend não conectam no
PostgreSQL. Use-os para uma verificação rápida antes de abrir o banco.

## Diagnóstico

- Erros de conexão: confira `DATABASE_URL` e se o PostgreSQL está em execução.
- Erros de CORS: confira `CORS_ORIGIN` e a porta do Vite.
- Erros de autenticação: confira `JWT_SECRET` e use o usuário criado pelo seed
  apenas em desenvolvimento.
