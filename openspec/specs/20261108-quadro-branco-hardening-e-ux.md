---
title: "Quadro Branco: Especificação Técnica de Hardening, Resiliência Offline, UX e Persistência Local"
type: spec
status: proposed
project: PRJ-0009
created: "2026-11-08"
proposal: "openspec/proposals/20261108-quadro-branco-hardening-e-ux.md"
relevant_decisions: ["DEC-0023"]
relevant_constraints: ["CON-0009", "CON-0012", "CON-0015", "CON-0016"]
---

# Especificação Técnica: Hardening, Resiliência Offline, UX e Persistência Local

## 1. Arquitetura de Sanitização e Safe DOM (VULN-01 & VULN-02)
- Criar a função estrita `safeSanitize(htmlString)` que:
  1. Cria um documento isolado via `DOMParser().parseFromString(htmlString, 'text/html')`.
  2. Percorre recursivamente a árvore de nós permitindo apenas os elementos: `B`, `I`, `U`, `STRONG`, `EM`, `BR`, `SPAN`, `P`, `DIV`, `UL`, `OL`, `LI`.
  3. Remove todos os atributos não essenciais e remove incondicionalmente qualquer atributo que comece com `on` (`onclick`, `onerror`, etc.), `href` com protocolo `javascript:`, tags `<script>`, `<iframe>`, `<object>`, `<embed>`, `<link>`, `<style>`, `<img>`, `<svg>`.
  4. Retorna a marcação estéril e segura.
- No `updateDisplay(text, isQR)` e `features.setView('text', data)`:
  - Se não houver tags de formatação simples, injetar estritamente via `textContent`.
  - Se houver formatação rica, injetar apenas após passar por `safeSanitize()`.
- No `handleBroadcast(data)`:
  - Validar a estrutura do objeto recebido e filtrar qualquer string antes de aplicar ao DOM do projetor.

## 2. Correção de Integridade Estrutural & DOM
- Eliminar o bloco corrompido pós-`</html>` (linhas 3696-3727).
- Injetar no HTML estático os elementos SVG correspondentes a `Target` e `X` nas linhas 2014 e 2018.
- Remover o segundo elemento com `id="queue-info-badge"`.

## 3. Preservação de Memória Gráfica no Canvas (`ink.resize()`)
- Modificar `features.ink.resize()` para:
  1. Capturar o conteúdo atual do canvas num elemento auxiliar em memória:
     ```javascript
     const temp = document.createElement('canvas');
     temp.width = canvas.width;
     temp.height = canvas.height;
     const tCtx = temp.getContext('2d');
     tCtx.drawImage(canvas, 0, 0);
     ```
  2. Ajustar `canvas.width = window.innerWidth` e `canvas.height = window.innerHeight`.
  3. Redesenhar o conteúdo capturado de `temp` no contexto redimensionado.
  4. Repor as propriedades gráficas de traço (`strokeStyle`, `lineWidth`, `lineCap`, `lineJoin`).

## 4. Persistência Local Soberana (`localStorage`)
- Chaves geridas:
  - `qb_session_scores`
  - `qb_session_queue`
  - `qb_session_history`
  - `qb_session_poll`
- Métodos a introduzir em `state`:
  - `saveSession()`: Serializa `scores`, `queue`, `history`, `historyIndex`, e estado do `poll` com `JSON.stringify` dentro de bloco protegido `try/catch`.
  - `loadSession()`: Deserializa dados existentes no arranque e repõe contadores e visualizadores.
  - `resetSession()`: Remove as chaves de sessão e repõe valores neutros (com confirmação do utilizador).
- Adicionar opção visual no menu de cabeçalho: "Reiniciar Sessão de Formação".

## 5. Resiliência Offline e Sintetizador Web Audio API Nativo
- Atualizar o dicionário `SOUNDS` para referenciar os ficheiros locais relativos (`certo.mp3`, `errado.mp3`, `mais_um_ponto.mp3`, `menos_um_ponto.mp3`, `rufar.mp3`, `aplausos.mp3`, `palmas.mp3`, `trompetas.mp3`, `sucesso_guitarra.mp3`).
- Implementar `AudioService.playSynth(key)` através de `AudioContext` nativo:
  - Geração procedural de notas e acordes sintetizados quando os ficheiros de áudio locais não forem encontrados ou em caso de restrições de reprodução de media.

## 6. UX e Refinamentos Ergonómicos
- **Modo Zen**: Timeout alargado para 4500ms com transição CSS suave de `opacity 0.4s ease`.
- **Botão Limpar Ecrã**: Exigência de clique de confirmação nos 2.5 segundos subsequentes ao primeiro clique antes de efetuar o wipe, acompanhado por feedback visual (toast / cor de aviso temporária).
- **Tema Sketch**: Restringir `border-radius: 2px !important` para não afetar botões com classes circulares ou botões da barra de ferramentas.
- **Sorteio e Dados**: Manter sem alterações a estrutura e apresentação visual atual.
