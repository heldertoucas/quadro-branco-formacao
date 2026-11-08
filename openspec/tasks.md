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

- [x] **Task 5: Hardening Forense de Segurança, Resiliência Offline, UX e Persistência Local no Quadro Branco**
  - *Context*: Implementação cirúrgica no `index.html` mitigando XSS, reparando corrupção física do ficheiro e SVGs de votação, persistência resiliente em LocalStorage com reset explícito, recuperação de buffer no canvas de tinta, e polimento de UX (Modo Zen, duplo clique em limpar, resiliência offline de áudio). Proposta: `openspec/proposals/20261108-quadro-branco-hardening-e-ux.md`. Especificação: `openspec/specs/20261108-quadro-branco-hardening-e-ux.md`. Executado e validado em 2026-11-08 com passagem em 15/15 verificações de integridade estática e funcional. Refinamentos adicionais concluídos: eliminação automática do texto de boas-vindas ("Olá! Vamos começar?") ao selecionar opções/ferramentas; layout do Poll com opções 'A' e 'B' centradas abaixo de cada coluna; eliminação do corte na borda superior da caixa de seleção dos menus e no efeito de glow máximo do menu dos sons; restauração universal do botão Slide (`#btn-create-slide`); e barra lateral vertical de caneta com submenu de formas geométricas (retângulo, círculo, linha, seta e caneta livre).

- [x] **Task 6: Modo Projetado Cinematográfico e Motor de Reações Visuais aos Sons (Gamificação)**
  - *Context*: Implementação em 2 fases. Fase 1: Blindagem visual total do modo projetor (ocultação estrita de todos os controlos de formador, botões de poll/score e calibração de escala 16:9). Fase 2: Motor de Reações Visuais aos Sons via `BroadcastChannel` (`sfx_trigger`), com ecrã de celebração triunfal de vitória (sunburst 360°, confetis, troféu dourado), partículas flutuantes dinâmicas `+1`/`-1`, flashes de moldura e chuva de aplausos. Proposta: `openspec/proposals/20261108-quadro-branco-projector-gamification.md`. Especificação: `openspec/specs/20261108-quadro-branco-projector-gamification.md`. Executado e validado em 2026-11-08 com passagem em todos os testes estáticos e dinâmicos. Atualização cinematográfica do apuramento de Poll projetado: sincronização bidirecional de vencedores (`poll_winner`), spotlight teatral com esmorecimento de opções não-vencedoras, barras esmeralda neon pulsantes, troféu 4.2rem animado sobre a coluna vencedora, canhões duplos de confetis de alta intensidade e cartão de vitória em vidro escuro calibrado para auditórios.


