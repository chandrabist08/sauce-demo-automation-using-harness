# GitHub Copilot Instructions — playwright-harness

Architecture: **Config → Helpers → Fixture → Tests**. Read `CLAUDE.md` for the full framework contract.

## Non-negotiable rules

- **no-hard-wait** (Hook + CI) — never `page.waitForTimeout(<number>)`; use `waitForResponse()` or a deterministic `expect()` assertion. A fixed delay hides the real readiness condition and flakes in CI.
- **no-hardcoded-selector** (Hook + CI) — never a selector literal in a spec or helper; use constants from `playwright/configs/ui/**`. A UI change should have one owner, not scattered copies.
- **no-hardcoded-route** (Hook + CI) — never a route or endpoint literal when config exists; use constants from `playwright/configs/app/routes.ts`. Routes need one maintained registry.
- **no-page-object** (Hook + CI) — never page-object classes or action layers; use helper-first flat functions in `playwright/support/helpers/**`. A second UI abstraction duplicates config and helper ownership.
- **no-credential-literal** (Hook + CI) — never a password, secret, API key, or token as a literal string; use environment variables from a gitignored `.env` or CI secret. A committed credential is a breach.
- **storage-state-auth** (Hook + CI) — never login inside `beforeEach()`; use a `storageState` setup-project dependency. Authentication must be isolated and cached, not repeated per test.
- **base-fixture-import** (Hook + CI) — never import `test` directly from `@playwright/test` in a spec; use `test` and `expect` from `playwright/fixtures/base.fixture.ts`. The fixture is the single injection point.
- **smoke-read-only** (Hook + CI) — never POST, PUT, PATCH, or DELETE in a smoke spec; smoke coverage must be safe against shared environments.
- **no-sql-literal** (Hook + CI) — never a SQL literal in a spec or helper; use frozen entries from `playwright/configs/db/**`.
- **focused-or-quarantined-test** (Hook + CI) — never `test.only()`; never `.skip()`/`.fixme()` without `// @quarantine ISSUE-123: reason` on the line above.
- **locator-priority** (QA gate) — prefer `getByRole()`, `getByLabel()`, `getByText()`, then `getByTestId()`. Avoid raw `locator()`.
- **narrow-before-index** (QA gate) — never `first()` or `nth()` where a `filter()` can identify the element.
- **search-before-create** (QA gate) — search for existing selectors, routes, and endpoints before adding new ones.
- **one-requirement-tag** (Hook + CI) — every test must have exactly one requirement id in the title `[REQ-ID]`, one Type tag (`@smoke`/`@regression`), and one Priority tag (`@P0`/`@P1`/`@P2`).

Edit and Write calls are checked by repository hooks. CI rescans changes as the final backstop.

## Agents

- `project-bootstrapper` (GATHER) — Start a new project or module from no existing automation context
- `playwright-test-automation` (BUILD) — Build a requirement-backed helper-first Playwright module
- `playwright-bug-hunter` (DIAGNOSE) — Trace and repair a failing test
- `pre-merge-qa-gate` (EVALUATE) — Evaluate diff and verification evidence, return the QA verdict
- `pr-creator` (SHIP) — Open a pull request with a generated description
- `workflow-maintainer` (MAINTAIN) — Simplify workflow scripts, agents, skills, or docs

## Where things live

| Layer | Path |
|---|---|
| Config | `playwright/configs/` |
| Helpers | `playwright/support/helpers/` |
| Fixture | `playwright/fixtures/base.fixture.ts` |
| Tests | `playwright/tests/**/*.spec.ts` |
