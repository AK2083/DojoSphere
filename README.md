# DojoSphere

Open-source Electron application for managing Judo tournaments.

## Features

- Tournament administration
- Competitor and club management
- Local intranet spectator view
- Match and schedule overview
- Offline/local-first capable setup

## Table of Contents

- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Best Practices](#best-practices)
- [Project Structure (Recommended)](#project-structure-recommended)
- [Dependencies](#dependencies)

## Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/), [Vue Router](https://router.vuejs.org/), [Vuetify](https://vuetifyjs.com/)
- **Build Tooling:** [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/), [Vue TSC](https://www.npmjs.com/package/vue-tsc)
- **Desktop Runtime:** [Electron](https://www.electronjs.org/)
- **Internationalization:** [vue-i18n](https://vue-i18n.intlify.dev/)
- **Backend Services:** [Supabase](https://supabase.com/)
- **Monitoring:** [Sentry for Vue](https://docs.sentry.io/platforms/javascript/guides/vue/), [GlitchTip](https://glitchtip.com/)
- **Testing:** [Vitest](https://vitest.dev/) (unit), [Playwright](https://playwright.dev/) (E2E), [Storybook](https://storybook.js.org/) (UI components)
- **Code Quality:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## Requirements

- **Node.js:** latest LTS recommended
- **npm:** installed with Node.js
- **(Optional) Supabase CLI:** for local Supabase services

## Quick Start

```bash
npm install
npm run dev
```

Run desktop and frontend together:

```bash
npm run electron:start
```

Run Storybook for isolated UI development:

```bash
npm run storybook
```

Create a production build:

```bash
npm run build
```

## Available Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs type checks and creates a production build.
- `npm run preview` serves a local preview of the production build.
- `npm run electron` starts the Electron app.
- `npm run electron:start` runs Vite and Electron in parallel.
- `npm run lint:check` runs ESLint checks.
- `npm run lint:fix` auto-fixes supported ESLint issues.
- `npm run type:check` runs TypeScript and Vue type checks without building.
- `npm run format:check` checks formatting with Prettier.
- `npm run format:fix` formats files using Prettier.
- `npm run test` runs unit tests with Vitest.
- `npm run test:coverage` runs tests and generates a coverage report.
- `npm run test:e2e` runs end-to-end tests with Playwright.
- `npm run test:e2e:ui` opens Playwright in UI mode.
- `npm run storybook` starts Storybook (uses the next free port if `6006` is already occupied).
- `npm run build-storybook` creates a static Storybook build.
- `npm run supabase:start` starts local Supabase services.
- `npm run supabase:stop` stops local Supabase services.
- `npm run supabase:status` shows the status of local Supabase services.
- `npm run supabase:init` initializes Supabase configuration for the project.

## Best Practices

- Keep changes small and focused by feature or fix.
- Run `lint:check`, `type:check`, and relevant tests before every commit.
- Cover new business logic with unit tests and critical flows with E2E tests.
- Avoid hardcoded UI strings and use i18n keys consistently.
- Handle errors and edge cases explicitly (auth, API failures, offline behavior).
- Keep formatting and import ordering consistent across the codebase.

## Project Structure (Recommended)

- The structure follows key ideas from [Feature-Sliced Design](https://feature-sliced.design/): business-focused slices, clear boundaries, and explicit module APIs.
- `src/features/` contains domain-focused feature slices (for example authentication and settings).
- `src/widgets/` contains reusable, composed UI blocks that combine multiple features/entities.
- `src/shared/` (if present) contains cross-cutting utilities, types, and configuration with no business ownership.
- `electron/` contains main and preload logic for the desktop runtime.

## Dependencies

- `@fontsource/roboto`: Provides local Roboto fonts for consistent typography across platforms.
- `@mdi/js`: Provides Material Design icon SVG paths for flexible icon rendering.
- `@sentry/vue`: Captures runtime errors and performance signals for monitoring and debugging.
- `@supabase/supabase-js`: Client SDK for Supabase auth, database access, and related services.
- `vue`: Core framework for building reactive, component-driven user interfaces.
- `vue-i18n`: Internationalization library for translations and locale-aware UI text.
- `vue-router`: Official routing library for navigation and page-level state by route.
- `vuetify`: Material Design component framework for consistent, fast UI development.
