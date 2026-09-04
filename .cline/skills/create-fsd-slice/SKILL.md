---
name: create-fsd-slice
description: >-
  Generates the core structure for an FSD feature slice under
  src/renderer/features/. Strictly creates i18n and api folders on a conditional
  basis.
modeSlugs:
  - architect
---

# Skill: FSD Feature Slice Creator

Use this skill to create a new use-case slice under `src/renderer/features/<feature-name>/<slice-name>/`.

## Conditional Directory Logic

Evaluate the following conditions **before** creating any files or folders:

### 1. Internationalization (`i18n/`) — _Conditional_

- **Create `i18n/` ONLY IF** the component or logic contains user-facing text, labels, or UI notifications.
- When required, create `keys.ts`, `de.ts`, `en.ts`, and `index.ts`.
- If **no user-facing text** exists (e.g., pure data-handling slice), **omit the `i18n/` directory entirely**.

### Internationalization Layout (under `features/<feature>/<slice>/i18n/`)

- Single flat structure: `keys.ts`, `de.ts`, `en.ts`, and `index.ts`.
- **No language subfolders** (`de/`, `en/`) or topic-split files (`cloud.ts`).
- All user-facing strings and ARIA labels must route through `useTranslation()` and slice `keys.ts`.

### 2. API Layer (`api/`) — _Conditional_

- **Create `api/` ONLY IF** the slice needs to fetch or send data via `@shared/api` (e.g., Supabase client, HTTP requests).
- When required:
  - Create `api/index.ts` (or specific request functions) to encapsulate calls to `@shared/api` and handle slice-level error reporting.
  - The `model/` layer must import **exclusively** from the local slice `api/`, never directly from `@shared/api`.
- If no external API access is required, omit the `api/` directory entirely.

---

## File Structure Template

```text
features/<feature>/<slice>/
├── ui/
│   └── <ComponentName>.vue
├── model/
│   └── use-<slice>.ts
├── api/            # OPTIONAL: Only if calling @shared/api
│   └── index.ts
├── i18n/           # OPTIONAL: Only if user-facing text exists
│   ├── keys.ts
│   ├── de.ts
│   ├── en.ts
│   └── index.ts
└── index.ts        # Public API export
```
