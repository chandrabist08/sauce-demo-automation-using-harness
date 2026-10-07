# Naming & Import Conventions

## File naming
- Page Object: `kebab-case.page.ts` under `src/pages/<feature>/`
- Spec file: `kebab-case.spec.ts` under `tests/<feature>/`

## Class naming
- Page Object class: `PascalCase` + `Page` suffix (e.g. `InvoiceListPage`)
- Always extend `BasePage` from `src/pages/base.page.ts`

## Locators
- Always use `this.getByTestId('...')` — never CSS class, XPath, or text selectors
- Declare as `private readonly camelCase` properties on the class

## Imports in spec files
- Always import `test` and `expect` from `../../src/fixtures/index`
- Always import `setFeature`, `setStory`, `step` from `../../src/utils/allure-helpers`
- Never import directly from `@playwright/test`

## Test tags
- Every test must have at least one tag: `@smoke` or `@regression`
- Format: `test('@smoke Description of what the user does', ...)`

## Allure metadata
- Every test must call `setFeature()` and `setStory()`
- Every logical action must be wrapped in `step()`
