---
name: audit-electron-hardening
description: >-
  Audits Electron main and window configurations against OWASP desktop security
  guidelines.
modeSlugs:
  - security
---

# Skill: Electron Hardening Auditor

Use this skill in Security Mode to audit Electron window settings and Preload context boundaries.

## Inspection Checklist

1. **Context Isolation:** `contextIsolation: true` must be enabled in `BrowserWindow` webPreferences.
2. **Node Integration:** `nodeIntegration: false` must be enforced in the Renderer process.
3. **Bridge Leakage:** Verify that `src/preload/` exposes only explicit, input-validated helper functions on `window.api` and NEVER passes raw `ipcRenderer` or Node modules (`fs`, `child_process`).
4. **Navigation Limits:** Ensure `will-navigate` and `new-window` events block external URL navigation unless explicitly whitelisted.
