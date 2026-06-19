const app = {
    setTheme(t) { state.theme = t; localStorage.setItem('qv_theme', t); ui.applyState(); this.broadcastState(); AudioService.playTick(); },
    setMode(m) { state.mode = m; localStorage.setItem('qv_mode', m); ui.applyState(); this.broadcastState(); AudioService.playTick(); },
    setBrand(b) { state.brand = b; localStorage.setItem('qv_brand', b); ui.applyState(); this.broadcastState(); AudioService.playTick(); },

    processInput() {
        const val = ui.els.input.innerText.trim() ? ui.els.input.innerHTML : "";
        ui.els.input.innerHTML = "";
        if (val) this.showContent(val);
        ui.els.input.focus();
    },

    manualSubmit() {
        // If Slide Mode is active, Create Slide instead of Projecting
        if (features.slide.active) {
            features.slide.create();
            return;
        }
        const text = ui.els.input.innerText.trim();
        if (!text) return;
        this.showContent(text); // Use showContent to handle history
        ui.els.input.innerHTML = ""; // Clear input after submission
        ui.els.input.focus(); // Keep focus on input
    },

    showContent(text) {
        // Add to history
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
            AudioService.toggle('pointUp'); // Feedback sound
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
        if (!state.channel) return;
        state.channel.postMessage({
            type: 'sync',
            state: {
                view: state.view,
                theme: state.theme,
                brand: state.brand,
                isSerif: state.isSerif,
                isHighlight: state.isHighlight,
                isAnimated: state.isAnimated,
                textAlignment: state.textAlignment,
                diceValues: state.diceValues,
                history: state.history,
                historyIndex: state.historyIndex,
                scores: state.scores,
                timerActive: !!state.timerInterval,
                pollLabels: features.poll.labels,
                pollVotes: features.poll.votes,
                pollActive: features.poll.active
            },
            data: state.view === 'text' ? ui.els.mainText.innerHTML : (state.view === 'qr' ? state.history[state.historyIndex] : null)
        });
    },

    handleBroadcast(data) {
        const params = new URLSearchParams(window.location.search);
        const isProjector = params.get('mode') === 'projector';

        if (data.type === 'request_sync' && !isProjector) {
            this.broadcastState();
        }

        if (data.type === 'sync' && isProjector) {
            const s = data.state;
            state.theme = s.theme;
            state.brand = s.brand;
            state.isSerif = s.isSerif;
            state.isHighlight = s.isHighlight;
            state.isAnimated = s.isAnimated;
            state.textAlignment = s.textAlignment;
            state.history = s.history;
            state.historyIndex = s.historyIndex;
            state.scores = s.scores;
            ui.applyState();

            if (s.view === 'poll' && s.pollActive) {
                features.poll.votes = s.pollVotes;
                features.poll.build(s.pollLabels, true);
            } else if (s.view === 'score') {
                features.score.build(Object.keys(s.scores).length, true);
            } else {
                features.setView(s.view, data.data);
            }
        }

        if (data.type === 'ink_stroke' && isProjector) {
            if (!features.ink.ctx) {
                const canvas = document.getElementById('ink-canvas');
                features.ink.ctx = canvas.getContext('2d');
                features.ink.resize();
            }
            features.ink.ctx.strokeStyle = data.color;
            features.ink.ctx.lineWidth = data.width;
            features.ink.ctx.globalCompositeOperation = data.op;
            features.ink.ctx.lineCap = 'round';
            features.ink.ctx.lineJoin = 'round';
            features.ink.ctx.beginPath();
            features.ink.ctx.moveTo(data.from.x, data.from.y);
            features.ink.ctx.lineTo(data.to.x, data.to.y);
            features.ink.ctx.stroke();
        }

        if (data.type === 'ink_clear' && isProjector) {
            if (features.ink.ctx) features.ink.ctx.clearRect(0, 0, features.ink.ctx.canvas.width, features.ink.ctx.canvas.height);
        }
    }
};

function handleLogoAreaClick(e) {
    if (e.target.id === 'logo-area') {
        const logoArea = document.getElementById('logo-area');
        logoArea.classList.remove('active');
        if (window.innerWidth <= 900) {
            document.body.style.overflow = '';
        }
    }
}

function toggleMenu(e) {
    if (e) e.stopPropagation();
    const logoArea = document.getElementById('logo-area');
    logoArea.classList.toggle('active');
    AudioService.playTick();

    // On mobile, if menu is active, prevent body scrolling to keep focus on menu
    if (window.innerWidth <= 900) {
        if (logoArea.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = ''; // Restore body scroll
        }
    }
}

// INIT
window.addEventListener('load', () => ui.init());
