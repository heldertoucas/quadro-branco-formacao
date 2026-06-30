# 🏗️ Track: Migração para Multificheiro v2

## Context
Initialize a new clean multi-file project based on the original single-file `index.html` and `futuro-digital.html`. This will serve as a fresh foundation for future feature development, separating concerns into logical modules.

## Goals
- [ ] Create `proj-multifile-v2/` structure.
- [ ] Extract global variables and state into `state.js`.
- [ ] Extract core logic into `app.js`.
- [ ] Extract feature-specific logic (timer, scoreboard, etc.) into `features.js`.
- [ ] Extract UI and audio services into `ui.js`.
- [ ] Extract CSS into `variables.css`, `layout.css`, and `animations.css`.
- [ ] Reconstruct `index.html` and `futuro-digital.html` as clean shell files.

## Roadmap
1. **Scaffold:** Create directories and empty files.
2. **Analysis:** Identify all shared logic in original files.
3. **Extraction:** Surgically move code into respective modules.
4. **Integration:** Link modules in the new HTML files.
5. **Verification:** Ensure basic rendering and state synchronization works.