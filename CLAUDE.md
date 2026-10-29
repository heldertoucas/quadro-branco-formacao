# Project Instructions: quadro-branco-formacao

## Product Vision
Interactive multimedia training whiteboard, gamification assets, audio/SFX cues, and automated video rendering tools for Futuro Digital classroom sessions.

## Tech Stack
- **Web / Frontend**: Native HTML5, Canvas, Web Audio API, Vanilla JavaScript, CSS3.
- **Automation & Video Rendering**: Node.js, Playwright (`render-video.js`), PowerShell (`render.ps1`).
- **Package Manager**: `pnpm`

## Architecture
- `index.html`, `futuro-digital.html`, `webcam-studio.html`: Interactive trainer webviews and live drawing / quiz surfaces.
- `render-video.js` & `render-config.json`: Headless Playwright script that animates and records sequences to video.
- Audio assets (`*.mp3`): Positive/negative gamification sound effects and transitions.

## Verification & Execution Commands
- **Install**: `pnpm install`
- **Render Sequence**: `powershell -File ./render.ps1` or `node render-video.js`
- **Test Webview**: Open target `.html` in browser or serve locally via lightweight HTTP server.

## Standards
- **Zero Heavy Frameworks**: Keep UI zero-build, offline-first, native HTML/JS.
- **Asset Integrity**: Audio and image assets must remain local; do not introduce external CDN dependencies for offline classroom reliability.
