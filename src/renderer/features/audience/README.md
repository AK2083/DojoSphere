# Audience (read-only overview)

Anonymous spectators open the tournament overview on the local network without signing in or entering a name.

## Access model

| Aspect             | Behavior                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Authentication     | None — no session, no user record                                                           |
| Personal data      | No name or identifier collected on this path                                                |
| Activity logging   | No activity audit or user context on audience routes                                        |
| Audit              | No audience activity rows in `authorization_audit_logs`                                     |
| Errors             | Unhandled application errors are still written to the local error log via global handlers   |

## Routing

- Path: `/audience`
- Route meta: `activityLogging: false`
- The app composition root binds activity-logging scope from route meta (see [docs/logging.md](../../../docs/logging.md) — Activity logging scope).

## Implementation rules

- Audience UI must not call `auditRecord` for activity tracking on audience routes.
- Authorization history (e.g. scorekeeper approval) is recorded when an **authenticated** user performs the action — not when the audience browses the overview.

## Scorekeepers

Scorekeepers use the same authenticated write path as the tournament director. Every privileged write in main records audit events with `actor_user_id` — there is no reduced audit tier for scorekeepers.
