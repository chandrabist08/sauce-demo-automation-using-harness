# Playwright Harness — Claude Code Instructions

## Architecture

```
Config → Helpers → Fixture → Tests
```

- **Config** (`playwright/configs/`) owns all selectors, routes, and queries
- **Helpers** (`playwright/support/helpers/`) own all actions as flat functions
- **Fixture** (`playwright/fixtures/base.fixture.ts`) injects helpers into tests
- **Tests** (`playwright/tests/`) are thin orchestration — one behaviour per test

## Source Precedence

1. `harness.config.json` — generated config, authoritative for rules and agents
2. `harness/profiles/projects/*.json` — project facts
3. `harness/profiles/adapters/*.json` — adapter policy
4. `harness/qa-automation-foundations.md` — quality contract
5. `playwright/configs/` — selectors, routes, queries
6. `playwright/fixtures/base.fixture.ts` — test injection point
7. `playwright/support/helpers/` — helper implementations
8. `playwright/tests/` — specs (always thin)

## Lifecycle

```
GATHER → approve requirements → DISCOVER → BUILD → EVALUATE →
  BLOCK: BUILD repairs (max 3) → EVALUATE again
  PASS:  SHIP (pr-creator) → CI (npm run verify)
```

## Agents

| Agent | Role | Cannot |
|-------|------|--------|
| project-bootstrapper | GATHER | Write specs or helpers |
| playwright-cli | DISCOVER | Write specs or issue verdicts |
| playwright-test-automation | BUILD | Issue verdicts or invoke gate |
| pre-merge-qa-gate | EVALUATE | Write files or run commands |
| playwright-bug-hunter | DIAGNOSE | Run speculatively |
| pr-creator | SHIP | Merge with secrets in diff |
| workflow-maintainer | MAINTAIN | Delete generated files |

## 14 Rules

| # | Rule | Enforcement |
|---|------|-------------|
| 1 | no-hard-wait | BLOCK (hook + CI) |
| 2 | no-hardcoded-selector | BLOCK (hook + CI) |
| 3 | no-hardcoded-route | BLOCK (hook + CI) |
| 4 | no-page-object | BLOCK (hook + CI) |
| 5 | no-credential-literal | BLOCK (hook + CI) |
| 6 | storage-state-auth | BLOCK (hook + CI) |
| 7 | base-fixture-import | BLOCK (hook + CI) |
| 8 | smoke-read-only | BLOCK (hook + CI) |
| 9 | no-sql-literal | BLOCK (hook + CI) |
| 10 | focused-or-quarantined-test | BLOCK (hook + CI) |
| 11 | locator-priority | REVIEW (gate) |
| 12 | narrow-before-index | REVIEW (gate) |
| 13 | search-before-create | REVIEW (gate) |
| 14 | one-requirement-tag | REVIEW (gate) |

## Empty State

Zero tests is valid before intake. `evidence/requirements.json` starts empty.
`playwright/tests/` contains only `.gitkeep`.

## Verification

```bash
npm run verify
```
