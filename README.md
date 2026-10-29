# Ferramentas de Apoio à Formação

> **Criado por Hélder Touças e Vanessa Veríssimo** para os programas Passaporte Competências Digitais | Futuro Digital | CMLisboa

Este repositório contém duas ferramentas interativas desenvolvidas para dinamizar sessões de formação: **Quadro Branco** e **Futuro Digital**.

Ambas as ferramentas foram desenhadas com foco na **portabilidade** e facilidade de uso em qualquer contexto de sala de aula ou formação online.

---

## Enquadramento e Autoria

Este projeto foi desenvolvido com o foco principal de criar **recursos pedagógicos ágeis e acessíveis** para apoiar formadores, professores e facilitadores nas suas sessões de formação, quer em regime presencial, quer online.

* **Autoria e Desenvolvimento:** Desenvolvido por **Hélder Toucas** e **Vanessa Veríssimo**.
* **Objetivo de Utilização:** Disponibilizar aos formadores um conjunto de utilitários interativos (temporizadores, sorteios, painéis de pontuação, etc.) prontos a usar. O foco central é eliminar barreiras tecnológicas: as ferramentas não exigem instalação, permissões de administrador, dependências complexas ou sequer ligação à internet (se os ficheiros forem guardados e executados localmente).
* **Público-Alvo e Distribuição:** Destina-se a profissionais de educação que procurem dinâmicas de apoio visual. O projeto (código e ficheiros HTML) pode ser descarregado, partilhado e utilizado livremente para enriquecer a experiência formativa.


## Portabilidade

O conceito chave destas ferramentas é a simplicidade de distribuição e execução:

*   **Ficheiros Únicos (Standalone):** Cada ferramenta funciona a partir de um único ficheiro HTML (`index.html` para o Quadro Branco e `futuro-digital.html` para o Futuro Digital).
*   **Zero Instalação:** Não é necessário instalar software, servidores complexos ou configurações de base de dados. Basta abrir o ficheiro no navegador (browser).
*   **Fácil Partilha:** Podem ser transportadas numa pen drive, enviadas por email ou alojadas em qualquer servidor web estático (como o GitHub Pages).
*   **Persistência Local:** As configurações e histórico são guardados no `LocalStorage` do próprio navegador, mantendo a experiência personalizada sem necessidade de login ou backend.

---

## Parâmetros URL

Para facilitar a preparação das aulas, é possível configurar o estado inicial de ambas as ferramentas através de argumentos no URL. Isto permite criar links ou atalhos pré-configurados para diferentes momentos da formação.

### 1. Quadro Branco (`index.html`)

O `index.html` aceita uma vasta gama de parâmetros para controlar o comportamento e o visual ao iniciar.

**Exemplo de uso:**
`index.html?program=passaporte&text=Bem-Vindos&timer=10`

| Parâmetro | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`text`** | Define o texto apresentado no centro do ecrã ao iniciar. | `?text=Bom Dia` |
| **`program`** | Altera a marca/logótipo da aplicação. Opções: `futuro`, `passaporte`, `ia`. | `?program=passaporte` |
| **`mode`** | Define o modo de operação. Opções: `pro`, `simple`. | `?mode=simple` |
| **`theme`** | Define o tema visual. Opções: `dark`, `light`, `neon`, `ocean`, `sketch`, `nature`, `sunset`, `gameboy`, `8bit`. | `?theme=neon` |
| **`timer`** | Inicia a aplicação com um temporizador ativo (em minutos). | `?timer=5` |
| **`placar`** | Inicia a aplicação no modo "Placar" com o número de equipas indicado (2-6). | `?placar=4` |
| **`dados`** | Inicia a aplicação a lançar dados automaticamente. | `?dados` ou `?dados=true` |
| **`sorteio`** | Inicia um sorteio com a lista de nomes fornecida (separados por vírgula). | `?sorteio=Ana,Rui,Eva` |
| **`sons`** | Inicia com a gaveta de efeitos sonoros aberta. | `?sons` |
| **`qrcode`** | Inicia a aplicação a exibir um QR Code com o conteúdo indicado. | `?qrcode=https://www.google.pt` |

### 2. Futuro Digital (`futuro-digital.html`)

O `futuro-digital.html` serve como um slide de apresentação dinâmico e também aceita configurações via URL.

**Exemplo de uso:**
`futuro-digital.html?text=Equipa%20Vencedora&theme=scheme2`

