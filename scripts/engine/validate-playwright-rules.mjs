import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = process.cwd();

// Dynamically import the shared-rules from .claude/hooks
const sharedRulesPath = pathToFileURL(join(root, '.claude', 'hooks', 'shared-rules.mjs')).href;
const { scanContent, loadAllowlist } = await import(sharedRulesPath);

const allowlistPath = join(root, '.claude', 'hooks', 'playwright-hook-allowlist.json');
const allowlist = loadAllowlist(allowlistPath);

function walkDir(dir) {
  const results = [];
  try { if (!statSync(dir).isDirectory()) return results; } catch { return results; }
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...walkDir(full));
    else if (/\.[mc]?[jt]s$/.test(full)) results.push(full);
  }
  return results;
}

async function runScanAll() {
  const files = [...walkDir(join(root, 'playwright'))];
  const allViolations = [];
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    allViolations.push(...scanContent(file, content, allowlist, root));
  }
  return allViolations;
}

async function runCiMode(baseRef) {
  const diff = execSync(`git diff origin/${baseRef} --name-only`, { encoding: 'utf8' });
  const files = diff.split('\n').filter((f) => /^playwright\/.*\.[mc]?[jt]s$/.test(f));
  const allViolations = [];
  for (const file of files) {
    try {
      const content = readFileSync(join(root, file), 'utf8');
      allViolations.push(...scanContent(file, content, allowlist, root));
    } catch { /* deleted */ }
  }
  return allViolations;
}

async function runHookMode() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const event = JSON.parse(Buffer.concat(chunks).toString() || '{}');
  const filePath = event?.tool_input?.file_path ?? '';
  const content = event?.tool_input?.new_string ?? event?.tool_input?.content ?? '';
  if (!filePath) return [];
  return scanContent(filePath, content, allowlist, root);
}

const args = process.argv.slice(2);
let violations = [];

if (args.includes('--all')) violations = await runScanAll();
else if (args.includes('--base-ref')) violations = await runCiMode(args[args.indexOf('--base-ref') + 1]);
else violations = await runHookMode();

if (violations.length > 0) {
  console.error('\n❌ Playwright rule violations:\n');
  for (const v of violations) {
    console.error(`  [Line ${v.lineNumber ?? '?'}] ${v.filePath}`);
    console.error(`  → ${v.message}\n`);
  }
  process.exit(2);
} else {
  console.log('✅ No rule violations found.');
}
