# Logging & Monitoring — Architecture Decision

This document is the outcome of **SPIKE #0: Offline-First Logging Architecture**. It describes the target architecture and implementation plan. Implementation is tracked in separate issues (see [Follow-up issues](#follow-up-issues)).

> **Note:** This document does not constitute legal advice. Operators are responsible for the legal basis, information obligations, retention, and deletion of personal data in their specific deployment.

## Implementation priority

**Near-term focus: capture, not send.**

| Phase | Goal | Issues |
|-------|------|--------|
| **Capture** | Record telemetry locally (OTLP → JSONL), audit in SQLite | 1 ✓, 3 ✓ (local collector), 4–6 |
| **Send** | Upload queued telemetry to Grafana Cloud (OTLP); reachability gates | 2; upload wiring in Issue 3 — **deferred** |

Capture must work offline and with cloud mode off. Sending to Grafana Cloud is architecturally prepared (`shouldUploadTelemetry`, reachability checks) but not required for the first implementation milestones.

## Current state

| Topic | Today |
|-------|-------|
| SDK | OpenTelemetry — `@opentelemetry/sdk-trace-web` (renderer), `@opentelemetry/sdk-trace-node` (main) |
| Local collector | Main-process OTLP/HTTP server on `127.0.0.1:4318`; trace batches appended to `<userData>/telemetry/traces.jsonl` |
| Public API | `@shared/lib` (`captureException`, `addBreadcrumb`, `setUserContext`, …) — features do not import OTel SDKs |
| Main / Preload | telemetry init in main (`initTelemetryApp`); no audit IPC yet |
| Offline | `shouldCaptureTelemetry()` allows local capture; spans export to localhost collector |
| Cloud mode | `isCloudUsed` will gate **upload** only; capture remains local |
| Audit | `authorization_audit_logs` table in migration V001, no application logic yet |
| Connectivity | `navigator.onLine` and Supabase heartbeat are separate; not yet used for upload gates |

## Target: three lanes

| Lane | Purpose | Storage / destination | Process |
|------|---------|----------------------|---------|
| **Telemetry** | Errors, performance, technical breadcrumbs | **Capture:** local OTLP collector → `<userData>/telemetry/traces.jsonl`. **Send (later):** Grafana Cloud (OTLP) | Main + renderer via OpenTelemetry SDKs |
| **Audit** | Traceable business actions (who changed what?) | SQLite (`authorization_audit_logs`) | main only |
| **Debug** | Developer / support logs | rotating log file | main only |

**Separation rule:** Audit events **never** go to Grafana Cloud / telemetry backends. Telemetry does not replace audit.

```
┌─────────────────────────────────────────────────────────────────┐
│ Renderer (Vue) — tournament director & scorekeeper (authenticated) │
│ use telemetry + audit; the audience (anonymous, read-only) uses    │
│ neither for activity tracking                                     │
│                                                                 │
│  @shared/lib/telemetry  ──► OTLP/HTTP → 127.0.0.1:4318          │
│  @shared/lib/audit      ──► preload IPC ──► Main → SQLite       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Main Process                                                    │
│  local OTLP collector   → traces.jsonl (capture)                │
│  sdk-trace-node         → same collector (main spans)             │
│                         → Grafana Cloud upload (send — later)   │
│  audit repository       → authorization_audit_logs (SQLite)     │
│  debug logger           → log file (userData/logs/)             │
└─────────────────────────────────────────────────────────────────┘
```

## Cloud mode (`isCloudUsed`)

`isCloudUsed` controls **cloud services as a whole** — aligned with the planned data sync logic: the same switch philosophy for data and logging.

| Action | Cloud on (`isCloudUsed = true`) | Cloud off (`isCloudUsed = false`) |
|--------|----------------------------------|-----------------------------------|
| Telemetry **capture** (local OTLP / JSONL) | yes | yes |
| Telemetry **upload** (Grafana Cloud) | yes, when reachable + optional consent | no |
| Supabase access | yes, after heartbeat | no |
| Audit (SQLite) | yes | yes |
| Debug file | yes (configurable) | yes (configurable) |

**Core rule:** Cloud mode controls **upload**, not **capture**. Events captured offline are stored locally in `traces.jsonl` until a later send phase allows upload.

### Send phase — upload (deferred)

Applies only when **sending** queued telemetry to Grafana Cloud — not when **capturing** events locally.

- **Capture:** always on (local OTLP collector / SQLite audit); no dialog, no upload required.
- **Send (later):** upload when cloud mode, reachability, and product rules allow (details TBD).

Send UX (e.g. consent dialog, settings) is out of scope for the current issue list.

## Connectivity checks

**Send phase only** — not required for local capture. Before Grafana Cloud upload (Issue 2), the service is checked explicitly:

| Before access to | Check | Already exists | Phase |
|------------------|-------|----------------|-------|
| Supabase (auth, API, sync) | heartbeat edge function | yes (`checkHeartbeatConnectivity`) | sync |
| Grafana Cloud OTLP upload | dedicated reachability check (ping/HEAD to ingest endpoint or health URL) | no — Issue 2 | **send** |
| Local SQLite / IPC / OTLP collector | no network check | — | capture |

**Telemetry upload gate (send phase, target):**

```
uploadAllowed =
  isCloudUsed
  ∧ grafanaCloudReachable
  ∧ (autoUploadEnabled ∨ userConsentedToUpload)
```