| Parâmetro | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`text`** | Define o título principal do slide. | `?text=Pausa para Café` |
| **`theme`** | Define o esquema de cores. <br>• **(default)**: Amarelo/Laranja<br>• `scheme2`: Azul/Verde/Roxo<br>• `scheme3`: Amarelo/Verde/Vermelho | `?theme=scheme2` |

---

> **Dica:** Para usar espaços no texto via URL, utilize a codificação `%20` (ex: `Bom%20Dia`).

---

## 📜 Histórico de Versões

### V3.2 (Atual / Produção - Setembro 2026)
* **Futuro Digital (`futuro-digital.html`) - Sintonizador de Slide & Motor Procedural:**
  * **Painel Sintonizador Completo:** Gaveta lateral retrátil (tecla `H`) com organização modular dos controlos de todos os elementos:
    1. **Logótipo:** Controlo de visibilidade, efeito de *Shine* periódico configurável (`10.5s`), escala (`0.65x`), posições X/Y (`4%`, `5%`).
    2. **Título & Subtítulo:** Edição de texto ao vivo, ciclo de *Fade* suave configurável (`17.0s`), escala tipográfica (`1.15x`), posições X/Y (`4%`, `34.5%`).
    3. **Imagem da Equipa:** Suporte para imagem personalizada via URL, tamanho (`31vw`), posições X/Y (`11%`, `36%`) e ritmo de flutuação (`6.0s`).
    4. **Motor de Ondas Procedurais Canvas:**
       * **Modo 1 (Rodapé):** Inversão simétrica com curvatura a fechar suavemente no rodapé ($y = h$).
       * **Modo 2 (Fita Base):** Fita fluida orgânica com origem e regresso à base inferior.
       * **Modo 3 (Curva Base):** Curva geométrica ascendente com cota vertical ajustada ($+14.5\%$).
       * **Sentido de Movimento:** Suporte para propagação `Esq → Dir` e `Dir → Esq` (invertido).
       * **Sintonizadores:** Velocidade (`0.4x`), Amplitude (`1.05x`) e Deslocamento X/Y (`-8%`, `+14%`).
    5. **Partículas Dinâmicas Parallax:**
       * **Evitação Inteligente de Colisão:** Algoritmo procedural de posicionamento que garante que nenhuma partícula sobrepõe as caixas delimitadoras do logótipo, título ou imagem.
       * **Sintonizadores:** Quantidade (`8`), Escala de Tamanho (`1.00x`), Ritmo de Flutuação (`6.0s`), Opacidade (`90%`) e botão de randomização compacto.
    6. **Temas Cromáticos Integrados:** Predefinição no tema **Digital** (`scheme2`), com suporte para temas *Original* e *Energia*.
* **Quadro Branco (`index.html`):**
  * Design & UX Premium, toolbar com scroll horizontal, menu Bottom Sheet, temporizadores, sorteios, placar, dados e sons.
* **Próximos Passos:** Sessão de verificação e sincronização com a estrutura modular `proj-multifile-v2`.

### V3.1 / V3
* **Design & UX Premium:** Barra de ferramentas com *scroll* horizontal em mobile, menu principal com formato *Bottom Sheet*.
* **Escalabilidade de Texto Fluida:** Novo algoritmo matemático (CSS `clamp` dinâmico) que ajusta o tamanho da fonte suavemente à medida que se escreve, sem saltos bruscos.
* **Leitura Natural de URLs:** Deteção inteligente de links e palavras longas, inserindo quebras de linha em símbolos (`/`, `.`, `-`, etc.) sem cortar palavras a meio.
* **Controlo Manual:** Adicionado Zoom Manual via `Ctrl + Scroll`.
* **Novos Programas e Atalhos:** Inclusão da CMLisboa e links diretos para apresentações e portal Futuro Digital na gaveta "Links Rápidos".
* **Mantém a Identidade:** Código monolítico rápido e leve com manutenção de todas as fontes gráficas originais.

### Legacy V3 (Anterior v2.6 estabilizada)
* Arquivada na pasta `/legacy_v3/`. 
* Versão monolítica muito otimizada e madura, base das inovações visuais antes das reformulações de UX avançada.

### Legacy V2
* Arquivada na pasta `/legacy_v2/`.
* Versão original do Futuro Digital e Quadro Branco clássico, com componentes ligeiramente mais rígidos.

### V1
* Versão conceptual inicial (arquivada em `/v1/`), estruturada em vanilla mais básico e com as primeiras integrações das funções formativas.
