# UI Consistency Guide - Triagem Inteligente UPA

## 1. Principios visuais
- Leitura em menos de 1 segundo para informacoes criticas.
- Tipografia funcional, contraste alto e baixo ruido visual.
- Cores fortes reservadas para risco clinico e alertas.

## 2. Hierarquia
- `PageHeader` para contexto da tela.
- `StatCard` para KPI operacional.
- `QueueTable` para lista acionavel em tempo real.
- `AlertBanner` para excecoes e avisos clinicos.

## 3. Cores de risco
- Vermelho: emergencia.
- Laranja: muito urgente.
- Amarelo: urgente.
- Verde: pouco urgente.
- Azul: nao urgente.

## 4. Interacao
- Acoes criticas sempre com confirmacao (`ConfirmModal`).
- Feedback imediato de acao (`Toast`).
- Estado de desconexao visivel (`OfflineState`).

## 5. Responsividade
- Desktop: layout principal operacional.
- Tablet: colunas reduzidas, mantendo acao rapida.
- Mobile: menu colapsado e tabelas com rolagem horizontal.

## 6. Acessibilidade
- Contraste de texto acima de niveis minimos WCAG.
- Estados nao dependem apenas de cor (texto + badge + borda).
- Foco visivel nos campos e botoes.
