# 🗺️ Implementation Plan: QR Code v2

## Phase 1: Organic Integration
- [x] Task: Glassified Rendering Logic
    - [x] `#qr-container` background: `var(--glass-bg)` + `backdrop-filter: blur(20px)` + `var(--glass-border)` (`layout.css:1146-1155`)
    - [x] QRious config: `background: 'transparent'`, `backgroundAlpha: 0`, `foreground: '#000000'`, `level: 'H'` (`features.js:48-56`, `ui.js:494-505`)
    - [x] Inner `#qr-canvas-wrapper` has `background: rgba(255,255,255,0.92)` for dot contrast on dark themes
- [x] Task: Active Brand Logo Overlay
    - [x] `ui.buildQrLogoOverlay()` helper returns `<div id="qr-logo-overlay">` with brand logo from `BRANDS[state.brand]` (`ui.js:426-431`)
    - [x] Pill-shaped white backing (68×68, border-radius 34px) handles both square and wide banner logos (`layout.css:1193-1212`)
    - [x] Applied in both `features.setView('qr')` and `ui.updateDisplay(isQR)`
- [x] Task: Close Button Restyle
    - [x] `#qr-close` and `#qr-expand` use glass styling (var(--glass-hover), backdrop-blur) instead of solid red (`layout.css:1214-1240`)
- [x] Task: Conductor - User Manual Verification 'Organic Integration'

## Phase 2: Cinematic Reach
- [x] Task: Card Flip 3D Animation
    - [x] `#flip-card` wraps both `#main-text` and `#qr-container` in a 3D perspective container (`index.html:162-171`)
    - [x] `.flip-card-inner` with `transform-style: preserve-3d` + 0.8s cubic-bezier transition (`layout.css:1108-1140`)
    - [x] Front/back faces with `backface-visibility: hidden`; back pre-rotated `rotateY(180deg)`; `.flipped` class triggers the flip
    - [x] `features.setView('qr')` adds `.flipped`; `setView('text')` and `ui.closeQR()` remove it
- [x] Task: Cinema Mode (full-screen expansion)
    - [x] `#qr-expand` button (⤢) in top-left of QR container
    - [x] `.cinema-mode` class: `position: fixed; inset: 0; z-index: 9999` with theme gradient background (`layout.css:1263-1280`)
    - [x] QR + logo scale via `min(2.2, 60vmin/280)` to fit any viewport
    - [x] Escape key exits cinema mode (keeps QR view); `ui.closeQR()` exits both cinema and flip
- [x] Task: Conductor - User Manual Verification 'Cinematic Reach'

## Notes
- The flip replaces the old `popIn` scale animation — transition now feels like a physical card flip.
- Both QRious call sites (features.js and ui.js sync path) use the same config and logo overlay helper.
- Removed `qrContainer.style.display = 'none'` from `setView` — the flip card's `backface-visibility: hidden` now controls QR visibility.
- Logo overlay uses `max-width: 80px; max-height: 36px` to handle both square icons (Futuro Digital) and wide banner logos (CML) without distortion.
