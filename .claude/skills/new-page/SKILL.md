# /new-page

Scaffold a new helper module and matching Playwright spec skeleton for a given feature.

## When to load supporting files

- Always load `references/conventions.md` before generating any file
- Load `scripts/scaffold.js` to determine file paths
- Load `assets/helper-template.ts` as the base for the helper
- Load `assets/spec-template.ts` as the base for the spec

## Steps

1. Ask the user for:
   - Module name (e.g. `products`)
   - Key user actions (e.g. "visit list, search, create product")
   - Requirement id (e.g. `PAY-PRODUCTS-001`)

2. Read `references/conventions.md`

3. Generate `playwright/configs/ui/modules/<module>/<module>.ui.ts` — selector constants

4. Generate `playwright/support/helpers/domain/<module>.helpers.ts` using `assets/helper-template.ts`

5. Generate `playwright/tests/<module>/smoke/<module>-smoke.spec.ts` using `assets/spec-template.ts`

6. Remind the user to register the new helper in `playwright/fixtures/base.fixture.ts`

7. Report all file paths created
