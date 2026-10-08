#!/usr/bin/env node
// Validates that doc-impact-map.json is parseable and well-formed.
import { readFileSync } from 'fs';

const MAP_PATH = '.github/doc-impact-map.json';

try {
  const raw = readFileSync(MAP_PATH, 'utf8');
  const map = JSON.parse(raw);
  if (!map.version || !Array.isArray(map.mappings)) {
    console.error(`${MAP_PATH}: missing required fields "version" or "mappings"`);
    process.exit(1);
  }
  for (const m of map.mappings) {
    if (!m.pattern || !Array.isArray(m.docs)) {
      console.error(`${MAP_PATH}: each mapping must have "pattern" and "docs" array`);
      process.exit(1);
    }
  }
  console.log(`doc-impact-map.json OK (${map.mappings.length} mappings)`);
} catch (err) {
  console.error(`Failed to read/parse ${MAP_PATH}: ${err.message}`);
  process.exit(1);
}
