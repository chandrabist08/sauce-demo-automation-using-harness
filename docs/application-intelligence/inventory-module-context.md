# Module Context — Inventory

## Module name
Inventory (`/inventory.html`) — product listing page; the primary landing page after login.

## User story / requirement IDs covered
- REQ-001: Logged-in user sees the product inventory (6 items, "Products" heading)
- REQ-002: User can sort products A to Z by name
- REQ-003: User can sort products Z to A by name
- REQ-004: User can sort products by price low to high
- REQ-005: User can sort products by price high to low

## Key routes
| Key | Path |
|---|---|
| `inventory` | `/inventory.html` |

## Key API endpoints
None — product data is static, rendered from JS.

## Key selectors (`data-test` values)
| Selector constant | `data-test` value | Purpose |
|---|---|---|
| `inventory.title` | `.title` (class, not data-test) | "Products" heading |
| `inventory.items` | `inventory-item` | Each product card |
| `inventory.itemName` | `inventory-item-name` | Product name text |
| `inventory.itemPrice` | `inventory-item-price` | Price label (includes `$`) |
| `inventory.sortSelect` | `product-sort-container` | Sort dropdown |
| `cart.addToCartButton` | `add-to-cart` (prefix match `^=`) | Add to cart buttons |

## Key helpers
- `inventory.sortBy(option)` — selects a sort option (`az`, `za`, `lohi`, `hilo`)
- `inventory.getItemNames()` — returns all visible product names as `string[]`
- `inventory.getItemPrices()` — returns prices as `number[]` (strips `$`)
- `cart.addItemAt(index)` — adds item at nth position on inventory page

## Edge cases to test
- All 6 products visible after login (count assertion)
- Sort order is stable when two prices are equal
- Add-to-cart button text changes to "Remove" after click
- Cart badge increments for each item added from inventory
- `problem_user`: product images are broken (img `src` contains wrong filename)
