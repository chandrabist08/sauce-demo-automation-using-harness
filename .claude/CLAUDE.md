# Playwright Harness — Claude Code Project Instructions

## Core rules (enforce in every response)

- All tests import `test` and `expect` from `src/fixtures/index`, never directly from `@playwright/test`
- Locators use `data-testid` attributes only — no CSS class selectors, no XPath, no text-based selectors unless documented with a comment
- New Page Objects extend `BasePage` from `src/pages/base.page.ts`
- API helpers accept an `ApiClient` instance — never a raw `APIRequestContext`
- Every test must carry at least one tag: `@smoke` or `@regression`
- Allure step wrappers from `src/utils/allure-helpers.ts` must wrap every logical test block
- No raw `process.env` access in tests or pages — use typed env config from `src/config/env.ts`

## File placement conventions

| What | Where |
|------|-------|
| Page Object | `src/pages/<feature>/<name>.page.ts` |
| Component Object | `src/pages/components/<name>.component.ts` |
| API helper | `src/api/<resource>.api.ts` |
| Test spec | `tests/<feature>/<name>.spec.ts` |
| Fixture | `src/fixtures/<name>.fixture.ts` |
| Utility | `src/utils/<name>-helpers.ts` |

## Naming conventions

- Files: `kebab-case`
- Classes: `PascalCase` with suffix (`LoginPage`, `AuthApi`, `NavbarComponent`)
- Locators: `private readonly camelCase` on the class
- Tests: `@tag Description of what the user can do`
