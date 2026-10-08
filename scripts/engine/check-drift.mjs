import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const harnessConfig = resolve(root, 'harness.config.json');

if (!existsSync(harnessConfig)) {
  console.warn('⚠️  harness.config.json not found — run: node harness/profiles/bin/compose-harness-config.mjs');
  process.exit(0);
}

try {
  JSON.parse(readFileSync(harnessConfig, 'utf8'));
  console.log('✅ harness.config.json is valid.');
} catch (e) {
  console.error('❌ harness.config.json is malformed:', e.message);
  process.exit(1);
}
