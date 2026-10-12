# Playwright Harness

A production-grade Playwright TypeScript test harness boilerplate using a **helper-first architecture**. Built for QA teams and AI-assisted test generation.

---

## Tech Stack

- [Playwright](https://playwright.dev/) — browser automation
- [TypeScript](https://www.typescriptlang.org/) — type-safe test code
- [Allure](https://allurereport.org/) — rich test reporting
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipeline

---

## Architecture

```
Config → Helpers → Fixture → Tests
```

| Layer | Path | Responsibility |
|-------|------|----------------|
| Config | `playwright/configs/` | Selectors, routes, queries — no logic |
| Helpers | `playwright/support/helpers/` | Flat action functions — no classes |
| Fixture | `playwright/fixtures/base.fixture.ts` | Injects helpers into tests |
| Tests | `playwright/tests/` | Thin orchestration — one behaviour per test |

---

## Project Structure

```
├── .claude/                        # Claude Code config (agents, hooks, skills, settings)
│   ├── CLAUDE.md                   # Project conventions enforced on every AI response
│   ├── settings.json               # Hook wiring + permissions
│   ├── agents/                     # Claude Code agent definitions
│   ├── hooks/                      # Rule engine (L1 + L2 + wiring)
│   └── skills/new-page/            # /new-page scaffold skill
├── .github/
│   ├── copilot-instructions.md     # Copilot gets the same 14 rules as Claude
│   └── workflows/
│       ├── playwright.yml          # Main CI pipeline
│       ├── playwright-rules.yml    # Rule engine gate on PRs
│       └── locator-strategy.yml    # Locator quality gate on PRs
├── evidence/                       # Test results and requirements traceability
│   ├── requirements.json           # Approved requirements (populated by GATHER agent)
│   └── reports/                    # HTML, JUnit, JSON reports
├── harness/
│   ├── agents/                     # Agent persona definitions
│   ├── profiles/                   # Project + adapter profiles
│   └── patterns.mjs                # Architecture pattern helpers
├── playwright/
│   ├── configs/
│   │   ├── app/routes.ts           # ROUTES + API_ENDPOINTS registry
│   │   ├── ui/                     # Selector constants
│   │   └── db/                     # Frozen SQL query entries
│   ├── fixtures/
│   │   └── base.fixture.ts         # nav / ui / api / har / evidence fixtures
│   ├── support/
│   │   ├── helpers/common/         # nav, ui, api, har, db helpers
│   │   └── setup/                  # storageState auth setup
│   └── tests/                      # Spec files (empty until GATHER → BUILD)
├── scripts/
│   └── engine/                     # CLI rule validator, evidence builder, sync
├── harness.config.json             # Single source of truth for rules + agents
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Install browsers

```bash
npx playwright install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
ENV=qa
BASE_URL=https://your-app.com
API_BASE_URL=https://your-api.com
```

### 4. Verify the harness

```bash
npm run verify
```

This runs the full pipeline: type-check → rule scan → format check → tests → evidence build.

### 5. Run tests

```bash
# All tests
npm test

# Smoke suite only
npm run test:smoke

# Headed mode
npm run test:headed

# UI mode
npm run test:ui
```

---

## Reporting

```bash
# Playwright HTML report
npm run report:html

# Allure report
npm run report:allure:serve
```

---

## 14 Enforced Rules

| # | Rule | Enforcement |
|---|------|-------------|
| 1 | no-hard-wait | Hook + CI |
| 2 | no-hardcoded-selector | Hook + CI |
| 3 | no-hardcoded-route | Hook + CI |
| 4 | no-page-object | Hook + CI |
| 5 | no-credential-literal | Hook + CI |
| 6 | storage-state-auth | Hook + CI |
| 7 | base-fixture-import | Hook + CI |
| 8 | smoke-read-only | Hook + CI |
| 9 | no-sql-literal | Hook + CI |
| 10 | focused-or-quarantined-test | Hook + CI |
| 11 | locator-priority | QA gate |
| 12 | narrow-before-index | QA gate |
| 13 | search-before-create | QA gate |
| 14 | one-requirement-tag | Hook + CI |

Rules are defined in `harness.config.json` and enforced by a 3-tier engine:
- **L1** `.claude/hooks/rule-engine.mjs` — framework-neutral scan mechanism
- **L2** `.claude/hooks/playwright.patterns.mjs` — Playwright-specific rule table
- **Wiring** `.claude/hooks/shared-rules.mjs` — composes L1 + L2

---

## Lifecycle

```
GATHER → approve requirements → DISCOVER → BUILD → EVALUATE →
  BLOCK: BUILD repairs (max 3) → EVALUATE again
  PASS:  SHIP (pr-creator) → CI (npm run verify)
```

## Agents

| Agent | Role |
|-------|------|
| `project-bootstrapper` | GATHER — captures requirements into `evidence/requirements.json` |
| `playwright-cli` | DISCOVER — browser discovery and codegen |
| `playwright-test-automation` | BUILD — writes helper-first specs from requirements |
| `pre-merge-qa-gate` | EVALUATE — QA verdict (read-only, cannot edit files) |
| `playwright-bug-hunter` | DIAGNOSE — traces failures and suggests fixes |
| `pr-creator` | SHIP — opens PR after gate passes |
| `workflow-maintainer` | MAINTAIN — keeps generated files in sync |

---

## Writing Tests

Every test must follow this structure:

```typescript
import { test, expect } from '../../fixtures/base.fixture.js';

test('[REQ-ID] what the user can do', {
  tag: ['@REQ-ID', '@smoke', '@P1'],
}, async ({ nav, ui, page }) => {
  await nav.goTo('home');
  await ui.clickButton('Submit');
  await expect(page.getByRole('heading')).toHaveText('Done');
});
```

**Rules:**
- Import `test`/`expect` from `base.fixture` — never from `@playwright/test`
- Title must start with `[REQUIREMENT-ID]`
- Tags: exactly 1 requirement id + 1 type (`@smoke`/`@regression`) + 1 priority (`@P0`/`@P1`/`@P2`)
- Use `nav`/`ui`/`api`/`har` fixtures — never call `page.locator()` directly in specs

---

## Claude Code Integration

Open this project in Claude Code — everything is pre-configured:

```bash
claude .
```

| Resource | Purpose |
|----------|---------|
| `CLAUDE.md` | Helper-first conventions on every response |
| `settings.json` | Hook events wired, permissions set, effort level high |
| Hook rules | Violations blocked at write time — no bad code lands |
| `/new-page` skill | Scaffolds UI config + helper + spec for a new module |
| 7 agents | Full GATHER → SHIP lifecycle covered |
| `.github/copilot-instructions.md` | Copilot gets the same 14 rules as Claude |

### `/new-page` skill

Invoke with `/new-page` in Claude Code. It asks for a module name and key actions, then generates three files:

1. `playwright/configs/ui/modules/<module>/<module>.ui.ts` — selector constants
2. `playwright/support/helpers/domain/<module>.helpers.ts` — factory function + interface
3. `playwright/tests/<module>/smoke/<module>-smoke.spec.ts` — spec skeleton with requirement tag format

The skill is self-contained under `.claude/skills/new-page/`:

| File | Purpose |
|------|---------|
| `SKILL.md` | Entry point — steps Claude follows |
| `assets/helper-template.ts` | Helper factory function template |
| `assets/spec-template.ts` | Spec skeleton with correct import and tag format |
| `references/conventions.md` | Naming, locator, and import rules |
| `scripts/scaffold.js` | Derives file paths from module name |

---

## MCP Browser Integration

`.vscode/mcp.json` wires the Playwright MCP server into VS Code, giving Claude Code and Copilot control of a real Chromium browser:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--browser", "chromium"]
    }
  }
}
```

This powers the DISCOVER phase — the `playwright-cli` agent can navigate pages, take snapshots, and capture selectors interactively without leaving the editor. No separate codegen session needed.

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:smoke` | Run `@smoke` tagged tests |
| `npm run test:regression` | Run `@regression` tagged tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run verify` | Full harness verification pipeline |
| `npm run report:html` | Open HTML report |
| `npm run report:allure:serve` | Open Allure report |
| `npm run check:rules` | Run rule engine against all files |
| `npm run harness:check` | Validate harness config |
| `npm run lint` | Lint TypeScript files |
| `npm run format` | Format with Prettier |

---

## CI/CD

GitHub Actions runs on every push and pull request:

- **playwright.yml** — full test suite, uploads HTML + Allure reports as artifacts
- **playwright-rules.yml** — rule engine scans changed files, blocks violation PRs
- **locator-strategy.yml** — enforces locator priority (`getByRole` > `getByTestId`)

### Required Secrets

| Secret | Description |
|--------|-------------|
| `BASE_URL` | App URL for the target environment |
| `API_BASE_URL` | API base URL |
