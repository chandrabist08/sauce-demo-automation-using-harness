# Module Context — Cart

## Module name
Cart (`/cart.html`) — shopping cart page; lists items added from inventory.

## User story / requirement IDs covered
- REQ-006: Adding one item increments the cart badge to 1
- REQ-007: Adding two items increments the cart badge to 2
- REQ-008: Added item appears on the cart page with correct name
- REQ-009: Removing an item from cart clears it and removes the badge

## Key routes
| Key | Path |
|---|---|
| `cart` | `/cart.html` |

## Key API endpoints
None — cart state is managed in client-side `localStorage`.

## Key selectors (`data-test` values)
| Selector constant | `data-test` value | Purpose |
|---|---|---|
| `cart.badge` | `shopping-cart-badge` | Item count on cart icon |
| `cart.link` | `shopping-cart-link` | Cart icon in header |
| `cart.items` | `inventory-item` | Each item row in cart |
| `cart.itemName` | `inventory-item-name` | Item name in cart row |
| `cart.addToCartButton` | `add-to-cart` (prefix `^=`) | Add button on inventory |
| `cart.removeButton` | `remove` (prefix `^=`) | Remove button in cart or inventory |
| `cart.continueShoppingButton` | `continue-shopping` | Back to inventory |
| `cart.checkoutButton` | `checkout` | Proceed to checkout |

## Key helpers
- `cart.addItemAt(index)` — clicks nth add-to-cart button on inventory page
- `cart.getCartCount()` — reads badge text as number (returns 0 if badge hidden)
- `cart.getCartItemNames()` — returns array of item name strings from cart page
- `cart.removeItemAt(index)` — clicks nth remove button on cart page
- `cart.goToCart()` — clicks cart icon, waits for `/cart.html` and checkout button

## Edge cases to test
- Badge disappears (not just shows "0") when last item removed
- Items persist in cart after navigating away and returning
- "Continue Shopping" returns to inventory with sort state preserved
- Adding the same item twice is not possible — button becomes "Remove" after first click
- Cart is empty on a fresh session (storage state is per-test via `storageState`)
