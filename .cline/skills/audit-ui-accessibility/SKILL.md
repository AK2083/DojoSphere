---
name: audit-ui-accessibility
description: >-
  Audits Vue components for WCAG/a11y standards, ARIA attributes, keyboard
  navigation, and responsive Vuetify grid usage.
modeSlugs:
  - code
  - ask
---

# Skill: UI Accessibility & Responsive Auditor

Use this skill when developing or reviewing Vue 3 components under `src/renderer/**/*.vue`.

## Inspection Checklist

1. **Accessibility (a11y):**
   - **Form Inputs:** Ensure every input element has an associated `<label>`, `aria-label`, or `aria-labelledby`.
   - **Icon Accessibility:** Decorative MDI icons must have `aria-hidden="true"`. Icon-only buttons must carry an explicit, translated `aria-label`.
   - **Dynamic Alerts:** Dynamic status/error messages must use `role="alert"` or `aria-live="polite"`.
   - **Keyboard Navigation:** All interactive elements must be focusable via keyboard with visible focus states.

2. **Template Cleanliness:**
   - Verify **zero business logic in templates** (no inline calculations, complex logical conditions, or raw API calls). Templates must only bind state and trigger events from script/composable.

3. **Responsive Grid:**
   - Layouts must use Vuetify grid components (`v-container`, `v-row`, `v-col`) with dynamic breakpoints (`cols`, `md`, `lg`).
   - Use `useDisplay()` from Vuetify for mobile/desktop toggle logic instead of fixed pixel widths.
