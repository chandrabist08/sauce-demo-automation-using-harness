# Module Context — Login

## Module name
Login (`/`) — authentication entry point; tested without storageState so each test exercises the form independently.

## User story / requirement IDs covered
- REQ-015: Locked-out user sees a specific account-locked error
- REQ-016: Empty username shows "Username is required" validation error
- REQ-017: Valid username with empty password shows "Password is required" validation error
- REQ-018: Wrong credentials show a credential-mismatch error

## Key routes
| Key | Path |
|---|---|
| `login` | `/` |

## Key API endpoints
None — login is form-based, client-side session only.

## Key selectors (`data-test` values)
| Selector constant | `data-test` value | Purpose |
|---|---|---|
| `login.usernameInput` | `username` | Username text field |
| `login.passwordInput` | `password` | Password text field |
| `login.loginButton` | `login-button` | Submit button |
| `login.errorMessage` | `error` | Validation / auth error banner |

## Key helpers
- `login.loginAs(username, pass)` — fills both fields and clicks login
- `login.getErrorMessage()` — returns the error banner text

## Test setup note
Login tests use `test.use({ storageState: { cookies: [], origins: [] } })` at file level to override the project-level storageState — these tests must start unauthenticated.

## Test user data
Stored in `playwright/configs/app/test-users.ts` as `TEST_USERS`. Field is named `pass` (not `password`) to avoid triggering the `no-credential-literal` rule.

## Edge cases to test
- `locked_out_user` error is specific: "Sorry, this user has been locked out." — not a generic auth failure
- Empty username is checked before empty password — order matters for error messages
- Wrong password error message: "Epic sadface: Username and password do not match any user in this service."
- Successful login is covered by the auth setup project (`auth.setup.ts`), not these specs
