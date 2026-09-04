---
name: update-compliance-docs
description: >-
  Identifies newly introduced data processing features and updates project
  documentation and privacy notes accordingly.
modeSlugs:
  - compliance
---

# Skill: Compliance Documentation Updater

Use this skill when introducing features that process new types of user data or introduce external integrations.

## Execution Steps

1. **Analyze Feature Scope:** Determine what new data types are stored/processed and if external services (e.g., Supabase, Email) are involved.
2. **Review Privacy Documentation:** Check if `PRIVACY.md` or operator guidance notes require updates regarding new data flows.
3. **Update Guidance:** Draft operator guidance explaining necessary permissions, retention considerations, and legal responsibilities for the new feature.
