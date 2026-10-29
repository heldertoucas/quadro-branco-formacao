---
title: "Especificação Técnica - Cenário Dinâmico B-Roll FUTURO digital"
type: spec
status: proposed
project: PRJ-0009
created: "2026-09-19"
---

# Especificação: Cenário Dinâmico B-Roll para Edição de Vídeo (futuro-digital-broll.html)

## 1. Design Tokens & Identidade
- **Paleta Futuro Digital**:
  - Laranja Quente Solar: `#FFB743`
  - Vermelho-Laranja Vibrante: `#FF4D00`
  - Azul Elétrico Municipal: `#5271FF`
  - Verde Primavera Inovação: `#35B729`
  - Roxo Criativo: `#933EC5`
- **Modos de Iluminação / Fundo**:
  - `midnight`: Fundo ardósia profundo `#07090E` a `#0E131F`, elementos bioluminescentes (otimizado para contraste e edição de vídeo).
  - `solar`: Fundo branco suave com gradientes quentes de Lisboa.
  - `clean`: Fundo minimalista de estúdio `#0B1120`.

## 2. Especificação dos Modos de Gravação B-Roll (16:9 4K)

### Proposta A: "Broadcast Card (Title & Team Bumper)"
- **Layout**:
  - Ilha flutuante de vidro fosco (`backdrop-filter: blur(16px)`) com o logo oficial SVG e cartão de tópico/título.
  - Portal holográfico com foto da equipa e anéis de calibração em rotação contínua.
  - Ideal para cortes de abertura, separadores de capítulos ou bumpers de episódio no editor de vídeo.

### Proposta B: "Editorial Motion / Visualized Radio" (Inspirado em Vox & Bloomberg Originals)
- **Layout**:
  - Fundo com grelha técnica de alta precisão (coordenadas geográficas de Lisboa e timer de estúdio).
  - Equalizador de espectro de frequência dinâmico com 28 barras animadas.
  - Ticker horizontal contínuo em rodapé (*infinit loop*) com conceitos de inovação cívica e digital.

### Proposta C: "Kinetic Concept Showcase & Brand Cycler"
- **Dinamismo Alternado**:
  - **Fase 1: Expressão em Grande Plano**: Tipografia colossal cinemática com realce cromático de conceitos pedagógicos.
  - **Fase 2: Celebração da Marca**: Transição fluida para o escudo e logótipo vetorial *FUTURO digital*, acompanhado de aura energética e chips temáticos.
  - Barra de progresso subtil no ecrã indicando a contagem decrescente para a próxima transição, com pausa no `Space`.

### Proposta D: "Fundo Animado Puro (Asset Motion Background - Sem Texto)"
- **Layout**:
  - Camada de vídeo 100% limpa (sem texto, cartões ou logótipos).
  - Mantém o motor generativo de ondas fluídas HTML5 Canvas e partículas flutuantes em movimento contínuo.
  - Concebido especificamente como ativo de background para os editores de vídeo adicionarem texto, legendas ou chromakey por cima no Premiere, DaVinci ou Final Cut.

## 3. Controlos de Captura & Modo Limpo (Hotkeys & URL Params)
- Teclas `1`, `2`, `3`, `4` ou `A`, `B`, `C`, `D`: Alternar imediatamente entre os modos B-Roll.
- Tecla `H`: Ocultar / mostrar HUD e botões (para gravação 100% limpa sem elementos de interface).
- Tecla `P`: Alternar tema cromático (Midnight / Solar / Clean).
- Tecla `Space`: Pausar / retomar ciclo de animações.
- Tecla `F`: Ecrã inteiro (Fullscreen 16:9).
- **Parâmetros URL para Captura**: `?proposal=D&clean=true&theme=midnight`
