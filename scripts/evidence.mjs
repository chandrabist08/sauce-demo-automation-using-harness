import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const resultsPath = resolve(root, 'evidence/reports/results.json');
const summaryPath = resolve(root, 'evidence/summary.json');

mkdirSync(resolve(root, 'evidence/reports'), { recursive: true });

if (!existsSync(resultsPath)) {
  const summary = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    timestamp: new Date().toISOString(),
  };
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log('✅ evidence:build complete (no test results yet).');
  process.exit(0);
}

const results = JSON.parse(readFileSync(resultsPath, 'utf8'));
const suites = results.suites ?? [];

let total = 0, passed = 0, failed = 0, skipped = 0;
function countSpecs(suite) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      total++;
      const status = test.results?.[0]?.status;
      if (status === 'passed') passed++;
      else if (status === 'failed') failed++;
      else skipped++;
    }
  }
  for (const child of suite.suites ?? []) countSpecs(child);
}
for (const suite of suites) countSpecs(suite);

const summary = { total, passed, failed, skipped, timestamp: new Date().toISOString() };
writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
console.log(`✅ evidence:build — ${passed}/${total} passed.`);
