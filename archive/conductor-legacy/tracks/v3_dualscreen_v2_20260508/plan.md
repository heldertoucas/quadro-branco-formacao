# 🗺️ Implementation Plan: Dual Screen v2

## Phase 1: Signal & Enquadramento
- [x] Task: Connection Heartbeat
    - [x] Implement ping/pong between windows via `BroadcastChannel`
- [x] Task: Safe Area UI
    - [x] Create a `.safe-area-outline` visible only to the trainer
- [x] Task: Conductor - User Manual Verification 'Signal & Enquadramento'

## Phase 2: Narrative Control
- [x] Task: Laser Pointer Overlay
    - [x] Sync mouse coordinates and render a glow div on the projector
- [x] Task: Stage & Push Implementation
    - [x] Add a `state.staging` buffer and only broadcast on click
- [x] Task: Conductor - User Manual Verification 'Narrative Control'
