import { test, expect } from '../../fixtures/base.fixture.js';
import { NAVIGATION_SELECTORS } from '../../configs/ui/shared/navigation.ui.js';

test(
  '[REQ-010] completing checkout with 2 products shows correct price breakdown and order confirmation',
  {
    tag: ['@REQ-010', '@smoke', '@P1'],
  },
  async ({ page, nav, cart, checkout }) => {
    // Arrange
    await nav.goTo('inventory');
    await cart.addItemAt(0);
    await cart.addItemAt(1);
    await cart.goToCart();

    // Act
    await page.locator(NAVIGATION_SELECTORS.cart.checkoutButton).click();
    await page.waitForURL('**/checkout-step-one.html');
    await checkout.fillShippingInfo('John', 'Doe', '10001');
    await checkout.continueToReview();

    // Assert — price math
    const { itemTotal, tax, total } = await checkout.getPriceBreakdown();
    expect(tax).toBeGreaterThan(0);
    expect(parseFloat((itemTotal + tax).toFixed(2))).toBe(total);

    // Assert — order complete
    await checkout.finishCheckout();
    const header = await checkout.isOrderComplete();
    expect(header).toBe('Thank you for your order!');
  },
);

test(
  '[REQ-011] checkout form shows error when submitted with empty fields',
  {
    tag: ['@REQ-011', '@smoke', '@P1'],
  },
  async ({ page, nav, cart }) => {
    // Arrange
    await nav.goTo('inventory');
    await cart.addItemAt(0);
    await cart.goToCart();
    await page.locator(NAVIGATION_SELECTORS.cart.checkoutButton).click();
    await page.waitForURL('**/checkout-step-one.html');

    // Act — click continue without filling any fields
    await page.locator(NAVIGATION_SELECTORS.checkout.continueButton).click();

    // Assert
    await expect(page.locator(NAVIGATION_SELECTORS.checkout.errorMessage)).toBeVisible();
  },
);

test(
  '[REQ-012] cancelling from checkout step one returns to cart with items intact',
  {
    tag: ['@REQ-012', '@smoke', '@P1'],
  },
  async ({ page, nav, cart }) => {
    // Arrange
    await nav.goTo('inventory');
    await cart.addItemAt(0);
    await cart.addItemAt(1);
    await cart.goToCart();
    await page.locator(NAVIGATION_SELECTORS.cart.checkoutButton).click();
    await page.waitForURL('**/checkout-step-one.html');

    // Act
    await page.locator(NAVIGATION_SELECTORS.checkout.cancelButton).click();

    // Assert
    await page.waitForURL('**/cart.html');
    await expect(page.locator(NAVIGATION_SELECTORS.cart.items)).toHaveCount(2);
  },
);

test(
  '[REQ-013] order summary on step two lists the correct item names',
  {
    tag: ['@REQ-013', '@smoke', '@P1'],
  },
  async ({ page, nav, cart, checkout }) => {
    // Arrange
    await nav.goTo('inventory');
    await cart.addItemAt(0);
    await cart.addItemAt(1);
    await cart.goToCart();

    // Capture names from cart so they match exactly what was added
    const expectedNames = await cart.getCartItemNames();

    // Act
    await page.locator(NAVIGATION_SELECTORS.cart.checkoutButton).click();
    await page.waitForURL('**/checkout-step-one.html');
    await checkout.fillShippingInfo('Jane', 'Smith', '20002');
    await checkout.continueToReview();

    // Assert
    const summaryNames = await checkout.getOrderItemNames();
    expect(summaryNames).toContain(expectedNames[0]);
    expect(summaryNames).toContain(expectedNames[1]);
  },
);

test(
  '[REQ-014] cancelling from checkout step two returns to inventory',
  {
    tag: ['@REQ-014', '@smoke', '@P1'],
  },
  async ({ page, nav, cart, checkout }) => {
    // Arrange
    await nav.goTo('inventory');
    await cart.addItemAt(0);
    await cart.goToCart();
    await page.locator(NAVIGATION_SELECTORS.cart.checkoutButton).click();
    await page.waitForURL('**/checkout-step-one.html');
    await checkout.fillShippingInfo('Alex', 'Brown', '30003');
    await checkout.continueToReview();

    // Act
    await checkout.cancelCheckout();

    // Assert — step two cancel navigates back to inventory
    await page.waitForURL('**/inventory.html');
    await expect(page.locator(NAVIGATION_SELECTORS.inventory.title)).toHaveText('Products');
  },
);
