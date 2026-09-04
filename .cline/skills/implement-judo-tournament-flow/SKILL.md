---
name: implement-judo-tournament-flow
description: >-
  Enforces role boundaries and workflow logic for Tournament Director (Electron
  host), Scorekeeper (Intranet + Mat assignment), and Audience (LAN read-only).
modeSlugs:
  - code
---

# Skill: Judo Tournament Workflow & Role Enforcer

Use this skill when implementing tournament management features, fight schedules, mat assignments, or scorekeeper controls.

## Access & Role Matrix

1. **Tournament Director (Electron Host):**
   - Has full access to tournament initialization, competitor registration, mat setup, and scorekeeper approval.
   - Operates strictly within the Electron Main App context.

2. **Scorekeeper (Intranet / Browser):**
   - Access path: Web client connecting over the local area network (LAN).
   - Must submit an access request to the host.
   - Action boundary: Can ONLY manage scores and matches for their **assigned mat** after explicit host approval.

3. **Audience (Intranet / Browser):**
   - Access path: Direct URL or QR-Code scan over LAN.
   - **No approval required**. Read-only view of current brackets, fight lists, and mat statuses.
   - Must **never** expose unneeded personal competitor data in URLs, LocalStorage, or public DOM elements.

## Execution Rules

- Ensure domain logic for match generation and mat distribution is shared, but UI routes and IPC/API permissions are strictly segmented by user role.
- Small tournament focus: Keep volunteer interfaces minimal, intuitive, and error-tolerant.
