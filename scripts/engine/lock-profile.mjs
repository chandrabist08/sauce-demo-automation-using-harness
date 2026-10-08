import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const profilePath = resolve(root, 'harness/profiles/projects/playwright-boilerplate.json');

const profile = JSON.parse(readFileSync(profilePath, 'utf8'));
profile.locked = true;
writeFileSync(profilePath, JSON.stringify(profile, null, 2));
console.log('✅ Profile locked.');
