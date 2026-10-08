import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const reqPath = resolve(root, 'evidence/requirements.json');

if (!existsSync(reqPath)) {
  console.error('❌ evidence/requirements.json not found.');
  process.exit(1);
}

const { requirements } = JSON.parse(readFileSync(reqPath, 'utf8'));
console.log(`✅ requirements.json valid — ${requirements.length} requirement(s) registered.`);
