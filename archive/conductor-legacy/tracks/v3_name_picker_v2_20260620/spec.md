# Specification: Random Name Picker v2

## Overview

Avaliar 3 abordagens de animação para substituir o atual `features.picker` (rAF + DOM reel com estado "preso"). O objetivo é um seletor aleatório de nomes com animação visualmente apelativa, sem os bugs de composição do current implementation.

## Current Implementation Problems

- `features.js:203-207` — clonagem do reel para limpar GPU state (workaround frágil)
- `features.js:220` — `reel.getAnimations().forEach(a => a.cancel())` necessário porque animações anteriores ficam "presas"
- `features.js:236-255` — `requestAnimationFrame` manual com `translateY`, sem composição otimizada pelo browser
- Easing quintic-out ok, mas a abordagem geral é propensa a glitches

## Approaches

### A — slot-text (CDN, zero dep)

| Aspect | Detail |
|--------|--------|
| Library | `slot-text` v0.3.1 (MIT, 3KB gzip) |
| Load | CDN via jsDelivr (`<script type="importmap">`) |
| Animation | Per-character vertical roll — cada letra "cai" no lugar |
| Integration | `slotText(el, initialText)` → `label.set("Winner")` |
| Pros | Interrupt handling nativo, cleanup automático, bundle tiny |
| Cons | Per-character quebra kerning/ligaduras (irrelevante para nomes) |
| Mockup | `conductor/docs/mockup_name_slottext.html` |

### B — Web Animations API (zero dep)

| Aspect | Detail |
|--------|--------|
| Library | None — `element.animate()` nativo |
| Load | N/A |
| Animation | DOM reel com keyframes CSS-like via JS. Browser gere composição. |
| Integration | `reel.animate(keyframes, { duration, easing })` |
| Pros | Zero deps, browser otimiza o loop, sem estado "preso" |
| Cons | ~50 linhas de adapter code, API verbosa |
| Mockup | `conductor/docs/mockup_name_reel_waapi.html` |

### C — Canvas Wheel of Fortune (zero dep)

| Aspect | Detail |
|--------|--------|
| Library | None — Canvas 2D API |
| Load | N/A |
| Animation | Roda circular com slices coloridos, rotação com física de desaceleração |
| Integration | `canvas` + `requestAnimationFrame` para deceleração |
| Pros | UX radicalmente diferente do slot, visual impactante |
| Cons | Mais código, texto em canvas, acessibilidade menor |
| Mockup | `conductor/docs/mockup_name_wheel.html` |
