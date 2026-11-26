# Hairspace — Plano e Casos de Teste

**Versão:** 1.2
**Data:** 2026-11-26
**Escopo:** Frontend React/Vite, API Express e PostgreSQL local multi-barbearias.

## 1. Objetivo

Validar os fluxos críticos observados no produto: mapa e catálogo por barbearia, disponibilidade de horários, criação e consulta de agendamentos e autenticação administrativa. O plano também cobre validações de entrada, isolamento entre barbearias, autorização e os checks automatizados do projeto.

## 2. Pré-condições

1. Node.js e npm instalados.
2. PostgreSQL local ou autorizado disponível.
3. Arquivo `Backend/.env` criado a partir de `Backend/.env.example`, sem versionar o arquivo.
4. Banco de desenvolvimento preparado:

   ```powershell
   Push-Location Backend
   npm install
   npm run db:setup
   npm run db:seed
   Pop-Location
   ```

5. Backend iniciado com `Push-Location Backend; npm run dev`.
6. Frontend iniciado com `Push-Location Frontend; npm run dev`.

Para executar `npm test`, crie um banco UTF-8 local separado chamado
`hairspace_test` e defina `DATABASE_URL` somente na sessão do terminal. A suíte
recusa qualquer host fora de localhost ou nome de banco diferente. Antes de
usar `npm run db:reset`, confirme tanto o host quanto o nome `hairspace_test`;
nunca use esse comando contra produção ou contra o banco de desenvolvimento.

O usuário criado pelo seed deve ser usado somente em desenvolvimento. Não reutilize credenciais reais em testes.

## 3. Critérios de entrada e saída

### Entrada

- Dependências instaladas sem erro.
- Banco de desenvolvimento acessível.
- API respondendo em `GET /health` com `{ "status": "ok" }`.

### Saída

- Todos os casos críticos foram executados e seus resultados registrados.
- Nenhum teste deixa dados reais, segredos ou processos persistentes.
- Lint, build, sintaxe e auditoria de dependências foram executados; eventuais falhas foram registradas e avaliadas.
- Falhas são registradas com caso, evidência, ambiente e passos para reprodução.

> Um caso só deve ser marcado como aprovado depois de sua execução. A existência deste plano não significa que todos os casos já foram executados.

## 4. Casos de teste

### 4.1 Saúde, catálogo e navegação

| ID | Caso | Passos | Resultado esperado |
|---|---|---|---|
| TC-001 | Health check | `GET /health` | HTTP 200 e status `ok`. |
| TC-002 | Listar serviços | `GET /services` | HTTP 200; somente serviços ativos são retornados. |
| TC-003 | Listar portfólio | `GET /portfolio` | HTTP 200; resposta é uma lista de fotos. |
| TC-004 | Listar produtos | `GET /products` | HTTP 200; somente produtos ativos são retornados. |
| TC-005 | Navegação do frontend | Abrir o mapa, selecionar uma barbearia e um serviço; acessar portfólio ou produtos | Cada tela renderiza sem erro e permite voltar ao mapa. |

### 4.2 Disponibilidade e criação de agendamento

| ID | Caso | Passos | Resultado esperado |
|---|---|---|---|
| TC-006 | Horários disponíveis | `GET /bookings/available?barbershop_id=:id&date=AAAA-MM-DD` para um dia útil futuro | HTTP 200 com `date`, `slots`, `available` e `taken` da barbearia informada. |
| TC-007 | Data ausente | `GET /bookings/available` | HTTP 400 com mensagem indicando data obrigatória ou formato inválido. |
| TC-008 | Agendamento válido | `POST /bookings` com nome, telefone, data futura, horário, local, `barbershop_id` e `service_id` válidos | HTTP 201; reserva `pending` associada à barbearia e serviço informados. |
| TC-009 | Campos obrigatórios | Executar uma tentativa por vez, omitindo individualmente cada campo obrigatório do corpo de criação | Cada tentativa retorna HTTP 400; nenhuma reserva é criada. |
| TC-010 | Data inválida | Enviar `2026-02-31` ou formato diferente de `AAAA-MM-DD` | HTTP 400; nenhuma reserva nem registro relacionado é criado. |
| TC-011 | Data passada | Enviar uma data anterior ao dia atual | HTTP 400; nenhuma reserva é criada. |
| TC-012 | Domingo | Enviar um domingo futuro | HTTP 400; nenhuma reserva é criada. |
| TC-013 | Local inválido | Enviar local diferente de `barbershop` ou `home` | HTTP 400; nenhuma reserva é criada. |
| TC-014 | Horário inválido | Enviar horário fora da lista de slots | HTTP 400; nenhuma reserva é criada. |
| TC-015 | Horário duplicado, inclusive concorrente | Criar duas reservas para a mesma data e horário. Repetir o cenário enviando as duas requisições simultaneamente | Em execução sequencial, a primeira retorna HTTP 201 e a segunda HTTP 409. Em execução simultânea, somente uma reserva é persistida; a outra requisição é rejeitada conforme o contrato (preferencialmente HTTP 409). Não pode haver duplicidade no banco. |
| TC-016 | Espaços no nome/telefone | Enviar valores com espaços nas extremidades | Valores são normalizados conforme as regras do projeto; a resposta e o registro persistido refletem a normalização. |

