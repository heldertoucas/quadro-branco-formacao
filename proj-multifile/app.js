/* --- 7. MAIN CONTROLLER --- */

const app = {
    setTheme(t) { state.theme = t; localStorage.setItem('qv_theme', t); ui.applyState(); this.broadcastState(); },
    setMode(m) { state.mode = m; localStorage.setItem('qv_mode', m); ui.applyState(); this.broadcastState(); },
    setBrand(b) { state.brand = b; localStorage.setItem('qv_brand', b); ui.applyState(); this.broadcastState(); },

    processInput() {
        const val = ui.els.input.innerText.trim() ? ui.els.input.innerHTML : "";
        ui.els.input.innerHTML = "";
        if (ui.els.sendBtn) ui.els.sendBtn.classList.remove('visible');
        if (val) this.showContent(val);
        ui.els.input.focus();
    },

    manualSubmit() {
        if (features.slide.active) {
            features.slide.create();
            return;
        }
        const text = ui.els.input.innerText.trim();
        if (!text) return;
        this.showContent(text);
        ui.els.input.innerHTML = "";
        if (ui.els.sendBtn) ui.els.sendBtn.classList.remove('visible');
        ui.els.input.focus();
    },

    showContent(text) {
        if (state.history[state.history.length - 1] !== text) {
            state.history.push(text);
            state.historyIndex = state.history.length - 1;
        }
        features.setView('text', text);
        ui.navControls();
    },

    addToQueue() {
        const val = ui.els.input.innerText.trim() ? ui.els.input.innerHTML : "";
        if (val) {
            state.queue.push(val);
            ui.els.input.innerHTML = "";
            ui.updateQueueBadge();
            AudioService.toggle('pointUp');
        }
    },

    navHistory(dir) {
        if (dir === 'back') {
            if (state.historyIndex > 0) {
                state.historyIndex--;
                features.setView('text', state.history[state.historyIndex]);
            }
        } else {
            if (state.queue.length > 0) {
                const next = state.queue.shift();
                ui.updateQueueBadge();
                this.showContent(next);
            } else if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                features.setView('text', state.history[state.historyIndex]);
            }
        }
        ui.navControls();
    },

    clear() {
        features.setView('text', '');
        ui.els.mainText.classList.remove('visible');
        this.broadcastState();
    },

    broadcastState() {
        sync.broadcastState();
    },

    handleBroadcast(data) {
        sync.handleBroadcast(data);
    }
};

// INIT
window.addEventListener('load', () => ui.init());