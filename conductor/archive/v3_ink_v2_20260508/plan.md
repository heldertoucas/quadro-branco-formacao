# 🗺️ Implementation Plan: Ink Overlay v2

## Phase 1: Mathematics & Curves
- [x] Task: Implement Quadratic Bézier Smoothing
    - [x] Update `features.ink.draw()` to store last 3 points and use `quadraticCurveTo`
- [x] Task: Ink Performance Check
    - [x] Ensure low latency synchronization via `BroadcastChannel`
- [x] Task: Conductor - User Manual Verification 'Mathematics & Curves'

## Phase 2: Materiality & Modes
- [x] Task: Neon Glow & Shadow Logic
    - [x] Update `features.ink.setColor()` to apply `shadowBlur` if in dark theme
- [x] Task: Highlighter Tool Implementation
    - [x] Add `opacity` and `lineWidth` toggle for Highlighter mode
- [x] Task: Theme-Adaptive Palettes
    - [x] Auto-adjust colors based on active theme
- [x] Task: Conductor - User Manual Verification 'Materiality & Modes'
