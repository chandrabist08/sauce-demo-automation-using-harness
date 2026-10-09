/**
 * L1 rule engine — framework-neutral. Path normalisation, message resolution,
 * violation accumulation, and the scan driver. No framework patterns live here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCRIPT_EXT = String.raw`(?:m|c)?[jt]s`;

export function toPosix(p) {
  return p.replaceAll('\\', '/');
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function readProjectPaths(hooksModuleUrl) {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(hooksModuleUrl)), '..', '..');
  const configPath = path.join(repoRoot, 'harness.config.json');
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `cannot read project paths from ${configPath}: ${error.message}`,
      { cause: error },
    );
  }
  const project = config.project ?? config;
  for (const key of ['testRoot', 'commandRoot', 'specGlob']) {
    if (!project?.[key]) throw new Error(`harness.config.json project.${key} is missing`);
  }
  for (const key of ['testRoot', 'commandRoot']) {
    const declared = path.join(repoRoot, project[key]);
    if (!fs.existsSync(declared)) {
      throw new Error(
        `harness.config.json project.${key} is "${project[key]}" but that directory does not exist.`,
      );
    }
  }
  return project;
}

export const DEFAULT_WRITE_TOOLS = ['Write', 'Edit', 'StrReplace'];

export function makeExtractToolChange(writeToolNames = DEFAULT_WRITE_TOOLS) {
  const writeTools = new Set(writeToolNames);
  return function extractToolChange(toolData, repoRoot, { readCurrent = false } = {}) {
    const toolName = toolData?.tool_name || toolData?.toolName || '';
    let toolInput = toolData?.tool_input || toolData?.toolArgs || {};
    if (typeof toolInput === 'string') {
      try { toolInput = JSON.parse(toolInput); } catch { return { filePath: '', content: '' }; }
    }
    const filePath =
      toolInput.file_path || toolInput.filePath || toolInput.path ||
      toolData?.file_path || toolData?.filePath || '';
    const knownWrite = writeTools.has(toolName);
    const cursorAfterEdit = !toolName && Boolean(filePath) && readCurrent;
    if (!filePath || (!knownWrite && !cursorAfterEdit)) return { filePath: '', content: '' };

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath);
    if (readCurrent && fs.existsSync(absolutePath)) {
      return { filePath, content: fs.readFileSync(absolutePath, 'utf8') };
    }
    if (toolName === 'Write') {
      return { filePath, content: toolInput.contents || toolInput.content || toolInput.text || '' };
    }
    const replacement = toolInput.new_string || toolInput.newString || toolInput.new_str || toolInput.replacement || toolInput.content || '';
    const original = toolInput.old_string || toolInput.oldString || toolInput.old_str || '';
    if (replacement && original && fs.existsSync(absolutePath)) {
      const current = fs.readFileSync(absolutePath, 'utf8');
      if (current.includes(original)) return { filePath, content: current.replace(original, replacement) };
    }
    return { filePath, content: replacement };
  };
}

export function loadAllowlist(allowlistPath) {
  try {
    const raw = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
    return {
      selectors: new Set((raw.selectors || []).map((s) => String(s).trim())),
      routes: new Set((raw.routes || []).map((s) => String(s).trim())),
      endpoints: new Set((raw.endpoints || []).map((s) => String(s).trim())),
    };
  } catch {
    return { selectors: new Set(['body', 'html']), routes: new Set(['/']), endpoints: new Set() };
  }
}

export function loadRuleMessages(repoRoot) {
  try {
    const { rules } = JSON.parse(fs.readFileSync(path.join(repoRoot, 'harness.config.json'), 'utf8'));
    if (Array.isArray(rules)) {
      return Object.fromEntries(rules.map((r) => [r.id ?? r, r.message ?? '']));
    }
    return {};
  } catch { return {}; }
}

export function loadDeclaredRuleIds(repoRoot) {
  try {
    const { rules } = JSON.parse(fs.readFileSync(path.join(repoRoot, 'harness.config.json'), 'utf8'));
    if (Array.isArray(rules)) return new Set(rules.map((r) => r.id ?? r));
    // Support object form {block:[...], review:[...]}
    const all = [...(rules.block ?? []), ...(rules.review ?? [])];
    return new Set(all);
  } catch { return null; }
}

export function isAllowedLiteral(value, allowSet, ignoreCase = false) {
  const literal = String(value || '').trim();
  if (!literal) return false;
  if (allowSet.has(literal)) return true;
  if (!ignoreCase) return false;
  const lower = literal.toLowerCase();
  for (const allowed of allowSet) {
    if (String(allowed).toLowerCase() === lower) return true;
  }
  return false;
}

export function lineNumberForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

export function extractBalancedObject(text, start) {
  if (text[start] !== '{') return '';
  let depth = 0, quote = null;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return text.slice(start, i + 1); }
  }
  return '';
}

export function scanForRegex(violations, filePath, text, regex, messageBuilder) {
  const re = new RegExp(regex.source, regex.flags);
  let match;
  while ((match = re.exec(text)) !== null) {
    const lineNumber = lineNumberForIndex(text, match.index);
    const message = typeof messageBuilder === 'function' ? messageBuilder(match) : messageBuilder;
    if (!message) continue;
    violations.push({ filePath, lineNumber, message });
  }
}

export function makeScanner({ targetFileRe, rules }) {
  return function scanContent(filePath, content, allowlist, repoRoot) {
    const violations = [];
    const messages = loadRuleMessages(repoRoot);
    const absolute = path.isAbsolute(filePath) ? filePath : path.resolve(repoRoot, filePath);
    const normalized = toPosix(path.relative(repoRoot, absolute));
    if (!targetFileRe.test(normalized)) return violations;
    const declared = loadDeclaredRuleIds(repoRoot);

    for (const rule of rules) {
      if (declared && !declared.has(rule.ruleId)) continue;
      if (rule.appliesTo && !rule.appliesTo(normalized)) continue;
      const message = messages[rule.ruleId] || rule.fallback;
      if (rule.check) {
        rule.check({
          filePath: normalized, content, allowlist, repoRoot, message,
          push: (lineNumber, override) => violations.push({ filePath: normalized, lineNumber, message: override ?? message }),
        });
        continue;
      }
      scanForRegex(violations, normalized, content, rule.pattern,
        rule.messageBuilder ? (match) => rule.messageBuilder(match, { message, allowlist }) : message,
      );
    }
    return violations;
  };
}
