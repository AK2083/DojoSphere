---
name: enforce-ipc-security
description: >-
  Wraps Electron IPC handlers with session authentication, permission checks,
  and token hash validation.
modeSlugs:
  - security
  - code
  - ask
---

# Skill: Enforce IPC Security

Use this skill when implementing or refactoring privileged IPC handlers under `src/main/features/`.

## Mandatory Security Pattern

Every privileged IPC handler in `src/main/features/<slice>/ipc/register.ts` must follow this execution order:

1. **Session Verification:** Retrieve and validate the active session token hash using `@main/shared/security` or the `sessions` slice.
2. **Permission Check:** Verify that the authenticated session holds the required permission for the requested action.
3. **Execution Delegation:** Delegate to the service or repository layer **only** after step 1 and 2 succeed.

## Rules & Constraints

- **Never** store or compare raw session tokens in memory or database; compare **SHA-256 token hashes** only.
- Reject requests with invalid sessions immediately before parsing inputs or running DB queries.
- Block normal users from modifying system roles or permission assignments.
