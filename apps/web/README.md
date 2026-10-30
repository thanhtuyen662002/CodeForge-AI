# CodeForge AI — web shell

This is the first buildable App Router shell, not an authenticated or production application.

## Local checks

- Node.js 24.22.2 (see `.nvmrc`)
- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npx playwright install chromium`
- `npm run test:e2e`

No Supabase or Vercel credentials are required for this shell. It does not register users, create sessions, save learning data, run learner code, grade submissions, or claim progress. Those services must remain visibly unavailable until their real integrations and release gates are proven.
