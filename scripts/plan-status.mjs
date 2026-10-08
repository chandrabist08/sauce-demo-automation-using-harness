import { readFileSync } from 'fs';
import { resolve } from 'path';
import { currentPhase } from './task-control.mjs';

const { requirements } = JSON.parse(readFileSync(resolve(process.cwd(), 'evidence/requirements.json'), 'utf8'));
console.log(`Current phase: ${currentPhase(requirements)}`);
console.log(`Requirements: ${requirements.length} total, ${requirements.filter(r => r.status === 'approved').length} approved`);
