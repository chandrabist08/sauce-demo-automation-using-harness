# Module Context — Burger Menu

## Module name
Burger Menu — slide-out navigation panel accessible from the header on any authenticated page.

## User story / requirement IDs covered
- REQ-022: All Items link navigates to the inventory page
- REQ-023: Logout ends the session and redirects to the login page
- REQ-024: Reset App State clears all items from the cart

## Key routes
No new routes — menu actions navigate to existing routes (`inventory`, `login`).

## Key API endpoints
None.

## Key selectors (`data-test` values)
| Selector constant | `data-test` value | Notes |
|---|---|---|
| `menu.openButton` | `open-menu` | On `<img>` inside button — use `getByRole` to click |
| `menu.closeButton` | `close-menu` | On `<img>` inside button — use `getByRole` to click |
| `menu.allItemsLink` | `inventory-sidebar-link` | All Items link |
| `menu.logoutLink` | `logout-sidebar-link` | Logout link |
| `menu.resetLink` | `reset-sidebar-link` | Reset App State link |

## Key helpers
- `menu.goToAllItems()` — opens menu, clicks All Items, waits for `/inventory.html`
- `menu.logout()` — opens menu, clicks Logout, waits for `/`
- `menu.resetAppState()` — opens menu, clicks Reset App State, closes menu

## Critical implementation note
The hamburger open/close triggers are `<button>` elements that wrap `<img data-test="open-menu">`. Clicking the `data-test` img directly fails — the button intercepts pointer events. Use `page.getByRole('button', { name: 'Open Menu' })` and `page.getByRole('button', { name: 'Close Menu' })` instead.

## Edge cases to test
- Menu opens with an animation — wait for `logoutLink` to be visible before clicking any item
- Reset App State does not navigate away — close the menu after clicking to leave a clean state
- Logout clears the session cookie; next test restores from `storageState` automatically (fresh context per test)
- "About" link navigates to external saucelabs.com — not tested (external URL, fragile)
- "Dynamic Catalog" link is a beta feature — not tested (unpredictable behaviour)
