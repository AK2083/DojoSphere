---
description: Windows developer setup — VC++ Redistributable for native Node addons (npm test / electron:start)
alwaysApply: true
---

# Windows — Visual C++ Redistributable

On Windows, `npm install` can succeed while `npm test` or `npm run electron:start` still fail because native `.node` addons cannot load.

## When this applies

Suspect a missing VC++ runtime (not a broken lockfile) when you see:

- `Cannot find native binding` / `ERR_DLOPEN_FAILED` (`oxc-resolver`, `@electron-internal/extract-zip`, …)
- `Das angegebene Modul wurde nicht gefunden` for a `.node` file that exists under `node_modules`
- Electron stuck on `Downloading Electron binary...`, then `Electron failed to install correctly` / missing `node_modules/electron/dist`

**Cause:** Missing `VCRUNTIME140.dll` / `MSVCP140.dll` from the [VC++ Redistributable x64](https://aka.ms/vs/17/release/vc_redist.x64.exe). This is a **dev machine** requirement; end-user packaged Electron apps normally ship their own runtime.

## What to do

1. Tell the user to install [VC_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe) and reopen the terminal.
2. Reinstall Electron so the binary download can finish:

```powershell
Remove-Item -Recurse -Force node_modules\electron
npm install
```

Optional if still incomplete: `node node_modules/electron/install.js`

3. Do **not** default to deleting `package-lock.json` / all of `node_modules` first — only if problems remain after the Redistributable is installed.

Full write-up: [CONTRIBUTING.md](../../CONTRIBUTING.md#windows-visual-c-redistributable).
