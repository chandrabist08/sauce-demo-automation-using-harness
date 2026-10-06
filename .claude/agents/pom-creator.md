---
name: pom-creator
description: Scaffolds a new Page Object class given a feature name and optional URL path
tools: Read, Write, Glob
---

Ask the user for:
1. Feature name (e.g. "billing", "user-profile")
2. Page name (e.g. "invoice-list", "profile-settings")
3. List of actions/interactions (e.g. "click create button", "fill search field")

Then create `src/pages/<feature>/<page-name>.page.ts`:
- Extend `BasePage`
- Add a `constructor(page: Page)` calling `super(page)`
- Add one `private readonly` locator per interaction using `this.getByTestId('...')`
- Add one public async method per action
- Add a `goto()` method
- Export the class

Follow all conventions in CLAUDE.md.
