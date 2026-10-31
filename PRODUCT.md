# Hairspace

## Produto

Hairspace é uma aplicação web para uma barbearia. O cliente consulta serviços,
portfólio e produtos, escolhe data, horário e local de atendimento e recebe uma
confirmação do agendamento. O barbeiro possui autenticação para consultar e
alterar o status das reservas.

## Fluxos observados

1. Navegar pela home e acessar serviços, portfólio ou produtos.
2. Selecionar um horário disponível e enviar nome, telefone, data, horário e
   local.
3. Consultar a confirmação usando o identificador e o código retornados pela
   API.
4. Autenticar o barbeiro em `/login` para as rotas administrativas da API.

## Contratos e restrições

- Frontend: React 19, Vite e React Router.
- Backend: Node.js ESM, Express e PostgreSQL.
- O banco impede reservas duplicadas para a mesma data e horário.
- A configuração local usa variáveis de ambiente; segredos não entram no Git.
- Não há requisito observado para troca de framework, ORM, banco, deploy ou
  novo provedor.

## Critérios de aceite deste setup

- Um novo colaborador encontra os comandos de instalação e verificação.
- O contexto canônico não promete funcionalidades que ainda não existem.
- Lint, build e checagem de sintaxe são reproduzíveis sem conectar em
  produção.
- O setup preserva mudanças locais e distingue evidência validada de itens
  pendentes.
