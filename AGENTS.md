# Project Instructions: quadro-branco-formacao

## Memory Protocol

Every session must begin by loading the Obsidian context and end by saving
it back. This is how the AI preserves its memory across sessions.

- **Start Session**: Use skill `obsidian-sync` with `oc-start quadro-branco-formacao`.
  The script prints the `hot.md` cache (open loops, blockers, last decisions)
  from the Obsidian vault and syncs the repo. After it returns, review the
  printed state to brief the user on what was in progress. Never begin coding
  before this context restoration completes.

- **End Session**: Use skill `obsidian-sync` with `oc-close quadro-branco-formacao`.
  This reviews git changes (`git diff --stat`), writes a session log to
  Obsidian at `03-projetos/quadro-branco-formacao/sessoes/YYYY-MM-DD-session.md`,
  and refreshes `hot.md` with the new project state. Skipping this loses
  context between sessions.

## Vault Context

This project's knowledge lives in the Obsidian Second Brain. Before making
design or architectural decisions, consult the vault to avoid re-litigating
past choices.

- **Project Folder**: `03-projetos/quadro-branco-formacao/` — contains session
  logs, product vision specs, and architectural decisions. Search this folder
  with semantic queries (RAG) before designing new features. It is the
  project's institutional memory.

- **Hot Cache**: `03-projetos/quadro-branco-formacao/hot.md` — the living
  snapshot of current state: open loops, active blockers, next tasks. Read
  this first at session start. Update it at session end. It bridges the gap
  between the detailed session logs and what the AI needs to resume work
  immediately.

- **Product Vision**: Interactive whiteboard for training sessions — featuring
  real-time feedback with sound effects and visual elements.

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (no framework)
- **Testing**: Playwright
- **Audio**: MP3 sound effects (aplausos.mp3, certo.mp3, errado.mp3)
- **No Build Step**: Static files served directly

## Architecture
- **Structure**: Single-page application with no build step
- **Key Files**: `futuro-digital.html` (main app), `index.html` (entry point)
- **Legacy Versions**: `legacy_v1` through `legacy_v5` directories contain previous iterations
- **Key Pattern**: Interactive training whiteboard with audio feedback

## Build & Run Commands
- **Dev**: Open `futuro-digital.html` in browser or use local server (`npx serve .`)
- **E2E Tests**: `npx playwright test` (if Playwright config exists)

## Code Standards
- **Style Guide**: Follow guidelines in `conductor/code_styleguides/` if present
- **No Build Step**: All changes are direct HTML/CSS/JS edits
- **Legacy Code**: Do not modify `legacy_v*` directories — they are archived versions

## Quality Gates
- **Manual Testing**: Verify interactive elements and audio playback in browser
- **Responsive**: Verify layout on different screen sizes
- **Audio**: Confirm sound effects play correctly on user interactions
