import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

const root = process.cwd();

// Load patterns from harness
const { BLOCK_PATTERNS } = await import('../../harness/patterns.mjs');

function scanFile(filePath, content) {
  const violations = [];
  for (const [rule, { pattern, message }] of Object.entries(BLOCK_PATTERNS)) {
    if (pattern.test(content)) {
      violations.push({ rule, file: filePath, message });
    }
  }
  return violations;
}

function walkDir(dir, ext = '.ts') {
  const results = [];
  try {
    if (!statSync(dir).isDirectory()) return results;
  } catch {
    return results;
  }
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...walkDir(full, ext));
    else if (full.endsWith(ext)) results.push(full);
  }
  return results;
}

async function runScanAll() {
  const dir = join(root, 'playwright');
  const files = walkDir(dir);
  const allViolations = [];
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    allViolations.push(...scanFile(file, content));
  }
  return allViolations;
}

async function runCiMode(baseRef) {
  const diff = execSync(`git diff origin/${baseRef} --name-only`, { encoding: 'utf8' });
  const files = diff.split('\n').filter((f) => f.startsWith('playwright/') && f.endsWith('.ts'));
  const allViolations = [];
  for (const file of files) {
    try {
      const content = readFileSync(join(root, file), 'utf8');
      allViolations.push(...scanFile(file, content));
    } catch {
      // file deleted
    }
  }
  return allViolations;
}

async function runHookMode() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const event = JSON.parse(Buffer.concat(chunks).toString() || '{}');
  const filePath = event?.tool_input?.file_path ?? '';
  const content = event?.tool_input?.new_string ?? event?.tool_input?.content ?? '';
  if (!filePath.startsWith('playwright/')) return [];
  return scanFile(filePath, content);
}

const args = process.argv.slice(2);
let violations = [];

if (args.includes('--all')) {
  violations = await runScanAll();
} else if (args.includes('--base-ref')) {
  const ref = args[args.indexOf('--base-ref') + 1];
  violations = await runCiMode(ref);
} else {
  violations = await runHookMode();
}

if (violations.length > 0) {
  console.error('\n❌ Playwright rule violations:\n');
  for (const v of violations) {
    console.error(`  [${v.rule}] ${v.file}`);
    console.error(`  → ${v.message}\n`);
  }
  process.exit(2);
} else {
  console.log('✅ No rule violations found.');
}
