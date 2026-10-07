# /update-selectors

Audit all Page Object files for locators that don't use data-testid and suggest fixes.

## When to load supporting files

- Load `references/selector-rules.md` before auditing — it defines what's allowed and what's not
- Load `assets/audit-report-template.md` to format the output report

## Steps

1. Read `references/selector-rules.md`
2. Search all files under `src/pages/` for locator patterns that are NOT `getByTestId` or `data-testid`
3. For each violation found — record: file path, line number, current selector, suggested data-testid replacement
4. Format findings using `assets/audit-report-template.md`
5. Report the audit summary to the user
