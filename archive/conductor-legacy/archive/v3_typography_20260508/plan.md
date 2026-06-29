# 🗺️ Implementation Plan: Typography v3.0

## Phase 1: Infrastructure & Optical Scaling
- [x] Task: Integrate **Playfair Display** Google Font.
    - [x] Update `index.html` head with new font family and weights.
- [x] Task: Implement Dynamic Optical Scaling Engine.
    - [x] Create `ui.updateOpticalScaling(charCount)` to calculate CSS custom properties.
    - [x] Map character count to `--optical-weight` and `--optical-spacing`.
- [x] Task: Update Display Logic for Variable Line-Height.
    - [x] Refactor `ui.updateDisplay` to apply dynamic line-height based on text volume.
- [x] Task: Conductor - User Manual Verification 'Infrastructure & Optical Scaling'

## Phase 2: Editorial Modes & UI Integration
- [x] Task: Implement **Serif Mode** (Citations).
    - [x] Define `.serif-mode` CSS class and apply Playfair Display styling.
- [x] Task: Implement **Highlighting Animation** (Glow/Pulse).
    - [x] Define `highlight-mode` CSS with dynamic glow animation.
    - [x] Create `ui.toggleHighlight()` to manage state.
- [x] Task: UI Submenu Refinement & Visual Feedback.
    - [x] Add "Serif" and "Destaque" toggle buttons to the `#rich-toolbar`.
    - [x] Implement `.active` CSS style for distinctive button feedback.
    - [x] Update `ui.applyState()` to manage all active visual states.
- [x] Task: Conductor - User Manual Verification 'Editorial Modes & UI'
