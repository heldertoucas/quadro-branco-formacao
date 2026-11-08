# Proposal: Modo Projetado Cinematográfico e Motor de Reações Visuais aos Sons (Gamificação)

- **ID**: `20261108-quadro-branco-projector-gamification`
- **Data**: 2026-11-08
- **Autor**: Antigravity (Pair Programming com Utilizador)
- **Status**: Proposto / Em Revisão pelo AI Council
- **Projeto**: `PRJ-0009` (Quadro Branco - Ferramentas de Apoio à Formação)
- **Alvo**: `index.html` (Aplicação Web Autónoma Zero-Build)

---

## 1. Contexto e Motivação
O Quadro Branco dispõe de um modo de projeção dedicado (`index.html?mode=projector`), aberto numa segunda janela/ecrã para exibição aos alunos na sala ou em sessão remota.
Contudo, foram identificadas fragilidades de isolamento e interatividade:
1. **Falta de blindagem visual no projetor**: Elementos de controlo do formador (como os botões de apurar vencedor/fechar no Poll e o botão de troféu no Placar) podem aparecer indevidamente na tela dos formandos.
2. **Desconexão visual de gamificação e áudio**: Quando o formador dispara efeitos sonoros (SFX como `pointUp`, `pointDown`, `trophy`, `drum`, `clap`), o projetor permanece estático, sem qualquer indicação visual ou celebração para os alunos.
3. **Escala e legibilidade de sala**: A escala de apresentação no projetor precisa de ser otimizada para visibilidade à distância (16:9, sem barras de rolagem, sem poluição de interface).

---

## 2. Objetivos e Âmbito
- **Fase 1: Blindagem Estrita do Modo Projetor**
  - Ocultar 100% das ferramentas do formador no projetor: `#poll-actions`, `#score-win-btn`, `#control-panel`, `#logo-area`, `.nav-arrow`, `#ink-toolbar`, `#links-drawer`, `#rich-toolbar`.
  - Projeção de tipografia ótica gigante para texto, poll, placar e temporizador.
- **Fase 2: Motor de Reações Visuais aos Sons (Gamificação)**
  - Criação do protocolo de sincronização via `BroadcastChannel` para gatilhos sonoros (`type: 'sfx_trigger'`).
  - Implementação de micro-interações e ecrãs de celebração no projetor:
    - `trophy`: Ecrã de vitória com rotação de sunburst 360°, confetis torrenciais e banner luminoso de campeão.
    - `pointUp`: Partícula flutuante `+1` em verde néon com curva de subida e desvanecimento (*float & fade*).
    - `pointDown`: Partícula flutuante `-1` em vermelho com ligeiro micro-tremor de ecrã (*screen shake* de 150ms).
    - `success` / `error`: Flashes perimétricos suaves nas molduras.
    - `drum`: Vinheta de suspense pulsante.
    - `clap` / `palmas`: Chuva de reações flutuantes pelas laterais inferiores.
- **Zero Dependências Externas**: Código 100% puro Vanilla JS/CSS/Canvas inline no `index.html`, compatível com ambientes offline e restrições CML.

---

## 3. Não-Objetivos
- Não alterar a lógica interna de cálculo de pontos do placar ou contagem do poll.
- Não unificar com `proj-multifile-v2/` (manter `index.html` estritamente autónomo).
- Não redesenhar o estilo visual original de `Sorteio / Picker` ou `Dados / Dice`.
