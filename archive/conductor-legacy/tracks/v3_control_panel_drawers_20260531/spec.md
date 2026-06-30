# 🧊 Specification: Modular Control Panel Drawers

## Overview
As more features are added, the main control panel (Floating Island) is becoming crowded. This track introduces "Drawers" (submenus) to group secondary or thematic functions.

## Functional Requirements
- **Generic Drawer System**: Refactor `ui.setDrawerState` to support an arbitrary number of drawers by ID.
- **Gamification Drawer (`#drawer-gamify`)**:
    - Group: **Scoreboard**, **Polls**, **Dice (3D)**, **Picker**.
    - Trigger: New "Trophy/Game" icon in the main toolbar.
- **Stage/Projection Drawer (`#drawer-stage`)**:
    - Group: **QR Code**, **Slide**, **Projector Window**.
    - Trigger: New "Screen/Stage" icon in the main toolbar.
- **Refined Main Toolbar**:
    - Keep visible: **Expand (Modo Zen)**, **Ink (Caneta)**, **Clear (Limpar)**, **Send (Projetar)**.
    - Keep drawers: **Sounds**, **Links**, **Gamification**, **Stage**.

## UI/UX Requirements
- Consistent animation (slide up/fade in) for all drawers.
- Automatic closing of other drawers when a new one is opened.
- "Active" state indicator on the trigger button when its drawer is open.

## Acceptance Criteria
- [ ] Toolbar width is reduced by at least 40%.
- [ ] All functions are still accessible within 2 clicks.
- [ ] Drawers open/close smoothly without layout shifts.
