---
description: Security rules for local users, roles, sessions and access requests
globs: **/auth/**/*.ts, **/authorization/**/*.ts, **/sessions/**/*.ts, **/db/**/*.sql, **/migrations/**/*.sql
alwaysApply: false
---

Authorization must be enforced in the Electron main process.
Every privileged IPC handler must verify the current session and required permission.
Do not store session tokens in plain text. Store token hashes only.
System roles and permissions must be protected from normal user edits.
Access requests must have clear states: pending, approved, rejected, expired.
Approved access requests must create a real local user or attach to an existing one.
