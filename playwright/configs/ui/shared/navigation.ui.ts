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
  cart: {
    badge: '[data-test="shopping-cart-badge"]',
    link: '[data-test="shopping-cart-link"]',
    items: '[data-test="inventory-item"]',
    itemName: '[data-test="inventory-item-name"]',
    addToCartButton: '[data-test^="add-to-cart"]',
    removeButton: '[data-test^="remove"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    checkoutButton: '[data-test="checkout"]',
  },
  checkout: {
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    finishButton: '[data-test="finish"]',
    itemTotal: '[data-test="subtotal-label"]',
    tax: '[data-test="tax-label"]',
    total: '[data-test="total-label"]',
    completeHeader: '[data-test="complete-header"]',
    backToProductsButton: '[data-test="back-to-products"]',
    errorMessage: '[data-test="error"]',
    cartItems: '[data-test="inventory-item"]',
    itemName: '[data-test="inventory-item-name"]',
  },
} as const;

export type NavigationSelectors = typeof NAVIGATION_SELECTORS;
