# ✍️ Specification: Text Submenu Refinement

## Overview
This track focuses on refining the functionality and user experience of the text formatting submenu. The goal is to ensure all buttons work correctly, provide clear visual feedback when toggled, and properly synchronize text formatting (including alignment and list styles) with the projected screen.

## Functional Requirements
1. **Toolbar Reorganization**:
   - Move the "Citação" and "Animar" buttons from the main toolbar into the rich-text submenu.
2. **Toggle Signaling**:
   - Implement clear visual feedback for active buttons in the submenu using a subtle border change or opacity adjustment to signal their toggled state.
3. **Text Alignment Synchronization**:
   - Ensure that text alignment (Left, Center, Right) selected in the command window is applied correctly.
   - Synchronize the chosen alignment with the projected screen by including the alignment state directly in the broadcast payload.
4. **List Formatting**:
   - Ensure that unordered (bulleted) and ordered (numbered) lists respect and inherit the global text alignment rules applied to regular text.

## Acceptance Criteria
- [ ] "Citação" and "Animar" buttons are exclusively located in the text submenu.
- [ ] Active formatting buttons display a distinct subtle border to indicate their toggled state.
- [ ] Changing text alignment updates the display immediately in the command window.
- [ ] Text alignment changes are correctly broadcasted and rendered on the projector screen.
- [ ] Lists and numbered lists align correctly according to the selected text alignment.