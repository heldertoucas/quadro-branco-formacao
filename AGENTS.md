# Project Instructions: quadro-branco-formacao

## Product Vision
Interactive whiteboard for training sessions — featuring
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


> Note: Memory Protocol and Global Rules are inherited from Universal Agent Protocol (Rulesync).
