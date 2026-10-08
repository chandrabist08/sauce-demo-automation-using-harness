import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const configPath = resolve(process.cwd(), 'harness.config.json');
const rules = existsSync(configPath)
  ? JSON.parse(readFileSync(configPath, 'utf8')).rules?.block ?? []
  : [];

console.log('\n📋 Pre-merge checklist:');
console.log('  □ npm run verify passes');
console.log('  □ All tests trace to an approved requirement');
console.log('  □ No block rule violations:');
for (const rule of rules) console.log(`      - ${rule}`);
console.log('  □ QA gate verdict is PASS or PASS_WITH_ACTIONS');
console.log('  □ No secrets in diff\n');
