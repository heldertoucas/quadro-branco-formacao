const SOUND_KITS = {
    pro: { wave: 'sine' },
    neon: { wave: 'sawtooth' },
    '8bit': { wave: 'square' },
    gameboy: { wave: 'triangle' },
    sketch: { wave: 'sine' }
};

class AudioService {
    static init() {
        if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    static getKit() {
        const t = state.theme;
        return SOUND_KITS[t] || SOUND_KITS.pro;
    }

    static setVolume(v) {
        state.volume = Math.max(0, Math.min(1, v));
        localStorage.setItem('qv_volume', state.volume);
        const slider = document.getElementById('volume-slider');
        if (slider) slider.value = state.volume;
        const label = document.getElementById('volume-label');
        if (label) label.innerText = Math.round(state.volume * 100) + '%';
    }

    static toggle(key) {
        this.init();
        if (state.activeSounds[key]) {
            const sound = state.activeSounds[key];
            if (sound.audio) { sound.audio.pause(); sound.audio.currentTime = 0; }
            delete state.activeSounds[key];
            ui.highlightSound(key, false);
            if (key === 'trophy') document.getElementById('sunburst').classList.remove('active');
            return;
        }

        const url = SOUNDS[key];
        const isLoop = ['drum', 'clap', 'palmas'].includes(key);

        if (url && state.volume > 0.05) {
            const audio = new Audio(url);
            audio.volume = state.volume;
            audio.loop = isLoop;
            state.activeSounds[key] = { audio };
            ui.highlightSound(key, true);

            if (!isLoop) audio.onended = () => {
                delete state.activeSounds[key];
                ui.highlightSound(key, false);
                if (key === 'trophy') document.getElementById('sunburst').classList.remove('active');
            };

            audio.play().catch(() => this.playSynth(key));
        } else if (state.volume > 0.05) {
            this.playSynth(key);
        }

        const el = document.getElementById('main-text');
        if (el) { el.classList.remove('sound-reactive'); void el.offsetWidth; el.classList.add('sound-reactive'); }

        if (key === 'fanfare' || key === 'trophy') ui.confetti();
        if (key === 'trophy') document.getElementById('sunburst').classList.add('active');
    }

    static playTick() {
        this.init();
        if (state.volume < 0.05) return;
        const kit = this.getKit();
        const ctx = state.audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = kit.wave;
        osc.frequency.setValueAtTime(kit.wave === 'square' ? 600 : 800, ctx.currentTime);
        gain.gain.setValueAtTime(state.volume * 0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
        const el = document.getElementById('main-text');
        if (el) { el.classList.remove('sound-reactive'); void el.offsetWidth; el.classList.add('sound-reactive'); }
    }

    static playSynth(key) {
        this.init();
        if (state.volume < 0.05) return;
        const kit = this.getKit();
        const ctx = state.audioCtx;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(state.volume * 0.15, ctx.currentTime);
        masterGain.connect(ctx.destination);

        switch (key) {
            case 'success': {
                [523, 659, 784].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = kit.wave;
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
                    g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
                    osc.connect(g);
                    g.connect(masterGain);
                    osc.start(ctx.currentTime + i * 0.1);
                    osc.stop(ctx.currentTime + i * 0.1 + 0.3);
                });
                break;
            }
            case 'error': {
                [400, 300].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = kit.wave;
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
                    g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
                    osc.connect(g);
                    g.connect(masterGain);
                    osc.start(ctx.currentTime + i * 0.15);
                    osc.stop(ctx.currentTime + i * 0.15 + 0.3);
                });
                break;
            }
            case 'pointUp': {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = kit.wave;
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
                g.gain.setValueAtTime(0.3, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.connect(g);
                g.connect(masterGain);
                osc.start();
                osc.stop(ctx.currentTime + 0.15);
                break;
            }
            case 'pointDown': {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = kit.wave;
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.1);
                g.gain.setValueAtTime(0.3, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.connect(g);
                g.connect(masterGain);
                osc.start();
                osc.stop(ctx.currentTime + 0.15);
                break;
            }
            case 'drum': {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(120, ctx.currentTime);
                g.gain.setValueAtTime(0.5, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                osc.connect(g);
                g.connect(masterGain);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
                const noise = ctx.createOscillator();
                const ng = ctx.createGain();
                noise.type = 'sawtooth';
                noise.frequency.setValueAtTime(80, ctx.currentTime);
                ng.gain.setValueAtTime(0.2, ctx.currentTime);
                ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                noise.connect(ng);
                ng.connect(masterGain);
                noise.start();
                noise.stop(ctx.currentTime + 0.1);
                break;
            }
            case 'clap':
            case 'palmas': {
                for (let i = 0; i < 4; i++) {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(200 + Math.random() * 600, ctx.currentTime + i * 0.06);
                    g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.06);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.08);
                    osc.connect(g);
                    g.connect(masterGain);
                    osc.start(ctx.currentTime + i * 0.06);
                    osc.stop(ctx.currentTime + i * 0.06 + 0.08);
                }
                break;
            }
            case 'fanfare': {
                [440, 554, 659, 880].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = kit.wave;
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
                    g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
                    osc.connect(g);
                    g.connect(masterGain);
                    osc.start(ctx.currentTime + i * 0.12);
                    osc.stop(ctx.currentTime + i * 0.12 + 0.4);
                });
                break;
            }
            case 'trophy': {
                [262, 330, 392, 523, 659, 784, 1047].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const g = ctx.createGain();
                    osc.type = kit.wave;
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
                    g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5);
                    osc.connect(g);
                    g.connect(masterGain);
                    osc.start(ctx.currentTime + i * 0.15);
                    osc.stop(ctx.currentTime + i * 0.15 + 0.5);
                });
                break;
            }
        }
    }
}

