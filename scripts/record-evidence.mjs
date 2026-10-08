import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const [,, requirementId, verdict] = process.argv;
if (!requirementId || !verdict) {
  console.error('Usage: node scripts/record-evidence.mjs <requirementId> <PASS|BLOCK>');
  process.exit(1);
}

const reqPath = resolve(process.cwd(), 'evidence/requirements.json');
const data = JSON.parse(readFileSync(reqPath, 'utf8'));
const req = data.requirements.find((r) => r.id === requirementId);
if (!req) {
  console.error(`❌ Requirement ${requirementId} not found in evidence/requirements.json`);
  process.exit(1);
}
req.lastVerdict = verdict;
req.lastVerifiedAt = new Date().toISOString();
writeFileSync(reqPath, JSON.stringify(data, null, 2));
console.log(`✅ Recorded ${verdict} for ${requirementId}`);