### 4.3 Confirmação

| ID | Caso | Passos | Resultado esperado |
|---|---|---|---|
| TC-017 | Consultar reserva com código | Usar `GET /bookings/:id?code=...` com dados retornados na criação | HTTP 200 e dados da reserva autorizados para consulta. |
| TC-018 | Código ausente/incorreto | Consultar o mesmo ID sem código ou com código errado | HTTP 404; dados da reserva não são expostos. |
| TC-019 | Tela de confirmação | Concluir agendamento pelo frontend | Tela exibe nome, data, horário, local e status correto. |

### 4.4 Autenticação e autorização

| ID | Caso | Passos | Resultado esperado |
|---|---|---|---|
| TC-020 | Login válido | `POST /auth/login` com credenciais de um admin local | HTTP 200; token JWT e dados não sensíveis do usuário, incluindo `role=admin`. |
| TC-021 | Login inválido | Usar senha errada ou e-mail inexistente | HTTP 401; mensagem genérica, sem indicar qual credencial falhou. |
| TC-022 | Corpo incompleto no login | Omitir e-mail ou senha | HTTP 400. |
| TC-023 | Rotas admin sem token | Chamar `GET /admin/barbershop`, `GET /admin/bookings?date=...`, `PATCH /admin/barbershop` e `PATCH /admin/bookings/:id/status` sem `Authorization` | Todas retornam HTTP 401; nenhuma alteração ocorre. |
| TC-024 | Token inválido | Enviar Bearer token inválido a uma rota de admin | HTTP 401; nenhum dado administrativo é retornado. |
| TC-025 | Papel sem permissão | Autenticar usuário com `role=client` e chamar rotas admin de leitura e alteração | HTTP 403; os dados permanecem inalterados. |
| TC-026 | Isolamento entre barbearias | Admin A lista reservas na data de uma reserva de B e tenta alterar a reserva de B | A listagem de A não contém reservas de B; a alteração da reserva de B retorna HTTP 404. |
| TC-027 | Cor inválida | Admin envia cor fora do formato `#RRGGBB` em `PATCH /admin/barbershop` | HTTP 400; nome e cores persistidos não mudam. |
| TC-028 | Serviço de outra barbearia | Criar reserva com `barbershop_id` de A e `service_id` de B | HTTP 400; nenhuma reserva é inserida. |
| TC-029 | Alteração autorizada de status | Admin altera uma reserva da própria barbearia por `PATCH /admin/bookings/:id/status` | HTTP 200; status atualizado e persistido no banco. |
| TC-030 | Reserva multi-barbearia e duplicidade | Criar reserva válida com barbearia/serviço correspondentes e repetir a mesma data e horário | Primeira chamada HTTP 201; repetição HTTP 409; a reserva mantém a associação correta. |

## 5. Checks automatizados

Executar a partir da raiz:

```powershell
Push-Location Frontend
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
Pop-Location

Push-Location Backend
node --check index.js
Get-ChildItem src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
npm test
npm audit --omit=dev --audit-level=high
Pop-Location
```

Os comandos acima devem ser conferidos com os scripts e a estrutura reais dos diretórios. Se algum script ou caminho não existir, registrar o ajuste necessário em vez de marcar o check como aprovado.

## 6. Matriz de rastreabilidade

| Requisito observado | Casos |
|---|---|
| Catálogo público | TC-002 a TC-005 |
| Disponibilidade de agenda | TC-006 e TC-007 |
| Criação e regras de reserva | TC-008 a TC-016 |
| Confirmação protegida por código | TC-017 a TC-019 |
| Login administrativo | TC-020 a TC-022 |
| Rotas administrativas e papéis | TC-023 a TC-026 |
| Validação multi-barbearias | TC-027 a TC-030 |
| Qualidade de build e dependências | Checks automatizados |

## 7. Registro de execução

Para cada execução, registrar data, ambiente, commit, executor, caso, status, evidência e observação. Não registrar tokens, senhas, `DATABASE_URL` ou dados reais de clientes.

| Data | Ambiente/commit | Casos | Resultado | Evidência | Observações |
|---|---|---|---|---|---|
| 2026-11-16 | Desenvolvimento local | Checks estáticos e health check | Passou | Lint, build, sintaxe, audit e `/health` | Registro histórico anterior à suíte automatizada. |
| 2026-11-26 | Windows, commit `bfe2aa4` | TC-023 a TC-030 e checks automatizados | Aprovado | `npm test`: 6/6; `db:reset`; lint, build, `node --check` e audits sem vulnerabilidades altas | PostgreSQL 17 temporário, local e UTF-8; cluster e dados descartáveis removidos. Teste detectou e corrigiu resposta desatualizada no PATCH de status. |

**Status sugeridos:** Não executado, Aprovado, Reprovado, Bloqueado ou Não aplicável.

## 8. Pendências

- Expandir a automação para os casos públicos de datas/horários e concorrência.
- Executar os casos manuais restantes usando banco de teste descartável.
- Executar a validação do fluxo principal no navegador.
- Testar concorrência no TC-015 e confirmar a proteção contra duplicidade no banco.
- Registrar os resultados de casos ainda não cobertos após execução.
