# Implementation Plan: Sistema de Votação (Polls)

## Phase 1: Setup & UI Scaffold
- [x] Task: Adicionar botão "Votação" no painel de controlo (toolbar).
- [x] Task: Criar modal de configuração para receber o número ou nomes das opções (dinâmico).
- [x] Task: Estruturar contentor HTML e classes CSS base para o Gráfico de Barras Verticais.

## Phase 2: Logic Implementation
- [x] Task: Implementar lógica de estado para manter o número de votos de cada opção.
- [x] Task: Desenvolver função de incremento/decremento de votos (+1/-1) via Rato.
- [x] Task: Mapear eventos `keydown` para registar votos usando os números do teclado.

## Phase 3: Visuals & Feedback
- [x] Task: Implementar função matemática que recalcula a altura das barras (0% a 100%) dinamicamente.
- [x] Task: Adicionar animações CSS fluidas para o crescimento das barras.
- [x] Task: Implementar botão "Apurar", destacando a opção vencedora com recurso a Confetti e som.

## Phase 4: Refinement
- [ ] Task: Testar responsividade em ecrãs móveis (evitar sobreposições).
- [ ] Task: Garantir que as cores das barras se adaptam aos temas (Neon, Oceano, etc.).