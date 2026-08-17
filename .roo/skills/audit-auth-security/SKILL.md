---
name: audit-auth-security
description: >-
  Audits auth, session, and migration files for plain-text token leaks, missing
  IPC session guards, and role mutation vulnerabilities.
modeSlugs:
  - debug
  - ask
  - security
---

# Skill: Auth & Security Auditor

Use this skill to audit authorization, authentication, and database code under `**/auth/**`, `**/sessions/**`, and `**/migrations/**`.

## Inspection Checklist

1. **Plain-Text Token Check:** Scan for plain-text token storage or logging. Tokens must be stored as hashes.
2. **IPC Authorization Check:** Verify every `ipcMain.handle` in `src/main/` checks for an active session and required permission before executing logic.
3. **Role Protection:** Confirm that endpoints or SQL queries modifying system roles/permissions are protected and not callable by standard users.
4. **Access Request States:** Verify DB schemas and logic enforce the `pending | approved | rejected | expired` status constraints.

## Output Format

List any security flaws with exact file paths, lines, and severity levels, accompanied by recommended fixes.
