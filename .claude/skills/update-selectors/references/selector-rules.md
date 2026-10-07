# Selector Rules

## Allowed
- `this.getByTestId('...')` — preferred, maps to `data-testid` attribute
- `page.getByTestId('...')` — allowed in component objects

## Not allowed (flag these)
- `page.locator('.css-class')` — CSS class selectors
- `page.locator('#id')` — ID selectors (unless truly unique and stable)
- `page.locator('//xpath')` — XPath selectors
- `page.getByText('...')` — text-based selectors (brittle with i18n)
- `page.getByRole('...')` — only acceptable with a documented reason comment

## Exception
If a non-testid selector is used, it must have an inline comment explaining why:
```ts
// data-testid not available on third-party widget
private readonly datePicker = this.page.locator('.react-datepicker');
```
