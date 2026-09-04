---
name: audit-third-party-data-transfer
description: >-
  Audits external data transfers (Supabase, external APIs, export files) for
  role authorization and privacy compliance.
modeSlugs:
  - compliance
---

# Skill: Third-Party Data Transfer Auditor

Use this skill when implementing feature endpoints that send data externally or generate local export files (e.g., PDF/Excel/CSV).

## Inspection Checklist

1. **External Boundaries:** Identify all data payloads sent to Supabase, external REST/GraphQL APIs, or third-party integrations.
2. **Role & Permission Enforcer:** Confirm that data transfer calls are authorized at a trusted layer (Main process or Supabase RLS) prior to dispatching.
3. **Export Minimization:** When generating file exports (e.g., tournament lists, member rosters), confirm that non-public/sensitive fields are excluded unless the user explicitly holds permission to view them.
4. **Public Exposure Check:** Ensure no private member data is rendered publicly without explicit authorization checks.
