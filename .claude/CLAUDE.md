# Playwright Harness — Claude Code Project Instructions

## Architecture: helper-first

```
Config → Helpers → Fixture → Tests
```

- **Config** (`playwright/configs/`) — selectors, routes, queries (no logic)
- **Helpers** (`playwright/support/helpers/`) — flat functions, no classes
- **Fixture** (`playwright/fixtures/base.fixture.ts`) — injects nav/ui/api/har into tests
- **Tests** (`playwright/tests/`) — thin orchestration, one behaviour per test

## Core rules (enforce in every response)

- Tests import `test` and `expect` from `playwright/fixtures/base.fixture` — never from `@playwright/test`
- Locators use `getByTestId()`, `getByRole()`, `getByLabel()` — no raw `locator('[data-testid=…']')`
- Helpers are flat `createXxxHelpers(page)` factory functions — no Page Object classes
- Routes from `ROUTES` (playwright/configs/app/routes.ts), endpoints from `API_ENDPOINTS` — never hardcoded strings
- Auth via `storageState` setup project — never login inside `beforeEach`
- No `waitForTimeout()` — use `waitForResponse()` or `expect()` assertions
- No `process.env` directly in specs — use the `env` helper or `.env` files

## File placement

| What | Where |
|------|-------|
| Selectors / routes / queries | `playwright/configs/` |
| Common helper | `playwright/support/helpers/common/<name>.helpers.ts` |
| Domain helper | `playwright/support/helpers/domain/<name>.helpers.ts` |
| Fixture extension | `playwright/fixtures/base.fixture.ts` |
| Spec | `playwright/tests/<feature>/<name>.spec.ts` |
| Auth setup | `playwright/support/setup/<name>.setup.ts` |

## Test structure

```typescript
import { test, expect } from '../../fixtures/base.fixture.js';

test('[REQ-ID] what the user can do', {
  tag: ['@REQ-ID', '@smoke', '@P1'],
}, async ({ nav, ui }) => {
  await nav.goTo('home');
  await ui.clickButton('Submit');
  await expect(page.getByRole('heading')).toHaveText('Done');
});
```

## Naming

- Files: `kebab-case.helpers.ts`, `kebab-case.spec.ts`
- Helpers: `createFeatureHelpers(page): FeatureHelpers`
- Interfaces: `PascalCase` with `Helpers` suffix
