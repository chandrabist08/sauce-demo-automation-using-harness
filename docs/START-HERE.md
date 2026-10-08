# Start Here — Harness Lifecycle

## Phase 1: GATHER
Run `project-bootstrapper` agent to capture requirements.
Requirements are written to `evidence/requirements.json`.
Nothing is built until requirements are approved.

## Phase 2: DISCOVER
Run `playwright-cli` agent to map routes, selectors, and API endpoints.
Fills `playwright/configs/app/routes.ts` and `playwright/configs/ui/`.

## Phase 3: BUILD
Run `playwright-test-automation` agent to write helpers and specs.
Each spec traces to exactly one approved requirement id.

## Phase 4: EVALUATE
Run `pre-merge-qa-gate` agent (plan mode, read-only) to grade output.
Gate verdict: PASS / PASS_WITH_ACTIONS / BLOCK.
On BLOCK: BUILD repairs (max 3 attempts), then EVALUATE again.

## Phase 5: SHIP
Run `pr-creator` agent to open a pull request.
CI runs `npm run verify` — must pass before merge.

## Verification command
```bash
npm run verify
```
