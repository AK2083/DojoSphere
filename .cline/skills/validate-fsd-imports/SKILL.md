---
name: validate-fsd-imports
description: >-
  Audits code for Feature-Sliced Design import boundary violations and layer
  integrity.
modeSlugs:
  - debug
  - ask
---

# Skill: FSD Import Validator

Use this skill prior to commits or PRs to ensure strict adherence to FSD layering rules.

## Validation Checklist

1. **Downward Import Rule:**
   - Confirm `shared` imports **nothing** from `app`, `pages`, `widgets`, or `features`.
   - Confirm `features` do not import other `features` or higher layers.
   - Confirm `pages` route setup imports only `@pages/*`.

2. **API Layering Integrity:**
   - Verify that `features/.../model/` and `features/.../ui/` do **not** directly import `@shared/api`.
   - All API calls from a slice model must route through the slice's own `api/` directory.

3. **Public API Exports (`index.ts`):**
   - Ensure imports crossing slice boundaries enter via the target slice's `index.ts` root rather than deep internal paths.

## Output Format

Provide a concise summary of identified architecture violations along with exact file lines and suggested refactoring steps.
