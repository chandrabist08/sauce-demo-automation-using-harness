import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const profilePath = resolve(process.cwd(), 'harness/profiles/projects/playwright-boilerplate.json');

if (!existsSync(profilePath)) {
  console.error('❌ Project profile not found. Run: node scripts/bootstrap.js');
  process.exit(2);
}

const profile = JSON.parse(readFileSync(profilePath, 'utf8'));
if (!profile.locked) {
  console.error('❌ Project profile is not locked. Run: node scripts/engine/lock-profile.mjs');
  process.exit(2);
}
