# ✍️ Specification: Typography & Dynamic Scaling v3.0

## Overview
Elevate the typography of the "Quadro Branco" to an editorial standard, ensuring that text is not only legible but also aesthetically pleasing across all scales. This version introduces advanced CSS transformations and JS-driven optical sizing.

## Functional Requirements
- **Dynamic Optical Sizing:**
    - **Weight Scaling:** Automatically reduce `font-weight` as text size decreases (e.g., 900 for titles, 500 for long paragraphs).
    - **Spacing Scaling:** Proportially increase `letter-spacing` for long text blocks to maintain readability.
    - **Variable Line-Height:** Adapt `line-height` dynamically between 1.1 (short) and 1.5 (long) based on character count.
- **Editorial Modes:**
    - **Serif Mode (Citations):** Use **Playfair Display** (including Italics) to switch the layout to a classic citation mood.
    - **Cinematic Entry:** Implement a **Word-by-word fade/slide** animation for revealing text on the screen.
- **UI Integration:**
    - Insert toggle controls for "Serif Mode" and "Animations" into the **Long Text / Rich Toolbar** submenu.

## Acceptance Criteria
- [ ] Text weight, spacing, and line-height adjust correctly based on content length.
- [ ] Toggling "Serif Mode" correctly applies Playfair Display.
- [ ] Cinematic animation triggers on word boundaries with smooth transitions.
- [ ] Submenu buttons highlight when the respective mode is active.
