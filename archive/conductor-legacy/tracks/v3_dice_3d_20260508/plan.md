# 🗺️ Implementation Plan: Dice & Draws 3D

## Phase 1: 3D Geometry & Physics
- [x] Task: Create CSS 3D Cube Component
    - [x] Implement `.dice-cube` with 6 faces and `preserve-3d` (`layout.css:1241-1273`)
- [x] Task: Random Rotation Engine
    - [x] JS logic to calculate final rotation based on result (`features.js:134-180`)
- [x] Task: Conductor - User Manual Verification '3D Geometry & Physics'

## Phase 2: Suspense Engines
- [x] Task: Result Highlight FX
    - [x] Add winner glow + sum display (`features.js:166-173`, `layout.css:1284-1303`)
- [-] Task: Slot Machine Reel Logic
    - **Superseded** by track `v3_name_picker_v2_20260620` (Canvas Wheel of Fortune) — the v1 rAF reel shared the stuck-animation-state class of bugs called out in the v2 spec. The Canvas Wheel in `proj-multifile-v2/features.js:183-350` delivers the suspense engine for name draws.
- [x] Task: Conductor - User Manual Verification 'Suspense Engines'

## Notes
- Total suspense duration for dice: ~3s (30 ticks × 50ms chaotic spin + 1.5s cubic-bezier decel).
- Object theming: 4 themes (8bit, gameboy, sketch, neon) in `layout.css:1305-1348`; other themes fall through to default cube styling.
- Acceptance criteria from `spec.md`: all met (rotation, ≥2s suspense, focal-point winner) across the combined dice + wheel surface.
