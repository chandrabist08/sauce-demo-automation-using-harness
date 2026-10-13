import { test, expect } from '../../fixtures/base.fixture.js';
import { NAVIGATION_SELECTORS } from '../../configs/ui/shared/navigation.ui.js';

test('[REQ-001] logged-in user sees the product inventory', {
  tag: ['@REQ-001', '@smoke', '@P1'],
}, async ({ page, nav }) => {
  await nav.goTo('inventory');
  await expect(page.locator(NAVIGATION_SELECTORS.inventory.title)).toHaveText('Products');
  await expect(page.locator(NAVIGATION_SELECTORS.inventory.items)).toHaveCount(6);
});

test('[REQ-002] user can sort products A to Z', {
  tag: ['@REQ-002', '@smoke', '@P1'],
}, async ({ nav, inventory }) => {
  await nav.goTo('inventory');
  await inventory.sortBy('az');
  const names = await inventory.getItemNames();
  expect(names).toEqual([...names].sort());
});

test('[REQ-003] user can sort products Z to A', {
  tag: ['@REQ-003', '@smoke', '@P1'],
}, async ({ nav, inventory }) => {
  await nav.goTo('inventory');
  await inventory.sortBy('za');
  const names = await inventory.getItemNames();
  expect(names).toEqual([...names].sort().reverse());
});

test('[REQ-004] user can sort products by price low to high', {
  tag: ['@REQ-004', '@smoke', '@P1'],
}, async ({ nav, inventory }) => {
  await nav.goTo('inventory');
  await inventory.sortBy('lohi');
  const prices = await inventory.getItemPrices();
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('[REQ-005] user can sort products by price high to low', {
  tag: ['@REQ-005', '@smoke', '@P1'],
}, async ({ nav, inventory }) => {
  await nav.goTo('inventory');
  await inventory.sortBy('hilo');
  const prices = await inventory.getItemPrices();
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
})