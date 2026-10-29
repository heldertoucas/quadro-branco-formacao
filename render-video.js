/**
 * Motor Automatizado de Renderização de Vídeo de Alta Fidelidade - Futuro Digital
 * Utiliza Playwright (Browser Nativo) + FFmpeg para gravação fluida a 1080p/60fps.
 * Garante transição suave a partir de quadro branco e duração exata sem variações de velocidade.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

async function renderSequence(sequence, defaultSettings, outputDir) {
    const width = defaultSettings.width || 1920;
    const height = defaultSettings.height || 1080;
    const fps = defaultSettings.fps || 60;
    const bitrate = defaultSettings.bitrate || '14M';
    const durationSec = sequence.duration || 120;
    const outputFile = path.resolve(outputDir, sequence.fileName || `${sequence.id || 'seq'}.mp4`);

    const tempDir = path.resolve(__dirname, '.temp-recordings');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    console.log(`\n======================================================`);
    console.log(`🎬 RENDERIZANDO SEQUÊNCIA: "${sequence.title}"`);
    console.log(`======================================================`);
    console.log(`📐 Resolução:   ${width}x${height} @ ${fps} FPS`);
    console.log(`⏱️ Duração:     ${durationSec}s (${(durationSec / 60).toFixed(1)} min)`);
    console.log(`🎨 Tema:        ${sequence.theme || defaultSettings.theme || 'scheme3'}`);
    console.log(`💾 Destino:     ${outputFile}`);
    console.log(`======================================================\n`);

    let browser;
    const launchOptions = {
        headless: true,
        args: [
            '--disable-gpu-vsync',
            '--disable-frame-rate-limit',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
        ]
    };

    try {
        browser = await chromium.launch({ ...launchOptions, channel: 'msedge' });
    } catch (e1) {
        try {
            browser = await chromium.launch({ ...launchOptions, channel: 'chrome' });
        } catch (e2) {
            browser = await chromium.launch(launchOptions);
        }
    }

    const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        recordVideo: {
            dir: tempDir,
            size: { width, height }
        }
    });

    const page = await context.newPage();
    const htmlPath = 'file:///' + path.resolve(__dirname, 'futuro-digital.html').replace(/\\/g, '/');

    // Carregar imagem local em Base64 caso aplicável
    let imageUri = null;
    if (sequence.image) {
        let imgPath = sequence.image;
        if (!imgPath.startsWith('http://') && !imgPath.startsWith('https://')) {
            if (!path.isAbsolute(imgPath)) {
                imgPath = path.resolve(__dirname, imgPath);
            }
            if (fs.existsSync(imgPath)) {
                const ext = path.extname(imgPath).toLowerCase();
                const mime = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
                const b64 = fs.readFileSync(imgPath).toString('base64');
                imageUri = `data:${mime};base64,${b64}`;
            } else {
                imageUri = sequence.image;
            }
        } else {
            imageUri = sequence.image;
        }
    }

    await page.goto(htmlPath, { waitUntil: 'domcontentloaded' });

    // Injetar estilos de estúdio e cortina de quadro branco inicial
    await page.addStyleTag({
        content: `
            #hud-container, .admin-drawer, .floating-action-btn { display: none !important; opacity: 0 !important; visibility: hidden !important; }
            body { overflow: hidden !important; background: #ffffff !important; }
            
            #whiteboard-curtain {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: #ffffff;
                z-index: 999999;
                pointer-events: none;
                transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            #whiteboard-curtain.fade-out {
                opacity: 0;
            }
        `
    });

    // Injetar a cortina branca
    await page.evaluate(() => {
        const curtain = document.createElement('div');
        curtain.id = 'whiteboard-curtain';
        document.body.appendChild(curtain);
    });

    // Configurar o conteúdo e tema da cena
    await page.evaluate(({ title, subtitle, theme, imageUri }) => {
        const h1 = document.getElementById('slide-heading');
        const sub = document.getElementById('slide-subheading');
        const img = document.getElementById('team-img-elem');

        if (h1) {
            h1.textContent = title || '';
            const len = (title || '').length;
            let factor = 1.0;
            if (len > 15) factor = Math.max(0.35, 1.0 - ((len - 15) * 0.005));
            h1.style.setProperty('--scale-factor', factor);
            h1.style.display = title ? 'block' : 'none';
        }

        if (sub) {
            if (subtitle && subtitle.trim().length > 0) {
                sub.textContent = subtitle;
                sub.style.display = 'block';
            } else {
                sub.textContent = '';
                sub.style.display = 'none';
            }
        }

        const themeToApply = theme || 'scheme3';
        document.body.classList.remove('scheme-scheme2', 'scheme-scheme3');
        if (themeToApply === 'scheme2') {
            document.body.classList.add('scheme-scheme2');
        } else if (themeToApply === 'scheme3') {
            document.body.classList.add('scheme-scheme3');
        }

        if (img) {
            if (imageUri) {
                img.src = imageUri;
            } else {
                if (themeToApply === 'scheme2') img.src = 'https://i.imgur.com/6FOOuFp.png';
                else if (themeToApply === 'scheme3') img.src = 'https://i.imgur.com/RKBwuaM.png';
                else img.src = 'https://i.imgur.com/ZJvakeb.png';
            }
        }
    }, {
        title: sequence.title,
        subtitle: sequence.subtitle,
        theme: sequence.theme || defaultSettings.theme,
        imageUri
    });

    // Esperar 400ms em tela branca absoluta e depois revelar os elementos suavemente
    await page.waitForTimeout(400);
    await page.evaluate(() => {
        const curtain = document.getElementById('whiteboard-curtain');
        if (curtain) curtain.classList.add('fade-out');
    });

    console.log(`⏳ A gravar em tempo real (${durationSec} segundos)...`);
    const startTime = Date.now();
    const intervalMs = 1000;
    let elapsed = 0;

    while (elapsed < durationSec) {
        await page.waitForTimeout(intervalMs);
        elapsed += 1;
        const pct = ((elapsed / durationSec) * 100).toFixed(1);
        const barLength = 25;
        const filled = Math.round((elapsed / durationSec) * barLength);
        const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        process.stdout.write(`\r⏳ Progresso: [${bar}] ${elapsed}s / ${durationSec}s (${pct}%)`);
    }
    console.log('\n🛑 Gravação concluída. A finalizar ficheiro...');

    const videoPromise = page.video().path();
    await page.close();
    await context.close();
    await browser.close();

    const rawVideoPath = await videoPromise;
    console.log(`🎞️ Gravação bruta Playwright capturada: ${rawVideoPath}`);

    // Pós-processamento com FFmpeg para MP4 H.264 @ 60fps constante de alta fidelidade
    console.log(`⚙️ A transcodificar para MP4 1080p@60fps (${bitrate})...`);
    await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-y',
            '-i', rawVideoPath,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-b:v', bitrate,
            '-pix_fmt', 'yuv420p',
            '-r', `${fps}`,
            outputFile
        ], { stdio: 'inherit' });

        ffmpeg.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg finalizou com código ${code}`));
        });
        ffmpeg.on('error', reject);
    });

    // Limpar gravação temporária webm
    try {
        if (fs.existsSync(rawVideoPath)) fs.unlinkSync(rawVideoPath);
    } catch (e) {}

    // Se o diretório externo do curso existir, copiar também
    const externalCourseDir = 'C:/tmp/Curso Teams Sharepoint Online/recursos';
    if (fs.existsSync(externalCourseDir)) {
        try {
            const externalTarget = path.join(externalCourseDir, path.basename(outputFile));
            fs.copyFileSync(outputFile, externalTarget);
            console.log(`📋 Copiado adicionalmente para o curso: ${externalTarget}`);
        } catch (e) {}
    }

    console.log(`✅ Ficheiro finalizado com sucesso: ${outputFile}\n`);
}

async function main() {
    const configPath = path.join(__dirname, 'render-sequences.json');
    if (!fs.existsSync(configPath)) {
        console.error(`❌ Ficheiro de configuração não encontrado: ${configPath}`);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const { defaultSettings, sequences } = config;

    const outputDir = path.resolve(__dirname, 'videos');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const targetArg = process.argv[2] || 'boas-vindas';

    if (targetArg === '--all' || targetArg === 'all') {
        console.log(`🚀 A iniciar renderização de TODAS as ${sequences.length} sequências...`);
        for (const seq of sequences) {
            await renderSequence(seq, defaultSettings, outputDir);
        }
    } else {
        const seq = sequences.find(s => s.id === targetArg || s.fileName === targetArg || s.title.toLowerCase().includes(targetArg.toLowerCase())) || sequences[0];
        await renderSequence(seq, defaultSettings, outputDir);
    }
}

main().catch(err => {
    console.error('❌ Erro durante a renderização:', err);
    process.exit(1);
});
