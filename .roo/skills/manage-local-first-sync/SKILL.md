---
name: manage-local-first-sync
description: Enforces local-first SQLite priority, sync metadata isolation, conflict detection, and privacy rules for Supabase/remote sync.
---

# Skill: Local-First & Remote Sync Manager

Use this skill when developing or auditing code under `**/sync/**/*.ts`, `**/supabase/**/*.ts`, or `**/remote/**/*.ts`.

## Core Sync Rules & Safeguards

### 1. Data Minimization & Privacy

- **No Unnecessary Personal Data:** Send only required fields to remote services. Exclude private participant/member details unless explicitly needed for cloud operations.
- **Payload Logging Isolation:** Never log full JSON payloads containing participant, member, or competitor personal data during sync routines or error handling.

### 2. Architecture & Metadata Isolation

- **Separate Sync Metadata:** Keep sync-related fields (e.g., `remote_id`, `last_synced_at`, `sync_status`, `version_hash`) in separate sync tracking tables or dedicated columns, avoiding pollution of core domain models.
- **Local Authorization Alignment:** Sync execution must strictly enforce and respect local authorization levels. Unprivileged roles must not trigger elevated remote data syncs.

### 3. Key Isolation & Credentials

- **No Service Role Keys in Renderer:** Supabase `service_role` keys must strictly remain in the Electron Main process or secure environment variables. Never expose them to renderer/frontend code.

### 4. Conflict Handling & Local-First Precedence

- **No Blind Overwrites:** Never overwrite local SQLite records with remote data without explicit conflict detection (e.g., vector clocks, timestamps, or hashing).
- **Offline First:** Write operations must persist to local SQLite (`database.db`) first before queuing for optional background cloud sync.
