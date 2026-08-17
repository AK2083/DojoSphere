---
name: run-ui-completion-pipeline
description: >-
  Executes the required linting, type-checking, formatting, coverage, and test
  pipelines prior to completing UI tasks.
modeSlugs:
  - tester
---

# Skill: UI Completion Pipeline

Use this skill in Test/QA Mode after completing UI features or component modifications to ensure full CI compliance.

## Execution Steps

Run and verify the following commands via terminal execution:

1. **Linting & Formatting:**
   - Execute `npm run lint:fix`
   - Execute `npm run format:fix`
   - Execute `npm run type:check`

2. **Test & Story Verification:**
   - Execute unit tests with coverage: `npm run test:coverage`
   - Run Playwright E2E specs for affected components (`.e2e.spec.ts`)
   - Verify Storybook compilation for affected stories (`.stories.ts`)

3. **Lighthouse Verification:**
   - Ensure Accessibility, Best Practices, and Performance score benchmarks are maintained with no regressions.
