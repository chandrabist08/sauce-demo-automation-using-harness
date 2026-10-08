// Review concerns (graded by QA gate, not enforced by hooks)

export const REVIEW_CONCERNS = {
  'locator-priority': 'Prefer role → label → text → testId → CSS/XPath',
  'narrow-before-index': 'Use filter() before first() or nth() to disambiguate',
  'search-before-create': 'Search for existing implementation before creating new files',
  'one-requirement-tag': 'Every test must trace to exactly one approved requirement id',
};
