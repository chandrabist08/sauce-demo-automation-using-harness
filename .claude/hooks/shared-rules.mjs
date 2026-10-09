/**
 * L1/L2 wiring point. Composes rule-engine.mjs (L1) with playwright.patterns.mjs (L2).
 * Hooks and engine scripts import from here — not from the layers directly.
 */
import { isAllowedLiteral, lineNumberForIndex, loadAllowlist, loadRuleMessages, makeExtractToolChange, makeScanner, scanForRegex, toPosix } from './rule-engine.mjs';
import { EXTENSION_PATTERNS, rules, targetFileRe } from './playwright.patterns.mjs';

export const extractToolChange = makeExtractToolChange();
export const scanContent = makeScanner({ targetFileRe, rules });

export { EXTENSION_PATTERNS, isAllowedLiteral, lineNumberForIndex, loadAllowlist, loadRuleMessages, scanForRegex, toPosix };
