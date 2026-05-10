/* --- 5. FEATURES & LOGIC --- */

const features = {
    setView(mode, data = null) {
        if (mode !== 'trophy') {
            const sb = document.getElementById('sunburst');
            if (sb) sb.classList.remove('active');
        }

        if (state.view === mode && !data) return;
        state.view = mode;

        ui.els.mainText.classList.remove('hidden', 'visible', 'rich-content');
        ui.els.mainText.style.display = 'none';
        ui.els.qrContainer.style.display = 'none';
        document.getElementById('scoreboard').style.display = 'none';

        switch (mode) {
            case 'text':
                ui.els.mainText.style.display = 'block';
                const isHtml = data && (/<[a-z][\s\S]*>/i.test(data) || data.includes('style=') || data.includes('<b>'));
                if (isHtml) {
                    ui.els.mainText.classList.add('rich-content');
                    ui.els.mainText.innerHTML = DOMPurify.sanitize(data);
                } else {
                    ui.els.mainText.innerText = data || "";
                }
                void ui.els.mainText.offsetWidth;
                ui.els.mainText.classList.add('visible');
                break;

            case 'qr':
                ui.els.qrContainer.style.display = 'block';
                ui.els.qrWrapper.innerHTML = `
                    <div style="font-size:1.2rem; margin-bottom:1.5rem; color:var(--accent-color); font-weight:600; text-align:center; max-width:400px; word-break:break-all;">
                        ${data}
                    </div>
                `;
                const canvas = document.createElement('canvas');
                ui.els.qrWrapper.appendChild(canvas);
                new QRious({ element: canvas, value: data, size: 280, level: 'H' });
                break;

            case 'dice':
                ui.els.mainText.style.display = 'block';
                ui.els.mainText.innerHTML = `
                    <div class="dice-wrapper">
                        <div id="dice-result" class="dice-result">A lançar...</div>
                        <div class="dice-visuals dice-shake"><span id="d1"></span><span id="d2"></span></div>
                    </div>`;
                ui.els.mainText.classList.add('visible');
                break;

            case 'picker':
                ui.els.mainText.style.display = 'flex';
                ui.els.mainText.style.alignItems = 'center';
                ui.els.mainText.style.justifyContent = 'center';
                ui.els.mainText.innerHTML = '<div id="picker-result" style="font-size:4rem; font-weight:800; color:var(--accent-color); animation: pulse 0.5s infinite alternate;">Sorteando...</div>';
                ui.els.mainText.classList.add('visible');
                break;
        }
        app.broadcastState();
    },

    timer: {
        async setup() {
            if (state.timerInterval) {
                clearInterval(state.timerInterval);
                state.timerInterval = null;
                document.getElementById('timer-overlay').style.display = 'none';
                return;
            }
            const min = await modal.show({
                title: 'Definir Timer',
                html: '<input type="number" class="modal-input" placeholder="Minutos (ex: 5)" value="5" min="1">'
            });
            if (min) this.start(parseInt(min));
        },
        start(min) {
            let time = min * 60;
            const el = document.getElementById('timer-overlay');
            el.style.display = 'block';
            el.style.color = '';

            const update = () => {
                el.innerText = `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
            };
            update();

            state.timerInterval = setInterval(() => {
                time--;
                update();
                if (time <= 0) {
                    clearInterval(state.timerInterval);
                    state.timerInterval = null;
                    el.style.color = '#ff4b4b';
                    AudioService.toggle('success');
                    ui.confetti();
                    setTimeout(() => { el.style.display = 'none'; }, 5000);
                }
            }, 1000);
        }
    },

    dice: {
        roll() {
            if (state.view === 'dice') { app.clear(); return; }
            features.setView('dice');
            const diceChars = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            let rolls = 0;
            const interval = setInterval(() => {
                const v1 = Math.floor(Math.random() * 6);
                const v2 = Math.floor(Math.random() * 6);
                const d1 = document.getElementById('d1'), d2 = document.getElementById('d2');
                if (d1) d1.innerText = diceChars[v1];
                if (d2) d2.innerText = diceChars[v2];
                if (++rolls >= 20) {
                    clearInterval(interval);
                    const vis = document.querySelector('.dice-visuals');
                    if (vis) vis.classList.remove('dice-shake');
                    const res = document.getElementById('dice-result');
                    if (res) {
                        res.innerText = (v1 + v2 + 2);
                        res.classList.add('show');
                        AudioService.toggle('success');
                    }
                }
            }, 80);
        }
    },

    picker: {
        async setup() {
            const text = await modal.show({
                title: 'Sorteio Aleatório',
                html: '<textarea class="modal-input" placeholder="Nomes separados por vírgula" rows="4"></textarea>'
            });
            if (text) this.run(text.split(',').map(s => s.trim()).filter(Boolean));
        },
        run(names) {
            if (names.length < 2) return;
            features.setView('picker');
            const resEl = document.getElementById('picker-result');
            let spins = 0;
            const interval = setInterval(() => {
                if (state.view !== 'picker' || !resEl) { clearInterval(interval); return; }
                resEl.innerText = names[Math.floor(Math.random() * names.length)];
                if (++spins >= 30) {
                    clearInterval(interval);
                    resEl.style.animation = "none";
                    resEl.style.transform = "scale(1.2)";
                    AudioService.toggle('fanfare');
                }
            }, 100);
        }
    },

    poll: {
        votes: [],
        labels: [],
        active: false,
        async setup() {
            if (this.active) { this.close(); return; }
            const input = await modal.show({
                title: 'Configurar Votação',
                html: `
                    <p style="font-size:0.9rem; opacity:0.8;">Indique o número de opções (2-6) ou escreva os nomes separados por vírgula.</p>
                    <input type="text" id="poll-setup-input" class="modal-input" placeholder="Ex: 3 ou Opção A, Opção B, Opção C" value="2">
                `
            });
            if (!input) return;
            let options = [];
            if (!isNaN(input) && input.trim() !== "") {
                const n = Math.min(Math.max(parseInt(input), 2), 6);
                for (let i = 0; i < n; i++) options.push(`Opção ${String.fromCharCode(65 + i)}`);
            } else {
                options = input.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (options.length < 2) return;
            this.build(options);
        },
        build(options, isSync = false) {
            this.labels = options;
            if (!isSync) this.votes = new Array(options.length).fill(0);
            this.active = true;
            let html = '';
            options.forEach((label, i) => {
                html += `
                    <div class="poll-item" id="poll-item-${i}">
                        <div class="poll-info">
                            <div class="poll-count" id="poll-count-${i}">${this.votes[i] || 0}</div>
                            <div class="poll-label" title="${label}">${label}</div>
                            <div class="poll-btn-group">
                                <button class="poll-btn" onclick="features.poll.update(${i}, 1)">+</button>
                                <button class="poll-btn" onclick="features.poll.update(${i}, -1)">-</button>
                            </div>
                        </div>
                        <div class="poll-bar-track">
                            <div class="poll-bar-fill" id="poll-bar-${i}"></div>
                        </div>
                    </div>`;
            });
            const display = document.getElementById('poll-display');
            display.innerHTML = html;
            display.style.display = 'flex';
            document.getElementById('poll-actions').style.display = 'flex';
            if (!isSync) app.clear();
            if (!this._keyHandler) {
                this._keyHandler = (e) => {
                    if (document.activeElement.tagName === 'INPUT' || document.activeElement.contentEditable === "true") return;
                    const num = parseInt(e.key);
                    if (!isNaN(num) && num >= 1 && num <= this.labels.length) {
                        this.update(num - 1, e.shiftKey ? -1 : 1);
                    }
                };
                document.addEventListener('keydown', this._keyHandler);
            }
            this.refreshBars();
        },
        update(index, delta) {
            if (!this.active) return;
            this.votes[index] = Math.max(0, this.votes[index] + delta);
            document.getElementById(`poll-count-${index}`).innerText = this.votes[index];
            this.refreshBars();
            
            // v2: Impact Micro-interaction
            const item = document.getElementById(`poll-item-${index}`);
            item.classList.remove('poll-impact');
            void item.offsetWidth; // Trigger reflow
            item.classList.add('poll-impact');

            AudioService.toggle(delta > 0 ? 'pointUp' : 'pointDown');
            app.broadcastState();
        },
        refreshBars() {
            const maxVotes = Math.max(...this.votes, 1);
            this.votes.forEach((v, i) => {
                const percent = (v / maxVotes) * 100;
                document.getElementById(`poll-bar-${i}`).style.height = `${percent}%`;
            });
        },
        checkWinner() {
            const max = Math.max(...this.votes);
            if (max === 0) return;
            const winners = [];
            this.votes.forEach((v, i) => { if (v === max) winners.push(i); });
            
            // v2: Winner Ceremony
            document.querySelectorAll('.poll-item').forEach((el, idx) => {
                el.classList.remove('poll-winner-highlight', 'losing-option');
                if (!winners.includes(idx)) {
                    el.classList.add('losing-option');
                }
            });
            
            winners.forEach(i => { document.getElementById(`poll-item-${i}`).classList.add('poll-winner-highlight'); });
            
            AudioService.toggle('trophy');
            
            // v2: Color-coordinated Confetti
            const palette = [
                ['#FF5252', '#B71C1C', '#ffffff'], // col-1
                ['#448AFF', '#1565C0', '#ffffff'], // col-2
                ['#69F0AE', '#2E7D32', '#ffffff'], // col-3
                ['#FFD740', '#F9A825', '#ffffff'], // col-4
                ['#E040FB', '#6A1B9A', '#ffffff'], // col-5
                ['#00E5FF', '#006064', '#ffffff']  // col-6
            ];
            const winnerColors = winners.length === 1 ? palette[winners[0]] : null;
            ui.confetti(winnerColors);
            
            app.broadcastState();
        },
        close() {
            this.active = false;
            document.getElementById('poll-display').style.display = 'none';
            document.getElementById('poll-actions').style.display = 'none';
            document.removeEventListener('keydown', this._keyHandler);
            
            // Stop any active sounds (especially trophy)
            Object.keys(state.activeSounds).forEach(key => AudioService.toggle(key));
            
            app.clear();
        }
    },

    qr: {
        toggle() {
            if (state.view === 'qr') {
                if (state.history.length > 0) features.setView('text', state.history[state.historyIndex]);
                else app.clear();
            } else {
                let content = ui.els.input.innerText.trim();
                if (!content && state.view === 'text') content = ui.els.mainText.innerText;
                if (content && content !== "..." && !content.includes("Sorteando")) {
                    features.setView('qr', content);
                }
            }
        }
    },

    score: {
        async setup() {
            const sb = document.getElementById('scoreboard');
            if (sb.style.display === 'flex') { sb.style.display = 'none'; return; }
            const num = await modal.show({
                title: 'Configurar Placar',
                html: '<input type="number" class="modal-input" placeholder="Número de Equipas (2-6)" min="2" max="6" value="2">'
            });
            if (num) this.build(parseInt(num));
        },
        build(n, isSync = false) {
            if (!isSync) state.scores = {};
            let html = '';
            for (let i = 0; i < n; i++) {
                const char = String.fromCharCode(65 + i);
                if (!isSync) state.scores[char] = 0;
                const scoreVal = state.scores[char] || 0;
                html += `<div class="score-team" id="team-${char}" onmousedown="features.score.update('${char}', event)">
                            <div class="score-val" id="score-${char}">${scoreVal}</div>
                            <div class="score-label">Equipa ${char}</div>
                         </div>`;
            }
            html += `<button id="score-win-btn" onclick="features.score.checkWinner()" title="Apurar Vencedor" style="margin-left:15px; background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:50%; width:75px; height:75px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-color); transition:all 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                        <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none">${ICONS.Target}</svg>
                     </button>`;
            const sb = document.getElementById('scoreboard');
            sb.innerHTML = html;
            sb.style.display = 'flex';
        },
        update(team, e) {
            const delta = (e.shiftKey || e.button === 2) ? -1 : 1;
            state.scores[team] = Math.max(0, state.scores[team] + delta);
            document.getElementById(`score-${team}`).innerText = state.scores[team];
            AudioService.toggle(delta > 0 ? 'pointUp' : 'pointDown');
            app.broadcastState();
        },
        checkWinner() {
            let max = -1, winners = [];
            Object.entries(state.scores).forEach(([t, s]) => {
                if (s > max) { max = s; winners = [t]; }
                else if (s === max) winners.push(t);
            });
            document.querySelectorAll('.score-team').forEach(el => el.classList.remove('winner-highlight'));
            if (max > 0) {
                winners.forEach(t => document.getElementById(`team-${t}`).classList.add('winner-highlight'));
                AudioService.toggle('trophy');
            }
            app.broadcastState();
        }
    },

    slide: {
        activeScheme: 'default',
        active: false,
        toggleInline() {
            const toolbarColors = document.getElementById('slide-colors-toolbar');
            const drawer = document.getElementById('links-drawer');
            if (drawer.classList.contains('visible')) ui.toggleLinkMenu();
            this.active = !this.active;
            const btn = document.getElementById('btn-create-slide');
            btn.classList.toggle('active', this.active);
            if (this.active) {
                document.getElementById('control-panel').classList.add('expanded');
                toolbarColors.style.display = 'flex';
                ui.els.input.focus();
                this.setScheme(this.activeScheme);
            } else {
                toolbarColors.style.display = 'none';
                document.getElementById('control-panel').classList.remove('expanded');
                if (ui.els.input) ui.els.input.style.borderColor = '';
            }
        },
        setScheme(scheme) {
            this.activeScheme = scheme;
            document.querySelectorAll('.inline-scheme-btn').forEach(btn => btn.classList.remove('active'));
            const btn = document.getElementById(`toolbar-scheme-${scheme}`);
            if (btn) btn.classList.add('active');
            const colors = { 'default': '#FFB743', 'scheme2': '#5271FF', 'scheme3': '#35B729' };
            if (this.active && ui.els.input) ui.els.input.style.borderColor = colors[scheme] || 'var(--glass-border)';
        },
        create() {
            let text = ui.els.input.innerText;
            text = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
            if (!text) text = "Novo Slide";
            const data = { text: text, scheme: this.activeScheme };
            localStorage.setItem('slideData', JSON.stringify(data));
            window.location.href = 'futuro-digital.html';
        },
        openSlides() {
            const data = { text: "https://docs.google.com/presentation/d/1BR9b4cx1kMfBY3zkMFgV5BjtMpbur9K7CV6J2YUNr70/view", scheme: 'default' };
            localStorage.setItem('slideData', JSON.stringify(data));
            window.location.href = 'futuro-digital.html';
        },
        openPortal() {
            const data = { text: "bit.ly/futurodigitalcml", scheme: 'scheme2' };
            localStorage.setItem('slideData', JSON.stringify(data));
            window.location.href = 'futuro-digital.html';
        },
        openChallenge() {
            const data = { text: "bit.ly/desafiocml", scheme: 'scheme3' };
            localStorage.setItem('slideData', JSON.stringify(data));
            window.location.href = 'futuro-digital.html';
        }
    },

    ink: {
        active: false,
        color: '#ff0000',
        isDrawing: false,
        ctx: null,
        lastX: 0,
        lastY: 0,
        setup() {
            const canvas = document.getElementById('ink-canvas');
            if (!this.ctx) {
                this.ctx = canvas.getContext('2d');
                this.resize();
                window.addEventListener('resize', () => this.resize());
                canvas.onmousedown = (e) => this.start(e);
                canvas.onmousemove = (e) => this.draw(e);
                canvas.onmouseup = () => this.stop();
                canvas.onmouseout = () => this.stop();
                canvas.ontouchstart = (e) => { e.preventDefault(); this.start(e.touches[0]); };
                canvas.ontouchmove = (e) => { e.preventDefault(); this.draw(e.touches[0]); };
                canvas.ontouchend = () => this.stop();
            }
            this.toggle();
        },
        resize() {
            const canvas = document.getElementById('ink-canvas');
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            if (this.ctx) {
                this.ctx.scale(dpr, dpr);
                this.setColor(this.color); // Re-apply settings after scale
            }
        },
        toggle() {
            this.active = !this.active;
            const canvas = document.getElementById('ink-canvas');
            const toolbar = document.getElementById('ink-toolbar');
            canvas.classList.toggle('active', this.active);
            toolbar.classList.toggle('visible', this.active);
            document.getElementById('btn-ink').classList.toggle('active', this.active);
            if (this.active) {
                this.resize();
                this.setColor(this.color);
            }
        },
        start(e) { this.isDrawing = true; [this.lastX, this.lastY] = [e.clientX, e.clientY]; },
        draw(e) {
            if (!this.isDrawing) return;
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(e.clientX, e.clientY);
            this.ctx.stroke();
            if (state.channel) {
                state.channel.postMessage({
                    type: 'ink_stroke',
                    from: { x: this.lastX, y: this.lastY },
                    to: { x: e.clientX, y: e.clientY },
                    color: this.ctx.strokeStyle,
                    width: this.ctx.lineWidth,
                    op: this.ctx.globalCompositeOperation
                });
            }
            [this.lastX, this.lastY] = [e.clientX, e.clientY];
        },
        stop() { this.isDrawing = false; },
        setColor(c) {
            this.color = c;
            this.ctx.strokeStyle = c;
            this.ctx.lineWidth = 4;
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            document.querySelectorAll('.ink-color').forEach(el => el.classList.remove('active'));
            const btn = document.getElementById(`ink-col-${c.replace('#', '')}`);
            if (btn) btn.classList.add('active');
            document.getElementById('ink-eraser').classList.remove('active');
        },
        setEraser() {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = 30;
            document.querySelectorAll('.ink-color').forEach(el => el.classList.remove('active'));
            document.getElementById('ink-eraser').classList.add('active');
        },
        clear() {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            if (state.channel) state.channel.postMessage({ type: 'ink_clear' });
        }
    }
};