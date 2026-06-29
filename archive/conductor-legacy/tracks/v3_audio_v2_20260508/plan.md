# 🗺️ Implementation Plan: Audio Atmosphere v2

## Phase 1: Interface Physics
- [x] Task: UI Sound Engine
    - [x] `AudioService.playTick()` for common interactions (`ui.js:67-86`) — called on theme/mode/brand set (`app.js:2-4`) and button clicks (`app.js:164`, `ui.js:604`)
- [x] Task: Volume Control UI
    - [x] Range input in sound drawer with `localStorage('qv_volume')` persistence (`ui.js:19-26, 433`, `state.js:54`)
- [x] Task: Conductor - User Manual Verification 'Interface Physics'

## Phase 2: Immersive Kits
- [x] Task: Map Sound Banks to Themes
    - [x] `SOUND_KITS` maps 5 themes to waveform — `pro` (sine), `neon` (sawtooth), `8bit` (square), `gameboy` (triangle), `sketch` (sine) (`ui.js:1-6`)
    - [x] Flat `SOUNDS` map in `state.js:8-18` — MP3 primary, synth fallback (theme-aware) when MP3 missing
- [x] Task: Audio-Visual Sync
    - [x] `sound-reactive` CSS pulse on `h1` (brightness + drop-shadow) triggered by `playTick` and `toggle` (`layout.css:740-748`, `ui.js:62-63, 84-85`)
- [x] Task: Conductor - User Manual Verification 'Immersive Kits'

## Notes
- Dead asset cleanup: deleted `proj-multifile-v2/sounds/` (11 duplicate files) and 2 orphan MP3s (`retro-video-game-coin-pickup-38299.mp3`, `sucesso_guitarra_antigo.mp3`).
- AnalyserNode: spec listed as optional. CSS pulse approach adopted.
- Per-theme MP3 sets (8bit/Neon specific sounds) and BiquadFilter wiring were considered and explicitly rejected by the user as out of scope.