Heartbeat result and Grafana Cloud reachability are tracked separately (dedicated status signal or extension of the network status store).

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

- No tokens, session IDs, passwords, or full personal records in span attributes / breadcrumb `data`
- `setUserContext` with internal user ID only (no email)
- Span attribute scrubbing before export (send phase)
- Review existing breadcrumb payloads (e.g. cloud status as boolean flag only, no key names with context)
- Trace file under `<userData>/telemetry/` — document in settings
- Retention: JSONL rotation / max file size (TBD); audit retention operator-side; debug logs with rotation

## SDK decision: OpenTelemetry

| | `@sentry/vue` (former) | OpenTelemetry (today) |
|-|------------------------|------------------------|
| Main crashes / DB init | no | yes (main `sdk-trace-node`) |
| Offline / local-first | events dropped | yes — OTLP to localhost collector, JSONL on disk |
| Renderer → main context | no | both export to same local collector |
| Vendor lock-in | Sentry/GlitchTip-specific | OTLP standard; Grafana Cloud as optional backend |
| LAN clients (scorekeeper/audience) | same app | same app |

Renderer code imports only `@shared/lib` (FSD), not `@opentelemetry/*` directly. Main-process credentials for Grafana Cloud (send phase) stay in main only — never in renderer or `.env` exposed to Vite.

## API design

Existing calls (`captureException`, `addBreadcrumb`, `setUserContext`) remain unchanged at the feature level:

| Former | Today / target |
|--------|----------------|
| `isMonitoringEnabled()` (blocked capture + upload) | `shouldCaptureTelemetry()` — `true` for local capture |
| — | `shouldUploadTelemetry()` — cloud + Grafana reachability + optional consent (**send phase**) |
| — | `auditRecord(event)` — IPC → main (**not yet implemented**) |

Internal implementation maps exceptions and breadcrumbs to OpenTelemetry spans/events exported via OTLP/HTTP.

## Risks

| Risk | Mitigation |
|------|------------|
| PII in events | span attribute scrubbing, audit schema, code review checklist |
| JSONL growth offline | rotation / max size, breadcrumb sampling |
| False “online” | separate heartbeat + Grafana Cloud ping |
| GDPR / retention | no auto-compliance claims; operator notice; delete/export issues |
| Scorekeeper write attribution | same audit IPC and schema as tournament director; session required |
| Audience privacy | no auth, no name, no activity telemetry or audit |

---

## Follow-up issues

Recommended order. Numbers are suggestions for GitHub issues.

**Capture phase (near-term):** Issues 1 ✓, 3 ✓ (local collector), 4–6.

**Send phase (deferred):** Issue 2; upload enablement in Issue 3.

### Issue 1 — Decouple telemetry guard (capture ≠ upload) · capture ✓

**Goal:** Events are no longer dropped offline; upload remains gated.

- `isMonitoringEnabled` → `shouldCaptureTelemetry` / `shouldUploadTelemetry` (upload helper deferred)
- Capture: `navigator.onLine` no longer blocks `captureException` / `addBreadcrumb`
- Tests for offline capture paths

**DoD:** Unit tests green; offline exceptions retained locally via OTLP → JSONL.

---

### Issue 2 — Connectivity: Grafana Cloud reachability + unified gate · send

**Goal:** Explicit checks before Grafana Cloud upload and before Supabase access. **Send phase** — not required for local capture.

- `checkGrafanaCloudReachability()` (HEAD/ping to OTLP ingest or configured health URL)
- Extend network status store: `isSupabaseReachable`, `isGrafanaCloudReachable`
- Supabase clients check heartbeat status before requests (or central API wrapper)
- `shouldUploadTelemetry` uses `isGrafanaCloudReachable`
- Document env vars for OTLP endpoint and credentials (main process only)

**DoD:** Tests with mocked fetch; upload blocked when heartbeat OK but Grafana Cloud down.

---

### Issue 3 — OpenTelemetry local capture (+ Grafana upload later) · capture ✓ / send deferred

**Goal (capture, done):** Main + renderer init, local OTLP collector, JSONL persistence.

**Goal (send, later):** Manual or automatic upload from Settings to Grafana Cloud (OTLP).

- OpenTelemetry Web + Node SDKs; `initLoggingProvider` / `initTelemetryApp`
- Local collector on `127.0.0.1:4318` with CORS for Vite dev origin
- Trace batches in `<userData>/telemetry/traces.jsonl`
- `@sentry/vue` and `@sentry/electron` removed

**DoD (capture):** Airplane mode → error → span batch in `traces.jsonl`; cloud off → local capture continues, no upload.

**DoD (send, later):** When upload enabled → spans appear in Grafana Cloud.

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

- [OpenTelemetry — OTLP](https://opentelemetry.io/docs/specs/otlp/)
- [OpenTelemetry JavaScript](https://opentelemetry.io/docs/languages/js/)
- Current code: `src/renderer/shared/lib/telemetry/`, `src/main/features/telemetry/`
- Network: `src/renderer/features/status/service/bootstrap-network-status.ts`
- Audit schema: `src/main/shared/database/migrations/V001__authorize_create_tables.sql`
- Project rules: `.cursor/rules/security-privacy.mdc`, `.cursor/rules/legal-open-source.mdc`
