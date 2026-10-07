# /run-smoke

Run the @smoke test suite and summarize results.

## When to load supporting files

- Load `references/commands.md` if you need the full list of available npm scripts

## Steps

1. Run: `npm run test:smoke`
2. Parse the output for: total tests, passed, failed, skipped
3. If failures exist — list each failing test name and the error summary
4. Open the HTML report: `npm run report:html`
5. Report a one-paragraph summary to the user
