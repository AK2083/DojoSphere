---
name: troubleshoot-windows-native-addons
description: >-
  Diagnoses and resolves Windows ERR_DLOPEN_FAILED, missing VCRUNTIME140.dll,
  and failed Electron binary downloads.
modeSlugs:
  - debug
  - ask
---

# Skill: Windows Native Addon & VC++ Runtime Troubleshooter

Use this skill in Debug or Setup Mode when facing native binding errors, `.node` module failures, or incomplete Electron binary downloads on Windows.

## Symptom Checklist

Suspect a missing Visual C++ Redistributable runtime (rather than a corrupted `package-lock.json`) if any of these occur:

- Error messages: `ERR_DLOPEN_FAILED`, `Cannot find native binding` (e.g., in `oxc-resolver`, `@electron-internal/extract-zip`).
- Windows system error: `Das angegebene Modul wurde nicht gefunden` for a `.node` file that physically exists under `node_modules`.
- Electron startup failure: Electron stuck on `Downloading Electron binary...` or missing `node_modules/electron/dist`.

## Diagnostic & Resolution Pipeline

1. **Verify Environment Cause:**
   - Do **NOT** delete `package-lock.json` or wipe the entire `node_modules` folder as a first action.

2. **Advise VC++ Runtime Installation:**
   - Prompt the user to download and install the [VC++ Redistributable x64 (vc_redist.x64.exe)](https://aka.ms/vs/17/release/vc_redist.x64.exe).
   - Instruct the user to restart their terminal/IDE after installation so system environment variables reload (`VCRUNTIME140.dll` / `MSVCP140.dll`).

3. **Re-trigger Electron Binary Download:**
   - Run PowerShell commands to clean and re-fetch Electron:
     ```powershell
     Remove-Item -Recurse -Force node_modules\electron
     npm install
     ```
   - Fallback (if still incomplete):
     ```powershell
     node node_modules/electron/install.js
     ```
