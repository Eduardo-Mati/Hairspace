# Setup e evidências

## Fonte e contexto

- Data da revisão: 2026-10-31.
- Toolkit consultado: `vibe-coding-toolkit`, revisão
  `21b68679679c11184f49c23168852014bf6dde8b`.
- Projeto: Hairspace; cliente principal: VS Code com Copilot SDK.
- Stack observada: React/Vite + Node/Express + PostgreSQL.
- Sistema de execução desta sessão: Windows/PowerShell.
- O recurso Superpowers não estava disponível; o protocolo de brainstorming e
  design foi aplicado diretamente.

## Matriz de cobertura

| Componente | Estado | Decisão e evidência |
|---|---|---|
| Contexto compartilhado | Validado | `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md` e docs canônicos criados |
| Brainstorming/design | Validado | Decisões e assunções registradas em `docs/design.md` |
| RTK | Inaplicável | Nenhum hook/instalação oficial disponível nesta sessão; comandos mantêm saída normal |
| Context7 | Não executado | Nenhum servidor Context7 carregado; consultar documentação oficial quando uma API mudar |
| Graphify | Não adotado | Não há necessidade concreta de exportar o grafo; segredos e dependências não devem ser enviados |
| Vercel/Next.js | Inaplicável | O frontend é Vite; não será migrado para Next.js |
| PostgreSQL | Reutilizado | Banco já é parte do produto; guia foi tratado como referência, sem migration |
| GitHub CI/gh-fix-ci | Pendente | Não há workflow observado nem execução autorizada de conta |
| differential-review | Pendente | A revisão desta entrega foi manual e read-only |
| shadcn/ui | Inaplicável | O projeto usa CSS e componentes próprios; não adicionar outra biblioteca |
| Sentry MCP | Pendente/inaplicável | Não há serviço ou organização autorizada |
| Browser/DevTools | Pendente | Validação visual completa requer servidor local e ferramenta de navegador |
| Memória externa/Obsidian | Inaplicável | A documentação versionada é suficiente; nenhum vault deve ser criado |
| Harness2 nativo | Configurado | Comandos reproduzíveis e critérios registrados; comparação de candidatos não se aplica sem falha observada |
| Subagentes | Não necessários | O escopo coube em uma execução direta; não foi criado roster fixo |
| Security review | Pendente | Prompt reutilizável referenciado em `docs/quality.md`; auditoria independente requer escopo/relatório próprio |

## Checks

| Item | Estado | Evidência |
|---|---|---|
| Frontend lint | Validado após mudança | `npm run lint` |
| Frontend build | Validado | `npm run build` |
| Backend sintaxe | Validado | `node --check` em `index.js` e `src/` |
| Banco/schema | Não executado | Requer PostgreSQL autorizado e dados locais |
| Fluxo browser | Não executado | Requer preflight de navegador |
| Auditoria de dependências | Validada | `npm audit --omit=dev --audit-level=high` passou em Frontend e Backend após atualização transitiva compatível |
| CI | Não executado | Workflow não observado |

## Manutenção

Repita os checks após mudanças em API, telas, schema ou dependências. Atualize
este arquivo junto com comandos, integrações e decisões. Não copie credenciais,
logs pessoais ou caminhos locais para a documentação.

## Pendências

1. Adicionar testes automatizados de API e controllers.
2. Executar uma revisão de segurança com relatório privado e escopo explícito.
3. Definir CI e uma validação browser quando houver autorização e ambiente
   descartável.
