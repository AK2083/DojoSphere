# Logging & Monitoring — Architecture Decision

This document is the outcome of **SPIKE #0: Offline-First Logging Architecture**. It describes the target architecture and implementation plan. Implementation is tracked in separate issues (see [Follow-up issues](#follow-up-issues)).

> **Note:** This document does not constitute legal advice. Operators are responsible for the legal basis, information obligations, retention, and deletion of personal data in their specific deployment.

## Current state

| Topic | Today |
|-------|-------|
| SDK | `@sentry/vue` in the renderer only |
| Main / Preload | no monitoring, no audit IPC |
| Offline | `isMonitoringEnabled()` drops events entirely (no queue) |
| Cloud mode | `isCloudUsed` blocks both capture and upload |
| Audit | `authorization_audit_logs` table in migration V001, no application logic yet |
| Connectivity | `navigator.onLine` and Supabase heartbeat are separate; not used for upload gates |

## Target: three lanes

| Lane | Purpose | Storage / destination | Process |
|------|---------|----------------------|---------|
| **Telemetry** | Errors, performance, technical breadcrumbs | Sentry offline queue → GlitchTip | Main + renderer via `@sentry/electron` |
| **Audit** | Traceable business actions (who changed what?) | SQLite (`authorization_audit_logs`, additional tables as needed) | main only |
| **Debug** | Developer / support logs | rotating log file | main only |

**Separation rule:** Audit events **never** go to Sentry/GlitchTip. Telemetry does not replace audit.

```
┌─────────────────────────────────────────────────────────────────┐
│ Renderer (Vue) — all roles (tournament director, scorekeeper,   │
│ spectator) use the same Electron app on the LAN                   │
│                                                                 │
│  @shared/lib/telemetry  ──► @sentry/electron/renderer           │
│  @shared/lib/audit      ──► preload IPC ──► Main → SQLite       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Main Process                                                    │
│  @sentry/electron/main  → offline disk queue → GlitchTip        │
│  audit repository       → SQLite                                │
│  debug logger           → log file (userData/logs/)             │
└─────────────────────────────────────────────────────────────────┘
```

## Cloud mode (`isCloudUsed`)

`isCloudUsed` controls **cloud services as a whole** — aligned with the planned data sync logic: the same switch philosophy for data and logging.

| Action | Cloud on (`isCloudUsed = true`) | Cloud off (`isCloudUsed = false`) |
|--------|----------------------------------|-----------------------------------|
| Telemetry **capture** (local queue) | yes | yes |
| Telemetry **upload** (GlitchTip) | yes, when reachable + optional consent | no |
| Supabase access | yes, after heartbeat | no |
| Audit (SQLite) | yes | yes |
| Debug file | yes (configurable) | yes (configurable) |

**Core rule:** Cloud mode controls **upload**, not **capture**. Events created offline stay in the Sentry offline queue and can be flushed once upload is allowed.

### Upload consent (tournament director)

When the internet is available and cloud mode is active, upload should be **possible** — not necessarily automatic for every event:

- **Default:** queued events are sent in the background once GlitchTip is reachable.
- **Optional / later:** explicitly ask the tournament director (“Send error report?”), e.g. after a critical error or for remote support. That UX is a separate issue; the architecture must support `shouldSend` / manual flush.

## Connectivity checks

`navigator.onLine` alone is not sufficient. Before cloud access, the respective service is checked explicitly:

| Before access to | Check | Already exists |
|------------------|-------|----------------|
| Supabase (auth, API, sync) | heartbeat edge function | yes (`checkHeartbeatConnectivity`) |
| GlitchTip / Sentry upload | dedicated reachability check (ping/HEAD to ingest endpoint or health URL) | no — issue |
| Local SQLite / IPC | no network check | — |

**Telemetry upload gate** (target):

```
uploadAllowed =
  isCloudUsed
  ∧ glitchtipReachable
  ∧ (autoUploadEnabled ∨ userConsentedToUpload)
```

