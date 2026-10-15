# Module Context — Product Detail

## Module name
Product Detail (`/inventory-item.html?id=N`) — individual product page reached by clicking a product name or image from the inventory listing.

## User story / requirement IDs covered
- REQ-019: Clicking a product on inventory navigates to its detail page with matching name and price
- REQ-020: Adding a product to cart from the detail page increments the cart badge
- REQ-021: Back button on the detail page returns the user to the inventory listing

## Key routes
| Key | Path |
|---|---|
| `productDetail` | `/inventory-item.html` (query string `?id=N` varies by product) |

## Key API endpoints
None — product data is static.

## Key selectors (`data-test` values)
| Selector constant | `data-test` value | Purpose |
|---|---|---|
| `product.name` | `inventory-item-name` | Product name on detail page (DIV, not anchor) |
| `product.description` | `inventory-item-desc` | Product description text |
| `product.price` | `inventory-item-price` | Price label (includes `$`) |
| `product.addToCartButton` | `add-to-cart` | Add to cart (bare, no suffix unlike inventory) |
| `product.backButton` | `back-to-products` | Back to inventory button |

## Key helpers
- `product.openProductAt(index)` — clicks nth `inventory-item-name` from inventory, waits for `**/inventory-item.html**`
- `product.getName()` — returns product name text from detail page
- `product.getPrice()` — returns price as number (strips `$`)
- `product.addToCart()` — clicks add-to-cart on detail page
- `product.goBack()` — clicks back button, waits for `/inventory.html`

## Edge cases to test
- `inventory-item-name` on inventory is an `<a>` (clickable); on detail page it is a `<div>` — same selector, different element type
- `add-to-cart` on detail page is bare (`data-test="add-to-cart"`); on inventory it uses a suffix (`data-test="add-to-cart-sauce-labs-backpack"`) — do not mix selectors across pages
- Price captured from inventory (`getItemPrices()`) should match price on detail page exactly — no rounding
