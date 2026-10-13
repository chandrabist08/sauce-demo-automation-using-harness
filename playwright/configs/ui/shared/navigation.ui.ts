// Filled after DISCOVER agent runs — do not add selectors manually

export const NAVIGATION_SELECTORS = {
  login: {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
  },
  inventory: {
    title: '.title',
    items: '[data-test="inventory-item"]',
    itemName: '[data-test="inventory-item-name"]',
    itemPrice: '[data-test="inventory-item-price"]',
    sortSelect: '[data-test="product-sort-container"]',
  },
} as const;

export type NavigationSelectors = typeof NAVIGATION_SELECTORS;
