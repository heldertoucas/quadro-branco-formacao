# Specification: Melhorias Quadro Branco v2.7

## Overview
Esta track visa implementar melhorias críticas na infraestrutura de assets, acessibilidade e interface do Quadro Branco.

## Functional Requirements
- **Internalização de JS:** Baixar e embutir os scripts `qrious.min.js` e `confetti.browser.min.js` diretamente no HTML.
- **Acessibilidade de Modais:**
    - Garantir que o foco fica preso dentro do modal aberto (Focus Trap).
    - Fechar modais ao premir a tecla 'Escape'.
- **UX Modo Zen:**
    - Ajustar CSS para evitar que o painel de controlo se sobreponha a outros elementos (como o placar) em ecrãs pequenos.

## Acceptance Criteria
- QR Code e Confetti funcionam sem ligação à internet.
- Navegação por Tab num modal não sai do modal.
- Tecla 'Esc' fecha qualquer modal aberto.
- Modo Zen não apresenta sobreposição visual em resoluções < 768px.