// Post-write validation
import { spawn } from 'child_process';

const validator = spawn('node', ['scripts/engine/validate-playwright-rules.mjs'], {
  stdio: ['pipe', 'inherit', 'inherit'],
});

process.stdin.pipe(validator.stdin);
validator.on('exit', (code) => process.exit(code ?? 0));
