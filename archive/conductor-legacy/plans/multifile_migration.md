# Multi-File Architecture Migration Plan

## Objective
Transform the monolithic `index.html` (which currently houses over 3,700 lines of HTML, CSS, and JS) into a maintainable, multi-file architecture within the `proj-multifile` directory. Additionally, implement a build script to compile these separate files back into a single, portable `dist/index.html` file to ensure the app retains its offline-first portability.

## Current Shortcomings
1. **Maintainability:** High cognitive load and difficult navigation due to a massive single file.
2. **Coupling:** Global state (`const state`), UI manipulation (`const ui`), feature logic (`const features`), and core application logic (`const app`) are tightly intertwined.
3. **Tooling Limitation:** Hard to implement linting, unit testing, or proper code formatting.
4. **Style Bloat:** Over 1000 lines of CSS in a single `<style>` block making theming and responsiveness hard to tweak.

## Proposed Directory Structure (`proj-multifile/`)

```text
proj-multifile/
├── index.html             # Base template (HTML structure only)
├── variables.css          # CSS variables, themes, optical scaling math
├── layout.css             # Main structural layout (grid/flex)
├── ui.css                 # UI components (buttons, toolbar, control panel)
├── animations.css         # Keyframes and visual effects
├── state.js               # Global state object and constants
├── ui.js                  # DOM manipulation and UI logic
├── sync.js                # BroadcastChannel communication
├── app.js                 # Main initialization and core routing
├── features.js            # Consolidated feature logic (or split if preferred)
├── vendor-qrious.js       # QRious library
├── vendor-confetti.js     # Confetti library
├── build.js               # Node.js build script
├── package.json           # build command definition
└── portable/              # Output directory
    └── index.html         # Final merged portable file
```

## Implementation Steps

### Phase 1: Setup and HTML Extraction
- [x] Initialized the `proj-multifile` directory structure.
- [x] Extracted the HTML structure into `proj-multifile/index.html` with placeholders.

### Phase 2: CSS Modularization
- [x] Extracted CSS into `variables.css`, `layout.css`, `ui.css`, and `animations.css`.

### Phase 3: JavaScript Modularization
- [x] Extracted JS logic into `state.js`, `ui.js`, `features.js`, `sync.js`, and `app.js`.
- [x] Extracted vendor libraries into `vendor-qrious.js` and `vendor-confetti.js`.
- [x] Code Cleanup: Fixed duplicate IDs and reorganized object methods for modularity.

### Phase 4: The Build Script
- [x] Created `package.json` with a `build` script.
- [x] Wrote `build.js` to concatenate and inline all files into `portable/index.html`.

### Phase 5: Testing and Verification
- [x] Run the build script and verified output generation.
- [ ] Manual functional verification of the portable file.