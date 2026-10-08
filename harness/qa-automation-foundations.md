# QA Automation Foundations

## Quality Contract

Every test in this harness must satisfy:

1. **Independent** — can run in any order, no shared mutable state
2. **Traced** — exactly one approved requirement id per test
3. **Thin** — one behaviour per test, no logic in specs
4. **Clean** — created state has failure-safe cleanup
5. **Semantic** — role/label locators preferred over CSS/XPath

## Gate Scoring Rubric

Every changed test starts at 100. Deductions:

| Defect | Points |
|--------|--------|
| Not independent or order-dependent | -20 |
| Weak or missing assertion | -20 |
| try/catch hides failures | -20 |
| Unclear or incorrect naming | -15 |
| Wrong type or priority | -15 |
| Created state has no failure-safe cleanup | -15 |
| Duplicated logic or dead code | -10 |
| Structural locator where semantic one exists | -10 |
| Index used where filter would disambiguate | -10 |
| Requirement traceability missing | -5 |

**Minimum passing score: 80/100**

Any BLOCK rule violation overrides the score — gate verdict is BLOCK regardless.

## Gate Verdicts

- **PASS** — score ≥ 80, no block violations
- **PASS_WITH_ACTIONS** — score ≥ 80, review items noted
- **BLOCK** — any block rule violated OR score < 80
