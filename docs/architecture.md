# Architecture

DojoSphere uses two complementary architectures: **Feature-Sliced Design (FSD)** in the renderer and **vertical slices** in the Electron main process. The preload script bridges IPC between them.

## Overview

| Area                | Architecture                                            | Location                                                          |
| ------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| **Renderer**        | [Feature-Sliced Design](https://feature-sliced.design/) | `src/renderer/app/`, `pages/`, `widgets/`, `features/`, `shared/` |
| **Preload**         | IPC bridge                                              | `src/preload/`                                                    |
| **Main (Electron)** | Vertical Slices                                         | `src/main/features/<slice>/`, `shared/`, `app/`                   |

## Renderer (FSD)

- `src/renderer/app/` — composition root (router, plugins, providers)
- `src/renderer/pages/` — route-level components
- `src/renderer/widgets/` — reusable composed UI blocks
- `src/renderer/features/` — business slices (authentication, settings, status, …)
- `src/renderer/shared/` — cross-cutting utilities, API clients, UI primitives

Import rules and slice conventions: `.cursor/rules/architecture-fsd.mdc`.

## Main process (vertical slices)

- `src/main/app/` — bootstrap, IPC registration (`register-ipc.ts`)
- `src/main/features/<slice>/` — one use case per slice (users, sessions, health, logging, diagnostics, …)
- `src/main/shared/` — infrastructure (database, security helpers)
- `src/main/window/` — main-process window setup
- `src/preload/` — IPC bridge to `window.api`

Each main feature slice follows this layout:

```
src/main/features/<slice>/
  ipc/register.ts    # thin IPC adapters
  service/           # use-case orchestration (optional)
  repository/        # SQL access (optional)
  index.ts           # public API
```

Import rules:

- `features → shared`
- `features → features` only via `@main/features/<slice>`
- `shared` must not import features

Details: `.cursor/rules/architecture-vertical-slice.mdc`.

## Security boundaries

- The renderer must not access SQLite directly; all privileged operations go through IPC in the main process.
- Every privileged IPC operation must verify session, user, and permission in the main process.
- The renderer must not make security-critical decisions on its own.

See `.cursor/rules/security-privacy.mdc` for full security guidelines.
