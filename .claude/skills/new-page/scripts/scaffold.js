/**
 * Derives file paths from module name input.
 * Used by Claude to determine where to write generated files.
 */
function getPaths(moduleName) {
  const kebab = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
  const pascal = (str) => str.split(/[-\s]/).map((w) => w[0].toUpperCase() + w.slice(1)).join('');

  const module = kebab(moduleName);
  const Module = pascal(moduleName);

  return {
    uiConfig: `playwright/configs/ui/modules/${module}/${module}.ui.ts`,
    helper: `playwright/support/helpers/domain/${module}.helpers.ts`,
    smokeSpec: `playwright/tests/${module}/smoke/${module}-smoke.spec.ts`,
    fixture: `playwright/fixtures/base.fixture.ts`,
    Module,
    module,
  };
}

module.exports = { getPaths };
