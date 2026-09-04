---
description: Security rules for synchronization with Supabase or remote services
globs: **/sync/**/*.ts, **/supabase/**/*.ts, **/remote/**/*.ts
alwaysApply: false
---

Do not send unnecessary personal data to remote services.
Do not use Supabase service role keys in Electron renderer code.
Sync must respect local authorization rules.
Do not overwrite local data without conflict detection.
Keep sync metadata separate from domain tables when possible.
Do not log full payloads containing participant or member data.
