# 🖊️ Specification: Ink Overlay v2 (Digital Marker)

## Overview
Upgrade the drawing tool from a basic line tool to a professional-grade digital marker with smooth curves and theme-integrated aesthetics.

## Functional Requirements
- **Bézier Smoothing:** Replace `lineTo` with a quadratic curve algorithm to ensure smooth strokes even with mouse movement.
- **Neon Glow Effect:** Add a dynamic `shadowBlur` and `shadowColor` to the canvas context for dark themes, creating a "light stroke" effect.
- **Highlighter Mode:** Implement a "Wide/Semi-transparent" mode that allows drawing behind or over text without obscuring it completely.
- **Theme-Adaptive Palettes:** Auto-adjust available ink colors to match the "mood" of the selected theme (e.g., pastels for Nature).
- **Fresh Ink Feedback:** Temporary glow at the brush tip during the active stroke.

## Acceptance Criteria
- [ ] Strokes are perfectly smooth without visible "stepping".
- [ ] Drawing on "Neon" theme produces a glowing light effect.
- [ ] Highlighter tool works as expected (transparency).
