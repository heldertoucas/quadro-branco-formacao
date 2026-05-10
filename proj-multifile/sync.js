/* --- 6. SYNC & BROADCAST --- */

const sync = {
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
                history: state.history,
                historyIndex: state.historyIndex,
                scores: state.scores,
                timerActive: !!state.timerInterval,
                timerRemaining: features.timer.remaining,
                timerDuration: features.timer.duration,
                pollLabels: features.poll.labels,
                pollVotes: features.poll.votes,
                pollActive: features.poll.active
            },
            data: state.view === 'text' ? ui.els.mainText.innerHTML : (state.view === 'qr' ? state.history[state.historyIndex] : null)
        });
    },

    handleBroadcast(data) {
        if (!data || typeof data !== 'object' || !data.type) return;
        const params = new URLSearchParams(window.location.search);
        const isProjector = params.get('mode') === 'projector';

        if (data.type === 'request_sync' && !isProjector) {
            this.broadcastState();
        }

        if (data.type === 'sync' && isProjector) {
            const s = data.state;
            if (!s) return;
            state.theme = s.theme || state.theme;
            state.brand = s.brand || state.brand;
            state.isSerif = !!s.isSerif;
            state.isHighlight = !!s.isHighlight;
            state.isAnimated = !!s.isAnimated;
            state.textAlignment = s.textAlignment || 'center';
            state.history = s.history || state.history;
            state.historyIndex = s.historyIndex !== undefined ? s.historyIndex : state.historyIndex;
            state.scores = s.scores || state.scores;
            ui.applyState();

            if (s.timerActive) {
                if (!state.timerInterval) {
                    features.timer.remaining = s.timerRemaining;
                    features.timer.duration = s.timerDuration;
                    features.timer.start(s.timerRemaining, true);
                }
            } else {
                if (state.timerInterval) features.timer.stop();
            }

            if (s.view === 'poll' && s.pollActive) {
                features.poll.votes = s.pollVotes;
                // Sanitize poll labels if they exist
                const cleanLabels = s.pollLabels ? s.pollLabels.map(l => DOMPurify.sanitize(l)) : [];
                features.poll.build(cleanLabels, true);
            } else if (s.view === 'score') {
                features.score.build(Object.keys(s.scores).length, true);
            } else {
                const cleanData = data.data ? DOMPurify.sanitize(data.data) : null;
                features.setView(s.view, cleanData);
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

        if (data.type === 'ink_stroke_v2' && isProjector) {
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

            if (data.glow) {
                features.ink.ctx.shadowBlur = 15;
                features.ink.ctx.shadowColor = data.color;
            } else {
                features.ink.ctx.shadowBlur = 0;
            }

            features.ink.ctx.beginPath();
            features.ink.ctx.moveTo(data.from.x, data.from.y);
            features.ink.ctx.quadraticCurveTo(data.control.x, data.control.y, data.to.x, data.to.y);
            features.ink.ctx.stroke();
        }

        if (data.type === 'ink_clear' && isProjector) {
            if (features.ink.ctx) features.ink.ctx.clearRect(0, 0, features.ink.ctx.canvas.width, features.ink.ctx.canvas.height);
        }
    }
};

// Aliases for compatibility with existing code calls
const broadcastState = () => sync.broadcastState();
const handleBroadcast = (data) => sync.handleBroadcast(data);