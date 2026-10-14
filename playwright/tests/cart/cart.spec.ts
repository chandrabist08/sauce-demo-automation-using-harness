import { test, expect } from '../../fixtures/base.fixture.js';
import { NAVIGATION_SELECTORS } from '../../configs/ui/shared/navigation.ui.js';

test(
  '[REQ-006] adding one item increments the cart badge to 1',
  {
    tag: ['@REQ-006', '@smoke', '@P1'],
  },
  async ({ page, nav, cart }) => {
    // Arrange
    await nav.goTo('inventory');

    // Act
    await cart.addItemAt(0);

    // Assert
    await expect(page.locator(NAVIGATION_SELECTORS.cart.badge)).toHaveText('1');
  },
);

test(
  '[REQ-007] adding two items increments the cart badge to 2',
  {
    tag: ['@REQ-007', '@smoke', '@P1'],
  },
  async ({ page, nav, cart }) => {
    // Arrange
    await nav.goTo('inventory');

    // Act
    await cart.addItemAt(0);
    await cart.addItemAt(1);

    // Assert
    await expect(page.locator(NAVIGATION_SELECTORS.cart.badge)).toHaveText('2');
  },
);

test(
  '[REQ-008] added item appears on the cart page',
  {
    tag: ['@REQ-008', '@smoke', '@P1'],
  },
  async ({ page, nav, cart }) => {
    // Arrange
    await nav.goTo('inventory');
    const itemNames = await page.locator(NAVIGATION_SELECTORS.inventory.itemName).allTextContents();
    const firstItemName = itemNames[0];

    // Act
    await cart.addItemAt(0);
    await cart.goToCart();

    // Assert
    await expect(page.locator(NAVIGATION_SELECTORS.cart.items)).toHaveCount(1);
    const cartItemNames = await cart.getCartItemNames();
    expect(cartItemNames).toContain(firstItemName);
  },
);

test(
  '[REQ-009] removing an item from cart clears it and removes the badge',
  {
    tag: ['@REQ-009', '@smoke', '@P1'],
  },
  async ({ page, nav, cart }) => {
    // Arrange
    await nav.goTo('inventory');
    await cart.addItemAt(0);
    await expect(page.locator(NAVIGATION_SELECTORS.cart.badge)).toHaveText('1');
    await cart.goToCart();
    await expect(page.locator(NAVIGATION_SELECTORS.cart.items)).toHaveCount(1);

    // Act
    await cart.removeItemAt(0);

    // Assert
    await expect(page.locator(NAVIGATION_SELECTORS.cart.items)).toHaveCount(0);
    await expect(page.locator(NAVIGATION_SELECTORS.cart.badge)).not.toBeVisible();
  },
);
