---
title: "Cenário Dinâmico B-Roll para Podcast Vídeo - FUTURO digital"
type: proposal
status: proposed
project: PRJ-0009
created: "2026-09-19"
relevant_decisions: []
relevant_constraints: ["CON-0016", "CON-0012", "CON-0019", "CON-0015"]
---

# Proposta OpenSpec: Cenário Dinâmico B-Roll para Podcast ("FUTURO digital")

## 1. Problema & Contexto
O projeto atual dispõe de um slide de projeção estático ([futuro-digital.html](file:///C:/Users/helder.toucas/Dev/quadro-branco-formacao/futuro-digital.html)) concebido para sala de formação. Para formatos de podcast vídeo no YouTube, streaming e captação OBS, este modelo apresenta limitações críticas:
- Falta de espaço dedicado e seguro para a janela de câmara/webcam do apresentador (PiP).
- Animações curtas em CSS rígido que provocam fadiga visual ou recomeços bruscos de ciclo.
- Ausência de dinamismo narrativo e editorial adaptável aos tópicos em discussão durante o programa.

## 2. Solução Proposta: 3 Propostas de Dinamismo Integradas
Desenvolvimento de uma nova ferramenta de broadcast cinemática (`futuro-digital-broll.html`), operável em tempo real ou como Browser Source no OBS Studio, integrando 3 propostas de dinamismo comutáveis:

### Proposta A: "Broadcast Studio (3 Polos)"
- **Estrutura**: Layout de 3 eixos diagonais com Ilha de Vidro de Tópicos (superior esquerdo), Fluxo de Ondas Generativas Contínuas em profundidade (centro), Portal Holográfico da Equipa com anéis de luz e Dock de Webcam (inferior direito/esquerdo com halo ambiente).
- **Movimento**: Malha fluída generativa sem recomeço mecânico (Simplex/Perlin noise), cadência respiratória orgânica (0.2 Hz).

### Proposta B: "Editorial Tech / Visualized Radio"
- **Inspiração Online**: *Vox (Explained/Borders)*, *The Vergecast* e *Bloomberg Originals (Visualized Radio)*.
- **Estrutura**: Grelha técnica/blueprint animada com coordenadas milimétricas, visualizador de frequências sonoras/áudio dinâmico em tempo real, telemetria de transmissão e ticker contínuo de subtópicos em rodapé.

### Proposta C: "Kinetic Concept Showcase & Brand Cycler"
- **Estrutura**: Alternância periódica automática e inteligente entre:
  1. *Expressão em Grande Plano*: Tipografia colossal cinemática apresentando conceitos-chave do episódio ("TRANSFORMAÇÃO DIGITAL", "AGILIDADE COLETIVA", etc.).
  2. *Dinamismo de Identidade de Marca*: Transição para celebração viva do emblema, ondas dinâmicas e grafismos da marca FUTURO digital.
- **Controlo de Ciclo**: Temporizador visual configurável com atalho para pausa, avanço ou fixação.

## 3. Ficheiros Impactados
- `openspec/proposals/20260919-futuro-digital-broll.md`: Esta proposta.
- `openspec/tasks.md`: Registo de tarefas e logs de execução.
- `futuro-digital-broll.html`: Novo ficheiro independente com as 3 propostas e painel de estúdio.
- `futuro-digital.html`: Preservado intacto para compatibilidade com o quadro de sala.

## 4. Não-Objetivos & Limites de Escopo
- Não alterar a lógica original de `futuro-digital.html` para evitar regressões nas sessões presenciais.
- Não introduzir dependências pesadas de backend; manter código 100% cliente (HTML5/Canvas/CSS3/Vanilla JS) para portabilidade imediata em qualquer máquina e OBS.
