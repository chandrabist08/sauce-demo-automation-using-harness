# Playwright Harness

A production-grade Playwright TypeScript test harness boilerplate for Web UI automation. Built for QA teams with Page Object Model, centralized fixtures, API helpers, and dual HTML + Allure reporting.

---

## Tech Stack

- [Playwright](https://playwright.dev/) — browser automation
- [TypeScript](https://www.typescriptlang.org/) — type-safe test code
- [Allure](https://allurereport.org/) — rich test reporting
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipeline

---

## Project Structure

```
├── .claude/                    # Claude Code project config (agents, hooks, skills)
├── .github/workflows/          # GitHub Actions CI pipeline
├── src/
│   ├── api/                    # API helper layer (ApiClient, AuthApi, UsersApi)
│   ├── config/                 # Typed env loader and test data constants
│   ├── fixtures/               # Playwright fixture extensions (base, auth)
│   ├── pages/                  # Page Object Model (BasePage, LoginPage, etc.)
│   ├── types/                  # Shared TypeScript interfaces
│   └── utils/                  # Allure helpers, date, random utilities
├── tests/
│   ├── auth/                   # Auth specs + global setup
│   ├── dashboard/              # Dashboard specs
│   └── smoke/                  # Smoke suite
├── test-data/                  # Static JSON test data
├── storage/auth/               # Saved auth state (gitignored)
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

Edit `.env` with your target app values:

```env
ENV=staging
BASE_URL=https://your-app.com
API_BASE_URL=https://your-api.com
ADMIN_EMAIL=admin@yourapp.com
ADMIN_PASSWORD=yourpassword
```

### 4. Run tests

```bash
# Smoke suite (fast, critical path)
npm run test:smoke

# Full regression
npm run test:regression

# Specific browser
npm run test:chromium
npm run test:firefox

# Headed mode (watch the browser)
npm run test:headed

# Interactive UI mode
npm run test:ui
```

---

## Reporting

### Playwright HTML Report
```bash
npm run report:html
```

### Allure Report
```bash
npm run report:allure:serve
```

Allure reports are automatically generated and deployed to GitHub Pages on every push to `main`.

---

## Architecture

### Layer interaction flow

```
tests/*.spec.ts
  └── src/fixtures/index.ts       ← single import point for test + expect
        ├── auth.fixture.ts       ← pre-authenticated session via API
        └── base.fixture.ts       ← injects POMs and API helpers
              ├── src/pages/**    ← Page Object Model (never raw locators in tests)
              └── src/api/**      ← API helpers (never raw fetch in tests)
                    └── src/config/env.ts   ← typed env vars
```

### Key conventions

| Rule | Detail |
|------|--------|
| Imports | Always import `test` and `expect` from `src/fixtures/index` |
| Locators | Use `data-testid` attributes only |
| Page Objects | Extend `BasePage`; locators as `private readonly` properties |
| API helpers | Accept `ApiClient`, never raw `APIRequestContext` |
| Test tags | Every test must have `@smoke` or `@regression` |
| Allure steps | Wrap every logical block with `step()` from `src/utils/allure-helpers` |
| Env vars | Access via `src/config/env.ts`, never raw `process.env` |

---

## Adding a New Feature

Use the built-in Claude Code skill:

```
/new-page
```

This scaffolds a Page Object and matching spec file by asking for the feature name and key actions.

Or create manually:

```
src/pages/<feature>/<name>.page.ts     ← Page Object
src/api/<resource>.api.ts              ← API helper
tests/<feature>/<name>.spec.ts         ← Spec file
```

---

## CI/CD

GitHub Actions runs on every push and pull request to `main` and `develop`:

- Parallel runs on Chromium and Firefox
- Auth state cached via `global.setup.ts`
- Allure report deployed to GitHub Pages
- Playwright HTML report uploaded as artifact

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `STAGING_BASE_URL` | Staging app URL |
| `STAGING_API_BASE_URL` | Staging API URL |
| `STAGING_ADMIN_EMAIL` | Admin email |
| `STAGING_ADMIN_PASSWORD` | Admin password |

---

## Claude Code Integration

This project ships with a `.claude/` directory pre-configured for Claude Code:

| Resource | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions enforced on every Claude response |
| `settings.json` | Pre-approved commands (no permission prompts) |
| `agents/test-generator` | Generates spec files from a Page Object |
| `agents/pom-creator` | Scaffolds new Page Objects |
| `agents/debug-failure` | Diagnoses test failures from traces |
| `hooks/hooks.js` | Warns on incorrect import patterns |
| `/new-page` skill | Scaffold POM + spec in one command |
| `/run-smoke` skill | Run smoke suite and open report |
| `/update-selectors` skill | Audit data-testid coverage |

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:smoke` | Run `@smoke` tagged tests |
| `npm run test:regression` | Run `@regression` tagged tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:chromium` | Chromium only |
| `npm run test:firefox` | Firefox only |
| `npm run report:html` | Open HTML report |
| `npm run report:allure:serve` | Open Allure report |
| `npm run lint` | Lint all TypeScript files |
| `npm run typecheck` | TypeScript type check |
| `npm run clean` | Remove all report artifacts |
