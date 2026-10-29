---
name: ai-start
description: >-
  Initializes a Development Universe session, presents Next Steps handoff, and
  retrieves dynamic Project context.
---
# Session Start (ai-start)

Use this skill when initializing work in a Development Universe (DU) repository.
Do NOT attempt to read hot.md or .ai-session.json.

1. **Start the session**:
   ```bash
   python -m dev.cli session start <project-id>
   ```
   *(Or invoke `bootstrap_session` / `start_session` via MCP).*

2. **Inspect Context Capsule & Handoff**:
   - Read the returned Context Capsule.
   - Acknowledge and display the previous session's **`## ⏭️ Next Steps`** and any active **`💡 Active OpenSpecs`** pointers.
   - Propose starting with the uncompleted `Next Steps` or ask the user for confirmation.
