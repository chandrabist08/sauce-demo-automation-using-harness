import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractToolChange, scanContent, loadAllowlist } from './shared-rules.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const allowlistPath = path.join(repoRoot, '.claude', 'hooks', 'playwright-hook-allowlist.json');
const allowlist = loadAllowlist(allowlistPath);

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const raw = Buffer.concat(chunks).toString('utf8');
let event = {};
try { event = JSON.parse(raw); } catch { process.exit(0); }

const { filePath, content } = extractToolChange(event, repoRoot);
if (!filePath || !content) process.exit(0);

const violations = scanContent(filePath, content, allowlist, repoRoot);
if (violations.length > 0) {
  console.error('\n❌ Rule violation (write blocked):\n');
  for (const v of violations) {
    console.error(`  Line ${v.lineNumber}: ${v.message}`);
  }
  process.exit(2);
}
