# Instruções do projeto

## Antes de alterar

- Leia [`PRODUCT.md`](./PRODUCT.md) e a documentação relevante em [`docs/`](./docs/).
- Preserve o contrato React/Vite + Express/PostgreSQL; não troque framework, ORM
  ou banco sem decisão específica.
- Não leia, registre ou versione `.env`, credenciais ou dados de produção.
- Mantenha a separação de camadas descrita em
  [`docs/architecture.md`](./docs/architecture.md).

## Verificação

- Frontend: `Push-Location Frontend; npm run lint; npm run build; Pop-Location`.
- Backend: execute `node --check` em `index.js` e nos arquivos de `src/`.
- Mudanças na API devem atualizar a documentação e ter uma reprodução/regressão
  verificável quando possível.
- Não use warnings ou ignores amplos para esconder problemas.

## Mapa

- Produto: [`PRODUCT.md`](./PRODUCT.md)
- Arquitetura: [`docs/architecture.md`](./docs/architecture.md)
- Design: [`docs/design.md`](./docs/design.md)
- Onboarding: [`docs/onboarding.md`](./docs/onboarding.md)
- Qualidade: [`docs/quality.md`](./docs/quality.md)
- Setup e evidências: [`docs/setup.md`](./docs/setup.md)