Heartbeat result and GlitchTip reachability are tracked separately (dedicated status signal or extension of the network status store).

## Roles and telemetry scope

Scorekeepers and spectators use the **same Electron instance** on the intranet (no separate browser client). Logging still applies, but with reduced scope:

| Role | Telemetry | Audit | Debug |
|------|-----------|-------|-------|
| **Tournament director** | full (exceptions, breadcrumbs, performance sample) | full | as needed |
| **Scorekeeper** | **minimal** — mainly `captureException`, few/no info breadcrumbs | relevant actions (mat assignment, approval, …) | no |
| **Spectator** | **minimal** — errors only | read-only, little audit obligation | no |

Implementation via role context in the renderer (`setUserContext` / tag `role=…`) and feature-level `monitorInformation` calls only where appropriate.

## Audit scope

Audit is stored in SQLite in the main process. Minimum scope (non-exhaustive):

- Authorization: roles, approvals, session revoke, join codes (`authorization_audit_logs`)
- **Competitors:** created, updated, deleted
- Tournament structure: mats, matches (where business-relevant)

Fields follow `authorization_audit_logs`: `actor_user_id`, `action`, `entity_type`, `entity_id`, `old_value_json`, `new_value_json` — **without** sensitive plaintext PII in JSON (IDs, status — not names/emails).

The renderer calls `window.api.auditRecord(...)` thinly; writes happen in main only after session/permission checks.

## PII and privacy

- No tokens, session IDs, passwords, or full personal records in telemetry `extra` / breadcrumb `data`
- `setUserContext` with internal user ID only (no email)
- `beforeSend` hook: scrubbing, drop on suspicion
- Review existing breadcrumb payloads (e.g. cloud status as boolean flag only, no key names with context)
- Queue path under `userData` — document in settings
- Retention: Sentry `maxAgeDays` / `maxQueueSize`; audit retention operator-side; debug logs with rotation

## SDK decision: `@sentry/electron`

| | `@sentry/vue` (today) | `@sentry/electron` (target) |
|-|----------------------|-----------------------------|
| Main crashes / DB init | no | yes |
| Offline queue | no (events dropped) | yes (disk, default) |
| Renderer → main context | no | yes |
| LAN clients (scorekeeper/spectator) | same app | same app |

Do **not** use `makeBrowserOfflineTransport` in the Electron renderer — it bypasses main routing in `@sentry/electron`.

Renderer code continues to import only `@shared/lib` (FSD), not `@sentry/*` directly.

## API design (target)

Existing calls (`captureException`, `addBreadcrumb`, `setUserContext`) remain; the internal guard is replaced:

| Today | Target |
|-------|--------|
| `isMonitoringEnabled()` (blocks capture + upload) | `shouldCaptureTelemetry()` — almost always `true` |
| — | `shouldUploadTelemetry()` — cloud + GlitchTip reachability + optional consent |
| — | `auditRecord(event)` — IPC → main |

## Risks

| Risk | Mitigation |
|------|------------|
| PII in events | `beforeSend`, audit schema, code review checklist |
| Queue growth offline | `maxQueueSize`, `maxAgeDays`, breadcrumb sampling |
| False “online” | separate heartbeat + GlitchTip ping |
| GDPR / retention | no auto-compliance claims; operator notice; delete/export issues |
| Scorekeeper/spectator overhead | role-based sampling |

---

## Follow-up issues

Recommended order. Numbers are suggestions for GitHub issues.

### Issue 1 — Decouple telemetry guard (capture ≠ upload)

**Goal:** Short-term improvement without an SDK switch; events are no longer dropped offline; upload remains gated.

- `isMonitoringEnabled` → `shouldCaptureTelemetry` / `shouldUploadTelemetry`
- Capture: `navigator.onLine` no longer blocks `captureException` / `addBreadcrumb`
- Upload: cloud mode + (interim) heartbeat or `onLine` until Issue 2
- Tests for offline+cloud on, online+cloud off, combinations
- Update existing feature tests

