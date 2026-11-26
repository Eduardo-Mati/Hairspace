# Qualidade

## Comandos

| Comando | Evidência |
|---|---|
| `Push-Location Frontend; npm run lint; npm run build; Pop-Location` | Regras Oxlint e bundle de produção |
| `Push-Location Backend; node --check index.js; Get-ChildItem src -Recurse -Filter *.js \| ForEach-Object { node --check $_.FullName }; Pop-Location` | Sintaxe de todos os módulos JS |
| `Push-Location Backend; npm run db:reset; Pop-Location` | Recria schema e seed; o comando só aceita `DATABASE_URL` de localhost |
| `npm audit --omit=dev --audit-level=high` em cada aplicação | Vulnerabilidades de dependências de produção |

Há testes HTTP de API com `node --test` em `Backend/test/`; eles exigem
`DATABASE_URL` apontando para localhost e para o banco descartável
`hairspace_test`. Não há typecheck ou CI versionados. Não foi instalado
ESLint/TypeScript apenas para satisfazer um checklist: Oxlint e JavaScript são
as ferramentas existentes.

## Baseline e critérios

Antes deste setup, o frontend compilava e o lint emitia dois avisos: import
`Menu` não usado e dependência ausente em um `useEffect`. A checagem de sintaxe
do backend passava. A meta desta entrega é remover esses avisos sem reduzir
proteções e manter build e sintaxe passando.

## Testes futuros

Expandir a suíte para cobrir a validação de datas/horários, concorrência de
reservas e demais fluxos públicos. Mocks, geração de SQL e banco real devem ser
registrados como evidências distintas.

## Revisão

O diff desta entrega foi revisado quanto a contratos de API, configuração,
segredos, documentação e regressões de build. A revisão não substitui uma
auditoria de segurança nem valida produção.

## Segurança

O prompt de revisão de segurança do toolkit é uma referência reutilizável, mas
não foi executado como auditoria independente nesta entrega. A revisão deve ser
read-only, com escopo de diff ou baseline explícito e relatório privado.
