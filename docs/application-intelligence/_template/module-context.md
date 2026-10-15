# Module Context — Inventory

## Module name
Inventory (`/inventory.html`) — product listing page, the primary landing page after login.

## User story / requirement IDs covered
- REQ-001: Inventory page displays all 6 products
- REQ-002: Products sort A→Z by name
- REQ-003: Products sort Z→A by name
- REQ-004: Products sort low→high by price
- REQ-005: Products sort high→low by price

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
- `inventory.getItemNames()` — returns all visible product names
- `inventory.getItemPrices()` — returns prices as `number[]` (strips `$`)
- `cart.addItemAt(index)` — adds item at nth position on inventory page

## Edge cases to test
- All 6 products visible after login (count assertion)
- Sort order is stable when two prices are equal
- Add-to-cart button text changes to "Remove" after click
- Cart badge increments for each item added from inventory
- `problem_user`: product images are broken (img `src` contains wrong filename)
