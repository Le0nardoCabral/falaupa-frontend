# Design System - Triagem Inteligente UPA

## Objetivo
Padronizar UI e acelerar mudanças futuras sem quebrar consistência visual.

## Estrutura
- `tokens.css`: cores, espaçamentos, tipografia, sombras e raios.
- `components.css`: estilos base dos componentes reutilizáveis.
- `components/`: wrappers React (`DSButton`, `DSBadge`, `DSCard`, `DSStatCard`).

## Regras
- Novas cores devem virar token em `tokens.css`.
- Componentes de tela devem priorizar componentes `DS*`.
- Evitar valores mágicos de cor/espaçamento fora do Design System.

## Checklist para novas telas
1. Usar tokens para cor/tipo/espaçamento.
2. Usar `DSCard` como container principal.
3. Usar `DSButton` para ações.
4. Usar `DSBadge` para risco/status.
5. Manter contraste e legibilidade em ambiente hospitalar.
