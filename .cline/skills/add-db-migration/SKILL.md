---
name: add-db-migration
description: >-
  Creates a versioned SQL migration file and updates the database registry in
  src/main/shared/database/migrations/.
modeSlugs:
  - architect
---

# Skill: Database Migration Generator

Use this skill to modify the SQLite database schema (tables, columns, indexes).

## Rules & Safeguards

- **Non-Destructive Migrations:** Migrations must **never** drop tables, columns, or delete user data without an explicit, documented architectural decision.
- Always use default values or safe migration steps when altering existing schemas.

## Execution Steps

1. **Determine Version Prefix:**
   - Check existing files under `src/main/shared/database/migrations/` to find the highest version index (e.g., `V003`). Increment it (e.g., `V004`).

2. **Create SQL Migration File:**
   - Path: `src/main/shared/database/migrations/V<XXX>__<slice_or_context>_<short_description>.sql`
   - Include clear SQL statements (`CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`).

3. **Register in Registry:**
   - Export and import the new migration file inside `src/main/shared/database/migrations/index.ts` so `runner.ts` executes it during `app/bootstrap`.
