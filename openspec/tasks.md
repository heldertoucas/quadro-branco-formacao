---
tags: ["#openspec/task"]
status: "pending"
created: "2026-07-05"
updated: "2026-07-05"
domain: "system"
---

# OpenSpec Roadmap

- [ ] **Task 1: Initial Integration**
  - *Context*: Initial Setup of OpenSpec workflow directories and guidelines verification.

- [x] **Task 2: Arquitetura e Especificação do Cenário B-Roll (Propostas A, B e C)**
  - *Context*: Definição do design token system, esquemas de cor Futuro Digital, layout panorâmico 16:9 e ancoragem de webcam.
  - *Executed 2026-09-19*: Especificada arquitetura em openspec/specs/20260919-futuro-digital-broll.md e proposta em openspec/proposals/20260919-futuro-digital-broll.md cobrindo Propostas A, B e C.

- [x] **Task 3: Implementação do Módulo Dinâmico `futuro-digital-broll.html`**
  - *Context*: Criação de ficheiro autónomo com Proposta A (Broadcast Studio), Proposta B (Editorial Tech Vox/Bloomberg) e Proposta C (Kinetic Concepts & Brand Cycler) com comutador em tempo real e hotkeys de estúdio.
  - *Executed 2026-09-19*: Implementado ficheiro autónomo futuro-digital-broll.html com motor canvas generativo de ondas, 3 propostas completas de layout, barra HUD de estúdio oculta via 'H', barra de progresso do cycler na Proposta C e ancoragem de webcam com safe-area 16:9.

- [x] **Task 4: Validação Funcional e Teste de Captação**
  - *Context*: Validação de responsividade 16:9 (1080p/4K), animações generativas, transições e modos de câmara.
  - *Executed 2026-09-19*: Validado visualmente via Playwright em 1920x1080 a 60fps; confirmadas as fases de Conceito e Celebração de Marca da Proposta C, o equalizador dinâmico e ticker da Proposta B, a ilha de vidro e portal holográfico da Proposta A, e comprovada a ausência de regressão em futuro-digital.html.

