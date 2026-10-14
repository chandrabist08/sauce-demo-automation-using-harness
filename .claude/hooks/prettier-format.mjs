import { createRequire } from 'module';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
const chunks = [];
process.stdin.on('data', (d) => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const { tool_input } = JSON.parse(Buffer.concat(chunks));
    const f = tool_input && tool_input.file_path;
    if (!f) return;
    const n = f.replace(/\\/g, '/');
    if (!/(playwright|scripts)/.test(n) || !/\.(ts|mjs)$/.test(n)) return;
    execSync('npx prettier --write "' + n.replace(/"/g, '\\"') + '"', {
      stdio: 'inherit',
      shell: true,
    });
  } catch (e) {
    process.stderr.write('prettier-format hook error: ' + e + '\n');
  }
});
