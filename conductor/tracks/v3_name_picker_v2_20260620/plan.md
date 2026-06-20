# Implementation Plan: Random Name Picker v2

## Decision
Approach **C — Canvas Wheel of Fortune** adopted. The rAF reel from approach B was rejected because it kept the same "stuck animation state" bugs called out in the spec (`features.js:203-255` in the pre-v2 implementation). Approach A (`slot-text`) was not adopted to avoid the CDN dependency. Approach C ships zero deps, gives a visually distinct UX, and the canvas + `requestAnimationFrame` loop has none of the composition/state issues of the old reel.

## Phase 1: Exploration & Decision
- [x] Review mockups A/B/C under `conductor/docs/mockup_name_*.html`
- [x] Evaluate: visual quality, code complexity, integration effort
- [x] Decide: adopt C (Canvas Wheel of Fortune)

## Phase 2: Integration
- [x] Implement `features.picker` in `proj-multifile-v2/features.js:183-350`
    - [x] `drawWheel(names, canvas, angle)` — Canvas 2D + DPR scaling, themed palettes, rotated slice labels, hub overlay (`features.js:217-294`)
    - [x] `run(names)` — 5–8 full spins, quartic ease-out, `spinning` guard, winner reveal, fanfare + confetti (`features.js:296-349`)
    - [x] `setup()` — modal input for comma-separated names (`features.js:209-215`)
- [x] Markup in `setView('picker')` — `wheel-stage` / `wheel-wrapper` / `wheel-pointer` / `wheel-canvas` / `wheel-winner` (`features.js:72-181`)
- [x] CSS — `.wheel-*` rules + 4 theme overrides + responsive (`proj-multifile-v2/layout.css:1353-1502`)
- [x] Entry points — Sorteio button + `?sorteio=` URL param wire to `features.picker.run` (`ui.js:342-344`)

## Phase 3: Polish
- [x] Test with 2–50 names (palette cycles, label truncation in `drawWheel`)
- [x] Test rapid re-spam — guarded by `spinning` flag, `wheel-winner` reset on each run
- [x] All themes — 15 palettes in `PALETTES` (`features.js:187-203`), 4 theme-specific CSS overrides (`layout.css:1405-1448`)
- [x] Responsive — `.wheel-canvas` width override at narrow viewport (`layout.css:1498-1502`)
