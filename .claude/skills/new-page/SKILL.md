# /new-page

Scaffold a new Page Object and matching Playwright spec file for a given feature.

## When to load supporting files

- Always load `references/conventions.md` before generating any file — it contains naming rules and import conventions
- Load `scripts/scaffold.js` if you need to determine file paths programmatically
- Load `assets/page-template.ts` as the base template for the Page Object
- Load `assets/spec-template.ts` as the base template for the spec file

## Steps

1. Ask the user for:
   - Feature name (e.g. `billing`)
   - Page name (e.g. `invoice-list`)
   - Key user actions on this page (e.g. "click create button, search invoices, delete invoice")

2. Read `references/conventions.md` for naming and import rules

3. Generate `src/pages/<feature>/<page-name>.page.ts` using `assets/page-template.ts` as base

4. Generate `tests/<feature>/<page-name>.spec.ts` using `assets/spec-template.ts` as base

5. Report both file paths created
