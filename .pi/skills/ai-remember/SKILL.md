---
name: ai-remember
description: >-
  Propose a reusable technical pattern, trap, problem, or knowledge note as a
  memory candidate
---
# 💡 Propose Memory Candidate (`/ai-remember`)

Use this skill when recording valuable knowledge discovered during pair programming.

## Procedure
1. Classify the entity type (`pattern`, `problem`, `knowledge`, `constraint`, or `decision`).
2. Propose the candidate:
   ```bash
   python -m dev.cli memory propose "$TITLE" --type <type> --content "$CONTENT" --confidence high --scope <project|global>
   ```
3. Confirm to user that candidate `MEM-*` has been staged in `home/08-system/candidates/` awaiting human review.
4. **Governance Rule**: Never promote candidates to canonical memory directly without explicit human instruction.
