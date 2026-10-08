import { execSync } from 'child_process';

console.log('Bootstrapping harness...');
execSync('node harness/profiles/bin/compose-harness-config.mjs', { stdio: 'inherit' });
execSync('node scripts/engine/sync.mjs', { stdio: 'inherit' });
console.log('✅ Bootstrap complete. Run npm run verify to validate.');
