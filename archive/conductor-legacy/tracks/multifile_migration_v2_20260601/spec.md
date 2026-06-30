# 🏗️ Spec: Migração para Multificheiro v2

## Architecture
The project will follow a modular monolith structure using ES modules (or script tags for offline robustness) to separate core concerns.

### 1. Data Layer (`state.js`)
- `state`: Central reactive state object.
- `PALETTES`, `BRANDS`, `SOUND_METADATA`: Configuration constants.
- `ICONS`: SVG path library.

### 2. Logic Layer (`features.js`)
- `features.timer`: All countdown logic.
- `features.score`: Gamification and podium logic.
- `features.poll`: Interactive voting logic.
- `features.ink`: Canvas drawing tools.
- `features.picker`: Randomization logic.

### 3. UI Layer (`ui.js`)
- `ui`: Handles DOM manipulation, event listeners, and visibility toggles.
- `AudioService`: Centralized audio feedback control.
- `ModalSystem`: Unified dialog management.

### 4. Application Layer (`app.js`)
- `app`: Main entry point, state broadcasting, and history management.

### 5. Styles
- `variables.css`: Design tokens (colors, fonts, sizes).
- `layout.css`: Structural layout and glassmorphism definitions.
- `animations.css`: UI transitions and special effects.

## Single Responsibility Principle
Each file should handle exactly one domain. No DOM manipulation in `state.js`, no business logic in `index.html`.