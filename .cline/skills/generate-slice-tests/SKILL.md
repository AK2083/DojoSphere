---
name: generate-slice-tests
description: >-
  Generates Storybook stories (.stories.ts) and Playwright E2E specs
  (.e2e.spec.ts) for existing FSD UI components. Intended for Roo Code Test
  Mode.
modeSlugs:
  - tester
---

# Skill: Slice Test & Story Generator

Use this skill when working in **Test Mode** (or QA Mode) in Roo Code to author and verify test specifications and component documentation.

## Input Target

Target component file: `src/renderer/features/<feature>/<slice>/ui/<ComponentName>.vue` (or corresponding paths in `pages/`, `widgets/`, or `shared/ui/`).

## Execution Steps

1. **Generate Storybook Story (`<ComponentName>.stories.ts`):**
   - Create a fully typed Vue 3 Storybook configuration.
   - Include necessary wrapper contexts (e.g., Vuetify provider, Pinia state mocks, or i18n mock placeholders).
   - Define primary default and edge-case state stories.

2. **Generate Playwright E2E Spec (`<ComponentName>.e2e.spec.ts`):**
   - Create interaction and DOM assertions using Playwright.
   - Cover component visibility, user interactions (clicks, form inputs), and error states.

3. **Execution & Verification (Roo Code Test Mode):**
   - Run the newly generated test or Storybook verification command via CLI tool execution to confirm all tests pass.
