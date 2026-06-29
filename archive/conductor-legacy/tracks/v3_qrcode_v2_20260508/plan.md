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

## Phase 3: Polish & Refinements (Current Session)
- [x] Task: Remove Brand Logo Overlay from QR Code
    - [x] Remove `ui.buildQrLogoOverlay()` call sites in `features.js:case 'qr'` and `ui.js:updateDisplay`
    - [x] Clean up CSS styles for `#qr-logo-overlay` in `layout.css`
    - [x] Delete/deprecate `ui.buildQrLogoOverlay()` helper method in `ui.js`
- [x] Task: Giant Fullscreen Cinema Mode
    - [x] Overhaul `#qr-container.cinema-mode` to be edge-to-edge fullscreen (no card margins, border, or glass container limits)
    - [x] Scale QR wrapper to fill the viewport (e.g. `85vmin`)
    - [x] Apply pixelated rendering to the canvas element for crisp scaling

## Notes
- The flip replaces the old `popIn` scale animation — transition now feels like a physical card flip.
- Removing the logo overlay restores readability and makes the QR code blend naturally with the glass backdrop wrapper.
- `image-rendering: pixelated` is applied to canvas to avoid browser blurring when scaling the QR code up to `85vmin`.
