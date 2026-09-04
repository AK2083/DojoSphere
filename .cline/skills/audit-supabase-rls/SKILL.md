---
name: audit-supabase-rls
description: >-
  Audits Supabase database migrations for proper Row Level Security (RLS)
  policies and direct API access vectors.
modeSlugs:
  - security
---

# Skill: Supabase RLS & API Security Auditor

Use this skill in Security Mode to inspect SQL migrations and Supabase access.

## Inspection Checklist

1. **RLS Enabled:** Every table created in `migrations/` must explicitly execute `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
2. **Policy Coverage:** Verify that `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies exist for non-public tables.
3. **Anon Key Exposure:** Ensure the `anon` key is restricted strictly to public endpoints and read-only operations where necessary.
4. **Service Role Security:** Ensure the `service_role` key is stored ONLY in Electron Main process environment variables and NEVER passed to the Renderer/Vue process.
