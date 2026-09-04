---
name: audit-data-privacy
description: >-
  Audits code for data minimization, PII logging leaks, real personal data in
  tests/mocks, and minor protection.
modeSlugs:
  - compliance
---

# Skill: Data Privacy & GDPR Auditor

Use this skill in Compliance Mode to inspect features processing user or tournament data.

## Inspection Checklist

1. **Data Minimization:** Are we collecting, storing, or exporting only the absolute minimum required personal fields?
2. **PII in Logs:** Ensure error logs, debug statements, and crash reports (`logError`, console output) strip out names, emails, birthdates, or phone numbers.
3. **No Real Personal Data:** Verify that test seeds, Storybook stories, E2E specs, and screenshots use **strictly fictional mock data** (e.g., `John Doe`, `test@example.com`).
4. **Minor/Children Protection:** If competitor or club member data involves minors, ensure extra data isolation and strict permission checks exist at the trusted main/database layer.
