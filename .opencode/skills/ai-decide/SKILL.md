---
name: ai-decide
description: Propose an architectural decision record (ADR) as a memory candidate
---
# 🏛️ Record Architectural Decision (`/ai-decide`)

Use this skill when an architectural choice, design pattern, or invariant is established.

## Procedure
1. Structure the decision:
   - **Title**: Clear statement of the decision.
   - **Context**: Problem background and forces.
   - **Decision**: What was chosen.
   - **Consequences**: Trade-offs, positive and negative impacts.
2. Propose as a candidate:
   ```bash
   python -m dev.cli memory propose "$TITLE" --type decision --content "$CONTEXT\n\n### Decision\n$DECISION\n\n### Consequences\n$CONSEQUENCES" --confidence high
   ```
3. The candidate will be staged in `home/08-system/candidates/` for human review.
