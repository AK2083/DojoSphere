# Logging & Monitoring — Architecture Decision

This document is the outcome of **SPIKE #0: Offline-First Logging Architecture**. It describes the target architecture and implementation plan. Implementation is tracked in separate issues (see [Follow-up issues](#follow-up-issues)).

> **Note:** This document does not constitute legal advice. Operators are responsible for the legal basis, information obligations, retention, and deletion of personal data in their specific deployment.

## Implementation priority

**Near-term focus: capture, not send.**

| Phase | Goal | Issues |
|-------|------|--------|
| **Capture** | Record telemetry locally (offline queue), audit in SQLite | 1, 3 (local queue), 4–6 |
| **Send** | Upload queued telemetry to GlitchTip; reachability gates | 2; upload wiring in Issue 3 — **deferred** |

Capture must work offline and with cloud mode off. Sending to GlitchTip is architecturally prepared (`shouldUploadTelemetry`, `shouldSend`) but not required for the first implementation milestones.

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
| **Telemetry** | Errors, performance, technical breadcrumbs | **Capture:** Sentry offline queue (local). **Send (later):** GlitchTip | Main + renderer via `@sentry/electron` |
| **Audit** | Traceable business actions (who changed what?) | SQLite (`authorization_audit_logs`) | main only |
| **Debug** | Developer / support logs | rotating log file | main only |

**Separation rule:** Audit events **never** go to Sentry/GlitchTip. Telemetry does not replace audit.

```
┌─────────────────────────────────────────────────────────────────┐
│ Renderer (Vue) — tournament director & scorekeeper (authenticated) │
│ use telemetry + audit; the audience (anonymous, read-only) uses    │
│ neither for activity tracking                                     │
│                                                                 │
│  @shared/lib/telemetry  ──► @sentry/electron/renderer           │
│  @shared/lib/audit      ──► preload IPC ──► Main → SQLite       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Main Process                                                    │
│  @sentry/electron/main  → offline disk queue (capture)          │
│                         → GlitchTip upload (send — later)       │
│  audit repository       → authorization_audit_logs (SQLite)     │
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

**Core rule:** Cloud mode controls **upload**, not **capture**. Events created offline stay in the Sentry offline queue until a later send phase allows upload.

### Send phase — upload (deferred)

Applies only when **sending** queued telemetry to GlitchTip — not when **capturing** events locally.

- **Capture:** always on (local queue / SQLite); no dialog, no upload required.
- **Send (later):** upload when cloud mode, reachability, and product rules allow (details TBD).

Send UX (e.g. consent dialog, settings) is out of scope for the current issue list.

## Connectivity checks

**Send phase only** — not required for local capture. Before GlitchTip upload (Issue 2), the service is checked explicitly:

| Before access to | Check | Already exists | Phase |
|------------------|-------|----------------|-------|
| Supabase (auth, API, sync) | heartbeat edge function | yes (`checkHeartbeatConnectivity`) | sync |
| GlitchTip / Sentry upload | dedicated reachability check (ping/HEAD to ingest endpoint or health URL) | no — Issue 2 | **send** |
| Local SQLite / IPC | no network check | — | capture |

**Telemetry upload gate (send phase, target):**

```
uploadAllowed =
  isCloudUsed
  ∧ glitchtipReachable
  ∧ (autoUploadEnabled ∨ userConsentedToUpload)
