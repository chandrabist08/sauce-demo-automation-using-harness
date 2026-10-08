import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) results.push(...walk(full));
      else if (full.endsWith('.spec.ts')) results.push(full);
    }
  } catch {
    // dir may not exist yet
  }
  return results;
}

const specs = walk('playwright/tests');
let violations = 0;
for (const spec of specs) {
  const content = readFileSync(spec, 'utf8');
  if (content.includes("from '@playwright/test'")) {
    console.error(`❌ ${spec}: imports from @playwright/test directly`);
    violations++;
  }
}
if (violations === 0) console.log('✅ All specs use base.fixture.ts');
else process.exit(1);
