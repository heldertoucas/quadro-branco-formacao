---
name: ai-close
description: >-
  Concludes a Development Universe session, captures Next Steps handoff, and
  triggers memory governance.
---
# Session Close (ai-close)

Use this skill when concluding work in a Development Universe (DU) repository.

1. **Review Session Context for Next Steps**:
   - Inspect the last few user instructions or unfinished work for explicit forward-looking intentions (e.g. *"na próxima sessão vamos começar por..."*).
   - Formulate 1-3 concise, actionable `Next Steps` items.

2. **Close Session via DU Engine / CLI**:
   ```bash
   python -m dev.cli session close --project <project-id> --summary "<Executive Summary>" -n "<Next Step 1>" -n "<Next Step 2>"
   ```
   *(Or invoke the `close_session` MCP tool passing `summary` and `next_steps: ["..."]`).*

3. **Memory Governance**:
   - Propose any durable architectural knowledge (Decisions, Patterns, Constraints) as Memory Candidates using `dev.cli memory propose`.
