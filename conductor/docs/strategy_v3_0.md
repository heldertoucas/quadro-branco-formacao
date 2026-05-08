# 🗺️ Documento Estratégico: Quadro Branco v3.0

## 🎯 Visão Geral
Este documento detalha o roteiro de evolução estética e funcional para a versão 3.0 do Quadro Branco. O foco principal é a transição de uma ferramenta funcional para uma experiência de formação imersiva, "premium" e altamente profissional, mantendo a filosofia *offline-first* e a simplicidade de ficheiro único.

---

## 🏗️ 1. Identidade Visual e "Glassmorphism"
*Melhoria da base estética para maior profundidade e contraste.*
- **Bordas Gradientes:** Substituir bordas sólidas por gradientes lineares (branco opaco para transparente) para simular reflexos de luz realistas nas arestas do vidro.
- **Textura de Ruído (Grain):** Adicionar uma camada de ruído visual quase impercetível aos elementos de vidro para aumentar a sensação de materialidade.
- **Contraste Dinâmico:** Ajuste automático da opacidade do vidro com base no brilho do tema selecionado para garantir legibilidade máxima.
- **Otimização de Blur:** Implementar fallbacks inteligentes para dispositivos com menor capacidade de processamento gráfico, garantindo fluidez em qualquer hardware.

## ✍️ 2. Tipografia e Escala Dinâmica
*Refinamento editorial para transformar a leitura num prazer visual.*
- **Ajuste Ótico de Peso:** Implementar lógica onde o `font-weight` diminui e o `letter-spacing` aumenta proporcionalmente à redução do tamanho do texto (ajuste para textos longos).
- **Interlinha Variável:** Implementação de `line-height` dinâmico (entre 1.1 e 1.5) adaptado automaticamente à densidade do conteúdo.
- **Suporte a Serifas:** Introdução de fontes secundárias clássicas (ex: Playfair Display ou EB Garamond) para citações e momentos de reflexão inspiradora.
- **Animação Cinemática:** Opção para entrada de texto sequencial (caracter a caracter ou palavra a palavra) para maior impacto dramático nas mensagens chave.

## 📊 3. Sistema de Votação (Polls)
*Transformação das barras estáticas em infografias vivas.*
- **Gradientes Multicolor:** Atribuição de assinaturas cromáticas distintas e vibrantes para cada opção de voto, facilitando a leitura à distância.
- **Efeito Líquido (Glass-Liquid):** Animação pulsante no topo das barras simulando o enchimento de um reservatório de energia.
- **Micro-interações de Impacto:** Efeito "bounce" físico e emissão de partículas rápidas ao registar novos votos (+/-).
- **Cerimónia do Vencedor:** Desfoque (grayscale) das opções perdedoras e "Glow" intenso na vencedora, acompanhado de chuva de confettis personalizada com as cores da barra campeã.

## 🖊️ 4. Ink Overlay (Ferramenta de Desenho)
*Evolução da caneta digital para um traço profissional e artístico.*
- **Suavização por Curvas de Bézier:** Implementação de um algoritmo de suavização que converte traços manuais em curvas matemáticas fluidas, eliminando o aspeto "pixelizado".
- **Efeito Neon Glow:** Adição de brilho dinâmico (`shadowBlur`) nos traços para temas escuros, fazendo a caneta "iluminar" o texto por baixo.
- **Modo Iluminador (Highlighter):** Diferenciação entre caneta opaca fina e marcador semi-transparente largo, permitindo destacar palavras sem as ocultar.
- **Paletas Adaptativas:** Cores da caneta que se ajustam automaticamente à paleta de cores e ao "mood" do tema ativo.
- **Feedback de "Tinta Fresca":** Pequeno brilho ou efeito de secagem no ponto de contacto da caneta para uma sensação mais tátil.

## 🎮 5. Painel de Controlo e Toolbar
*Simplificação da navegação e redução da carga cognitiva do formador.*
- **Conceito "Floating Island":** Evolução da barra fixa para grupos de pílulas flutuantes compactas e orgânicas que libertam espaço no ecrã.
- **Iconografia Exclusiva:** Substituição de ícones genéricos por um set desenhado especificamente para a linguagem visual do projeto.
- **Menu de Contexto em Cascata:** Reorganização dos submenus (ex: Sons) em grelhas elegantes que não interferem no layout principal.
- **Indicadores de Estado Pulsantes:** Feedback visual contínuo em ferramentas ativas (ex: Timer ligado, Emissão ativa).
- **Botão de Envio Inteligente:** Integração do contador de fila num indicador de progresso circular (badge integrado) no próprio botão de ação.

## 🎨 6. Temas, Marcas e Coesão
*Imersão total na identidade do programa de formação.*
- **Morphing de Cor:** Transições suaves de 1 segundo entre temas (CSS Transitions) para evitar saltos visuais bruscos e dar sofisticação.
- **Texturas Temáticas Imersivas:**
    - **Sketch:** Papel granulado real e efeito de traço trémulo (jitter) nos elementos de UI.
    - **8-bit:** Filtro de *scanlines* CRT e grelha de pixéis subtil.
    - **Neon:** Reflexos de luz (glow) projetados na "base" do ecrã.
