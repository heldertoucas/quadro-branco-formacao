# Specification: Dual Screen & Ink Overlay

## Overview
Implementação de duas novas funcionalidades para melhorar o controlo e a expressividade do formador:
1. **Modo Dual Screen (Broadcast API):** Separação entre a "Janela de Comando" (com todos os controlos) e a "Janela de Projeção" (limpa, em ecrã inteiro no projetor), sincronizadas em tempo real.
2. **Ferramenta de Desenho (Ink Overlay):** Uma camada transparente interativa (`<canvas>`) que permite desenhar livremente sobre o conteúdo do Quadro Branco.

## Functional Requirements

### Modo Dual Screen
- **Ativação:** Botão no painel de controlo para abrir a "Janela de Projeção" (`index.html?mode=projector`).
- **Sincronização:** Utilização da `BroadcastChannel` API para enviar mensagens de estado da Janela de Comando para a Janela de Projeção.
- **Interface da Projeção:** Ocultar o painel de controlo, menus, setas de navegação e botão de fechar QR Code. Apenas exibe o conteúdo visual (Texto, QR, Votação, Sorteio, Placar) e efeitos sonoros/visuais.
- **Controlo Central:** Ações desencadeadas na Janela de Comando (ex: submeter texto, atualizar placar, apurar vencedor) refletem-se instantaneamente na Projeção.

### Ferramenta de Desenho (Ink Overlay)
- **Ativação:** Botão "Caneta" na toolbar. Congela interações subjacentes e ativa o `<canvas>` de desenho a cobrir todo o ecrã.
- **Ferramentas:** Paleta de opções visível enquanto ativo:
  - Múltiplas cores (ex: Vermelho, Verde, Amarelo, etc.).
  - Ferramenta de Borracha Parcial.
  - Botão "Limpar Tudo".
- **Limitações (By Design):** O desenho ocorre apenas dentro da área do browser (`index.html`), sobrepondo os elementos atuais da aplicação.
- **Sincronização:** (Bónus/Esforço) Transmitir os traços de desenho da Janela de Comando para a Janela de Projeção via Broadcast API.

## Acceptance Criteria
- O formador consegue abrir uma segunda janela (Projeção) que se atualiza em tempo real com as ações da primeira (Comando) sem latência percetível em rede local/offline.
- A Janela de Projeção não exibe botões ou controlos de interface.
- O formador pode ativar a caneta, desenhar com várias cores, usar a borracha e limpar, e o desenho é visível e sem atrasos no canvas.
- (Opcional, mas desejável) O desenho feito na janela de comando reflete-se na janela de projeção.