# Design e decisões

## Decisão desta adoção

O setup é uma melhoria de contexto e verificação, sem mudança de stack. Essa
opção minimiza risco e preserva os contratos existentes. O toolkit foi usado
como referência na revisão de 2026-10-31, na revisão
`21b68679679c11184f49c23168852014bf6dde8b`.

## Brainstorming

### Observações

- O produto já possui fluxos de catálogo, agendamento e confirmação.
- O frontend compila, mas o lint reportava dois avisos.
- O backend tinha checagem de sintaxe possível, porém não possuía testes
  declarados.
- A documentação estava fragmentada entre READMEs e não havia contexto na raiz.

### Assunções reversíveis

- O ambiente alvo desta entrega é desenvolvimento local em Windows/PowerShell.
- PostgreSQL local ou autorizado continua sendo o banco de desenvolvimento.
- Não foi autorizada alteração de banco, deploy, troca de dependências major ou
  instalação global.

### Entrega escolhida

Adicionar o contexto canônico e os comandos de verificação, ajustar avisos de
lint e corrigir o controller para chamar o model existente. Segurança,
acessibilidade e testes de integração completos permanecem escopos posteriores
quando houver ambiente e decisão para eles.
