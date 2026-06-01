/* --- 4. UI CONTROLLER --- */

class AudioService {
    static init() {
        if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    static toggle(key) {
        this.init();
        const s = SOUND_METADATA.find(m => m.id === key);
        if (!s) return;

        if (state.activeSounds[key]) {
            state.activeSounds[key].pause();
            state.activeSounds[key].currentTime = 0;
            delete state.activeSounds[key];
            this.updateUI(key, false);
        } else {
            const audio = new Audio(`sounds/${s.file}`);
            audio.loop = s.loop;
            audio.play().catch(e => console.warn("Audio play blocked", e));
            state.activeSounds[key] = audio;
            this.updateUI(key, true);
            if (!s.loop) {
                audio.onended = () => {
                    delete state.activeSounds[key];
                    this.updateUI(key, false);
                };
            }
        }
    }

    static updateUI(key, active) {
        const btn = document.getElementById(`btn-${key}`);
        if (btn) btn.classList.toggle('sound-playing', active);
    }
}

const ui = {
    els: {
        mainText: document.getElementById('main-text'),
        qrContainer: document.getElementById('qr-container'),
        qrWrapper: document.getElementById('qr-canvas-wrapper'),
        input: document.getElementById('input-text'),
        badge: document.getElementById('queue-info-badge'),
        sendBtn: document.getElementById('btn-send'),
        root: document.documentElement
    },

    init() {
        if (this.els.input) {
            this.els.input.addEventListener('input', () => {
                const hasText = this.els.input.textContent.trim() !== '';
                this.els.sendBtn.classList.toggle('visible', hasText);
            });
        }
        
        this.renderSoundDrawer();
        this.showStartupMessage();
        this.applyState();
        
        document.addEventListener('selectionchange', () => {
            if (state.isExpanded) this.updateFormatButtons();
        });

        // Click Outside to collapse tiers
        document.addEventListener('click', (e) => {
            if (!document.getElementById('logo-area').contains(e.target)) {
                document.getElementById('logo-area').classList.remove('active');
            }
            if (!e.target.closest('#control-panel')) {
                this.closeAllTiers();
            }
        });

        const params = new URLSearchParams(window.location.search);
        if (params.has('program')) app.setBrand(params.get('program'));
        if (params.has('mode')) app.setMode(params.get('mode'));
        if (params.has('theme')) app.setTheme(params.get('theme'));
        if (params.has('sons')) this.toggleTertiary('sound');

        if (params.has('timer')) {
            const min = parseInt(params.get('timer'));
            if (!isNaN(min)) features.timer.start(min * 60);
        }

        // Projector Mode logic
        if (params.get('mode') === 'projector' || window.location.search.includes('mode=projector')) {
            document.body.classList.add('projector-mode');
        }

        features.ink.init();
        this.syncRunningIndicators();
    },

    applyState() {
        document.body.setAttribute('data-mode', state.mode);
        this.els.root.setAttribute('data-theme', state.theme);

        this.els.mainText.classList.remove('serif-mode', 'highlight-mode', 'align-left', 'align-center', 'align-right');
        if (state.isSerif) this.els.mainText.classList.add('serif-mode');
        if (state.isHighlight) this.els.mainText.classList.add('highlight-mode');
        this.els.mainText.classList.add(`align-${state.textAlignment || 'center'}`);

        const b = BRANDS[state.brand];
        if (b) {
            const img = document.getElementById('app-logo');
            if (img) img.src = state.theme === 'light' ? b.light : b.dark;
        }
        
        this.updateFormatButtons();
    },

    toggleTertiary(moduleId) {
        const secBar = document.getElementById('tertiary-bar');
        const modules = document.querySelectorAll('.sec-module');
        const target = document.getElementById(`sec-${moduleId}`);
        const iconBtn = document.getElementById(`mod-icon-${moduleId}`);
        const categoryIcons = document.querySelectorAll('#secondary-bar .tool-btn');

        const isCurrentlyOpen = !secBar.classList.contains('hidden') && target.classList.contains('active');

        categoryIcons.forEach(i => i.classList.remove('active'));
        modules.forEach(m => m.classList.remove('active'));

        if (isCurrentlyOpen) {
            secBar.classList.add('hidden');
        } else {
            target.classList.add('active');
            if (iconBtn) iconBtn.classList.add('active');
            secBar.classList.remove('hidden');
            
            if (moduleId === 'richtext') this.els.input.classList.add('multiline');
            else this.els.input.classList.remove('multiline');

            if (moduleId === 'paint') features.ink.renderPalette();
            this.syncRunningIndicators();
        }
    },

    closeSecondary() {
        const secBar = document.getElementById('tertiary-bar');
        const categoryIcons = document.querySelectorAll('#secondary-bar .tool-btn');
        if (secBar) secBar.classList.add('hidden');
        categoryIcons.forEach(i => i.classList.remove('active'));
        if (this.els.input) this.els.input.classList.remove('multiline');
    },

    openSecondary() {
        const controlPanel = document.getElementById('control-panel');
        if (controlPanel && !controlPanel.classList.contains('expanded')) {
            controlPanel.classList.add('expanded');
            const secBar = document.getElementById('secondary-bar');
            if (secBar) secBar.classList.remove('hidden');

            if (state.timerInterval) this.toggleTertiary('play');
            else if (features.ink.active) this.toggleTertiary('paint');
        }
    },
    
    closeAllTiers() {
        this.closeSecondary();
        const controlPanel = document.getElementById('control-panel');
        if (controlPanel) {
            controlPanel.classList.remove('expanded');
            const secBar = document.getElementById('secondary-bar');
            if (secBar) secBar.classList.add('hidden');
        }
    },

    syncRunningIndicators() {
        const playIcon = document.getElementById('mod-icon-play');
        const paintIcon = document.getElementById('mod-icon-paint');
        if (playIcon) playIcon.classList.toggle('active-state', !!state.timerInterval);
        if (paintIcon) paintIcon.classList.toggle('active-state', features.ink.active);
        
        const timerBtn = document.getElementById('btn-timer');
        if (timerBtn) timerBtn.classList.toggle('active', !!state.timerInterval);

        const p1 = document.getElementById('ink-pen1');
        const p2 = document.getElementById('ink-pen2');
        const eraserBtn = document.getElementById('ink-eraser');
        if (features.ink.active && features.ink.ctx) {
            const isEraser = features.ink.ctx.globalCompositeOperation === 'destination-out';
            if (p1) p1.classList.toggle('active', !isEraser && state.inkSize === 4);
            if (p2) p2.classList.toggle('active', !isEraser && state.inkSize === 12);
            if (eraserBtn) eraserBtn.classList.toggle('active', isEraser);
        }
    },

    setTextAlignment(align) {
        state.textAlignment = align;
        this.applyState();
        app.broadcastState();
    },

    updateFormatButtons() {
        const cmds = [{ id: 'fmt-bold', cmd: 'bold' }, { id: 'fmt-italic', cmd: 'italic' }, { id: 'fmt-underline', cmd: 'underline' }];
        cmds.forEach(c => {
            const btn = document.getElementById(c.id);
            if (btn) btn.classList.toggle('active', document.queryCommandState(c.cmd));
        });

        ['left', 'center', 'right'].forEach(a => {
            const btn = document.getElementById(`fmt-${a}`);
            if (btn) btn.classList.toggle('active', state.textAlignment === a);
        });

        const btnSerif = document.getElementById('btn-serif');
        if (btnSerif) btnSerif.classList.toggle('active', state.isSerif);

        const btnHighlight = document.getElementById('btn-highlight');
        if (btnHighlight) btnHighlight.classList.toggle('active', state.isHighlight);

        const btnAnimate = document.getElementById('btn-animate');
        if (btnAnimate) btnAnimate.classList.toggle('active', state.isAnimated);
    },

    toggleAnimations() { state.isAnimated = !state.isAnimated; this.applyState(); app.broadcastState(); },
    toggleSerif() { state.isSerif = !state.isSerif; this.applyState(); app.broadcastState(); },
    toggleHighlight() { state.isHighlight = !state.isHighlight; this.applyState(); app.broadcastState(); },

    toggleLinkMenu() {
        const drawer = document.getElementById('links-drawer');
        drawer.classList.toggle('visible');
    },

    renderSoundDrawer() {
        const container = document.getElementById('sec-sound');
        if (!container) return;
        container.innerHTML = SOUND_METADATA.map(s => `
            <button id=\"btn-${s.id}\" class=\"tool-btn\" onclick=\"AudioService.toggle('${s.id}')\">
                <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"stroke:${s.color}\">${ICONS[s.icon]}</svg>
                <span>${s.label}</span>
            </button>
        `).join('');
    },

    updateQueueBadge() {
        const count = state.queue.length;
        this.els.badge.innerText = count > 0 ? `${count} na Fila` : '0 na Fila';
        this.els.badge.classList.toggle('visible', count > 0);
    },

    showStartupMessage() {
        const msg = document.getElementById('startup-message');
        if (msg) {
            msg.classList.add('visible');
            setTimeout(() => msg.classList.remove('visible'), 5000);
        }
    },

    confetti(customColors) {
        const colors = customColors || ['#4facfe', '#00f2fe', '#ffffff'];
        const end = Date.now() + 2000;
        const frame = () => {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    }
};
