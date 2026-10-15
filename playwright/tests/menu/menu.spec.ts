import { test, expect } from '../../fixtures/base.fixture.js';
import { NAVIGATION_SELECTORS } from '../../configs/ui/shared/navigation.ui.js';

test(
  '[REQ-022] All Items link in the burger menu navigates to the inventory page',
  {
    tag: ['@REQ-022', '@smoke', '@P1'],
  },
  async ({ page, nav, menu }) => {
    await nav.goTo('inventory');
    await menu.goToAllItems();

    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(page.locator(NAVIGATION_SELECTORS.inventory.title)).toHaveText('Products');
  },
);

test(
  '[REQ-023] Logout link in the burger menu ends the session and redirects to the login page',
  {
    tag: ['@REQ-023', '@smoke', '@P1'],
  },
  async ({ page, nav, menu }) => {
    await nav.goTo('inventory');
    await menu.logout();

    await expect(page.locator(NAVIGATION_SELECTORS.login.usernameInput)).toBeVisible();
    await expect(page.locator(NAVIGATION_SELECTORS.login.loginButton)).toBeVisible();
  },
);

test(
  '[REQ-024] Reset App State in the burger menu clears all items from the cart',
  {
    tag: ['@REQ-024', '@smoke', '@P1'],
  },
  async ({ page, nav, cart, menu }) => {
    // Arrange — add 2 items so the badge is visible
    await nav.goTo('inventory');
    await cart.addItemAt(0);
    await cart.addItemAt(1);
    expect(await cart.getCartCount()).toBe(2);

    // Act
    await menu.resetAppState();

    // Assert — badge gone, cart is empty
    await expect(page.locator(NAVIGATION_SELECTORS.cart.badge)).not.toBeVisible();
  },
);
