# Specification: Sistema de Votação (Polls)

## Overview
Uma nova ferramenta interativa que permite ao formador contar votos da audiência em tempo real, apresentados sob a forma de um gráfico de barras verticais.

## Functional Requirements
- **Configuração:** O utilizador define a quantidade de opções dinamicamente através de um modal.
- **Visualização:** Apresentação através de um Gráfico de Barras Verticais. A altura das barras ajusta-se proporcionalmente aos votos introduzidos.
- **Interação (Inputs):**
    - Rato/Touch: Botões de "+1" (e possivelmente "-1") em cada barra.
    - Teclado: Atalhos numéricos (teclas 1, 2, 3, etc.) para acelerar o registo de votos nas respetivas barras.
- **Apuramento:** Botão para encerrar a votação, que destaca a opção mais votada com feedback visual (confetti) e áudio (vitória).

## Acceptance Criteria
- O sistema permite criar uma votação com um número livre de opções.
- A altura vertical das barras reflete de forma correta e animada a proporção de votos.
- Votos podem ser adicionados tanto por clique do rato como pelo teclado.
- A interface de votação não colide com os menus e é acessível em resoluções menores.