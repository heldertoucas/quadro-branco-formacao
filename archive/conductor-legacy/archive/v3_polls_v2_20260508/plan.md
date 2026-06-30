# 🗺️ Implementation Plan: Polls v2

## Phase 1: Visual Enrichment
- [x] Task: Define Color Palettes for 6 Options
    - [x] Update CSS with `--poll-col-1` to `--poll-col-6`
- [x] Task: Implement Glass-Liquid Animation
    - [x] Create a reusable CSS animation for the bar "cap"
- [x] Task: Conductor - User Manual Verification 'Visual Enrichment'

## Phase 2: Interaction & Ceremony
- [x] Task: Bounce & Particle Feedback
    - [x] Add `poll-impact` animation class on vote change
- [x] Task: The "Grand Reveal" Logic
    - [x] Update `features.poll.checkWinner()` to apply grayscale to others and enhanced glow to winner
    - [x] Customize `ui.confetti()` to accept color arrays
- [x] Task: Conductor - User Manual Verification 'Interaction & Ceremony'
