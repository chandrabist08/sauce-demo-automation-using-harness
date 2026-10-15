import { test, expect } from '../../fixtures/base.fixture.js';

test(
  '[REQ-019] clicking a product on inventory navigates to its detail page with matching name and price',
  {
    tag: ['@REQ-019', '@smoke', '@P1'],
  },
  async ({ nav, inventory, product }) => {
    await nav.goTo('inventory');

    // Capture expected values before navigating away
    const [expectedName] = await inventory.getItemNames();
    const [expectedPrice] = await inventory.getItemPrices();

    await product.openProductAt(0);

    expect(await product.getName()).toBe(expectedName);
    expect(await product.getPrice()).toBe(expectedPrice);
  },
);

test(
  '[REQ-020] adding a product to cart from the detail page increments the cart badge',
  {
    tag: ['@REQ-020', '@smoke', '@P1'],
  },
  async ({ nav, cart, product }) => {
    await nav.goTo('inventory');
    await product.openProductAt(0);

    await product.addToCart();

    expect(await cart.getCartCount()).toBe(1);
  },
);

test(
  '[REQ-021] back button on the detail page returns the user to the inventory listing',
  {
    tag: ['@REQ-021', '@smoke', '@P1'],
  },
  async ({ page, nav, product }) => {
    await nav.goTo('inventory');
    await product.openProductAt(0);

    await product.goBack();

    await expect(page).toHaveURL(/\/inventory\.html/);
  },
);
