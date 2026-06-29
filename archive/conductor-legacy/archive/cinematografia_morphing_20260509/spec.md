# ✍️ Specification: Cinematografia e Morphing

## Overview
Implementar transições suaves e cinematográficas (morphing) na interface de utilizador (UI) para melhorar a experiência visual durante as mudanças de estado ou interações.

## Functional Requirements
1. **Transições Globais Seletivas:** Aplicar uma transição CSS (`transition: all 1s ease-in-out`) a todos os elementos visíveis para criar um efeito de morphing de 1 segundo. Isso fará com que as cores e formas se transformem suavemente ao mudar de tema, em vez de saltarem instantaneamente.
2. A transição será aplicada usando a regra universal `*`, mas otimizada para afetar todos os elementos para corresponder ao pedido do utilizador de aplicar a "all" as propriedades no contexto "Selective Morphing".

## Acceptance Criteria
- [ ] Quando o tema muda, as cores de fundo, bordas, e texto devem fazer a transição gradualmente durante 1 segundo.
- [ ] A regra CSS de transição é implementada de forma a cobrir todos os elementos relevantes (`*`).
- [ ] A performance geral da página (framerates) não deve sofrer degradação crítica durante o "morphing".