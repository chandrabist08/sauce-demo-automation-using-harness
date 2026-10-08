import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const profilePath = resolve(root, 'harness/profiles/projects/playwright-boilerplate.json');

if (!existsSync(profilePath)) {
  console.error('❌ Project profile not found:', profilePath);
  process.exit(1);
}

const profile = JSON.parse(readFileSync(profilePath, 'utf8'));

if (!profile.locked) {
  console.error('❌ Project profile is not locked. Run: node scripts/engine/lock-profile.mjs');
  process.exit(1);
}

console.log('✅ Project profile is complete and locked.');
