---
name: ai-next
description: >-
  Deep tactical inspection of project current state, pending Next Steps, and
  active OpenSpec task checklists.
---
# 🎯 Project Priorities & Deep Tactical Inspection (`/ai-next`)

Use this skill when determining immediate next priorities and inspecting ongoing engineering work.

## Procedure
1. Resolve current project and retrieve context:
   ```bash
   python -m dev.cli repo current
   ```
2. Read the project's living state from `02-projects/<project-id>/current-state.md` (paying special attention to `## 📋 Next Steps`).
3. Scan for active OpenSpec changes in `<repo_dir>/openspec/changes/*/tasks.md` and collect uncompleted tasks (`- [ ]`).
4. Present a consolidated agenda:
   - **🎯 Active Objective & Milestone** (from `current-state.md`).
   - **⏭️ Immediate Next Steps** (tactical handoff items).
   - **⏳ Active OpenSpec Changes & Pending Tasks** (from `openspec/changes/*/tasks.md`).
   - **🚧 Known Blockers / Roadblocks**.
   - **🏆 Recent Achievements**.
