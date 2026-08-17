---
name: create-electron-slice
description: >-
  Creates a new Vertical Slice under src/main/features/ following VSA
  guidelines. Conditionally creates repositories, services, and IPC handlers.
modeSlugs:
  - architect
---

# Skill: Electron Vertical Slice Creator

Use this skill when introducing a new main-process domain slice under `src/main/features/<slice-name>/`.

## Conditional Directory Logic

Evaluate requirements before creating subfolders:

1. **IPC Layer (`ipc/`):**
   - **Create ONLY IF** the renderer needs to invoke this slice via IPC.
   - Contains `ipc/register.ts` for channel routing, input validation, and security checks. Must delegate execution to `service/` or `repository/` (no direct SQL in `register.ts`).

2. **Repository Layer (`repository/`):**
   - **Create ONLY IF** the slice executes SQL queries against SQLite.
   - Must import DB context exclusively from `@main/shared/database`.
   - Never import `electron` or `ipcMain` inside repositories.

3. **Service Layer (`service/`):**
   - **Create ONLY IF** the slice orchestrates multiple repositories or interacts with other features via their public API.

---

## Output File Structure

```text
src/main/features/<slice>/
├── ipc/            # OPTIONAL: IPC registration & validation
│   └── register.ts
├── service/        # OPTIONAL: Multi-repository or cross-feature orchestration
│   └── <slice>-service.ts
├── repository/     # OPTIONAL: SQLite data access
│   └── <slice>-repository.ts
├── index.ts        # Public API (sole export boundary for other main slices)
└── <slice>.test.ts # Colocated test suite
```
