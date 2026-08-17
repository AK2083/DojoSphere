---
name: connect-ipc-channel
description: >-
  End-to-end wiring of a new IPC channel across Preload, Main IPC registry, and
  Renderer API types.
modeSlugs:
  - code
---

# Skill: Connect IPC Channel

Use this skill when adding a new IPC communication endpoint between Renderer and Main process.

## Target Execution Pipeline

Update the following 4 locations in a single operation:

1. **Renderer API Interface (`src/renderer/shared/types/electron-api.ts`):**
   - Declare the strongly-typed method signature on the `ElectronAPI` interface.

2. **Preload Bridge (`src/preload/index.ts` or `src/preload/preload.ts`):**
   - Expose the method via `ipcRenderer.invoke('channel:name', ...args)` inside `contextBridge.exposeInMainWorld('api', ...)` without adding business logic or DB calls.

3. **Slice IPC Handler (`src/main/features/<slice>/ipc/register.ts`):**
   - Implement `ipcMain.handle('channel:name', async (event, args) => ...)` with payload validation, session security checks, and delegation to service/repository.

4. **Composition Root (`src/main/app/register-ipc.ts`):**
   - Import and invoke `register<Slice>Ipc()` from `@main/features/<slice>`.
