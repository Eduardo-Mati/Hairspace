# Registro de uso de IA

| Data | Ferramenta | Pedido | Gerado | Correções ou validações do usuário |
|---|---|---|---|---|
| 2026-11-26 | Copilot SDK em VS Code | Higienizar o repositório para o MVP multi-barbearias (Etapa 0). | Retirada de `Backend/node_modules` do índice, remoção dos arquivos Register vazios e verificações de higiene. | Lint, build, sintaxe e worktree limpo validados; usuário aprovou seguir para a Etapa 1 sem correções solicitadas. |
| 2026-11-26 | Copilot SDK em VS Code | Preparar banco multi-barbearias (Etapa 1). | Schema, seed fictício com cinco barbearias e `db:reset` protegido para localhost; instruções de banco atualizadas. | Reset local, bloqueio de URL não local, hashes bcrypt, unicidade de reserva, isolamento do serviço e CHECK de cor validados; revisão/aceite do usuário pendente. |
| 2026-11-26 | Copilot SDK em VS Code | Implementar API multi-barbearias (Etapa 2). | Rotas públicas e administrativas, autorização JWT por proprietário, validação de reservas e documentação de endpoints. | Sintaxe e testes HTTP de autorização, isolamento, reserva e validação executados; revisão/aceite do usuário pendente. |
| 2026-11-26 | Copilot SDK em VS Code | Implementar mapa e fluxo de reserva com tema por barbearia (Etapa 3). | Mapa Leaflet/OSM, tela de serviços por barbearia, agendamento por rota e confirmação com os dados da reserva. | Fluxo completo exercitado no navegador até a confirmação; reserva de teste local removida; lint, build e sintaxe do backend verificados. Revisão/aceite do usuário pendente. |