- **Ornamentos de Marca:** Detalhes decorativos dinâmicos na UI inspirados na identidade visual do programa selecionado (CML, Futuro Digital, IA).
- **Logótipos SVG Inteligentes:** Logos que mudam de cor e aplicam filtros dinâmicos para fusão perfeita com qualquer fundo.

## ⏱️ 7. Timer e Gestão de Tempo
*Indicação intuitiva e dramática do fluxo temporal.*
- **Progress Ring / Bar:** Contador numérico envolvido num anel visual de progresso ou uma linha de luz no topo do ecrã.
- **Modo Hectic:** Pulsação rítmica e brilho vermelho nos últimos 10 segundos para criar uma tensão lúdica na sala.
- **Time's Up Reveal:** Efeito cinematográfico de tela inteira (flash de luz ou vidro a quebrar) quando o tempo esgota.
- **Timer Picture-in-Picture:** Capacidade de mover livremente ou minimizar o timer sem interromper a contagem regressiva.

## 🏆 8. Placar (Scoreboard)
*Gamificação dinâmica com hierarquia visual clara.*
- **Layout de Podium:** Reordenação automática (subir/descer) das equipas baseada na pontuação em tempo real.
- **Animação de Odómetro:** Números que rodam fisicamente (tipo slot machine) ao mudar de valor, aumentando a satisfação.
- **Identidade por Avatar/Cor:** Substituição de nomes genéricos por cores vibrantes e ícones temáticos para cada equipa.
- **Glow de Liderança:** Aura brilhante ou gradiente animado na borda da equipa que ocupa o primeiro lugar.
- **Modo Minimizado:** Redução do placar para pequenos ícones laterais para focar no conteúdo sem perder os pontos de vista.

## 🎲 9. Dados e Sorteio (Acaso)
*Dramatização física e cinemática da sorte.*
- **Dados 3D (CSS Pure):** Cubos tridimensionais com física de rotação real em todos os eixos em vez de caracteres estáticos.
- **Efeito Slot Machine:** Desfile vertical de nomes no sorteio com efeito de desaceleração suave (easing out) para suspense.
- **Dramatização do Resultado:** Moldura de luz e efeito de projeção de sombra no vencedor sorteado.
- **Tematização de Objetos:** Dados que mudam de aspeto (sprites 8-bit, desenhos Sketch, luzes Neon) conforme o tema.

## 📲 10. QR Code e Partilha
*Integração orgânica entre o ecrã e o dispositivo móvel.*
- **QR Code Glassified:** Renderização de pontos coloridos sobre vidro transparente, eliminando a caixa branca "chapada".
- **Logo Integration:** Inserção do logótipo do programa no centro do código QR para reforço de marca.
- **Efeito de Carta 3D:** Animação de rotação do slide principal para revelar o QR Code no seu verso.
- **Modo Cinema:** Clique para expansão imediata para ecrã inteiro, garantindo que a última fila consegue ler o código.

## 🔊 11. Feedback Sonoro e Atmosfera
*Criação de um ambiente auditivo coerente e offline.*
- **Assets de Alta Fidelidade:** Manutenção de ficheiros de som reais (MP3) para garantir impacto e fidelidade emocional.
- **Kits de Som por Tema:** Sons específicos para cada mood (Beeps retro para 8-bit, pads de sintetizador para Neon).
- **Micro-interações de UI:** Sons de "tick" e "click" físicos quase impercetíveis ao navegar na interface.
- **Slider de Volume Dedicado:** Controlo direto e acessível no "Sound Drawer" para ajustes rápidos do formador.
- **Visualização Reativa:** O conteúdo (texto/barras) reage visualmente (vibra ou brilha) aos picos de áudio.

## 📺 12. Dual Screen e Sincronização
*Controlo profissional com foco na narrativa da formação.*
- **Indicador de Sinal (On-Air):** LED virtual ou ícone de antena que confirma a ligação ativa com o ecrã do projetor.
- **Laser Pointer Digital:** Ponto de luz (glow) que segue o rato no projetor, permitindo guiar a atenção sem a seta padrão do OS.
- **Modo Stage & Push (Encenação):** Preparação privada de texto/desenho seguida de "lançamento" dramático para o projetor.
- **Safe Area Overlay:** Linhas de contorno ténues no ecrã de comando que mostram os limites exatos do que os alunos vêem.
- **Standby Animado:** Ecrã de espera com branding dinâmico e animações subtis para momentos de intervalo ou preparação.

---

**Revisão de Conformidade:** Todas as análises críticas e propostas de melhoria discutidas foram compiladas e detalhadas exaustivamente neste documento estratégico para a v3.0.
