# Deployment — Supabase + Vercel

No cloud deployment has been performed by the foundation commit. No app URL, configured secret or production classification is implied by this document. The web application has not yet been created; importing the domain-only repository as Next.js will not produce the learning platform.

## Known Supabase target and fail-closed classification

The owner supplied project ref `qvufngaseebmaxzthrdi` with URL `https://qvufngaseebmaxzthrdi.supabase.co`. The reference is non-secret, but the project has **not** been classified in this repository as development, staging or production. Until that classification and the corresponding provider permissions are verified, hosted database writes remain blocked by policy.

`packages/domain/src/environment-readiness.ts` is the executable fail-closed contract for this state. It checks that the configured Supabase URL matches the expected project ref, rejects privileged browser exposure, separates browser readiness from database-write approval, and requires an independently verified Vercel production target plus release approval before reporting production deployment as allowed. The CI check runs with the owner-supplied public project URL but no credentials and must remain unable to authorize hosted writes or production deployment.

Database migration authority is deliberately separate from application API privilege. Supabase publishable keys are browser-safe under RLS; secret keys (and legacy `service_role`) are server-side application credentials, not proof that a migration actor is authenticated to the database. Remote migrations must use a reviewed Supabase CLI/database-auth flow against the explicitly approved project, with a dry run before application. The runtime flag `CODEFORGE_MIGRATION_AUTHORITY_VERIFIED` is an orchestration assertion set only after that authentication/target verification; it is not itself a credential.

This contract is a guardrail, not proof that Supabase Auth/RLS/Storage or Vercel deployment works. Those require provider integration evidence in CF-03/CF-04 and the release gates.

## Development/staging sequence

1. Owner/Lead classifies the supplied Supabase project and connects an explicitly chosen Vercel project. Confirm plan/cost, region, workspace and account scope; no production data in staging.
2. CF-03 creates `apps/web` with exact maintained Next/React/dependency versions and committed lockfile. Set Vercel root/build command to the verified workspace only after it exists.
3. CF-04 adds versioned SQL migrations, disposable reset/seed and RLS tests. Apply only to an explicitly identified development/staging target. Generate database types; review drift in PR.
4. For remote migration readiness, authenticate the Supabase CLI in approved secret storage, run `supabase link --project-ref qvufngaseebmaxzthrdi`, verify the linked target, then run `supabase db push --dry-run`. Only after review and environment authorization may an actual `supabase db push` occur. A service-role/secret application API key must not substitute for this migration authority.
5. Configure Auth callback/site URLs exactly for approved environments; no broad production wildcards. Use server/client SSR integration and test refresh/expiry. Set private Storage ACLs.
6. Store browser-safe publishable Supabase URL/key separately from server-only application values. Use provider encrypted environment settings; never paste credentials into GitHub issues or code. Supabase is migrating from legacy `anon`/`service_role` keys to publishable/secret keys, so new application integration should prefer the current key model.
7. Preview CI does not run migrations on production. Fork previews get no secrets. Protect sensitive previews, use synthetic data, no-store private pages and disable private runtime output in logs.
8. Enable the authoritative execution adapter only after CF-07/G3 proves egress/resource/cleanup and cost constraints in the actual account. No long-running worker masquerading as a Next request.

## Production promotion

Require G0–G7 relevant gates, exact green SHA, independent review, environment owner, migration backup/restore evidence, smoke plan and rollback. Use environment approval for production; prefer Vercel project integration for previews and reviewed production promotion. Do not run an unconditional `vercel --prod` on every PR or automatically push database migrations from forks.

Schema changes use expand → deploy compatible app → backfill → contract in a later reviewed change. Rolling back the app is not a database rollback. Destructive migration, new paid service or production data access needs explicit owner approval.
