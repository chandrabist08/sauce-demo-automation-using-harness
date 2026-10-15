# Project Context — Saucedemo

## Application name
Sauce Demo (`saucedemo.com`) — a purposely-built e-commerce demo site by Sauce Labs used for Playwright automation practice.

## Tech stack
- Frontend: Single-page application (plain JavaScript, no framework)
- No backend API — all state is client-side only
- No database — product catalogue is static; cart and session state live in `localStorage`

## Authentication method
- Form-based login at `/` (`data-test="username"` + `data-test="password"`)
- Auth is captured once via `playwright/support/setup/auth.setup.ts` using `storageState`
- Auth state saved to `playwright/storage/auth/user.json` (gitignored)
- All test projects depend on the `setup` project; tests never log in inside `beforeEach`
- Credentials supplied via env vars: `USERNAME`, `PASSWORD` (from `.env.qa` locally; GitHub Secrets in CI)

## Key user roles
| Username | Behaviour |
|---|---|
| `standard_user` | Normal behaviour — used for all current tests |
| `locked_out_user` | Login blocked with specific error message |
| `problem_user` | Broken product images; some interactions misbehave |
| `performance_glitch_user` | Artificially slow page loads (~5 s) |
| `error_user` | Checkout and cart interactions trigger errors |
| `visual_user` | Layout and visual differences from standard |

## Base URL (staging)
`https://www.saucedemo.com` — set via `BASE_URL` env var (read from `.env.qa`); falls back to `http://localhost:3000` if unset.

## API base URL
None — saucedemo has no REST or GraphQL API. `API_ENDPOINTS` is intentionally empty.

## Known constraints
- `fullyParallel: true` in Playwright config — tests must be fully independent (no shared state between specs)
- CI runs with `workers: 1` to avoid rate-limiting on the public demo site
- `testIdAttribute` defaults to `data-testid` but saucedemo uses `data-test` — all selectors use `data-test` attribute prefix
- `timeout: 30_000 ms` per test; `actionTimeout: 10_000 ms`; `navigationTimeout: 15_000 ms`
- No API to seed or reset state — use `Reset App State` from the burger menu or navigate fresh from inventory per test
- Sort values passed to `<select>` are encoded strings: `az`, `za`, `lohi`, `hilo`
