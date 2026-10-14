# Module Context — Checkout

## Module name
Checkout — three-step flow: Step One (shipping info) → Step Two (order review) → Complete.

## User story / requirement IDs covered
- REQ-010: Completing checkout with 2 products shows correct price breakdown and order confirmation
- REQ-011: Checkout form shows error when submitted with empty fields
- REQ-012: Cancelling from step one returns to cart with items intact
- REQ-013: Order summary on step two lists the correct item names
- REQ-014: Cancelling from step two returns to inventory

## Key routes
| Key | Path |
|---|---|
| `checkoutStepOne` | `/checkout-step-one.html` |
| `checkoutStepTwo` | `/checkout-step-two.html` |
| `checkoutComplete` | `/checkout-complete.html` |

## Key API endpoints
None — checkout is purely client-side; no order is submitted to a real backend.

## Key selectors (`data-test` values)
| Selector constant | `data-test` value | Purpose |
|---|---|---|
| `checkout.firstNameInput` | `firstName` | First name field on step one |
| `checkout.lastNameInput` | `lastName` | Last name field on step one |
| `checkout.postalCodeInput` | `postalCode` | Postal code field on step one |
| `checkout.continueButton` | `continue` | Submit step one form |
| `checkout.cancelButton` | `cancel` | Cancel button (both steps) |
| `checkout.finishButton` | `finish` | Confirm order on step two |
| `checkout.itemTotal` | `subtotal-label` | Item subtotal label (e.g. `Item total: $X`) |
| `checkout.tax` | `tax-label` | Tax label (e.g. `Tax: $X`) |
| `checkout.total` | `total-label` | Grand total label (e.g. `Total: $X`) |
| `checkout.completeHeader` | `complete-header` | "Thank you for your order!" heading |
| `checkout.backToProductsButton` | `back-to-products` | Return to inventory from complete page |
| `checkout.errorMessage` | `error` | Validation error on step one |
| `checkout.itemName` | `inventory-item-name` | Item name rows in step-two summary |

## Key helpers
- `checkout.fillShippingInfo(firstName, lastName, postalCode)` — fills all three step-one inputs
- `checkout.continueToReview()` — clicks continue, waits for step two and finish button
- `checkout.cancelCheckout()` — clicks cancel (works on both steps)
- `checkout.finishCheckout()` — clicks finish, waits for complete page
- `checkout.getPriceBreakdown()` — returns `{ itemTotal, tax, total }` as numbers
- `checkout.getOrderItemNames()` — returns item name strings from step-two summary
- `checkout.isOrderComplete()` — asserts complete-header visible, returns its text

## Edge cases to test
- Price math: `itemTotal + tax === total` (compare with `toFixed(2)` to avoid floating-point drift)
- Submitting step one with empty First Name shows error (other fields irrelevant until first passes)
- Cancel on step one → `/cart.html`; cart items still present
- Cancel on step two → `/inventory.html` (NOT cart — this is a known saucedemo quirk)
- Complete page "Back Home" button returns to `/inventory.html`
- Tax is always > 0 (saucedemo applies a fixed percentage regardless of item count)
