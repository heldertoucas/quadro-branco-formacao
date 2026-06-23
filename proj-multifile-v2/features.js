const features = {
    // New Unified View Manager
    setView(mode, data = null) {
        // Remove sunburst if not trophy
        if (mode !== 'trophy') {
            const sb = document.getElementById('sunburst');
            if (sb) sb.classList.remove('active');
        }

        if (state.view === mode && !data) return;
        state.view = mode;

        ui.els.mainText.classList.remove('hidden', 'visible', 'rich-content');
        ui.els.mainText.style.display = 'none';
        document.getElementById('scoreboard').style.display = 'none';

        switch (mode) {
            case 'text':
                const flipCardEl = document.getElementById('flip-card');
                if (flipCardEl) flipCardEl.classList.remove('flipped');
                ui.els.qrContainer.classList.remove('cinema-mode');
                ui.els.mainText.style.display = 'block';
                const isHtml = data && (/<[a-z][\s\S]*>/i.test(data) || data.includes('style=') || data.includes('<b>'));
                if (isHtml) {
                    ui.els.mainText.classList.add('rich-content');
                    ui.els.mainText.innerHTML = data;
                } else {
                    ui.els.mainText.innerText = data || "";
                }
                void ui.els.mainText.offsetWidth;
                ui.els.mainText.classList.add('visible');
                break;

            case 'qr':
                const flipCard = document.getElementById('flip-card');
                if (flipCard) flipCard.classList.add('flipped');
                ui.els.qrContainer.classList.remove('cinema-mode');
                ui.els.qrWrapper.innerHTML = `
                    <div style="font-size:1.1rem; margin-bottom:1.2rem; color:var(--accent-color); font-weight:600; text-align:center; max-width:400px; word-break:break-all;">
                        ${data}
                    </div>
                    <div style="position:relative; display:inline-block;">
                        <canvas id="qr-canvas" width="280" height="280"></canvas>
                    </div>
                `;
                const canvas = document.getElementById('qr-canvas');
                if (canvas) {
                    new QRious({
                        element: canvas,
                        value: data,
                        size: 280,
                        level: 'H',
                        background: 'transparent',
                        backgroundAlpha: 0,
                        foreground: '#000000',
                        foregroundAlpha: 1
                    });
                }
                break;

            case 'dice': {
                ui.els.mainText.style.display = 'block';
                const dotsOf = [
                    [[1,1]], [[0,2],[2,0]], [[0,2],[1,1],[2,0]],
                    [[0,0],[0,2],[2,0],[2,2]], [[0,0],[0,2],[1,1],[2,0],[2,2]],
                    [[0,0],[1,0],[2,0],[0,2],[1,2],[2,2]]
                ];
                const faceTransforms = [
                    'translateZ(50px)',
                    'rotateY( 90deg) translateZ(50px)',
                    'rotateX( 90deg) translateZ(50px)',
                    'rotateX(-90deg) translateZ(50px)',
                    'rotateY(-90deg) translateZ(50px)',
                    'rotateY(180deg) translateZ(50px)'
                ];
                const face = (val) => `<div class="dice-face" style="transform:${faceTransforms[val-1]}">${
                    dotsOf[val-1].map(([r,c]) => `<span class="dice-dot" style="grid-row:${r+1};grid-column:${c+1}"></span>`).join('')
                }</div>`;
                ui.els.mainText.innerHTML = `
                    <div class="dice-stage">
                        <div class="dice-scene"><div class="dice-cube" id="dice-cube-0">${[1,6,2,5,3,4].map(face).join('')}</div></div>
                        <div class="dice-scene"><div class="dice-cube" id="dice-cube-1">${[1,6,2,5,3,4].map(face).join('')}</div></div>
                    </div>
                    <div id="dice-sum" class="dice-sum"></div>`;
                ui.els.mainText.classList.add('visible');
                break;
            }

            case 'picker': {
                ui.els.mainText.style.display = 'flex';
                ui.els.mainText.style.flexDirection = 'column';
                ui.els.mainText.style.alignItems = 'center';
                ui.els.mainText.style.justifyContent = 'center';
                ui.els.mainText.innerHTML = `
                    <div class="wheel-stage">
                        <div class="wheel-wrapper">
                            <div class="wheel-pointer"></div>
                            <canvas class="wheel-canvas" id="wheel-canvas" width="380" height="380"></canvas>
                        </div>
                    </div>
                    <div id="wheel-winner" class="wheel-winner"></div>`;
                ui.els.mainText.classList.add('visible');
                break;
            }
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
        animating: false,
        roll() {
            if (this.animating) return;
            if (state.view === 'dice') { app.clear(); return; }
            features.setView('dice');
            this.animating = true;
            const cube0 = document.getElementById('dice-cube-0');
            const cube1 = document.getElementById('dice-cube-1');
            if (!cube0 || !cube1) { this.animating = false; return; }
            const v1 = Math.floor(Math.random() * 6);
            const v2 = Math.floor(Math.random() * 6);
            state.diceValues = [v1, v2];
            const faceAngles = [{x:0,y:0},{x:0,y:-90},{x:-90,y:0},{x:90,y:0},{x:0,y:90},{x:0,y:180}];

            // Phase 1: Chaotic spin
            let tick = 0;
            const spin = setInterval(() => {
                const rx = Math.floor(Math.random() * 720);
                const ry = Math.floor(Math.random() * 720);
                cube0.style.transition = 'none';
                cube1.style.transition = 'none';
                cube0.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
                cube1.style.transform = `rotateX(${Math.floor(Math.random() * 720)}deg) rotateY(${Math.floor(Math.random() * 720)}deg)`;
                if (++tick > 30) {
                    clearInterval(spin);
                    // Phase 2: Deceleration
                    const a1 = faceAngles[v1], a2 = faceAngles[v2];
                    const extra = (3 + Math.floor(Math.random() * 3)) * 360;
                    cube0.style.transition = 'transform 1.5s cubic-bezier(0.05, 0.9, 0.3, 1)';
                    cube1.style.transition = 'transform 1.5s cubic-bezier(0.05, 0.9, 0.3, 1)';
                    cube0.style.transform = `rotateX(${a1.x - extra}deg) rotateY(${a1.y - extra}deg)`;
                    cube1.style.transform = `rotateX(${a2.x - extra}deg) rotateY(${a2.y - extra}deg)`;
                    // Phase 3: Result
                    setTimeout(() => {
                        const sum = v1 + v2 + 2;
                        const el = document.getElementById('dice-sum');
                        if (el) { el.innerText = 'Total: ' + sum; el.classList.add('show'); }
                        [cube0, cube1].forEach((c, i) => {
                            const scene = c.closest('.dice-scene');
                            if (scene) scene.classList.add('winner');
                        });
                        AudioService.toggle('success');
                        this.animating = false;
                        app.broadcastState();
                    }, 1800);
                }
            }, 50);
        }
    },

    picker: {
        spinning: false,
        currentAngle: 0,

        PALETTES: {
            dark: ['#e94560','#0f3460','#533483','#ff6b35','#00b4d8','#2ec4b6','#e71d36','#ff9f1c','#7209b7','#3a0ca3','#4361ee','#4cc9f0'],
            light: ['#b8c6db','#f5b7b1','#a3de83','#f9e79f','#85c1e9','#d7bde2','#f0b27a','#a9cce3','#f1948a','#82e0aa','#d2b4de','#fad7a0'],
            neon: ['#ff0055','#00ff9f','#00d4ff','#ffd700','#8b5cf6','#ff6bcb','#00ffc8','#ff4400','#aa00ff','#00e5ff','#76ff03','#f50057'],
            sketch: ['#d33682','#268bd2','#b58900','#cb4b16','#859900','#6c71c4','#2aa198','#dc322f','#073642','#586e75'],
            nature: ['#2e7d32','#558b2f','#00897b','#5d4037','#795548','#3e2723','#81c784','#a5d6a7','#4db6ac','#8d6e63'],
            ocean: ['#004080','#006994','#00b4d8','#48cae4','#caf0f8','#ff6b6b','#023e8a','#0077b6','#90e0ef','#ff9f1c'],
            sunset: ['#7209b7','#b5179e','#f72585','#ff9f1c','#ff6b35','#ff0054','#560bad','#3a0ca3','#e0aaff','#f48c6e'],
            gameboy: ['#0f380f','#306230','#8bac0f','#9bbc0f'],
            '8bit': ['#ff0044','#00e5ff','#ffcc00','#00c853','#ff9100','#d500f9','#f44336','#2196f3'],
            mint: ['#ffb5c2','#a8e6cf','#dcedc1','#ffd3b6','#ffaaa5','#a8edea','#fed6e3','#b5ead7','#c7ecee','#ffc3a0'],
            warm: ['#ff6b35','#f7931e','#ffd700','#ff4500','#ff7e5f','#feb47b','#ff8c42','#e65c00','#ffaa71','#d94b00'],
            slate: ['#94a3b8','#64748b','#475569','#818cf8','#6366f1','#a5b4fc','#7c3aed','#6d28d9','#8b5cf6','#c4b5fd'],
            neutral: ['#007aff','#5856d6','#34c759','#ff9500','#ff3b30','#af52de','#5ac8fa','#ff2d55','#00c7be','#ffcc00'],
            navy: ['#3b82f6','#0ea5e9','#f59e0b','#10b981','#8b5cf6','#f43f5e','#06b6d4','#84cc16','#f97316','#6366f1'],
            silver: ['#10b981','#0ea5e9','#8b5cf6','#f43f5e','#f59e0b','#06b6d4','#84cc16','#f97316','#6366f1','#3b82f6'],
        },
        getPalette() {
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            return this.PALETTES[theme] || this.PALETTES.dark;
        },

        async setup() {
            const text = await modal.show({
                title: 'Sorteio Aleatorio',
                html: '<textarea class="modal-input" placeholder="Nomes separados por virgula" rows="4"></textarea>'
            });
            if (text) this.run(text.split(',').map(s => s.trim()).filter(Boolean));
        },

        drawWheel(names, canvas, angle) {
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            const size = canvas.clientWidth;
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const cx = size / 2;
            const cy = size / 2;
            const r = size / 2 - 10;
            const count = names.length;

            if (count === 0) {
                ctx.clearRect(0, 0, size, size);
                return;
            }

            const slice = (Math.PI * 2) / count;
            const offset = -Math.PI / 2;
            ctx.clearRect(0, 0, size, size);

            for (let i = 0; i < count; i++) {
                const start = offset + angle + i * slice;
                const end = start + slice;

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, start, end);
                ctx.closePath();
                const palette = this.getPalette();
                ctx.fillStyle = palette[i % palette.length];
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                ctx.lineWidth = 2;
                ctx.stroke();

                const mid = start + slice / 2;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(mid);
                const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#fff';
                ctx.fillStyle = textColor;
                ctx.font = `bold ${Math.max(11, 14 - count * 0.15)}px -apple-system, "Montserrat", sans-serif`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';

                let display = names[i];
                const maxWidth = r * 0.55;
                if (ctx.measureText(display).width > maxWidth) {
                    while (ctx.measureText(display + '...').width > maxWidth && display.length > 2) {
                        display = display.slice(0, -1);
                    }
                    display += '...';
                }
                ctx.fillText(display, r - 16, 0);
                ctx.restore();
            }

            const hubRadius = Math.max(18, size * 0.06);
            const style = getComputedStyle(document.documentElement);
            const accent = style.getPropertyValue('--accent-color').trim() || '#4facfe';
            const bg = style.getPropertyValue('--bg-grad-1').trim() || '#0f2027';
            ctx.beginPath();
            ctx.arc(cx, cy, hubRadius, 0, Math.PI * 2);
            ctx.fillStyle = bg;
            ctx.fill();
            ctx.strokeStyle = accent;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.shadowColor = accent;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fillStyle = accent;
            ctx.fill();
            ctx.shadowBlur = 0;
        },

        run(names) {
            if (this.spinning || names.length < 2) return;
            features.setView('picker');

            const canvas = document.getElementById('wheel-canvas');
            const winEl = document.getElementById('wheel-winner');
            if (!canvas || !winEl) return;

            this.spinning = true;
            winEl.classList.remove('show');
            winEl.textContent = '';

            const winIndex = Math.floor(Math.random() * names.length);
            const slice = (Math.PI * 2) / names.length;
            const fullSpins = 5 + Math.floor(Math.random() * 4);

            // Calculate where the wheel must stop so slice winIndex is at the pointer (top)
            // With offset -π/2 in drawWheel, the pointer (top) is at canvas angle 0 in the
            // wheel's reference frame. Slice i spans from angle+i*slice to angle+(i+1)*slice.
            // For slice winIndex to contain the pointer: angle ≡ -winIndex*slice - extraOffset
            const extraOffset = slice * (0.05 + Math.random() * 0.85);
            const desiredAngle = -(winIndex * slice + extraOffset);

            // One full rotation forward from current position to desired angle
            const startAngle = this.currentAngle;
            const oneMore = ((desiredAngle - startAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            const totalRotation = fullSpins * Math.PI * 2 + oneMore;
            const endAngle = startAngle + totalRotation;
            const duration = 4000 + Math.random() * 2000;
            const startTime = performance.now();

            const animate = (now) => {
                const elapsed = now - startTime;
                const t = Math.min(elapsed / duration, 1);
                const progress = 1 - Math.pow(1 - t, 4);

                this.currentAngle = startAngle + (endAngle - startAngle) * progress;
                this.drawWheel(names, canvas, this.currentAngle);

                if (t < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.currentAngle = endAngle;
                    this.drawWheel(names, canvas, this.currentAngle);
                    this.spinning = false;
                    winEl.textContent = '\u{1F3C6} ' + names[winIndex];
                    winEl.classList.add('show');
                    AudioService.toggle('fanfare');
                    ui.confetti();
                }
            };

            requestAnimationFrame(animate);
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
                    </div>
                `;
            });

            const display = document.getElementById('poll-display');
            display.innerHTML = html;
            display.style.display = 'flex';
            document.getElementById('poll-actions').style.display = 'flex';
            if (!isSync) app.clear(); // Clear main text only on fresh build

            // Keyboard shortcuts listener (only if not already attached)
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
            AudioService.toggle(delta > 0 ? 'pointUp' : 'pointDown');
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

            document.querySelectorAll('.poll-item').forEach(el => el.classList.remove('poll-winner-highlight'));
            winners.forEach(i => {
                document.getElementById(`poll-item-${i}`).classList.add('poll-winner-highlight');
            });

            AudioService.toggle('trophy');
            ui.confetti();
            app.broadcastState();
        },
        close() {
            this.active = false;
            document.getElementById('poll-display').style.display = 'none';
            document.getElementById('poll-actions').style.display = 'none';
            document.removeEventListener('keydown', this._keyHandler);
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
                // Force toolbar visible logic if needed, or just show colors
                document.getElementById('control-panel').classList.add('expanded'); // Reusing existing expanded logic
                toolbarColors.style.display = 'flex';
                ui.els.input.focus();
                this.setScheme(this.activeScheme);
            } else {
                toolbarColors.style.display = 'none';
                document.getElementById('control-panel').classList.remove('expanded');
                // Reset border
                if (ui.els.input) ui.els.input.style.borderColor = '';
            }
        },
        setScheme(scheme) {
            this.activeScheme = scheme;
            // Update selection in toolbar
            document.querySelectorAll('.inline-scheme-btn').forEach(btn => btn.classList.remove('active'));
            const btn = document.getElementById(`toolbar-scheme-${scheme}`);
            if (btn) btn.classList.add('active');

            // Visual feedback on input border
            const colors = {
                'default': '#FFB743',
                'scheme2': '#5271FF',
                'scheme3': '#35B729'
            };
            if (this.active && ui.els.input) {
                ui.els.input.style.borderColor = colors[scheme] || 'var(--glass-border)';
            }
        },
        create() {
            // Robust text retrieval
            let text = ui.els.input.innerText;

            // Cleanup any zero-width spaces or potential HTML artifacts
            text = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

            if (!text) text = "Novo Slide";

            const data = {
                text: text,
                scheme: this.activeScheme
            };
            localStorage.setItem('slideData', JSON.stringify(data));
            window.location.href = 'futuro-digital.html';
        },
        openSlides() {
            const data = {
                text: "https://docs.google.com/presentation/d/1BR9b4cx1kMfBY3zkMFgV5BjtMpbur9K7CV6J2YUNr70/view",
                scheme: 'default'
            };
            localStorage.setItem('slideData', JSON.stringify(data));
            window.location.href = 'futuro-digital.html';
        },
        openPortal() {
            const data = {
                text: "bit.ly/futurodigitalcml",
                scheme: 'scheme2' // Green, Blue, Purple
            };
            localStorage.setItem('slideData', JSON.stringify(data));
            window.location.href = 'futuro-digital.html';
        },
        openChallenge() {
            const data = {
                text: "bit.ly/desafiocml",
                scheme: 'scheme3' // Green, Orange, Red
            };
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

                // Touch support
                canvas.ontouchstart = (e) => { e.preventDefault(); this.start(e.touches[0]); };
                canvas.ontouchmove = (e) => { e.preventDefault(); this.draw(e.touches[0]); };
                canvas.ontouchend = () => this.stop();
            }
            this.toggle();
        },
        resize() {
            const canvas = document.getElementById('ink-canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        },
        toggle() {
            this.active = !this.active;
            const canvas = document.getElementById('ink-canvas');
            const toolbar = document.getElementById('ink-toolbar');
            canvas.classList.toggle('active', this.active);
            toolbar.classList.toggle('visible', this.active);
            document.getElementById('btn-ink').classList.toggle('active', this.active);

            if (this.active) {
                this.setColor(this.color);
            }
        },
        start(e) {
            this.isDrawing = true;
            [this.lastX, this.lastY] = [e.clientX, e.clientY];
        },
        draw(e) {
            if (!this.isDrawing) return;
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(e.clientX, e.clientY);
            this.ctx.stroke();

            // Broadcast stroke
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