```

Heartbeat result and GlitchTip reachability are tracked separately (dedicated status signal or extension of the network status store).

## Roles and logging scope

Scorekeepers and the audience use the **same Electron app** on the intranet (no separate browser client). Logging differs by role:

| Role | Authentication | Telemetry | Audit (`authorization_audit_logs`) |
|------|----------------|-----------|--------------------------------------------------|
| **Tournament director** | local/cloud session | full (exceptions, breadcrumbs, performance sample) | **full** — all write actions |
| **Scorekeeper** | after host approval; write access | full on authenticated paths (same technical pipeline as director) | **full — same rules as tournament director** for every write (scores, mat actions, approvals, …) |
| **Audience** | **none** — no name, no sign-in, anonymous read-only | **none** — no role-specific activity logging | **none** for audience activity; the audience does not produce audit rows |

**The audience** opens the overview without entering a name or authenticating. Browsing is not tracked via telemetry breadcrumbs or dedicated audit events. That keeps the read-only path data-minimal. Authorization-related history (e.g. scorekeeper approval, role assignment) still lives in `authorization_audit_logs` when the **host or an authenticated user** performs those actions — not as per-audience activity logs.

**Scorekeepers** perform write operations and must be attributable like the tournament director: every privileged write goes through the same audit pipeline (`actor_user_id`, action, entity) after session and permission checks in main.

Implementation notes:

- Audience routes must not call `monitorInformation`, `auditRecord`, or `setUserContext` for activity tracking.
- Scorekeeper and tournament-director write paths share the same `@shared/lib/audit` and IPC handlers; no reduced audit tier for scorekeepers.
- Unhandled application errors may still surface via global telemetry on the host instance; that is not audience *activity* logging.

## Audit storage

**Decision:** Reuse the existing `authorization_audit_logs` table from migration V001 as the **single audit store** for all authenticated write actions. Do not introduce a separate general-purpose audit table for the initial implementation.

The table name reflects its origin (authorization), but the schema is already generic enough for broader use:

| Column | Role |
|--------|------|
| `actor_user_id` | Who performed the action (nullable only where explicitly allowed) |
| `action` | Verb, e.g. `created`, `updated`, `deleted`, `approved`, `revoked` |
| `entity_type` | Domain entity, e.g. `role`, `session`, `competitor`, `match`, `mat` |
| `entity_id` | Target record ID |
| `old_value_json` / `new_value_json` | Change snapshot without plaintext PII |
| `ip_address` / `user_agent` | Optional request context for LAN clients |
| `created_at` | Timestamp |

**Examples** (same table, different `entity_type`):

- Authorization: `entity_type = 'access_request'`, `action = 'approved'`
- Competitor: `entity_type = 'competitor'`, `action = 'created'`
- Match: `entity_type = 'match'`, `action = 'score.updated'`

A later rename to `audit_logs` may be considered once non-authorization events are common; that is a separate migration issue, not required for Issues 4–5.

## Audit scope

All items below are written to **`authorization_audit_logs`** via the same audit repository and IPC path. Minimum scope (non-exhaustive):

- Authorization: roles, approvals, session revoke, join codes
- **Competitors:** created, updated, deleted (`entity_type = 'competitor'`)
- Tournament structure: mats, matches (where business-relevant)

Fields as defined in **Audit storage** above — **without** sensitive plaintext PII in JSON (IDs, status — not names/emails).

The renderer calls `window.api.auditRecord(...)` thinly; writes happen in main only after session/permission checks. **Every authenticated write** (tournament director or scorekeeper) uses this path. Audience read-only views never call it.

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
| LAN clients (scorekeeper/audience) | same app | same app |

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
| Scorekeeper write attribution | same audit IPC and schema as tournament director; session required |
| Audience privacy | no auth, no name, no activity telemetry or audit |

---

## Follow-up issues

Recommended order. Numbers are suggestions for GitHub issues.

**Capture phase (near-term):** Issues 1, 3 (local queue), 4–6.

**Send phase (deferred):** Issue 2; upload enablement in Issue 3.

### Issue 1 — Decouple telemetry guard (capture ≠ upload) · capture

**Goal:** Short-term improvement without an SDK switch; events are no longer dropped offline; upload remains gated.

- `isMonitoringEnabled` → `shouldCaptureTelemetry` / `shouldUploadTelemetry`
- Capture: `navigator.onLine` no longer blocks `captureException` / `addBreadcrumb`
- Upload: cloud mode + (interim) heartbeat or `onLine` until Issue 2
- Tests for offline+cloud on, online+cloud off, combinations
- Update existing feature tests

**DoD:** Unit tests green; offline exceptions retained in Sentry client (browser queue until Electron migration).

---

### Issue 2 — Connectivity: GlitchTip reachability + unified gate · send

**Goal:** Explicit checks before GlitchTip upload and before Supabase access. **Send phase** — not required for local capture.

- `checkGlitchtipReachability()` (HEAD/ping to ingest or configured health URL)
- Extend network status store: `isSupabaseReachable`, `isGlitchtipReachable`
- Supabase clients check heartbeat status before requests (or central API wrapper)
- `shouldUploadTelemetry` uses `isGlitchtipReachable`
- Document env vars (`VITE_GLITCHTIP_DSN`, optional health URL)

**DoD:** Tests with mocked fetch; upload blocked when heartbeat OK but GlitchTip down.

---

### Issue 3 — Introduce `@sentry/electron` · capture (+ send later)

**Goal (capture):** Main + renderer init, offline disk queue on disk.

**Goal (send, later):** `transportOptions.shouldSend` → `shouldUploadTelemetry`.

- Install `@sentry/electron`; `initLoggingProvider` → main + renderer init
- `transportOptions`: `maxAgeDays`, `maxQueueSize`; `shouldSend` wired when send phase starts
- Capture main-process errors (DB init)
- `beforeSend` scrubbing
- Remove / replace `@sentry/vue` where obsolete

**DoD (capture):** Airplane mode → error → event remains in local queue; cloud off → queue grows, no upload required.

**DoD (send, later):** When upload enabled → event appears in GlitchTip.

---

### Issue 4 — Audit slice (main + preload + IPC) · capture

**Goal:** Make `authorization_audit_logs` writable; establish the shared audit pipeline for all future events.

- Slice `src/main/features/audit/`: repository writing to `authorization_audit_logs`, `ipc/register.ts`, session check
- Preload: `auditRecord(payload)`; types in `electron-api.ts`
- Renderer: `@shared/lib/audit.ts` (thin API)
- Payload maps to existing columns (`action`, `entity_type`, `entity_id`, `old_value_json`, `new_value_json`)
- First events: session revoke, role assigned

**DoD:** Main integration test inserts into `authorization_audit_logs`; no direct SQLite access from renderer; no new audit table migration.

---

### Issue 5 — Audit: competitor lifecycle · capture

**Goal:** Business traceability for tournament operations using the existing audit table.

- **No new audit table** — reuse `authorization_audit_logs` with `entity_type = 'competitor'`
- Audit on competitor create/update/delete through the Issue 4 pipeline
- JSON without PII (IDs, field names — not values with names)
- Migration only if the **competitors** domain table itself is added/changed, not for audit storage

**DoD:** Unit/integration tests; manual “add competitor” flow creates a row in `authorization_audit_logs`.

---

### Issue 6 — Role-aware logging boundaries · capture

**Goal:** The audience stays anonymous with no activity logging; scorekeepers share the director’s audit rules for writes.

- Audience routes: no `monitorInformation`, `auditRecord`, or `setUserContext` for activity
- Scorekeeper write handlers: same `auditRecord` coverage as tournament director (no reduced tier)
- Guard in `@shared/lib` or route meta to skip telemetry breadcrumbs on audience-only paths
- Document audience “no auth / no name” in feature specs

**DoD:** Unit/E2E: audience route creates no audit rows and no auth breadcrumbs; scorekeeper write creates audit row with `actor_user_id`.

---

## References

- [Sentry Electron — Offline Support](https://docs.sentry.io/platforms/javascript/guides/electron/features/offline-support/)
- Current code: `src/renderer/shared/lib/glitchtip/`
- Network: `src/renderer/features/status/service/bootstrap-network-status.ts`
- Audit schema: `src/main/shared/database/migrations/V001__authorize_create_tables.sql`
- Project rules: `.cursor/rules/security-privacy.mdc`, `.cursor/rules/legal-open-source.mdc`
