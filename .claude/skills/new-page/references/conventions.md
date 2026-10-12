# Helper-First Conventions

## File naming
- UI config: `kebab-case.ui.ts` under `playwright/configs/ui/modules/<module>/`
- Helper: `kebab-case.helpers.ts` under `playwright/support/helpers/domain/`
- Spec: `kebab-case.spec.ts` under `playwright/tests/<module>/<tier>/`

## Helper structure
- Factory function: `createModuleHelpers(page: Page): ModuleHelpers`
- Interface: `ModuleHelpers` with method signatures
- Methods: verb-first (`visitList`, `assertProductVisible`, `createProduct`)
- No classes, no `this`, no BasePage

## Imports in spec files
- Always import `test` and `expect` from `../../../fixtures/base.fixture.js`
- Never import directly from `@playwright/test`

## Test structure
- Title: `[REQUIREMENT-ID] observable behavior and expected result`
- Tags: exactly one requirement id + `@smoke` or `@regression` + `@P0`/`@P1`/`@P2`
- Pattern: Arrange → Act → Assert
- One behavior per test

## Locator priority
1. `getByRole('button', { name: '...' })`
2. `getByLabel('...')`
3. `getByText('...')`
4. `getByTestId('...')`
5. CSS/XPath — last resort with comment explaining why

## Selectors
- All selector strings belong in `playwright/configs/ui/modules/<module>/<module>.ui.ts`
- Use `as const` on every config object
- Never hardcode a selector string in a helper or spec
