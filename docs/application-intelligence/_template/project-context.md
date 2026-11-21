# Project Context — {{AppName}}

## Application name
{{AppName}} — brief description of what the application is and its purpose.

## Tech stack
- Frontend: e.g. React, Angular, plain JS
- Backend: e.g. Node/Express, Django, none
- Database: e.g. PostgreSQL, MongoDB, none

## Authentication method
- Describe the login mechanism (form-based, OAuth, SSO, etc.)
- Where auth state is captured and stored (e.g. storageState path)
- How credentials are supplied (env vars, CI secrets, .env file)

## Key user roles
| Username / Role | Behaviour |
|---|---|
| `role_name` | Description of what this role can do or how it behaves differently |

## Base URL (staging)
`https://staging.example.com` — note which env var controls it and any fallback.

## API base URL
`https://api.staging.example.com` — or "None" if no API exists.

## Known constraints
- List any project-specific constraints that affect how tests are written or run
- e.g. parallelism limits, rate-limiting, flaky areas, special selector attributes
- e.g. CI-only env vars, storage reset requirements, timeout adjustments
