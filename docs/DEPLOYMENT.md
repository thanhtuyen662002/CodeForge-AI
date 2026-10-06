# Deployment — Supabase + Vercel

No cloud deployment has been performed by the foundation commit. No app URL, provisioned project or configured secret is implied by this document. The web application has not yet been created; importing the domain-only repository as Next.js will not produce the learning platform.

## Development/staging sequence

1. Owner connects an explicitly chosen Supabase development project and Vercel project. Confirm plan/cost, region, workspace and account scope; no production data in staging.
2. CF-03 creates `apps/web` with exact maintained Next/React/dependency versions and committed lockfile. Set Vercel root/build command to the verified workspace only after it exists.
3. CF-04 adds versioned SQL migrations, disposable reset/seed and RLS tests. Apply only to identified development project. Generate database types; review drift in PR.
4. Configure Auth callback/site URLs exactly for approved environments; no broad production wildcards. Use server/client SSR integration and test refresh/expiry. Set private Storage ACLs.
5. Store browser-safe publishable Supabase URL/key separately from server-only values. Use Vercel encrypted environment settings; never paste credentials into GitHub issues or code. Service key only when privileged jobs genuinely need it.
6. Preview CI does not run migrations on production. Fork previews get no secrets. Protect sensitive previews, use synthetic data, no-store private pages and disable private runtime output in logs.
7. Enable the authoritative execution adapter only after CF-07/G3 proves egress/resource/cleanup and cost constraints in the actual account. No long-running worker masquerading as a Next request.

## Production promotion

Require G0–G7 relevant gates, exact green SHA, independent review, environment owner, migration backup/restore evidence, smoke plan and rollback. Use environment approval for production; prefer Vercel project integration for previews and reviewed production promotion. Do not run an unconditional `vercel --prod` on every PR or automatically push database migrations from forks.

Schema changes use expand → deploy compatible app → backfill → contract in a later reviewed change. Rolling back the app is not a database rollback. Destructive migration, new paid service or production data access needs explicit owner approval.
