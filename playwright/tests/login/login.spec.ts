import { test, expect } from '../../fixtures/base.fixture.js';
import { TEST_USERS } from '../../configs/app/test-users.js';

// Override storageState so these tests run on the unauthenticated login page
test.use({ storageState: { cookies: [], origins: [] } });

test(
  '[REQ-015] locked-out user sees a specific account-locked error',
  {
    tag: ['@REQ-015', '@smoke', '@P1'],
  },
  async ({ nav, login }) => {
    await nav.goTo('login');
    await login.loginAs(TEST_USERS.locked.username, TEST_USERS.locked.pass);

    const error = await login.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out.');
  },
);

test(
  '[REQ-016] submitting the login form with no username shows a validation error',
  {
    tag: ['@REQ-016', '@smoke', '@P1'],
  },
  async ({ nav, login }) => {
    await nav.goTo('login');
    await login.loginAs('', '');

    const error = await login.getErrorMessage();
    expect(error).toContain('Username is required');
  },
);

test(
  '[REQ-017] submitting the login form with no password shows a validation error',
  {
    tag: ['@REQ-017', '@smoke', '@P1'],
  },
  async ({ nav, login }) => {
    await nav.goTo('login');
    await login.loginAs(TEST_USERS.standard.username, '');

    const error = await login.getErrorMessage();
    expect(error).toContain('Password is required');
  },
);

test(
  '[REQ-018] wrong credentials show a credential-mismatch error',
  {
    tag: ['@REQ-018', '@smoke', '@P1'],
  },
  async ({ nav, login }) => {
    await nav.goTo('login');
    await login.loginAs(TEST_USERS.standard.username, 'wrong_password');

    const error = await login.getErrorMessage();
    expect(error).toContain('Username and password do not match any user in this service');
  },
);
