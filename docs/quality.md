# Qualidade

## Comandos

| Comando | Evidência |
|---|---|
| `Push-Location Frontend; npm run lint; npm run build; Pop-Location` | Regras Oxlint e bundle de produção |
| `Push-Location Backend; node --check index.js; Get-ChildItem src -Recurse -Filter *.js \| ForEach-Object { node --check $_.FullName }; Pop-Location` | Sintaxe de todos os módulos JS |
| `Push-Location Backend; npm run db:setup; npm run db:seed; Pop-Location` | Schema e dados em PostgreSQL autorizado |
| `npm audit --omit=dev --audit-level=high` em cada aplicação | Vulnerabilidades de dependências de produção |

Não há suíte de testes automatizados, typecheck ou CI versionados no estado
observado. Não foi instalado ESLint/TypeScript apenas para satisfazer um
checklist: Oxlint e JavaScript são as ferramentas existentes.

## Baseline e critérios

Antes deste setup, o frontend compilava e o lint emitia dois avisos: import
`Menu` não usado e dependência ausente em um `useEffect`. A checagem de sintaxe
do backend passava. A meta desta entrega é remover esses avisos sem reduzir
proteções e manter build e sintaxe passando.

## Testes futuros

Prioridade: testes de controller para validação de datas/horários, concorrência
de reservas e autenticação; depois um fluxo HTTP com PostgreSQL descartável.
Mocks, geração de SQL e banco real devem ser registrados como evidências
distintas.

## Revisão

O diff desta entrega foi revisado quanto a contratos de API, configuração,
segredos, documentação e regressões de build. A revisão não substitui uma
auditoria de segurança nem valida produção.

## Segurança

O prompt de revisão de segurança do toolkit é uma referência reutilizável, mas
não foi executado como auditoria independente nesta entrega. A revisão deve ser
read-only, com escopo de diff ou baseline explícito e relatório privado.
