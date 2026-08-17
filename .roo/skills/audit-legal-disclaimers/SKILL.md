---
name: audit-legal-disclaimers
description: >-
  Scans code, documentation, and UI text for illegal compliance claims, missing
  operator disclaimers, or license violations.
modeSlugs:
  - compliance
---

# Skill: Legal & Open-Source Compliance Auditor

Use this skill to audit README files, UI notices, SECURITY.md, or promotional copy.

## Inspection Checklist

1. **No Absolute GDPR Claims:** Scan for terms like "GDPR-compliant", "DSGVO-sicher", or "certified". Replace or update wording to clarify that **the operator is responsible** for legal deployment, retention rules, and consent.
2. **Operator Responsibility Notice:** Ensure documentation clearly states that the software provides technical guardrails, but legal compliance depends on the specific deployment context.
3. **License & Copyright:** Confirm MIT license headers and copyright notices remain intact across all public files and repositories.