class ModalSystem {
    constructor() {
        this.overlay = document.getElementById('modal-overlay');
        this.title = document.getElementById('modal-title');
        this.body = document.getElementById('modal-body');
        this.btnConfirm = document.getElementById('modal-confirm');
        this.btnCancel = document.getElementById('modal-cancel');
        this.lastFocusedElement = null;

        this.btnCancel.onclick = () => this.close();
        this.resolvePromise = null;

        // Handle Tab for Focus Trap and Escape for closing
        this.overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close(null);
            if (e.key === 'Tab') {
                const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                const content = this.overlay.querySelectorAll(focusableElements);
                const first = content[0];
                const last = content[content.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    show({ title, html, confirmText = 'Confirmar', showCancel = true }) {
        this.lastFocusedElement = document.activeElement;
        this.title.innerText = title;
        this.body.innerHTML = html;
        this.btnConfirm.innerText = confirmText;
        this.btnCancel.style.display = showCancel ? 'block' : 'none';
        this.overlay.classList.add('open');
        this.overlay.setAttribute('aria-hidden', 'false');

        // Initial focus
        setTimeout(() => {
            const input = this.body.querySelector('input, textarea');
            if (input) input.focus();
            else this.btnConfirm.focus();
        }, 100);

        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            this.btnConfirm.onclick = () => {
                const field = this.body.querySelector('input, textarea');
                const val = field ? field.value : true;
                this.close(val);
            };
            this.btnCancel.onclick = () => this.close(null);
        });
    }

    close(val = null) {
        this.overlay.classList.remove('open');
        this.overlay.setAttribute('aria-hidden', 'true');
        if (this.resolvePromise) {
            this.resolvePromise(val);
            this.resolvePromise = null;
        }
        if (this.lastFocusedElement) this.lastFocusedElement.focus();
    }
}
const modal = new ModalSystem();

const ui = {
    els: {
        mainText: document.getElementById('main-text'),
        qrContainer: document.getElementById('qr-container'),
        qrWrapper: document.getElementById('qr-canvas-wrapper'),
        input: document.getElementById('input-text'),
        root: document.documentElement
    },

    init() {
        this.renderSoundDrawer();
        this.showStartupMessage();
        this.applyState();

        // Keep rich text buttons synced with selection
        document.addEventListener('selectionchange', () => {
            if (state.isExpanded) this.updateFormatButtons();
        });

        // --- URL Params Handling ---
        const params = new URLSearchParams(window.location.search);

        // 1. Configs
        if (params.has('program')) app.setBrand(params.get('program'));
        if (params.has('mode')) app.setMode(params.get('mode'));
        if (params.has('theme')) app.setTheme(params.get('theme'));
        if (params.has('sons')) this.toggleSoundDrawer();

        // 2. Timer (Overlay - Independent)
        if (params.has('timer')) {
            const min = parseInt(params.get('timer'));
            if (!isNaN(min)) features.timer.start(min);
        }

        // 3. Main View (Mutually Exclusive)
        if (params.has('placar')) {
            const n = parseInt(params.get('placar'));
            if (!isNaN(n)) features.score.build(n);
        } else if (params.has('dados')) {
            features.dice.roll();
        } else if (params.has('sorteio')) {
            const names = params.get('sorteio').split(',').map(s => s.trim()).filter(Boolean);
            if (names.length > 0) features.picker.run(names);
        } else if (params.has('qrcode')) {
            features.setView('qr', params.get('qrcode'));
        } else if (params.has('text')) {
            app.showContent(params.get('text'));
        } else {
            this.updateDisplay("Olá! Vamos começar?");
        }

        // Initialize BroadcastChannel
        state.channel = new BroadcastChannel('quadro_branco_sync');
        state.channel.onmessage = (e) => app.handleBroadcast(e.data);

        // Projector Mode logic
        if (params.get('mode') === 'projector') {
            document.body.classList.add('projector-mode');
            // Request initial state
            setTimeout(() => {
                if (state.channel) state.channel.postMessage({ type: 'request_sync' });
            }, 500);
        }

        // Idle Detection for Zen Mode
        let idleTimer;
        const resetIdle = () => {
            if (document.body.classList.contains('idle')) {
                document.body.classList.remove('idle');
            }
            if (idleTimer) clearTimeout(idleTimer);

            if (state.mode === 'simple') {
                idleTimer = setTimeout(() => {
                    // Only apply if still in simple mode
                    if (state.mode === 'simple') {
                        document.body.classList.add('idle');
                    }
                }, 2000); // 2 seconds
            }
        };

        // Initialize idle check immediately
        resetIdle();

        document.addEventListener('mousemove', resetIdle);
        document.addEventListener('keydown', resetIdle);
        document.addEventListener('click', resetIdle);
        document.addEventListener('touchstart', resetIdle);

        // Event Listeners
        document.addEventListener('click', (e) => {
            if (!document.getElementById('logo-area').contains(e.target)) {
                document.getElementById('logo-area').classList.remove('active');
                if (window.innerWidth <= 900) document.body.style.overflow = '';
            }
        });

        // Ctrl + Scroll to zoom text
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                let zoom = parseFloat(document.documentElement.style.getPropertyValue('--manual-zoom')) || 1;
                if (e.deltaY < 0) zoom += 0.1; // Scroll up = zoom in
                else zoom -= 0.1; // Scroll down = zoom out
                zoom = Math.max(0.5, Math.min(zoom, 5)); // Limits 0.5x to 5x
                document.documentElement.style.setProperty('--manual-zoom', zoom);
            }
        }, { passive: false });

        this.els.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !state.isExpanded) {
                e.preventDefault();
                app.processInput();
            }
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                app.manualSubmit();
            }
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                app.addToQueue();
            }
        });
    },

    renderSoundDrawer() {
        const drawer = document.getElementById('sound-drawer');
        const allowedLabels = ['clap', 'palmas', 'pointUp', 'pointDown'];
        drawer.innerHTML = '<button class="submenu-close" onclick="ui.toggleSoundDrawer()" title="Fechar">×</button>' +
            '<div class="sound-grid">' +
            '<div class="volume-inline"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg><input type="range" id="volume-slider" min="0" max="1" step="0.05" value="' + state.volume + '" oninput="AudioService.setVolume(this.value)"><span id="volume-label" class="volume-pct">' + Math.round(state.volume * 100) + '%</span></div>' +
            SOUND_METADATA.map(s => `
            <button id="btn-${s.id}" class="tool-btn sound-drawer-btn" onclick="AudioService.toggle('${s.id}')" title="${s.label}">
                <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="stroke:${s.color}">${ICONS[s.icon]}</svg>
                ${allowedLabels.includes(s.id) ? `<span>${s.label}</span>` : ''}
            </button>
        `).join('') + '</div>';
    },

    animateTextIn(text, element) {
        element.innerHTML = '';
        // Split by word but preserve whitespace
        const words = text.split(/(\s+)/);
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'word-span';
            span.style.animationDelay = `${index * 0.05}s`;
            span.innerText = word;
            element.appendChild(span);
        });
    },

    updateDisplay(text, isQR = false) {
        const isHtml = /<[a-z][\s\S]*>/i.test(text) || text.includes('style=') || text.includes('<b>') || text.includes('<i>');

        // Natural URL & Long Word Breaking (Add zero-width space after / . - ? = & _)
        let processedText = text;
        if (!isHtml) {
            processedText = text.split(/(\s+)/).map(word => {
                // Detects URL-like strings or very long words
                if (word.includes('/') || word.includes('www.') || word.match(/\.[a-z]{2,}/i) || word.length > 25) {
                    // Adds a zero-width space AFTER the symbol to allow natural line breaks
                    return word.replace(/([/.\-?=&_])/g, '$1\u200B');
                }
                return word;
            }).join('');
        } else if (!text.includes(' ') && text.length > 30) {
            // Fallback for long strings without spaces that might be considered HTML
            processedText = text.replace(/([/.\-?=&_])/g, '$1\u200B');
        }

        // Dynamic Smooth Scaling Logic via clamp modifier
        if (!isQR) {
            this.updateOpticalScaling(processedText.length);
        }

        if (isHtml && !isQR) {
            this.els.mainText.classList.add('rich-content');
            this.els.mainText.innerHTML = processedText;
        } else {
            this.els.mainText.classList.remove('rich-content');
            if (state.isAnimated && !isQR && processedText) {
                this.animateTextIn(processedText, this.els.mainText);
            } else {
                this.els.mainText.innerText = processedText;
            }
        }

        this.els.mainText.classList.toggle('serif-mode', state.isSerif);

        this.els.mainText.classList.remove('hidden');
        this.els.mainText.classList.add('visible');

        if (isQR) {
            this.els.qrContainer.style.display = 'block';
            this.els.qrWrapper.innerHTML = "";
            const canvas = document.createElement('canvas');
            this.els.qrWrapper.appendChild(canvas);
            new QRious({ element: canvas, value: (isHtml ? this.els.mainText.innerText : processedText), size: 256, level: 'H' });
        } else {
            this.els.qrContainer.style.display = 'none';
        }
    },

    updateOpticalScaling(charCount) {
        // Decay curve: Scale factor decreases as length increases
        // Max scale is 1.0 (for short texts), Min scale is ~0.35
        let factor = 1.0;
        if (charCount > 15) {
            factor = Math.max(0.35, 1.0 - ((charCount - 15) * 0.005));
        }

        // Weight Scaling: 1.0 factor -> 900 weight, 0.35 factor -> 500 weight
        const weight = Math.round(500 + (factor - 0.35) * (400 / 0.65));

        // Spacing Scaling: 1.0 factor -> 0 spacing, 0.35 factor -> 0.05em spacing
        const spacing = (0.05 * (1.0 - factor) / 0.65).toFixed(3) + 'em';

        // Line-Height Scaling: 1.0 factor -> 1.1, 0.35 factor -> 1.5
        const lh = (1.5 - (factor - 0.35) * (0.4 / 0.65)).toFixed(2);

        this.els.mainText.style.setProperty('--scale-factor', factor);
        this.els.mainText.style.setProperty('--optical-weight', weight);
        this.els.mainText.style.setProperty('--optical-spacing', spacing);
        this.els.mainText.style.setProperty('--optical-lh', lh);
    },

    toggleQR() {
        features.qr.toggle();
    },

    closeQR() {
        this.els.qrContainer.style.display = 'none';
        this.els.input.focus(); // Restore focus to prevent toolbar collapse
    },

    toggleExpand() {
        state.isExpanded = !state.isExpanded;
        document.getElementById('control-panel').classList.toggle('expanded', state.isExpanded);
        this.els.input.setAttribute('placeholder', state.isExpanded ? "Modo Texto Rico..." : "Escreva... (Shift+Enter para Fila)");
        this.els.input.focus();
        if (state.isExpanded) this.updateFormatButtons();
    },

    updateFormatButtons() {
        const commands = [
            { id: 'fmt-bold', cmd: 'bold' },
            { id: 'fmt-italic', cmd: 'italic' },
            { id: 'fmt-underline', cmd: 'underline' },
            { id: 'fmt-list', cmd: 'insertUnorderedList' },
            { id: 'fmt-num', cmd: 'insertOrderedList' }
        ];
        commands.forEach(c => {
            const btn = document.getElementById(c.id);
            if (btn) btn.classList.toggle('active', document.queryCommandState(c.cmd));
        });

        // Alignment
        ['left', 'center', 'right'].forEach(align => {
            const btn = document.getElementById(`fmt-${align}`);
            if (btn) btn.classList.toggle('active', state.textAlignment === align);
        });

        // Custom Toggles
        const btnSerif = document.getElementById('btn-serif');
        if (btnSerif) btnSerif.classList.toggle('active', state.isSerif);

        const btnHighlight = document.getElementById('btn-highlight');
        if (btnHighlight) btnHighlight.classList.toggle('active', state.isHighlight);

        const btnAnimate = document.getElementById('btn-animate');
        if (btnAnimate) btnAnimate.classList.toggle('active', state.isAnimated);
    },

    toggleAnimations() {
        state.isAnimated = !state.isAnimated;
        this.applyState();
        app.broadcastState();
    },

    toggleSerif() {
        state.isSerif = !state.isSerif;
        this.applyState();
        app.broadcastState();
    },

    setTextAlignment(align) {
        state.textAlignment = align;
        this.applyState();
        app.broadcastState();
    },

    toggleHighlight() {
        state.isHighlight = !state.isHighlight;
        this.applyState();
        app.broadcastState();
    },

    toggleSoundDrawer() {
        document.getElementById('sound-drawer').classList.toggle('open');
        document.getElementById('btn-sound-drawer').classList.toggle('active');
        AudioService.playTick();
    },

    toggleLinkMenu() {
        const drawer = document.getElementById('links-drawer');
        const btn = document.getElementById('btn-links');
        const inputWrap = document.querySelector('.input-wrapper');

        const isOpening = !drawer.classList.contains('visible');

        drawer.classList.toggle('visible', isOpening);
        btn.classList.toggle('active', isOpening);

        if (isOpening) {
            inputWrap.style.display = 'none'; // Hide input

            // Add click listener to close
            setTimeout(() => {
                const closeFn = (e) => {
                    if (!drawer.contains(e.target) && !btn.contains(e.target)) {
                        drawer.classList.remove('visible');
                        btn.classList.remove('active');
                        inputWrap.style.display = 'flex'; // Restore input
                        document.removeEventListener('click', closeFn);
                    }
                };
                document.addEventListener('click', closeFn);
            }, 0);
        } else {
            inputWrap.style.display = 'flex'; // Restore input if toggled off
        }
    },

    showToast(msg) {
        const toast = document.createElement('div');
        toast.innerText = msg;
        toast.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.8); color: white; padding: 10px 20px;
            border-radius: 20px; z-index: 2000; animation: fadeInOut 2s ease forwards;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2); backdrop-filter: blur(5px);
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    },

    highlightSound(id, active) {
        const btn = document.getElementById(`btn-${id}`);
        if (btn) active ? btn.classList.add('sound-playing') : btn.classList.remove('sound-playing');
    },

    applyState() {
        document.body.setAttribute('data-mode', state.mode);
        this.els.root.setAttribute('data-theme', state.theme);

        const b = BRANDS[state.brand];
        if (b) {
            const img = document.getElementById('app-logo');
            img.src = state.theme === 'light' ? b.light : b.dark;
            img.alt = b.name;
        }

        // Mark active menu items
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        [`brand-${state.brand}`, `mode-${state.mode}`, `theme-${state.theme}`].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('active');
        });

        const btnSerif = document.getElementById('btn-serif');
        const btnHighlight = document.getElementById('btn-highlight');
        const btnAnimate = document.getElementById('btn-animate');
        if (btnSerif) btnSerif.classList.toggle('active', state.isSerif);
        if (btnHighlight) btnHighlight.classList.toggle('active', state.isHighlight);
        if (btnAnimate) btnAnimate.classList.toggle('active', state.isAnimated);

        this.els.mainText.classList.toggle('serif-mode', state.isSerif);
        this.els.mainText.classList.toggle('highlight-mode', state.isHighlight);

        // Alignment
        this.els.mainText.style.textAlign = state.textAlignment;

        this.updateFormatButtons();

        const slideBtn = document.getElementById('btn-create-slide');
        const linkBtn = document.getElementById('btn-links');
        if (slideBtn) {
            if (state.brand === 'futuro') {
                slideBtn.classList.remove('hidden');
                linkBtn.classList.remove('hidden');
            } else {
                slideBtn.classList.add('hidden');
                linkBtn.classList.add('hidden');
                // Reset inline state
                document.getElementById('slide-inline-controls').classList.remove('visible');
                document.getElementById('btn-send').style.display = 'block';
            }
        }
    },

    updateQueueBadge() {
        const el = document.getElementById('nav-queue-count');
        const info = document.getElementById('queue-info-badge');
        if (state.queue.length > 0) {
            el.innerText = state.queue.length;
            el.classList.remove('hidden');
            info.innerText = `${state.queue.length} em espera`;
            info.classList.add('visible');
            document.getElementById('nav-right').classList.add('visible');
        } else {
            el.classList.add('hidden');
            info.classList.remove('visible');
            // Hide right arrow if no history forward and no queue
            if (state.historyIndex >= state.history.length - 1) document.getElementById('nav-right').classList.remove('visible');
        }
    },

    navControls() {
        document.getElementById('nav-left').classList.toggle('visible', state.historyIndex > 0);
        const canFwd = state.historyIndex < state.history.length - 1 || state.queue.length > 0;
        document.getElementById('nav-right').classList.toggle('visible', canFwd);
    },

    confetti() {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#4facfe', '#00f2fe', '#ffffff'] });
    },

    showStartupMessage() {
        const msg = document.getElementById('startup-message');
        if (msg) {
            // Show after a brief delay ensuring page load
            setTimeout(() => msg.classList.add('visible'), 100);

            // Hide after 3 seconds
            setTimeout(() => {
                msg.classList.remove('visible');
                // Optional: remove from DOM to keep it clean
                setTimeout(() => msg.remove(), 1000);
            }, 3100);
        }
    }
};
