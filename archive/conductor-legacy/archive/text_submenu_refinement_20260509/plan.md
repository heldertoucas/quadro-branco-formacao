# 🗺️ Implementation Plan: Text Submenu Refinement

## Phase 1: Structural Reorganization
- [x] Task: Move Buttons to Submenu
    - [x] Locate "Citação" and "Animar" buttons in `index.html`.
    - [x] Relocate them into the rich-text submenu container.
- [x] Task: Conductor - User Manual Verification 'Structural Reorganization' (Protocol in workflow.md)

## Phase 2: Visual Feedback & Toggle Signaling
- [x] Task: Implement Toggle CSS
    - [x] Add CSS classes to provide a subtle border for active/toggled buttons in the submenu.
- [x] Task: Apply Toggle Logic
    - [x] Update JavaScript logic to correctly apply the active CSS class when buttons are toggled.
- [x] Task: Conductor - User Manual Verification 'Visual Feedback' (Protocol in workflow.md)

## Phase 3: Alignment & Synchronization
- [x] Task: Enforce Alignment on Elements
    - [x] Ensure that CSS rules for lists (`<ul>`, `<ol>`) inherit the text alignment of their container.
- [x] Task: Update Synchronization Payload
    - [x] Modify the broadcast function to include the current text alignment state in the payload.
- [x] Task: Apply Synchronized Alignment
    - [x] Update the receiver logic to apply the broadcasted alignment to the main text display.
- [x] Task: Conductor - User Manual Verification 'Alignment & Synchronization' (Protocol in workflow.md)