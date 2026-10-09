/**
 * Pattern helpers consumed by adapter L2 files (playwright.patterns.mjs).
 * Keeps architecture-level decisions (which file kinds count as "code"?)
 * out of the framework-specific pattern files.
 */

/**
 * Returns the file suffixes that count as "code" for this architecture pattern.
 * For helper-first: spec + helpers + fixture + setup + data.
 * The caller maps these to framework-specific extensions.
 */
export function codeSuffixesFor(pattern, kindSuffix) {
  const helperFirst = ['spec', 'helpers', 'fixture', 'setup', 'data'];
  const pom = ['spec', 'page', 'steps', 'fixture', 'setup', 'data'];
  const kinds = pattern === 'helper-first' ? helperFirst : pom;
  return kinds.map((k) => kindSuffix[k]).filter(Boolean);
}

/**
 * Returns the scan roots for this architecture pattern.
 * For helper-first: testRoot + commandRoot.
 */
export function scanRootsFor(pattern, project) {
  const roots = [project.testRoot];
  if (project.commandRoot) roots.push(project.commandRoot);
  return roots;
}
