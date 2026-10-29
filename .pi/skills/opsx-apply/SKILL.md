---
name: opsx-apply
description: >-
  Execute tasks defined in an approved OpenSpec specification and log execution
  provenance
---
# ⚙️ OpenSpec: Apply Change Tasks (`/opsx-apply`)

Use this skill when implementing an approved OpenSpec specification.

## Procedure
1. Read the active spec from `openspec/specs/<change>-spec.md` or `openspec-lite-tasks.md`.
2. Execute tasks sequentially:
   - Make minimal, verified code changes.
   - Run tests to confirm zero regression.
3. **OpenSpec Task Registry Rule (CON-0012)**:
   - Never just delete a task or only check its box `[x]`.
   - Append a nested bullet point directly beneath the completed task logging execution:
     `- *Executed YYYY-MM-DD*: <Brief summary of what changed and any roadblocks hit.>`
4. If reusable patterns, architectural decisions, or traps were encountered, stage them as candidates:
   ```bash
   python -m dev.cli memory propose "$TITLE" --type <decision|pattern|problem> --content "$CONTENT"
   ```
