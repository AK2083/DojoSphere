---
name: manage-access-request
description: >-
  Implements access request state transitions (pending, approved, rejected,
  expired) and binds approved requests to local users.
modeSlugs:
  - code
---

# Skill: Access Request Lifecycle Manager

Use this skill when handling access requests or user onboarding logic.

## State Machine Rules

Access requests must strictly transition through these four states:

- `pending`: Initial state upon creation.
- `approved`: Triggers user binding/creation.
- `rejected`: Final state, no user modification.
- `expired`: Time-out state, no action allowed.

## Workflow Execution for Approval

When an access request is set to `approved`:

1. Verify if a matching local user already exists by unique identifier/email.
2. If the user exists: Attach the approved role/permissions to the existing account.
3. If the user does not exist: Create a new real local user account and assign the role.
4. Record the approval timestamp and administrator ID in the main database.
