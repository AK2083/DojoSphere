# Logging & Audit — Architecture

This document describes the **offline-first error logging** architecture for DojoSphere.

> **Note:** This document does not constitute legal advice. Operators are responsible for the legal basis, information obligations, retention, and deletion of personal data in their specific deployment.

## Two lanes

| Lane | Purpose | Storage | Where to log |
|------|---------|---------|--------------|
| **Error log** | Technical failures (Supabase, SQLite, unhandled exceptions) | `<userData>/logs/app.log` | Renderer: feature `api/` only (+ global handlers). Main: `repository/` only (+ process handlers) |
| **Audit** | Who changed what (business actions) | SQLite `authorization_audit_logs` | Main only (`audit` slice) |

**Separation rule:** Audit rows are never written to `app.log`. Error logging does not replace audit.

### Local data paths (Electron `userData`)

| Lane | Path |
|------|------|
| Error log | `<userData>/logs/app.log` |
| Audit | `<userData>/database.db` → table `authorization_audit_logs` |

## Public API

| API | Process | Role |
|-----|---------|------|
| `logError(error, service, action)` | Renderer → IPC → Main | Feature `api/` layer (Supabase errors) |
| `logError(error, service, action)` | Main direct | Repositories, startup, process handlers |
| `withDbErrorLogging(service, action, fn)` | Main | Wraps SQLite repository operations |
| `auditRecord(token, event)` | Renderer → IPC → Main | Optional renderer audit IPC (gated by activity scope) |
| `registerGlobalErrorHandlers(app)` | Renderer | Vue/window unhandled errors |

Renderer features import only `@shared/lib` — not logging internals directly.

## Logging rules

### Renderer

- **Only** feature `api/` files call `logError` for Supabase/network failures.
- `model/` and `service/` contain no logging calls.
- Expected user errors (e.g. `invalid_credentials`) are **not** logged.
- Global error handlers catch unhandled renderer exceptions.

### Main

- **Only** `repository/` layers wrap DB access with `withDbErrorLogging`.
- Validation errors (`throw new Error('…')` for empty fields) happen **before** DB logging wrappers.
- `uncaughtException` / `unhandledRejection` are logged at process level.

### Activity logging scope

Routes with `meta: { activityLogging: false }` disable renderer `auditRecord` via activity scope. Error logging (`logError`) still runs for real failures.

## Cloud diagnostic toggle (no-op)

Settings expose **“Send diagnostic data on errors”**. The preference is stored in renderer `localStorage` and synced to main via `diagnostics:setUploadPreferences`.

**There is no cloud provider configured yet** — the toggle is a placeholder for a future upload integration. No data leaves the device when enabled.

### Local system snapshot (always)

At every application start, the main process writes **one anonymous system snapshot** to `app.log`, independent of the cloud toggle:

| Field | Example | Purpose |
|-------|---------|---------|
| `platform` | `win32` | OS family |
| `arch` | `x64` | CPU architecture |
| `osRelease` | `10.0.26200` | OS version |
| `appVersion` | `0.1.0` | DojoSphere version |
| `electronVersion` | `42.3.0` | Electron runtime |
| `mode` | `production` | Build mode |

Implementation: `captureSystemSnapshot()` in `src/main/shared/logging/diagnostic-context.ts`, called from `initLogging()`.

Log line format:

```text
[info] [diagnostics] session_snapshot platform=… arch=… osRelease=… appVersion=… electronVersion=… mode=…
```

The snapshot is **not** merged into every `logError` line — it is a separate one-time entry per session.

### What is never written to `app.log`

| Category | Examples |
|----------|----------|
| Personal data | Email, names, tokens, passwords, session IDs |
| Network identifiers | Hostname, MAC, IP addresses, client User-Agent |
| User preferences | Language, theme (not needed for support context) |
| Security products | Antivirus names, firewall product names |
| Error messages | Raw `error.message` from exceptions (only `code` when present) |
| OS username | Never — even though `getOsUsername` exists for UI |

### LAN troubleshooting (future)

When the intranet host for scorekeepers and spectators is implemented, **port, firewall, and antivirus issues** should be explained to the tournament director in the **UI** (i18n hints, checklists) — not inferred and written to `app.log`. Technical server start failures may still use `logError` with scope, action, and code only.

## Connectivity

| Check | Purpose |
|-------|---------|
| Supabase heartbeat | Auth/API reachability (`isSupabaseReachable`) |
| `navigator.onLine` | Browser online state |

## References

- Renderer logging: `src/renderer/shared/lib/logging/`
- Main logging: `src/main/shared/logging/`
- Audit: `src/main/features/audit/`
