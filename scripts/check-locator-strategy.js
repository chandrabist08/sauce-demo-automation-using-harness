#!/usr/bin/env node
// Detects first()/nth() calls without a preceding .filter() in spec files.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const TESTS_DIR = 'playwright/tests';
const RE_FIRST_NTH = /\.(first|nth)\s*\(/g;
const RE_FILTER_BEFORE = /\.filter\s*\(.*\)\s*\.(first|nth)\s*\(/;

let violations = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!full.endsWith('.spec.ts') && !full.endsWith('.spec.js')) continue;
    const src = readFileSync(full, 'utf8');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      if (RE_FIRST_NTH.test(line) && !RE_FILTER_BEFORE.test(line)) {
        console.error(`${full}:${i + 1} — .first()/.nth() without .filter() preceding it`);
        violations++;
      }
    });
  }
}

walk(TESTS_DIR);

if (violations > 0) {
  console.error(`\n${violations} locator strategy violation(s) found.`);
  process.exit(1);
}
console.log('Locator strategy check passed.');