**DoD:** Unit tests green; offline exceptions retained in Sentry client (browser queue until Electron migration).

---

### Issue 2 — Connectivity: GlitchTip reachability + unified gate

**Goal:** Explicit checks before GlitchTip upload and before Supabase access.

- `checkGlitchtipReachability()` (HEAD/ping to ingest or configured health URL)
- Extend network status store: `isSupabaseReachable`, `isGlitchtipReachable`
- Supabase clients check heartbeat status before requests (or central API wrapper)
- `shouldUploadTelemetry` uses `isGlitchtipReachable`
- Document env vars (`VITE_GLITCHTIP_DSN`, optional health URL)

**DoD:** Tests with mocked fetch; upload blocked when heartbeat OK but GlitchTip down.

---

### Issue 3 — Introduce `@sentry/electron`

**Goal:** Main + renderer init, offline disk queue, `transportOptions.shouldSend`.

- Install `@sentry/electron`; `initLoggingProvider` → main + renderer init
- `transportOptions`: `maxAgeDays`, `maxQueueSize`, `shouldSend` → `shouldUploadTelemetry`
- Capture main-process errors (DB init)
- `beforeSend` scrubbing
- Remove / replace `@sentry/vue` where obsolete

**DoD:** Manual test: airplane mode → error → online → event in GlitchTip; cloud off → queue grows, no upload.

---

### Issue 4 — Audit slice (main + preload + IPC)

**Goal:** Writable `authorization_audit_logs`; pattern for further audit events.

- Slice `src/main/features/audit/`: repository, `ipc/register.ts`, session check
- Preload: `auditRecord(payload)`; types in `electron-api.ts`
- Renderer: `@shared/lib/audit.ts` (thin API)
- First events: session revoke, role assigned

**DoD:** Main integration test; no direct SQLite access from renderer.

---

### Issue 5 — Audit: competitor lifecycle

**Goal:** Business traceability for tournament operations.

- Migration only if competitor audit schema is missing (generic `audit_logs` or extend `entity_type`)
- Audit on competitor create/update/delete
- JSON without PII (IDs, field names — not values with names)

**DoD:** Unit/integration tests; manual “add competitor” flow creates audit row.

---

### Issue 6 — Role-based telemetry sampling

**Goal:** Scorekeepers/spectators errors only; tournament director full telemetry.

- Role in telemetry context (tag `role`)
- `monitorInformation` in features only on tournament-director paths, or guard in `@shared/lib`
- Update this document if behavior diverges

**DoD:** E2E or unit: spectator route produces no auth breadcrumbs; exception still does.

---

### Issue 7 — Tournament director upload consent (optional)

**Goal:** Explicit UX for “send error report” during remote support.

- Setting: auto-upload vs. ask-on-error
- UI dialog + manual `Sentry.flush` / queue flush
- i18n

**DoD:** Storybook/Playwright for dialog; queue cleared after consent.

---

### Issue 8 — Debug logging (main, file)

**Goal:** Rotating log file for support; no PII.

- `electron-log` or similar in main only
- Log level via env/settings
- Path `userData/logs/`, retention

**DoD:** Documented in this file; no secrets/PII in logs.

---

### Issue 9 — PII audit of existing telemetry calls

**Goal:** Clean up current breadcrumbs and `extra` fields.

- Review all `monitorInformation` calls
- Finalize `beforeSend`
- Security review checklist in `.cursor/rules` or CONTRIBUTING

**DoD:** No personal data in known monitoring paths.

---

## References

- [Sentry Electron — Offline Support](https://docs.sentry.io/platforms/javascript/guides/electron/features/offline-support/)
- Current code: `src/renderer/shared/lib/glitchtip/`
- Network: `src/renderer/features/status/service/bootstrap-network-status.ts`
- Audit schema: `src/main/shared/database/migrations/V001__authorize_create_tables.sql`
- Project rules: `.cursor/rules/security-privacy.mdc`, `.cursor/rules/legal-open-source.mdc`
