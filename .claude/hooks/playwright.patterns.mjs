/**
 * L2 — Playwright rule patterns. Engine (L1) owns the scan mechanism; this file owns
 * what a violation looks like in Playwright.
 */
import { SCRIPT_EXT, escapeRegex, extractBalancedObject, isAllowedLiteral, lineNumberForIndex, readProjectPaths } from './rule-engine.mjs';

const project = readProjectPaths(import.meta.url);
const { testRoot, commandRoot } = project;
const ROOT = escapeRegex(testRoot);
const COMMAND_ROOT = escapeRegex(commandRoot.replaceAll('\\', '/'));

const SPEC_RE = new RegExp(String.raw`\.spec\.${SCRIPT_EXT}$`, 'i');
const CODE_RE = new RegExp(String.raw`\.(helpers|fixture|setup|data)\.${SCRIPT_EXT}$`, 'i');
const PAGE_OBJECT_RE = new RegExp(String.raw`\.(?:page|actions)\.${SCRIPT_EXT}$`, 'i');
const SMOKE_SPEC_RE = new RegExp(String.raw`${ROOT}[\\/]tests[\\/].*[\\/]smoke[\\/].*\.spec\.${SCRIPT_EXT}$`, 'i');
const TARGET_FILE_RE = new RegExp(String.raw`(?:${ROOT}|${COMMAND_ROOT})[\\/].*\.${SCRIPT_EXT}$`, 'i');
const HELPERS_ROOT_RE = new RegExp(String.raw`^${COMMAND_ROOT}/`, 'i');
const TESTS_SPEC_RE = new RegExp(String.raw`${ROOT}[\\/]tests[\\/].*\.spec\.${SCRIPT_EXT}$`, 'i');

const REQUIREMENT_ID = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/;
const TYPE_TAGS = new Set(['smoke', 'regression']);
const PRIORITY_TAGS = new Set(['P0', 'P1', 'P2']);

