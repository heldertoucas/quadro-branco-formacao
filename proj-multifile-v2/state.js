const BRANDS = {
    'cml': { light: 'https://i.imgur.com/3Iwst9h.png', dark: 'https://i.imgur.com/rCMS5Ap.png', name: 'CMLisboa' },
    'futuro': { light: 'https://i.imgur.com/L7wNgqt.png', dark: 'https://i.imgur.com/tYc9GgI.png', name: 'Futuro Digital' },
    'passaporte': { light: 'https://i.imgur.com/Rzf5kQ3.png', dark: 'https://i.imgur.com/Mzwq7n0.png', name: 'Passaporte Competências' },
    'ia': { light: 'https://i.imgur.com/9qGRGAt.png', dark: 'https://i.imgur.com/QPifhum.png', name: 'IA para Todos' }
};

const SOUNDS = {
    success: "media/certo.mp3",
    error: "media/errado.mp3",
    pointUp: "media/mais_um_ponto.mp3",
    pointDown: "media/menos_um_ponto.mp3",
    drum: "media/rufar.mp3",
    clap: "media/aplausos.mp3",
    palmas: "media/palmas.mp3",
    fanfare: "media/trompetas.mp3",
    trophy: "media/sucesso_guitarra.mp3"
};

const SOUND_METADATA = [
    { id: 'success', color: 'var(--success-color)', icon: 'Check', label: 'Sucesso' },
    { id: 'error', color: 'var(--danger-color)', icon: 'X', label: 'Erro' },
    { id: 'drum', color: 'var(--warn-color)', icon: 'Drum', label: 'Tambores' },
    { id: 'clap', color: 'var(--clap-color)', icon: 'Clap', label: 'Ovação' },
    { id: 'palmas', color: 'var(--clap-color)', icon: 'Clap', label: 'Aplauso' },
    { id: 'pointUp', color: 'var(--success-color)', icon: 'Plus', label: '+1' },
    { id: 'pointDown', color: 'var(--danger-color)', icon: 'Minus', label: '-1' },
    { id: 'fanfare', color: 'var(--warn-color)', icon: 'Speaker', label: 'Fanfarra' },
    { id: 'trophy', color: 'var(--gold-color)', icon: 'Trophy', label: 'Vitória' }
];

const ICONS = {
    Check: '<polyline points="22 4 12 14.01 9 11.01"></polyline><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>',
    X: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
    Drum: '<path d="M12 2c5.5 0 10 1.8 10 4s-4.5 4-10 4S2 8.2 2 6s4.5-4 10-4z"></path><path d="M22 6v8c0 2.2-4.5 4-10 4S2 16.2 2 14V6"></path>',
    Clap: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>',
    Plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
    Minus: '<path d="M5 12h14"></path>',
    Speaker: '<path d="M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path><line x1="16" y1="4" x2="16" y2="20"></line><path d="M4 14h2"></path><path d="M4 10h2"></path><path d="M20 10h2"></path><path d="M20 14h2"></path>',
    Trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>',
    Target: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>'
};

const state = {
    queue: [], history: [], historyIndex: -1,
    timerInterval: null,
    theme: localStorage.getItem('qv_theme') || 'dark',
    mode: localStorage.getItem('qv_mode') || 'pro',
    brand: localStorage.getItem('qv_brand') || 'futuro',
    isExpanded: false,
    scores: {},
    audioCtx: null, activeSounds: {},
    volume: parseFloat(localStorage.getItem('qv_volume')) || 0.8,
    isSerif: false,
    isHighlight: false,
    textAlignment: 'center',
    diceValues: null,
    view: 'text',
    channel: null,
    stageMode: false,
    stagedChanges: false,
    lastProjectorPing: 0,
    showSafeArea: false
};
