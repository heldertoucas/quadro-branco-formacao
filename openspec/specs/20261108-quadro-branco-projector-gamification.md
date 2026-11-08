# Specification: Modo Projetado Cinematográfico e Motor de Reações Visuais aos Sons (Gamificação)

- **ID**: `20261108-quadro-branco-projector-gamification`
- **Data**: 2026-11-08
- **Status**: Em Implementação
- **Referência**: `openspec/proposals/20261108-quadro-branco-projector-gamification.md`

---

## 1. Fase 1: Blindagem e Layout do Modo Projetor

### 1.1 Regras CSS para `body.projector-mode`
```css
body.projector-mode #control-panel,
body.projector-mode #logo-area,
body.projector-mode .nav-arrow,
body.projector-mode #poll-actions,
body.projector-mode #score-win-btn,
body.projector-mode #ink-toolbar,
body.projector-mode #links-drawer,
body.projector-mode #rich-toolbar,
body.projector-mode .poll-btn-group {
    display: none !important;
}
```

### 1.2 Layout Cinematográfico
- `#poll-display` no projetor:
  - Altura expandida para `65vh`, ocupando o centro da tela sem botões `+`/`-`.
  - Letras das opções `"A"`, `"B"`, `"C"` com escala de `2.4rem` e cores de alto contraste.
- `#scoreboard` no projetor:
  - Cartões de equipa ampliados e centralizados (`font-size: 5rem` no número).
- `#timer-display` no projetor:
  - Contador central com tamanho ótico `font-size: clamp(6rem, 15vw, 12rem)`.

---

## 2. Fase 2: Motor de Reações Visuais aos Sons (Gamificação)

### 2.1 Protocolo `BroadcastChannel`
No disparador `AudioService.toggle(key)`:
```javascript
if (state.channel) {
    state.channel.postMessage({
        type: 'sfx_trigger',
        key: key,
        timestamp: Date.now()
    });
}
```

### 2.2 Reações Visuais no Projetor e no Ecrã Principal
- **Camada de Reações (`#fx-overlay`)**:
  - `div#fx-overlay`: Camada fixa em `top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 500;`.
- **Efeitos Implementados**:
  1. `triggerFloatingBadge(text, color, icon)`:
     - Disparado em `pointUp` (+1) e `pointDown` (-1).
     - Badge flutuante com sombra néon que sobe e desvanece suavemente.
  2. `triggerScreenFlash(color)`:
     - Flash de borda e vinheta translúcida suave de 400ms em `success`, `error`, `pointUp`.
  3. `triggerVictoryScreen()`:
     - Disparado em `trophy`.
     - Ativa `#sunburst.active` (360° rotativo).
     - Dispara chuva de confetis contínua durante 5 segundos (`ui.confetti()`).
     - Exibe banner triunfal dourado com troféu brilhante.
  4. `triggerScreenShake()`:
     - Micro-tremor de 150ms adicionando classe `.screen-shake` ao `#display-area` em `pointDown` ou `error`.
  5. `triggerApplauseParticles()`:
     - Emojis/ícones de palmas flutuando pelas laterais em `clap` e `palmas`.

---

## 3. Critérios de Verificação e Qualidade
1. Testar que `index.html?mode=projector` não exibe qualquer botão de controlo, input ou lixo.
2. Disparar SFX a partir do ecrã do formador e verificar receção e animação simultânea no projetor.
3. Garantir 100% de compatibilidade offline e integridade AST/Sintaxe no `node scratch/verify.js`.
