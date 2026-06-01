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
        duration: 0,
        remaining: 0,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },

        async setup() {
            const min = await modal.show({
                title: 'Definir Timer',
                html: '<input type="number" class="modal-input" placeholder="Minutos (ex: 5)" value="5" min="1">'
            });
            if (min) this.start(parseInt(min) * 60);
        },

        toggle() {
            if (state.timerInterval) {
                this.stop();
            } else {
                this.setup();
            }
        },

        start(seconds, isSync = false, isExtension = false) {
            if (isExtension && state.timerInterval) {
                this.remaining += seconds;
                this.duration += seconds;
                if (!isSync) app.broadcastState();
                return;
            }

            if (state.timerInterval) clearInterval(state.timerInterval);

            this.duration = seconds;
            this.remaining = seconds;

            const el = document.getElementById('timer-overlay');
            const display = document.getElementById('timer-display');
            const progress = document.getElementById('timer-progress');
            const extendBtn = document.getElementById('timer-extend-btn');

            el.style.display = 'flex';
            if (extendBtn) extendBtn.style.display = 'block';
            el.classList.remove('hectic');

            const updateUI = () => {
                const m = Math.floor(this.remaining / 60).toString().padStart(2, '0');
                const s = (this.remaining % 60).toString().padStart(2, '0');
                display.innerText = `${m}:${s}`;
                const offset = 502.65 - (this.remaining / this.duration * 502.65);
                progress.style.strokeDashoffset = offset;
                if (this.remaining <= 10 && this.remaining > 0) el.classList.add('hectic');
            };

            updateUI();
            if (!isSync) app.broadcastState();

            state.timerInterval = setInterval(() => {
                this.remaining--;
                updateUI();
                if (this.remaining <= 0) this.finish();
            }, 1000);
            ui.syncRunningIndicators();
        },

        stop() {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
            document.getElementById('timer-overlay').style.display = 'none';
            const extendBtn = document.getElementById('timer-extend-btn');
            if (extendBtn) extendBtn.style.display = 'none';
            ui.syncRunningIndicators();
            app.broadcastState();
        },

        finish() {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
            const extendBtn = document.getElementById('timer-extend-btn');
            if (extendBtn) extendBtn.style.display = 'none';
            ui.syncRunningIndicators();
            
            AudioService.toggle('success');
            
            // Cinematic Flash
            const flash = document.createElement('div');
            flash.className = 'timer-finished-overlay active';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 1000);

            setTimeout(() => {
                document.getElementById('timer-overlay').style.display = 'none';
            }, 5000);
            
            app.broadcastState();
        },

        // Drag & Drop
        startDrag(e) {
            if (e.target.closest('button')) return;
            this.isDragging = true;
            const el = document.getElementById('timer-overlay');
            const rect = el.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            
            const onMove = (me) => {
                if (!this.isDragging) return;
                el.style.left = (me.clientX - this.dragOffset.x) + 'px';
                el.style.top = (me.clientY - this.dragOffset.y) + 'px';
                el.style.right = 'auto';
                el.style.bottom = 'auto';
            };
            
            const onUp = () => {
                this.isDragging = false;
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
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
        setup() {
            modal.show({
                title: "Sorteio Aleatório",
                html: '<textarea class="modal-input" id="picker-list" placeholder="Nomes (um por linha)" rows="5"></textarea>',
                onConfirm: () => {
                    const list = document.getElementById('picker-list').value.trim().split('\\n').filter(n => n.trim());
                    if (list.length) this.spin(list);
                }
            });
        },
        spin(list) {
            features.setView('picker');
            const display = document.getElementById('picker-result');
            let counter = 0;
            let speed = 50;
            const maxSpins = 30 + Math.floor(Math.random() * 20);
            
            const run = () => {
                counter++;
                display.innerText = list[Math.floor(Math.random() * list.length)];
                if (counter < maxSpins) {
                    speed *= 1.1; // Smooth deceleration
                    setTimeout(run, speed);
                } else {
                    display.style.animation = 'none';
                    display.offsetHeight; // reflow
                    display.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                    AudioService.toggle('success');
                    ui.confetti();
                }
            };
            run();
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
            const teamIcons = ['Zap', 'Moon', 'Heart', 'Star', 'Ghost', 'Sun'];
            for (let i = 0; i < n; i++) {
                const char = String.fromCharCode(65 + i);
                const icon = teamIcons[i];
                if (!isSync) state.scores[char] = 0;
                const scoreVal = state.scores[char] || 0;
                html += `<div class="score-team" id="team-${char}" onmousedown="features.score.update('${char}', event)">
                            <div class="score-icon" style="opacity:0.6;"><svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">${ICONS[icon]}</svg></div>
                            <div class="score-val" id="score-${char}">${scoreVal}</div>
                            <div class="score-label">Equipa ${char}</div>
                         </div>`;
            }
            html += `<div class="score-controls" style="display:flex; gap:10px; order:99; align-items:center;">
                        <button id="score-toggle-btn" onclick="features.score.toggleMini()" title="Alternar Tamanho" style="background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:50%; width:45px; height:45px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-color); transition:all 0.2s;">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" id="score-toggle-icon">${ICONS.Minimize}</svg>
                        </button>
                        <button id="score-win-btn" onclick="features.score.checkWinner()" title="Apurar Vencedor" style="background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:50%; width:45px; height:45px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-color); transition:all 0.2s;">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none">${ICONS.Target}</svg>
                        </button>
                     </div>`;
            const sb = document.getElementById('scoreboard');
            sb.innerHTML = html;
            sb.style.display = 'flex';
            sb.onclick = (e) => {
                if (sb.classList.contains('winner-mode') && e.target === sb) {
                    this.clearWinner();
                }
            };
            this.refreshRankings();
        },
        toggleMini() {
            const sb = document.getElementById('scoreboard');
            sb.classList.toggle('mini');
            const isMini = sb.classList.contains('mini');
            document.getElementById('score-toggle-icon').innerHTML = isMini ? ICONS.Maximize : ICONS.Minimize;
        },
        update(team, e) {
            const delta = (e.shiftKey || e.button === 2) ? -1 : 1;
            state.scores[team] = Math.max(0, state.scores[team] + delta);
            
            const scoreEl = document.getElementById(`score-${team}`);
            scoreEl.innerText = state.scores[team];
            
            // Animation "Pop"
            scoreEl.classList.remove('pop');
            void scoreEl.offsetWidth; // Trigger reflow
            scoreEl.classList.add('pop');

            this.clearWinner();
            this.refreshRankings();
            AudioService.toggle(delta > 0 ? 'pointUp' : 'pointDown');
            app.broadcastState();
        },
        clearWinner() {
            const sb = document.getElementById('scoreboard');
            sb.classList.remove('winner-mode');
            document.querySelectorAll('.score-team').forEach(el => el.classList.remove('winner-highlight'));
        },
        refreshRankings() {
            const entries = Object.entries(state.scores);
            const maxScore = Math.max(...entries.map(e => e[1]));
            
            entries.forEach(([t, s]) => {
                const el = document.getElementById(`team-${t}`);
                if (el) {
                    el.classList.toggle('leading', s === maxScore && s > 0);
                }
            });
        },
        checkWinner() {
            const sb = document.getElementById('scoreboard');
            if (sb.classList.contains('winner-mode')) {
                this.clearWinner();
                return;
            }

            let max = -1, winners = [];
            Object.entries(state.scores).forEach(([t, s]) => {
                if (s > max) { max = s; winners = [t]; }
                else if (s === max) winners.push(t);
            });

            if (max > 0) {
                sb.classList.add('winner-mode');
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
            const slideDivider = document.getElementById('slide-divider');
            const drawer = document.getElementById('links-drawer');
            if (drawer.classList.contains('visible')) ui.toggleLinkMenu();
            this.active = !this.active;
            const btn = document.getElementById('btn-create-slide');
            btn.classList.toggle('active', this.active);
            if (this.active) {
                ui.toggleExpand(); // Ensure rich toolbar is open
                toolbarColors.style.display = 'flex';
                if (slideDivider) slideDivider.style.display = 'block';
                ui.els.input.focus();
                this.setScheme(this.activeScheme);
            } else {
                toolbarColors.style.display = 'none';
                if (slideDivider) slideDivider.style.display = 'none';
                if (state.isExpanded) ui.toggleExpand(); // Close rich toolbar
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
        isDrawing: false,
        ctx: null,
        points: [],
        _lastMidPoint: null,
        init() {
            const canvas = document.getElementById('ink-canvas');
            if (canvas && !this.ctx) {
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
        },
        setup() {
            this.init();
            this.toggle();
        },
        resize() {
            const canvas = document.getElementById('ink-canvas');
            const dpr = window.devicePixelRatio || 1;
            const temp = this.ctx ? this.ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            if (this.ctx) {
                this.ctx.scale(dpr, dpr);
                if (temp) this.ctx.putImageData(temp, 0, 0);
                this.applyBrushSettings();
            }
        },
        toggle() {
            this.active = !this.active;
            const canvas = document.getElementById('ink-canvas');
            const toggleBtn = document.getElementById('btn-ink-toggle');
            
            canvas.classList.toggle('active', this.active);
            if (toggleBtn) toggleBtn.innerText = this.active ? 'Desativar' : 'Ativar';
            
            ui.syncRunningIndicators();
            if (this.active) {
                this.resize();
                this.renderPalette();
                this.applyBrushSettings();
            }
        },
        renderPalette() {
            const container = document.getElementById('ink-palette');
            if (!container) return;
            const colors = PALETTES[state.theme] || PALETTES.dark;
            
            if (!colors.includes(state.inkColor)) {
                state.inkColor = colors[0];
            }

            container.innerHTML = colors.map(c => `
                <div class="ink-color ${state.inkColor === c && this.ctx.globalCompositeOperation !== 'destination-out' ? 'active' : ''}" 
                     style="background:${c}; width:24px; height:24px; border-radius:50%; cursor:pointer; border:2px solid rgba(255,255,255,0.2);" 
                     onclick="features.ink.setColor('${c}')"></div>
            `).join('');
        },
        start(e) {
            if (!this.active) return;
            this.isDrawing = true;
            const pt = { x: e.clientX, y: e.clientY };
            this.points = [pt];
            this._lastMidPoint = pt;
            this.drawPoint(pt);
        },
        drawPoint(pt) {
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, this.ctx.lineWidth / 2, 0, Math.PI * 2);
            this.ctx.fill();
        },
        draw(e) {
            if (!this.isDrawing) return;
            const pt = { x: e.clientX, y: e.clientY };
            this.points.push(pt);

            if (this.points.length > 2) {
                const lastIdx = this.points.length - 1;
                const p1 = this.points[lastIdx - 1];
                const p2 = this.points[lastIdx];
                const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

                this.ctx.beginPath();
                this.ctx.moveTo(this._lastMidPoint.x, this._lastMidPoint.y);
                this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                this.ctx.stroke();

                if (state.channel) {
                    state.channel.postMessage({
                        type: 'ink_stroke_v2',
                        from: this._lastMidPoint,
                        control: p1,
                        to: midPoint,
                        color: this.ctx.strokeStyle,
                        width: this.ctx.lineWidth,
                        op: this.ctx.globalCompositeOperation,
                        glow: this.ctx.shadowBlur > 0
                    });
                }
                this._lastMidPoint = midPoint;
            }
        },
        stop() { this.isDrawing = false; this.points = []; },
        applyBrushSettings() {
            if (!this.ctx) return;
            this.ctx.strokeStyle = state.inkColor;
            this.ctx.fillStyle = state.inkColor;
            this.ctx.lineWidth = state.inkSize || 4;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.shadowBlur = 0;
        },
        setColor(c) {
            state.inkColor = c;
            this.ctx.globalCompositeOperation = 'source-over';
            this.applyBrushSettings();
            this.renderPalette();
            const eraserBtn = document.getElementById('ink-eraser');
            if (eraserBtn) eraserBtn.classList.remove('active');
            
            const p1 = document.getElementById('ink-pen1');
            const p2 = document.getElementById('ink-pen2');
            if (p1 && state.inkSize === 4) p1.classList.add('active');
            if (p2 && state.inkSize === 12) p2.classList.add('active');
        },
        setPen(type) {
            state.inkSize = type === 1 ? 4 : 12;
            this.ctx.globalCompositeOperation = 'source-over';
            this.applyBrushSettings();
            
            const p1 = document.getElementById('ink-pen1');
            const p2 = document.getElementById('ink-pen2');
            const eraserBtn = document.getElementById('ink-eraser');
            
            if (p1) p1.classList.toggle('active', type === 1);
            if (p2) p2.classList.toggle('active', type === 2);
            if (eraserBtn) eraserBtn.classList.remove('active');
            this.renderPalette();
        },
        setEraser() {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = 40;
            this.ctx.shadowBlur = 0;
            document.querySelectorAll('.ink-color').forEach(el => el.classList.remove('active'));
            const p1 = document.getElementById('ink-pen1');
            const p2 = document.getElementById('ink-pen2');
            const eraserBtn = document.getElementById('ink-eraser');
            if (eraserBtn) eraserBtn.classList.add('active');
            if (p1) p1.classList.remove('active');
            if (p2) p2.classList.remove('active');
        },
        clear() {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            if (state.channel) state.channel.postMessage({ type: 'ink_clear' });
        }
    }
};
