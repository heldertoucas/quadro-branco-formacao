# 📸 Spec: PeerShot - Captura de Ecrã Colaborativa

## 🎯 Objetivo
Criar uma ferramenta leve e segura para sessões de formação, permitindo que o formador visualize o progresso dos alunos através de screenshots periódicos autorizados, transmitidos via WebRTC (PeerJS) em rede local.

## 🏗️ Arquitetura do Sistema

### 1. Servidor de Sinalização (Signaling)
- **Tecnologia:** `peerjs-server` (Node.js).
- **Execução:** Localmente no computador do formador (Porta 9000).
- **Vantagem:** Ignora firewalls corporativas e restrições de internet, mantendo o tráfego na rede local.

### 2. Emissor (Lado do Formando)
- **Captura:** API `navigator.mediaDevices.getDisplayMedia()`.
- **Processamento:**
    - Extração de frame via `<canvas>`.
    - Compressão JPEG (Qualidade 0.5 a 0.7).
    - Conversão para Base64.
- **Transmissão:** Envio via `DataConnection.send()` a cada 5-10 segundos.
- **Segurança:** O formando autoriza explicitamente a partilha e pode interrompê-la a qualquer momento.

### 3. Recetor (Lado do Formador)
- **Interface:** Dashboard em grelha (Grid) responsiva.
- **Gestão:** Criação dinâmica de cards por aluno (ID único).
- **Funcionalidades:**
    - Visualização em tempo real das miniaturas.
    - Indicador de estado (Online/Offline).
    - Opção de ampliar um ecrã específico.

## 🛠️ Stack Tecnológica
- **Linguagem:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Comunicação:** [PeerJS](https://peerjs.com/) (WebRTC Wrapper).
- **Backend:** Node.js (Servidor PeerJS portátil).

## 📋 Requisitos de Implementação

### Configuração de Rede (Exemplo)
- **IP Formador:** `192.168.1.XX` (descoberto via `ipconfig`).
- **Porta:** `9000`.

### Fluxo de Dados (Pseudocódigo)
```javascript
// Formando
const conn = peer.connect('formador-id');
setInterval(() => {
  const frame = captureScreen(); // Canvas to DataURL
  conn.send({ type: 'screenshot', data: frame, name: 'João' });
}, 10000);

// Formador
peer.on('connection', (conn) => {
  conn.on('data', (payload) => {
    if (payload.type === 'screenshot') {
      updateStudentUI(payload.name, payload.data);
    }
  });
});
```

## ⚠️ Restrições e Soluções
- **Sem Admin:** Utilização de Node.js portátil (ZIP) para rodar o servidor PeerJS.
- **Rede Corporativa:** Uso obrigatório de `host` e `port` locais na configuração do objeto `Peer`.
- **Performance:** Envio de strings Base64 (Lite Mode) em vez de MediaStream de vídeo para poupar CPU/RAM em turmas de 12+ alunos.

## ✅ Critérios de Aceitação
- [ ] O formador consegue ver a lista de alunos ligados.
- [ ] Os screenshots atualizam automaticamente sem intervenção manual.
- [ ] A aplicação funciona em rede local sem acesso à internet.
- [ ] O sistema de sinalização corre sem privilégios de administrador.
