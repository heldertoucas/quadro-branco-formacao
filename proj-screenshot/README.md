# 📸 PeerShot - Guia de Início Rápido

## 1. Servidor PeerJS (PC do Formador)

Como não tens direitos de administrador, segue estes passos para ter o servidor a correr localmente:

1.  **Node.js Portátil:** Descarrega o "Windows Binary (.zip)" de 64-bit do site oficial do Node.js e extrai para uma pasta (ex: `C:\Users\Utilizador\Downloads\node`).
2.  **Instalação:** Abre o terminal na pasta onde extraíste o Node e executa:
    ```bash
    .\npm install peer
    ```
3.  **Execução:** Inicia o servidor na porta 9000:
    ```bash
    .\npx peerjs --port 9000
    ```
4.  **Descobrir o teu IP:** Abre outro terminal e digita `ipconfig`. Procura por "Endereço IPv4" na tua rede Wi-Fi/Ethernet (ex: `192.168.1.50`).

## 2. Configuração do Código

No ficheiro `app.js` (ou no script HTML), configura o objeto Peer para apontar para o teu IP:

```javascript
const peer = new Peer('formador', {
    host: '192.168.1.50', // O TEU IP AQUI
    port: 9000,
    path: '/'
});
```

## 3. Como usar

1.  **Formador:** Abre `formador.html` no teu browser.
2.  **Formandos:** Abrem `formando.html` nos seus PCs.
    -   Eles inserem o nome e clicam em "Iniciar Partilha".
    -   Autorizam a captura do ecrã.
3.  **Projeção:** O teu dashboard (`formador.html`) começará a mostrar os ecrãs de todos os formandos automaticamente.

---
*Nota: Se a firewall do Windows perguntar, permite o acesso ao Node.js para redes privadas.*
