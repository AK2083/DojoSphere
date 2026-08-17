---
description: Security and privacy rules for implementations
alwaysApply: true
---

Technical security rules:

- Do not store secrets, API keys, service role keys, tokens, or passwords in the renderer, frontend, repository, SQLite, or logs.
- Supabase service role keys must never be used in the Electron renderer or normal client code.
- SQLite access happens only in the Electron main process or trusted local services.
- Renderer code must not make security-critical decisions on its own.
- Every privileged IPC operation must verify session, user, and permission.
- Never store session tokens in plaintext; store secure hashes only.
- Logs must not contain full personal records, session IDs, tokens, or sensitive content.
- Migrations must not delete user data without an explicit, documented decision.
- Sync must not overwrite local data without conflict detection.
