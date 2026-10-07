/**
 * Derives file paths from feature and page name inputs.
 * Used by Claude to determine where to write generated files.
 */
function getPaths(featureName, pageName) {
  const kebab = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const pascal = (str) => str.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');

  const feature = kebab(featureName);
  const page = kebab(pageName);
  const className = pascal(page) + 'Page';

  return {
    pageObject: `src/pages/${feature}/${page}.page.ts`,
    spec: `tests/${feature}/${page}.spec.ts`,
    className,
  };
}

module.exports = { getPaths };
