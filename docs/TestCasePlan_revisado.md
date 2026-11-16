# Hairspace — Plano e Casos de Teste

**Versão:** 1.1  
**Data:** 2026-11-16  
**Escopo:** Frontend React/Vite, API Express e PostgreSQL local de desenvolvimento.

## 1. Objetivo

Validar os fluxos críticos observados no produto: consulta de catálogo, disponibilidade de horários, criação e consulta de agendamentos e autenticação do barbeiro. O plano também cobre validações de entrada, autorização e os checks estáticos já adotados pelo projeto.

## 2. Pré-condições

1. Node.js e npm instalados.
2. PostgreSQL local ou autorizado disponível.
3. Arquivo `Backend/.env` criado a partir de `Backend/.env.example`, sem versionar o arquivo.
4. Banco preparado:

   ```powershell
   Push-Location Backend
   npm install
   npm run db:setup
   npm run db:seed
   Pop-Location
   ```

5. Backend iniciado com `Push-Location Backend; npm run dev`.
6. Frontend iniciado com `Push-Location Frontend; npm run dev`.

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
| TC-005 | Navegação do frontend | Abrir home e acessar Serviços, Cortes, Produtos e Agendamento | Cada rota renderiza sem erro e permite voltar à home. |

### 4.2 Disponibilidade e criação de agendamento

| ID | Caso | Passos | Resultado esperado |
|---|---|---|---|
| TC-006 | Horários disponíveis | `GET /bookings/available?date=AAAA-MM-DD` para um dia útil futuro | HTTP 200 com `date`, `available` e `taken`, conforme o contrato da API. |
| TC-007 | Data ausente | `GET /bookings/available` | HTTP 400 com mensagem indicando data obrigatória ou formato inválido. |
| TC-008 | Agendamento válido | `POST /bookings` com nome, telefone, data futura, horário válido e local válido | HTTP 201; reserva `pending`, `id` e `confirmation_code` presentes. |
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
| TC-020 | Login válido | `POST /auth/login` com credenciais do seed local | HTTP 200; token JWT e dados não sensíveis do usuário. |
| TC-021 | Login inválido | Usar senha errada ou e-mail inexistente | HTTP 401; mensagem genérica, sem indicar qual credencial falhou. |
| TC-022 | Corpo incompleto no login | Omitir e-mail ou senha | HTTP 400. |
| TC-023 | Listagem sem token | `GET /bookings` sem `Authorization` | HTTP 401. |
| TC-024 | Listagem com token inválido | Enviar Bearer token inválido em `GET /bookings` | HTTP 401; nenhum agendamento é retornado. |
| TC-025 | Alteração autorizada | `PATCH /bookings/:id/status` com JWT válido e status permitido | HTTP 200; status atualizado e persistido no banco. |
| TC-026 | Status inválido | Enviar status diferente de `pending`, `confirmed` ou `rejected` | HTTP 400; status anterior permanece inalterado no banco. |

**Observação sobre autorização:** se o sistema possuir perfis ou níveis de permissão diferentes, acrescentar um caso específico para verificar que um usuário autenticado, mas sem permissão administrativa, não consegue listar ou alterar agendamentos. Não presuma que esse perfil existe sem confirmar a implementação.

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
| Login do barbeiro | TC-020 a TC-022 |
| Rotas administrativas protegidas | TC-023 a TC-026 |
| Qualidade de build e dependências | Checks automatizados |

## 7. Registro de execução

Para cada execução, registrar data, ambiente, commit, executor, caso, status, evidência e observação. Não registrar tokens, senhas, `DATABASE_URL` ou dados reais de clientes.

| Data | Ambiente/commit | Casos | Resultado | Evidência | Observações |
|---|---|---|---|---|---|
| 2026-11-16 | Desenvolvimento local | Checks estáticos e health check | Passou | Lint, build, sintaxe, audit e `/health` | Fluxos com PostgreSQL e browser ainda precisam ser executados. |

**Status sugeridos:** Não executado, Aprovado, Reprovado, Bloqueado ou Não aplicável.

## 8. Pendências

- Automatizar os casos de API e controllers.
- Executar os casos de integração usando banco de desenvolvimento descartável.
- Executar a validação do fluxo principal no navegador.
- Testar concorrência no TC-015 e confirmar a proteção contra duplicidade no banco.
- Confirmar se existem perfis/permissões distintos e, se existirem, adicionar testes de acesso negado.
- Adicionar os resultados reais de TC-001 a TC-026 neste documento após a execução completa.
