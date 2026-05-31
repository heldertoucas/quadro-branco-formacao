/* --- 2. STATE & CONSTANTS --- */

const BRANDS = {
    'cml': { light: 'https://i.imgur.com/3Iwst9h.png', dark: 'https://i.imgur.com/rCMS5Ap.png', name: 'CMLisboa' },
    'futuro': { light: 'https://i.imgur.com/L7wNgqt.png', dark: 'https://i.imgur.com/tYc9GgI.png', name: 'Futuro Digital' },
    'passaporte': { light: 'https://i.imgur.com/Rzf5kQ3.png', dark: 'https://i.imgur.com/Mzwq7n0.png', name: 'Passaporte Competências' },
    'ia': { light: 'https://i.imgur.com/9qGRGAt.png', dark: 'https://i.imgur.com/QPifhum.png', name: 'IA para Todos' }
};

const PALETTES = {
    'dark': ['#ff0000', '#00ff00', '#ffff00', '#ffffff'],
    'light': ['#d32f2f', '#388e3c', '#fbc02d', '#2b2b2b'],
    'neon': ['#ff0055', '#00ff9f', '#00e5ff', '#ffffff'],
    'nature': ['#2e7d32', '#00897b', '#fcc419', '#5d4037'],
    'ocean': ['#4facfe', '#00f2fe', '#ffffff', '#2196f3'],
    'sketch': ['#d33682', '#2b2b2b', '#268bd2', '#859900'],
    'sunset': ['#ff9f1c', '#ff4d00', '#e040fb', '#ffffff'],
    'gameboy': ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
    '8bit': ['#ff0044', '#ffcc00', '#00ffcc', '#ffffff']
};

const SOUNDS = {
    success: "sounds/certo.mp3",
    error: "sounds/errado.mp3",
    pointUp: "sounds/mais_um_ponto.mp3",
    pointDown: "sounds/menos_um_ponto.mp3",
    drum: "sounds/rufar.mp3",
    clap: "sounds/aplausos.mp3",
    palmas: "sounds/palmas.mp3",
    fanfare: "sounds/trompetas.mp3",
    trophy: "sounds/sucesso_guitarra.mp3"
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

/* Helper for SVG Icons */
const ICONS = {
    Check: '<polyline points="22 4 12 14.01 9 11.01"></polyline><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>',
    X: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
    Drum: '<path d="M12 2c5.5 0 10 1.8 10 4s-4.5 4-10 4S2 8.2 2 6s4.5-4 10-4z"></path><path d="M22 6v8c0 2.2-4.5 4-10 4S2 16.2 2 14V6"></path>',
    Clap: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>',
    Plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
    Minus: '<path d="M5 12h14"></path>',
    Speaker: '<path d="M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path><line x1="16" y1="4" x2="16" y2="20"></line><path d="M4 14h2"></path><path d="M4 10h2"></path><path d="M20 10h2"></path><path d="M20 14h2"></path>',
    Trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>',
    Target: '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
    Zap: '<path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 Z"></path>',
    Moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
    Heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
    Star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
    Ghost: '<path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"></path>',
    Sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path>',
    Minimize: '<path d="M8 3v5H3"></path><path d="M21 8h-5V3"></path><path d="M3 16h5v5"></path><path d="M16 21v-5h5"></path>',
    Maximize: '<path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path>'
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
    isSerif: false,
    isHighlight: false,
    textAlignment: 'center', // 'left', 'center', 'right'
    isAnimated: false,
    isInkHighlighter: false,
    inkColor: '#ff0000',
    view: 'text', // 'text', 'qr', 'dice', 'picker', 'none'
    channel: null
};