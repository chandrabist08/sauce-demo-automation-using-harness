// Patterns used by validate-playwright-rules.mjs and hooks

export const BLOCK_PATTERNS = {
  'no-hard-wait': {
    pattern: /page\.waitForTimeout\s*\(\s*\d+/,
    message: 'Hard waits are forbidden — use waitForSelector, waitForResponse, or expect.',
  },
  'no-hardcoded-selector': {
    pattern: /(?:locator|querySelector|getByCSS)\s*\(\s*['"`][.#\[]/,
    message: 'Hardcoded selectors are forbidden — define in configs/ui/ and import.',
  },
  'no-hardcoded-route': {
    pattern: /(?:goto|navigate)\s*\(\s*['"`](?:https?:\/\/|\/(?!\/)[a-zA-Z])/,
    message: 'Hardcoded routes are forbidden — use ROUTES from configs/app/routes.ts.',
  },
  'no-page-object': {
    pattern: /class\s+\w+Page\s+(?:extends|implements)/,
    message: 'Page object classes are forbidden — use helper functions.',
  },
  'no-credential-literal': {
    pattern: /(?:password|secret|token|apiKey)\s*[:=]\s*['"`][^'"` ]{4,}/i,
    message: 'Hardcoded credentials are forbidden — use process.env or CI secrets.',
  },
  'storage-state-auth': {
    pattern: /beforeEach\s*\([^)]*\)\s*\{[^}]*(?:login|signIn|authenticate)/s,
    message: 'Login in beforeEach is forbidden — use storage-state auth.',
  },
  'base-fixture-import': {
    pattern: /from\s+['"`]@playwright\/test['"`]/,
    message: "Import test/expect from playwright/fixtures/base.fixture.ts, not '@playwright/test'.",
  },
  'smoke-read-only': {
    pattern: /@smoke[\s\S]*?(?:request\.(?:post|put|patch|delete)|api\.(?:post|put|delete))/,
    message: 'Smoke tests must be read-only — no POST/PUT/PATCH/DELETE.',
  },
  'no-sql-literal': {
    pattern: /(?:SELECT|INSERT|UPDATE|DELETE)\s+(?:FROM|INTO|\*)/i,
    message: 'Raw SQL is forbidden in specs/helpers — use QueryEntry from configs/db/.',
  },
  'focused-or-quarantined-test': {
    pattern: /test\.only\s*\(|test\.fixme\s*\(/,
    message: 'test.only() and unrecorded test.fixme() are forbidden.',
  },
};
