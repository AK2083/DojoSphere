---
name: validate-vsa-imports
description: >-
  Audits Main process code for VSA boundary rules, security isolation, and JSDoc
  requirements.
modeSlugs:
  - debug
---

# Skill: VSA Import & Security Validator

Use this skill to audit the Main process architecture.

## Validation Rules

1. **Driver Isolation:**
   - Ensure `node:sqlite` or `driver.ts` is **only** imported inside `src/main/shared/database/connection.ts`. Feature repositories must use `@main/shared/database`.

2. **Slice Boundaries:**
   - Confirm cross-slice imports use `@main/features/<slice>` (`index.ts`) and never reference internal paths like `<slice>/repository/...`.

3. **IPC Cleanliness:**
   - Confirm `ipc/register.ts` does not execute SQL directly.

4. **Preload Isolation:**
   - Confirm `src/preload/` contains no direct database, filesystem, or security-privileged operations.

5. **JSDoc Enforcement:**
   - Verify that all exported elements in `src/main/` have English JSDoc blocks.
