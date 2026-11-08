---
title: "Quadro Branco: Hardening Forense de Segurança, Resiliência Offline, UX e Persistência Local"
type: proposal
status: proposed
project: PRJ-0009
created: "2026-11-08"
relevant_decisions: ["DEC-0023"]
relevant_constraints: ["CON-0009", "CON-0012", "CON-0015", "CON-0016"]
---

# Proposta OpenSpec: Hardening Forense de Segurança, Resiliência Offline, UX e Persistência Local

## 1. Problema & Contexto
A auditoria forense aprofundada ao ficheiro autónomo de produção [index.html](file:///Users/heldertoucas/dev/quadro-branco-formacao/index.html) identificou vulnerabilidades de segurança, corrupção sintática e fragilidades funcionais que afetam a fiabilidade pedagógica em sala de aula presencial e remota:

1. **Vulnerabilidade DOM-Based XSS (VULN-01)**: Parâmetros URL como `?text=` e conteúdos inseridos no editor são injetados diretamente no DOM via `innerHTML` se contiverem tags HTML (`/<[a-z][\s\S]*>/i`), permitindo execução arbitrária de scripts no contexto do formador.
2. **Injeção Não Sanitizada em Janela de Projeção (VULN-02)**: Mensagens recebidas no `BroadcastChannel('quadro_branco_sync')` não validam estrutura nem sanitizam dados antes de aplicar ao ecrã do projetor.
3. **Corrupção Física no Final de Ficheiro (BUG-01)**: Linhas 3696–3727 contêm código JavaScript solto e duplicado após uma primeira tag `</html>`, quebrando a integridade estrutural do ficheiro.
4. **Sintaxe Literal Inválida em SVGs de Votação (BUG-02)**: Os botões de apuramento e fecho do Poll contêm as strings literais `${ICONS.Target}` e `${ICONS.X}` em HTML estático, impossibilitando a renderização dos ícones vetoriais.
5. **Perda Catastrófica de Anotações no Canvas (BUG-03)**: O redimensionamento da janela ou rotação de ecrã em tablets invoca `canvas.width = window.innerWidth`, limpando instantaneamente todo o buffer de tinta sem recuperação.
6. **Quebra da Promessa Offline e Bloqueio de CDNs (VULN-03)**: Os ficheiros de áudio e logótipos dependem de URLs absolutos externos (`heldertoucas.github.io` e `imgur.com`), falhando quando executados em modo local isolado (pen-drive) ou sob firewalls municipais (CML). O fallback `playSynth` é um stub inerte (`console.warn`).
7. **Duplicação de Identificadores (BUG-04)**: O identificador `id="queue-info-badge"` encontra-se duplicado no DOM.
8. **Volatilidade de Dados da Sessão Formativa**: Placar de equipas (`state.scores`), fila de conteúdos (`state.queue`), histórico e votações residem apenas na memória RAM; qualquer recarregamento acidental de página (F5 ou suspensão de aba) elimina o progresso da aula.
9. **Fricção de Usabilidade & UX**: O temporizador de inatividade do Modo Zen (2s) é excessivamente agressivo causando tremeluzir da barra de ferramentas; o botão "Limpar Ecrã" não tem proteção contra cliques acidentais; o tema `sketch` desfigura botões circulares devido ao `border-radius: 2px !important` universal.

## 2. Solução Proposta

### Módulo A: Saneamento Estrutural e Sanitização XSS (Safe DOM)
- Purgar as linhas corrompidas 3696–3727 no final de `index.html`.
- Substituir a injeção crua de `innerHTML` por um mecanismo seguro de renderização:
  - Renderizar por defeito texto puro com `textContent`.
  - Para formatação rica (negrito, itálico, sublinhado, quebras de linha), aplicar sanitização com lista fechada de tags autorizadas (`<b>`, `<i>`, `<u>`, `<br>`, `<span>`, `<ul>`, `<ol>`, `<li>`), expurgando handlers de evento (`onload`, `onerror`), scripts, iframes e estilos inline inseguros.
- Higienizar os payloads transmitidos pelo `BroadcastChannel` no modo Projetor.

### Módulo B: Correção dos SVGs de Votação e Integridade do DOM
- Substituir os marcadores `${ICONS...}` estáticos nas linhas 2014 e 2018 pelos nós vetoriais SVG reais correspondentes aos ícones `Target` e `X`.
- Remover a declaração duplicada de `id="queue-info-badge"`.

### Módulo C: Preservação de Traços no Redimensionamento do Canvas (`ink`)
- Criar um mecanismo de buffer em memória (canvas offscreen ou array de traços vetoriais) que guarda os píxeis antes da alteração de `canvas.width`/`height` e os redesenha proporcionalmente no evento de redimensionamento da janela.

### Módulo D: Persistência Local Soberana (Mecanismo Explicado)
A persistência local garante que nenhum dado pedagógico (pontuações, fila de slides, votação ativa) se perde por refresh acidental, fecho inadvertido de aba ou libertação de memória pelo browser em tablets.

* **Arquitetura de Armazenamento**:
  - Utilização da API `localStorage` sob namespace reservado `qb_session_*`:
    - `qb_session_scores`: Objeto JSON com as pontuações ativas das equipas (`{ "A": 2, "B": 3 }`).
    - `qb_session_queue`: Array JSON com os textos e itens colocados na fila de projeção.
    - `qb_session_history`: Array JSON com o histórico de mensagens projetadas e o respetivo índice ativo.
    - `qb_session_poll`: Estado da votação em curso (etiquetas, contagem de votos e estado ativo/fechado).
- **Ciclo de Vida & Hidratação**:
  - **Na Inicialização (`ui.init`)**: O sistema verifica a existência de dados salvos. Se existirem, recupera e hidrata imediatamente o placar, a fila e o estado visual correspondente, apresentando um indicador discreto de recuperação.
  - **Na Mutação de Dados**: Operações de soma/subtração de pontos, alteração de votos e inserção na fila invocam um gravador persistente com proteção `try/catch` (resiliente a restrições de Quota ou navegação privada restrita).
  - **Ação Explícita de Nova Sessão (Reset de Turma)**: Adição de uma ação de limpeza de sessão no menu de opções do cabeçalho ("Reiniciar Sessão de Formação"), permitindo ao formador iniciar uma nova aula a zeros sem necessidade de limpar manualmente o cache do browser.

### Módulo E: Resiliência Offline & Fallback Web Audio API Nativo
- Alterar as referências dos ficheiros de áudio em `SOUNDS` para ficheiros locais relativos (ex.: `certo.mp3`), preservando os ficheiros já empacotados na raiz do repositório.
- Implementar o sintetizador Web Audio API em `AudioService.playSynth(key)` utilizando osciladores puros (`Sine`, `Square`, `Triangle`) e gerador de ruído procedural para aplausos, fanfarras e contagens, garantindo áudio funcional mesmo que os ficheiros MP3 falhem ou sejam bloqueados.
- Manter imagens e fontes resilientes com font-stacks locais do sistema (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`).

### Módulo F: Refinamentos de UX e Ergonomia em Sala de Aula
- **Modo Zen (Idle)**: Alargar o temporizador de inatividade de 2 para 4.5 segundos com transição de opacidade suave, eliminando o efeito de oscilação irritante durante o uso de caneta ou rato.
- **Botão "Limpar Ecrã" Seguro**: Exigir duplo clique rápido ou apresentar confirmação suave com auto-cancelamento (toast de 3 segundos), prevenindo o cancelamento inadvertido de explicações no quadro.
- **Correção Estilística no Tema `sketch`**: Substituir a regra agressiva `* { border-radius: 2px !important; }` por seletores específicos que excluam botões circulares e controlos estruturais da barra de ferramentas.
- **Scroll na Toolbar Mobile**: Adicionar padding de segurança à direita da barra para evitar que os últimos botões fiquem tapados pelo gradiente de transição.

## 3. Ficheiros Impactados
- `index.html`: Ficheiro único de produção — alvo de todas as intervenções de segurança, correções de sintaxe, persistência e refinamento de UX.
- `openspec/proposals/20261108-quadro-branco-hardening-e-ux.md`: Este registo formal de proposta.
- `openspec/tasks.md`: Atualização do catálogo de tarefas do projeto.

## 4. Não-Objetivos & Limites de Escopo
- **Não Unificar com `proj-multifile-v2`**: O `index.html` permanece um artefacto monolítico estritamente independente e autónomo (Single-File Standalone Zero-Build), mantendo o objetivo de distribuição zero-instalação e portabilidade direta via pen-drive.
- **Preservação de Design de Sorteio e Dados**: Não será realizada qualquer alteração visual ou de layout nos módulos de Sorteio (`picker`) e Dados (`dice`), mantendo rigorosamente a sua apresentação estética e mecânica visual atual.
- **Sem Dependências Externas**: Nenhuma biblioteca externa (npm, CDN ou framework) será introduzida no ecossistema. Todo o código será mantido em Vanilla HTML5/CSS3/JavaScript nativo.
