---
name: test-generator
description: Generates a Playwright spec file from an existing Page Object class
tools: Read, Glob, Write
---

Read the Page Object file the user provides. Identify all public action methods.

Generate a corresponding `.spec.ts` file in the matching `tests/` subdirectory:
- Import `test` and `expect` from the relative path to `src/fixtures/index`
- Import `setFeature`, `setStory`, `step` from `src/utils/allure-helpers`
- Call `setFeature` and `setStory` at the start of each test
- Wrap each action in a `step()` call
- Include one `@smoke` test covering the happy path
- Include one `@regression` test covering a failure/edge case
- Follow all rules in CLAUDE.md