export const EXTENSION_PATTERNS = { SCRIPT_EXT, TARGET_FILE_RE, SPEC_RE, CODE_RE, PAGE_OBJECT_RE, SMOKE_SPEC_RE };
export const targetFileRe = TARGET_FILE_RE;
export const testTitleRe = /\btest(?:\.\w+)?\s*\(\s*(['"`])\s*\[([^\]]+)\][\s\S]*?\1/g;

export const rules = [
  {
    ruleId: 'no-hard-wait',
    fallback: 'Hard wait detected. Replace with waitForResponse(...) or an expect() assertion.',
    pattern: /\bwaitForTimeout\(\s*\d+\s*\)/g,
  },
  {
    ruleId: 'no-page-object',
    fallback: 'Page-object detected. Use the helper-first architecture.',
    appliesTo: (p) => !HELPERS_ROOT_RE.test(p),
    check: ({ filePath, content, push }) => {
      if (/(^|\/)(pages?|page-objects?|actions?)(\/|$)/i.test(filePath) || PAGE_OBJECT_RE.test(filePath) || /\bclass\s+\w*(?:Page|Actions)\b/.test(content)) {
        push(1);
      }
    },
  },
  {
    ruleId: 'base-fixture-import',
    fallback: "Spec imports from '@playwright/test'. Import test/expect from fixtures/base.fixture instead.",
    appliesTo: (p) => SPEC_RE.test(p),
    pattern: /import\s+[^;]*\bfrom\s+['"]@playwright\/test['"]/g,
  },
  {
    ruleId: 'no-hardcoded-selector',
    fallback: null,
    appliesTo: (p) => CODE_RE.test(p),
    pattern: /\.locator\(\s*['"]([^'"]+)['"]\s*\)/g,
    messageBuilder: (m, { message, allowlist }) => {
      const selector = String(m[1] || '').trim();
      if (isAllowedLiteral(selector, allowlist.selectors, true)) return null;
      return message || `Hardcoded selector '${selector}'. Use constants from playwright/configs/ui/.`;
    },
  },
  {
    ruleId: 'no-hardcoded-route',
    fallback: null,
    appliesTo: (p) => CODE_RE.test(p),
    pattern: /\.goto\(\s*['"]([^'"]+)['"]\s*\)/g,
    messageBuilder: (m, { message, allowlist }) => {
      const route = String(m[1] || '').trim();
      const isLiteral = route.startsWith('/') || /^https?:\/\//i.test(route);
      if (!isLiteral || isAllowedLiteral(route, allowlist.routes)) return null;
      return message || `Hardcoded route '${route}'. Use ROUTES from playwright/configs/app/routes.ts.`;
    },
  },
  {
    ruleId: 'no-credential-literal',
    fallback: null,
    pattern: /\b(password|passwd|secret|api[_-]?key|auth[_-]?token|access[_-]?token)\s*[:=]\s*["'`]([^"'`$][^"'`]{3,})["'`]/gi,
    messageBuilder: (m, { message }) => message || `Hardcoded credential '${m[1]}'. Use process.env instead.`,
  },
  {
    ruleId: 'storage-state-auth',
    fallback: 'Login inside before-hook detected. Use storageState setup-project.',
    appliesTo: (p) => SPEC_RE.test(p),
    pattern: /(?:test\.)?before(?:Each|All)\s*\([\s\S]{0,400}?(?:log[iI]n|signIn|authenticate)\s*\(/g,
  },
  {
    ruleId: 'focused-or-quarantined-test',
    fallback: 'Focused test or unrecorded quarantine detected.',
    appliesTo: (p) => TESTS_SPEC_RE.test(p),
    check: ({ content, message, push }) => {
      const re = /\btest(?:\.describe)?\.(only|skip|fixme)\s*\(/g;
      let match;
      while ((match = re.exec(content)) !== null) {
        const lineNumber = lineNumberForIndex(content, match.index);
        if (match[1] === 'only') { push(lineNumber, `${message} (.only is never permitted.)`); continue; }
        const lineStart = content.lastIndexOf('\n', match.index - 1) + 1;
        const before = content.slice(0, lineStart).replace(/\r?\n$/, '');
        const previousLine = before.slice(before.lastIndexOf('\n') + 1);
        if (!/^\s*\/\/\s*@quarantine\s+[A-Z][A-Z0-9]*-\d+\s*:\s*\S/.test(previousLine)) {
          push(lineNumber, `${message} (add // @quarantine ISSUE-123: reason above.)`);
        }
      }
    },
  },
  {
    ruleId: 'one-requirement-tag',
    fallback: 'Test must carry exactly one requirement id, one Type tag, and one Priority tag.',
    appliesTo: (p) => TESTS_SPEC_RE.test(p),
    check: ({ content, message, push }) => {
      const testCallRe = /\btest(?:\.\w+)?\s*\(\s*(['"`])([\s\S]*?)\1/g;
      let match;
      while ((match = testCallRe.exec(content)) !== null) {
        const lineNumber = lineNumberForIndex(content, match.index);
        const title = String(match[2] || '');
        let cursor = testCallRe.lastIndex;
        while (/\s/.test(content[cursor] || '')) cursor++;
        if (content[cursor] === ',') cursor++;
        while (/\s/.test(content[cursor] || '')) cursor++;
        const options = extractBalancedObject(content, cursor);
        const arrayMatch = options.match(/\btag\s*:\s*\[([^\]]*)\]/);
        const singleMatch = options.match(/\btag\s*:\s*(['"`])([^'"`]+)\1/);
        const tags = arrayMatch
          ? [...arrayMatch[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((m) => m[1].trim())
          : singleMatch ? [singleMatch[2].trim()] : [];
        const bare = (t) => t.replace(/^@/, '');
        const titleId = title.match(/^\s*\[([^\]]+)\]/)?.[1]?.trim() ?? null;
        const typeTags = tags.filter((t) => TYPE_TAGS.has(bare(t).toLowerCase()));
        const priorityTags = tags.filter((t) => PRIORITY_TAGS.has(bare(t).toUpperCase()));
        const requirementTags = tags.filter((t) => !TYPE_TAGS.has(bare(t).toLowerCase()) && !PRIORITY_TAGS.has(bare(t).toUpperCase()) && REQUIREMENT_ID.test(bare(t)));
        const problems = [];
        if (!titleId || !REQUIREMENT_ID.test(titleId)) problems.push('title must begin with [REQUIREMENT-ID]');
        if (requirementTags.length !== 1) problems.push(`expected 1 requirement tag, found ${requirementTags.length}`);
        if (typeTags.length !== 1) problems.push(`expected 1 Type tag (@smoke/@regression), found ${typeTags.length}`);
        if (priorityTags.length !== 1) problems.push(`expected 1 Priority tag (@P0/@P1/@P2), found ${priorityTags.length}`);
        if (titleId && requirementTags.length === 1 && bare(requirementTags[0]) !== titleId) problems.push(`title [${titleId}] ≠ tag ${requirementTags[0]}`);
        if (problems.length > 0) push(lineNumber, `${message} (${problems.join('; ')})`);
      }
    },
  },
  {
    ruleId: 'smoke-read-only',
    fallback: 'Write request in smoke suite. Smoke tests must be read-only.',
    appliesTo: (p) => SMOKE_SPEC_RE.test(p),
    pattern: /\b(?:request|api)\.(post|put|patch|delete)\s*\(/gi,
  },
  {
    ruleId: 'no-sql-literal',
    fallback: 'Hardcoded SQL. Move to playwright/configs/db/ and use the db fixture.',
    appliesTo: (p) => SPEC_RE.test(p) || CODE_RE.test(p),
    pattern: /['"`][^'"`]*\b(SELECT\s+[\w*,\s.]+\s+FROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM)\b[^'"`]*['"`]/gi,
  },
];
