# CodeForge working rules

## Source of truth and current scope

Read `docs/PROJECT_STATE.yaml`, `docs/DECISION_MEMO.md`, `docs/VALIDATION_PLAN.md`, and the live issue before starting. Latest explicit owner instruction wins. GitHub/repository evidence wins over chat recollection. Do not infer launch, payment, user count, review approval or deployed resources from a design document.

**Owner authorization update — 2026-11-16:** the owner directly reaffirmed the full 39-section product scope and production-acceptance target. This supersedes the historical 2026-10-07 P0-only / strategy-hold restriction **for product implementation scope**. Use the full approved traceability and CF-01..CF-15 backlog; a vertical slice is not the full MVP. PR #28 remains an open reconciliation record, not a prerequisite to honoring the direct owner instruction. The older P0 decision memo and validation protocol remain historical/current records for the separate market experiment; they do not veto owner-authorized implementation and must not be relabelled as product evidence.

P0 demand validation remains NOT_STARTED unless live evidence proves otherwise. Keep P0-G0 (market/payment validation) distinct from Release-G0 (repository governance). Do not claim either gate has passed from the other. Preserve protocol thresholds and raw evidence; never change a cohort threshold after observing results.

The owner-designated Supabase project is ref `qvufngaseebmaxzthrdi`, URL `https://qvufngaseebmaxzthrdi.supabase.co`. Do not ask for this URL again or create a replacement project. A known URL is not proof of credentials, environment identity or access. If access is denied, record NOT_VERIFIED / NOT_RUN and continue independent work.

## Implementation authority and safeguards

- Full scope remains authorized; do not silently shrink it to a demo or initial vertical slice. Prioritize security/data loss, broken main/required CI, blockers affecting multiple tasks, ready-work review/integration, the real learner flow, then quality/content expansion.
- Keep the chosen stack: Next.js App Router, React, strict TypeScript; modular-monolith Route Handlers/server services; Supabase Database/Auth/Storage; Vercel web deployment. Learner code/SQL executes only in an isolated sandbox; trusted grading stays outside the guest runtime.
- Owner authorization to implement does **not** authorize new spend, outbound contact/payment execution, destructive production operations, production database changes, secret access/rotation, or legal/business-policy decisions. Verify environment, rights, backup/rollback and release gates first. Never reset/drop or trial migrations on production.
- Keep learner identity, roles, deadlines, scores, revisions and idempotency server-authoritative. RLS and least-privilege grants are both required. Never expose service-role secrets, PII, hidden exam answers or privileged grading data. Unknown is not zero.
- Never run learner-submitted code on the app server, Supabase database/Edge Function, CI runner or host process. SQL practice uses synthetic disposable databases. Verify real sandbox isolation, egress denial, limits, timeout and cleanup before enabling authoritative grading.
- Tutor/hints require consent, quota/budget reservation, static fallback and server-side exam denial; AI output is not mastery evidence. Content requires provenance, immutable versions, deterministic validation and accountable human review.

## Evidence discipline

- Label FACT/INFERENCE/HYPOTHESIS. Every material market fact needs direct URL and checked date. Vendor page establishes an offer, not traction/learning validity. Recheck volatile prices/quotas before using them to charge or purchase.
- Preserve failed experiments and raw red-team critiques. Never change a threshold after inspecting results to manufacture success. Record new protocol version before new cohort; old results retain old criteria.
- Count missing/failed setup in denominators; separate self-funded, reimbursed, employer-funded and friend cohorts. Publish only de-identified aggregate data. No user contacts, receipts, source code, credentials or transcripts in this public repo.
- No agent-generated approval substitutes for an eligible GitHub reviewer or competent independent content reviewer. Unresolved critical risks block dependent steps, not hide under future work.

## Product/architecture boundaries

Future web default is a modular monolith. Do not add Redis, a second API framework, microservices, Kubernetes, queues, vector DB, paid telemetry or hosted LLM execution without a measured need, current official documentation and an ADR. Providers stay behind thin adapters. Do not invent a fake backend or dashboard to conceal missing integrations.

Local venv is not a sandbox. Reviewed starter code does not guarantee safety of agent edits. Do not run learner-submitted code in CI or founder environment. Self-reported checks must stay labelled self-reported.

## Git and checks

Use task-specific branches from the verified intended base: `codex/` for Coder-owned work and `lead/` for Lead-owned review/integration patches after path ownership is clear. Preserve unrelated changes. No direct push to main, force-push, reset or history erasure. One task/branch/path has one writer; require an explicit exact-head/path claim before Coder writes.

Run `node scripts/check-planning.mjs` and `git diff --check` for planning changes. Planning integrity is not app build, Supabase/RLS, sandbox, E2E, content-quality or deployment evidence.

**Live governance snapshot checked 2026-11-16:** ruleset #24379959 is ACTIVE and requires strict `merge-gate`, linear history and deletion/non-fast-forward restrictions, with no bypass actors. Its effective read-back currently has **0 required approvals**, no required reviewers, latest-push approval disabled and no trusted workflow pin. PR #40 modifies the workflow that emits the only required check. Therefore Release-G0 remains BLOCKED; do not claim that the live ruleset currently enforces independent approval. Re-read the effective ruleset every run. Never self-approve, lower protections, bypass required checks/reviews or merge deliberately failing negative controls. A COMMENTED review is not APPROVED. Keep PR links/issues/state synchronized and update the single existing tracker #17.

No deploy/provision/production migration is implied by documentation or planning authorization. Production promotion requires evidence-linked G0–G7, correct environment identity, exact green release SHA, eligible independent review, backup/restore and rollback evidence, smoke plan and authorized environment owner.

## Adversarial review

For every PR, challenge beginner learner, pedagogy/assessment, full-stack, security/privacy, accessibility, reliability and cost. Findings need severity, reproduction, remediation and regression coverage. These structured perspectives are self-review, not independent human approval. Preserve an adversarial counterexample and an automated regression test where executable code exists. For major thesis changes obtain two independent attacks (investment and operations), then reconcile every finding with severity and one action: eliminate, simplify, defer, experiment, monitor, accept, or kill.
