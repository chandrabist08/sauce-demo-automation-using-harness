import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const root = process.cwd();
const configPath = resolve(root, 'harness.config.json');

if (!existsSync(configPath)) {
  console.error('❌ harness.config.json not found. Run: node harness/profiles/bin/compose-harness-config.mjs');
  process.exit(1);
}

const config = JSON.parse(readFileSync(configPath, 'utf8'));

const claudeSettings = {
  permissions: config.permissions,
  env: { ENV: 'qa' },
};
mkdirSync(resolve(root, '.claude'), { recursive: true });
writeFileSync(resolve(root, '.claude/settings.json'), JSON.stringify(claudeSettings, null, 2));
console.log('✅ .claude/settings.json updated.');

const agentsSource = resolve(root, 'harness/agents');
const agentsDest = resolve(root, '.claude/agents');
if (existsSync(agentsSource)) {
  mkdirSync(agentsDest, { recursive: true });
  for (const file of readdirSync(agentsSource)) {
    const src = readFileSync(join(agentsSource, file), 'utf8');
    writeFileSync(join(agentsDest, file), src);
  }
  console.log('✅ .claude/agents/ synced.');
}

console.log('✅ harness:sync complete.');
