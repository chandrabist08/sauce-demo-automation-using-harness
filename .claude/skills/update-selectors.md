---
description: Audit data-testid coverage across all Page Object files
---

Search all files under `src/pages/` for locator calls that do NOT use `getByTestId` or `data-testid`.

List any files and line numbers where CSS class, XPath, or text-based selectors are used.

For each finding, suggest the equivalent `data-testid` selector and show the corrected line.
