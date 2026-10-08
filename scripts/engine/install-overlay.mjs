import { mkdirSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const dest = resolve(root, '.claude/hooks');

mkdirSync(dest, { recursive: true });
console.log('✅ Hook overlay installed.');
