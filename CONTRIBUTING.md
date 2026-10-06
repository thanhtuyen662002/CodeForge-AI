# Contributing

Start with an issue from docs/IMPLEMENTATION_BACKLOG.md. Branch prefixes: feat/, fix/, docs/, test/, chore/. Describe the learner problem, invariants, non-goals and acceptance evidence before code.

Run `npm ci && npm run check`. The foundation checks cover the domain library and repository contracts, not the future website, real Supabase RLS or sandbox isolation. Add real integration/browser tests with the first relevant implementation PR; a mock-only pass cannot unlock a release gate.

A PR must state local commands/results and link GitHub Actions on its exact head SHA. Use the PR template. Changes to security, content publishing, scoring or database policy require owner review; simulated roles do not count as approvals. Do not merge failed CI or silently lower a threshold to make it green.

Never commit secrets, learner submissions or production data. Use synthetic fixtures. Apply SQL only to disposable/local or explicitly selected development databases; production requires review, backup/restore proof and a rollout plan. Expand/contract migrations are preferred over destructive edits.

Only publish original or appropriately licensed content with provenance. Report a suspicious dependency or an accidentally committed credential immediately and rotate the credential; deleting the Git file alone is not remediation.
