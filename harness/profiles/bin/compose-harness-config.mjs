import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../../..');

const adapterPath = resolve(__dirname, '../adapters/playwright.json');
const projectPath = resolve(__dirname, '../projects/playwright-boilerplate.json');

const adapter = JSON.parse(readFileSync(adapterPath, 'utf8'));
const project = JSON.parse(readFileSync(projectPath, 'utf8'));

const config = {
  framework: project.framework,
  pattern: project.pattern,
  architecture: project.architecture,
  testRoot: project.testRoot,
  configRoot: project.configRoot,
  commandRoot: project.commandRoot,
  specGlob: project.specGlob,
  effortLevel: project.effortLevel ?? adapter.policy.effortLevel,
  gateRepairLimit: project.gateRepairLimit ?? adapter.policy.gateRepairLimit,
  auth: project.auth ?? adapter.policy.auth,
  testData: project.testData ?? adapter.policy.testData,
  credentials: project.credentials ?? adapter.policy.credentials,
  adapters: project.adapters,
  permissions: adapter.policy.permissions,
  defaultMode: adapter.policy.defaultMode,
  hooks: {
    prompt: ['harness-config-gate.mjs', 'prompt-duplication-guard.mjs'],
    preWrite: ['pre-validate-playwright-rules.mjs'],
    postWrite: ['validate-playwright-rules.mjs'],
    stop: ['session-end-reminder.mjs'],
  },
  rules: {
    block: [
      'no-hard-wait',
      'no-hardcoded-selector',
      'no-hardcoded-route',
      'no-page-object',
      'no-credential-literal',
      'storage-state-auth',
      'base-fixture-import',
      'smoke-read-only',
      'no-sql-literal',
      'focused-or-quarantined-test',
    ],
    review: [
      'locator-priority',
      'narrow-before-index',
      'search-before-create',
      'one-requirement-tag',
    ],
  },
};

const outputPath = resolve(root, 'harness.config.json');
writeFileSync(outputPath, JSON.stringify(config, null, 2));
console.log(`harness.config.json written to ${outputPath}`);
