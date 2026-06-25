# Logging & Monitoring — Architecture

This document describes the **offline-first logging architecture** for DojoSphere (outcome of SPIKE #0). The **capture phase** is fully implemented; **error-triggered upload** to Grafana Cloud is available when Settings allow.

> **Note:** This document does not constitute legal advice. Operators are responsible for the legal basis, information obligations, retention, and deletion of personal data in their specific deployment.

## Phased rollout

| Phase | Status | Scope |
|-------|--------|--------|
| **Capture** | **Implemented** | Local OTLP collector → `traces.jsonl`, audit in SQLite, debug log file, role-aware activity boundaries |
| **Send** | **Partial** | Error-triggered OTLP upload to Grafana Cloud when Settings allow; export scrubber + HMAC |

Capture works offline and without a Supabase session. Cloud usage (`isCloudUsed`) is derived from Supabase auth persistence (`dojosphere.auth.session`) after OTP or login — not from a separate settings flag. Settings expose automatic diagnostic upload only (privacy-first default: off).

## Current implementation

| Topic | Today |
|-------|-------|
| SDK | OpenTelemetry — `@opentelemetry/sdk-trace-web` (renderer), `@opentelemetry/sdk-trace-node` (main) |
| Local collector | Main-process OTLP/HTTP server on `127.0.0.1:4318`; trace batches appended to `<userData>/telemetry/traces.jsonl` |
| Public API | `@shared/lib` — `captureException`, `addBreadcrumb`, `setUserContext`, `auditRecord`, `shouldCaptureTelemetry`, `shouldUploadTelemetry`; features do not import OTel SDKs |
| Main / Preload | `initTelemetryApp` (main), `initLoggingProvider` + router activity scope (renderer); `audit:record` IPC via preload |
| Offline capture | `shouldCaptureTelemetry()` is always `true`; `navigator.onLine` does not block local capture |
| Cloud usage | `isCloudUsed` reflects **Supabase session** in storage; gates UI indicators; independent of diagnostic upload |
| Audit | `authorization_audit_logs` via `src/main/features/audit/`; IPC + repository; competitor create/update/delete audited in main; authorization events (session revoke, role assigned) supported |
| Activity scope | Route meta `activityLogging: false` on audience paths; guards in `@shared/lib` skip activity breadcrumbs, `setUserContext`, and renderer `auditRecord` |
| Connectivity | `isSupabaseReachable` and `isGrafanaCloudReachable` in network status store; `checkGrafanaCloudReachability()` in main (IPC); heartbeat for Supabase |
| Settings | Auto diagnostic upload toggle; in-app legal notice; prefs synced to main via IPC |
| Grafana upload | Error-triggered upload from `traces.jsonl` with export scrubber (HMAC `user.id`, error codes only, denylist) |
| Audience | `/audience` — anonymous read-only overview; see `src/renderer/features/audience/README.md` |

### Local data paths (Electron `userData`)

| Lane | Path |
|------|------|
| Telemetry traces | `<userData>/telemetry/traces.jsonl` |
| Audit | `<userData>/database.db` → table `authorization_audit_logs` |
| Debug | `<userData>/logs/app.log` |

## Three lanes

| Lane | Purpose | Storage / destination | Process |
|------|---------|----------------------|---------|
| **Telemetry** | Errors, performance, technical breadcrumbs | **Capture:** local OTLP collector → `traces.jsonl`. **Send:** Grafana Cloud (OTLP, scrubbed) on error | Main + renderer via OpenTelemetry SDKs |
| **Audit** | Traceable business actions (who changed what?) | SQLite (`authorization_audit_logs`) | Main only |
| **Debug** | Developer / support logs | Rotating log file | Main only |

**Separation rule:** Audit events **never** go to Grafana Cloud / telemetry backends. Telemetry does not replace audit.

```
┌─────────────────────────────────────────────────────────────────┐
│ Renderer (Vue) — tournament director & scorekeeper (authenticated) │
│ use telemetry + audit; the audience (anonymous, read-only) uses    │
│ neither for activity tracking                                     │
│                                                                 │
│  @shared/lib/telemetry  ──► OTLP/HTTP → 127.0.0.1:4318          │
│  @shared/lib/audit      ──► preload IPC ──► Main → SQLite       │
│  route meta activityLogging ──► activity-logging scope guard      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Main Process                                                    │
│  local OTLP collector   → traces.jsonl (capture)                │
│  sdk-trace-node         → same collector (main spans)             │
│                         → Grafana Cloud upload (on error, scrubbed)   │
│  audit repository       → authorization_audit_logs (SQLite)     │
│  debug logger           → log file (userData/logs/)             │
└─────────────────────────────────────────────────────────────────┘
```

## Cloud usage (`isCloudUsed`)

`isCloudUsed` reflects whether Supabase has persisted a cloud auth session — independent of diagnostic upload to Grafana Cloud. It is updated from Supabase auth state (`watchAuthState`) and initial storage read (`dojosphere.auth.session`). Navigation exposes **Register** (explicit `router.push`) when not cloud-signed-in; guest routes remain reachable with a local-only session.

| Action | Supabase session active | No Supabase session |
|--------|-------------------------|---------------------|
| Telemetry **capture** (local OTLP / JSONL) | yes | yes |
| Telemetry **upload** (Grafana Cloud) | when auto-upload on + reachable | when auto-upload on + reachable |
| Supabase access | yes, after heartbeat | yes when online (registration/login flows) |
| Audit (SQLite) | yes | yes |
| Debug file | yes (configurable) | yes (configurable) |

**Core rule:** Cloud usage does **not** gate local capture or Grafana upload. Upload is controlled by the separate auto-upload toggle.

### Send phase — upload (error-triggered)

Applies only when **sending** exception telemetry to Grafana Cloud — not when **capturing** events locally.

- **Capture:** always on (local OTLP collector / SQLite audit); no dialog, no upload required.
- **Send:** on `captureException`, when `uploadAllowed` (see below), main reads new `traces.jsonl` lines, scrubs them, and POSTs to Grafana OTLP.

**Settings UX:** `/settings` — “send diagnostic data on errors” toggle. Data-processing notice (accordion) is always visible on the diagnostic section. No PDF required. Cloud registration is started from navigation (**Register**), not from Settings.

**Telemetry upload gate:**

```
uploadAllowed =
  autoUploadDiagnostics
  ∧ grafanaCloudReachable
```

`shouldUploadTelemetry()` evaluates all three conditions. Preferences are persisted in `localStorage` and synced to main via `telemetry:setUploadPreferences`.

### Grafana export rules (GDPR-oriented)

| Local capture (`traces.jsonl`) | Grafana export |
|--------------------------------|----------------|
| Full exception spans, stacks, breadcrumbs | **Exception spans only** |
| Raw `user.id` | `user.id_hmac` (HMAC-SHA256, install secret in `<userData>/telemetry/export-hmac.key`) |
| `error.message`, stacks | **`error.code` only** (e.g. `auth.invalid_credentials`) |
| debug/info breadcrumbs | **Dropped** on export |
| Denied keys/values (email, token, bearer, …) | **Removed**; span dropped if unsafe |

Scrubber: `src/main/features/telemetry/service/export-scrubber.ts`. Audit lane and `app.log` are never uploaded.

## Connectivity checks

**Upload gating** — not required for local capture.

| Before access to | Check | Status |
|------------------|-------|--------|
| Supabase (auth, API, sync) | heartbeat edge function | implemented (`checkHeartbeatConnectivity`) |
| Grafana Cloud OTLP upload | dedicated reachability check (HEAD to ingest URL) | implemented (`checkGrafanaCloudReachability`); upload on error when Settings allow |
| Local SQLite / IPC / OTLP collector | no network check | — |

**Telemetry upload gate (send phase):**

```
uploadAllowed =
  autoUploadDiagnostics
  ∧ grafanaCloudReachable
```

`shouldUploadTelemetry()` evaluates auto-upload preference and `isGrafanaCloudReachable`.

## Roles and logging scope

Scorekeepers and the audience use the **same Electron app** on the intranet (no separate browser client). Logging differs by role:

| Role | Authentication | Telemetry | Audit (`authorization_audit_logs`) |
|------|----------------|-----------|--------------------------------------------------|
| **Tournament director** | local/cloud session | full (exceptions, breadcrumbs, performance sample) | **full** — all write actions |
| **Scorekeeper** | after host approval; write access | full on authenticated paths (same technical pipeline as director) | **full — same rules as tournament director** for every write (scores, mat actions, approvals, …) |
| **Audience** | **none** — no name, no sign-in, anonymous read-only | **none** — no role-specific activity logging | **none** for audience activity; the audience does not produce audit rows |

**The audience** opens the overview at `/audience` without entering a name or authenticating. Browsing is not tracked via telemetry breadcrumbs or dedicated audit events. Authorization-related history (e.g. scorekeeper approval, role assignment) is still recorded when the **host or an authenticated user** performs those actions — not as per-audience activity logs.

**Scorekeepers** perform write operations and must be attributable like the tournament director: every privileged write goes through the same audit pipeline (`actor_user_id`, action, entity) after session and permission checks in main.

### Activity logging scope

Audience routes set `meta: { activityLogging: false }`. The app composition root (`bindActivityLoggingToRouter`) syncs scope on navigation:

- **Disabled:** info/debug breadcrumbs (`monitorInformation`, `monitorDebug`), `setUserContext`, renderer `auditRecord`; user context is cleared when entering an audience route.
- **Still allowed:** `captureException`, warning/error breadcrumbs, and global error handlers (not audience *activity* tracking).

Feature spec: `src/renderer/features/audience/README.md`.

## Audit storage

Reuse the existing `authorization_audit_logs` table from migration V001 as the **single audit store** for all authenticated write actions.

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
- Match: `entity_type = 'match'`, `action = 'score.updated'` (planned)

A later rename to `audit_logs` may be considered once non-authorization events are common.

## Audit scope (implemented and planned)

Written to **`authorization_audit_logs`** via the audit repository and IPC path (or directly from main repositories inside transactions).

| Domain | Status | Notes |
|--------|--------|--------|
| Authorization (session revoke, role assigned) | implemented | renderer `auditRecord` + main helpers |
| Competitors (create, update, delete) | implemented | audited in `competitors` repository; JSON without PII values |
| Mats, matches, access requests | planned | same table and pipeline |

Fields as defined in **Audit storage** above — **without** sensitive plaintext PII in JSON (IDs, field names, status — not names/emails).

The renderer calls `auditRecord(token, event)` via `@shared/lib`; writes happen in main only after session validation. **Every authenticated write** (tournament director or scorekeeper) uses this path or an equivalent main-side `insertAuditLog` in the same transaction as the domain write. Audience read-only views never call it.

## PII and privacy

- No tokens, session IDs, passwords, or full personal records in span attributes / breadcrumb `data`
- `setUserContext` with internal user ID only (no email); not set on audience routes
- Span attribute scrubbing before Grafana export (implemented in export scrubber)
- Review breadcrumb payloads (e.g. cloud status as boolean flag only, no key names with context)
- Trace file under `<userData>/telemetry/` — operator-visible path; settings UX TBD
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

## Public API

| API | Role |
|-----|------|
| `shouldCaptureTelemetry()` | Local capture always allowed |
| `shouldUploadTelemetry()` | Cloud + auto-upload + Grafana reachability |
| `captureException`, `addBreadcrumb` | Telemetry via OTLP → local collector |
| `setUserContext` / `clearUserContext` | User ID on spans; skipped when activity logging disabled |
| `auditRecord(token, event)` | IPC → `authorization_audit_logs`; skipped when activity logging disabled |
| `setActivityLoggingEnabled` / route binding | Internal scope; set from router meta in app composition root |

Internal implementation maps exceptions and breadcrumbs to OpenTelemetry spans/events exported via OTLP/HTTP.

## Risks

| Risk | Mitigation |
|------|------------|
| PII in events | span attribute scrubbing, audit schema, code review checklist |
| JSONL growth offline | rotation / max size, breadcrumb sampling |
| False “online” | separate heartbeat + Grafana Cloud ping |
| GDPR / retention | no auto-compliance claims; operator notice; delete/export TBD |
| Scorekeeper write attribution | same audit IPC and schema as tournament director; session required |
| Audience privacy | no auth, no name, no activity telemetry or audit; `/audience` + scope guard |

## References

- [OpenTelemetry — OTLP](https://opentelemetry.io/docs/specs/otlp/)
- [OpenTelemetry JavaScript](https://opentelemetry.io/docs/languages/js/)
- Renderer telemetry: `src/renderer/shared/lib/telemetry/`
- Renderer audit: `src/renderer/shared/lib/audit/`
- Router activity scope: `src/renderer/app/providers/router/activity-logging.ts`
- Main telemetry: `src/main/features/telemetry/`
- Main audit: `src/main/features/audit/`
- Audience feature spec: `src/renderer/features/audience/README.md`
- Network status: `src/renderer/features/status/service/bootstrap-network-status.ts`
- Audit schema: `src/main/shared/database/migrations/V001__authorize_create_tables.sql`
- Project rules: `.cursor/rules/security-privacy.mdc`, `.cursor/rules/legal-open-source.mdc`
