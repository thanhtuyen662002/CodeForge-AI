# CodeForge working rules

## Owner scope override — 2026-10-24

The owner explicitly directs the Lead to deliver the full approved requirements-traceability scope and production acceptance. This supersedes the historical P0-only/no-platform-implementation restriction for implementation authorization. It does not imply demand or learning validation passed, or that any product/deployment capability exists. G0–G7 remain hard evidence gates; every capability stays unaccepted until evidence is linked.

This does not authorize new spend, paid-provider activation, external outreach/payment/publication, destructive database operations, production migrations, or production deployment without separate explicit approval, verified rights/target environment, and a rollback plan. Missing credentials/runtime are NOT_RUN, never fake success. Live ruleset #24379959 is ACTIVE but currently requires zero approving reviews; treat this as a G0 governance blocker and never self-approve or merge around it.

## Source of truth and current scope

Read `docs/PROJECT_STATE.yaml`, `docs/DECISION_MEMO.md`, `docs/VALIDATION_PLAN.md`, and the live issue before starting. Latest explicit owner instruction wins. GitHub/repository evidence wins over chat recollection. Do not infer launch, payment, user count, review approval or deployed resources from a design document.

Historical strategy decision is BUILD WITH CONDITIONS; validation remains NOT_STARTED. The $49 finite Python backend verification pack and BYO-agent path remain hypotheses, not validated demand. The owner scope override above supersedes the former P0-only implementation restriction, but does not turn old issues into completed work. Re-read every issue/PR and preserve existing resources/history.

P0 cap10workingdays/20h/$100; full90day160h/$500; budgets are ceilings, not authorization to buy services or contact people. P0 issues remain valid research work, but are no longer the only authorized implementation scope. Do not duplicate backlog issues or mark P1–P6 accepted without evidence. Outreach/payment/publication execution still needs explicit owner authorization and resolved prerequisites.

## Evidence discipline

- Label FACT/INFERENCE/HYPOTHESIS. Every material market fact needs direct URL and checked date. Vendor page establishes an offer, not traction/learning validity. Recheck volatile prices/quotas before using them to charge or purchase.
- Preserve failed experiments and raw red-team critiques. Never change a threshold after inspecting results to manufacture success. Record new protocol version before new cohort; old results retain old criteria.
- Count missing/failed setup in denominators; separate self-funded, reimbursed, employer-funded and friend cohorts. Publish only de-identified aggregate data. No user contacts, receipts, learner-submitted source code, credentials or transcripts in this public repo; this restriction does not prohibit the authorized application source.
- No agent-generated approval substitutes for an eligible GitHub reviewer or competent independent content reviewer. Unresolved critical risks block dependent steps, not hide under future work.

## Product/architecture boundaries

Product implementation is owner-authorized in bounded, reviewable PRs. Every capability remains disabled until its relevant G0–G7 evidence passes. Do not run learner code on the main app/CI host or Supabase app DB; SQL practice uses synthetic disposable databases. No stored provider API keys, hiring-score claims, surveillance, hidden-test secrecy claims, seasons, custom agent integrations, microservices, Kubernetes, queues, or vector DB without a separate evidence-based decision.

Local venv is not a sandbox. Reviewed starter code does not guarantee safety of agent edits. Do not run learner-submitted code in CI or founder environment. The old finite-pack distribution note is historical: this public repository may contain the owner-authorized application source and public manifests/advisories, but never private assessment answers/hidden grading data, paid-only artifacts, learner PII, credentials or transcripts. Self-reported checks must stay labelled self-reported.

Future web default remains a modular monolith. The full application implementation is owner-authorized in bounded PRs. Supabase/Vercel are the target stack, but use only the exact approved account/project/environment; current access remains unverified. No new paid service, recurring spend, or production mutation without explicit approval and verified rights. G3 blocks enabling graded Python/SQL execution until isolation, limits, egress, cleanup and trusted grading are proven; G4 blocks tutor enablement until consent, quota, exam denial and static fallback are proven. ROI and automation expansion may be reconsidered after measured demand and first-order economics; they do not replace release gates. Implement the minimum server-authoritative learner progress/evidence needed for the approved flow, with ownership checks, retention, export/delete and correction controls. Isolate providers behind thin adapters; avoid a premature generic LLM abstraction. Contracts/version/migration/security details remain in ARCHITECTURE.

## Git and checks

Use `codex/` branches from intended reviewed base; preserve unrelated changes. Run `node scripts/check-planning.mjs` and `git diff --check` for planning changes. Its merge-gate is documentation integrity only; future executable content/product requires appropriate tests and a new gate design.

Never self-approve, lower protections, bypass required checks/reviews or merge deliberately failing negative controls. Live ruleset #24379959 is active with strict `merge-gate` but currently requires zero approving reviews and no independent reviewers. Do not merge until an authorized administrator restores and reads back the independent-review policy. Keep PR links/issues/state synchronized. No deploy/provision/production migration is implied by scope authorization.

## Adversarial review

For major thesis changes obtain two independent attacks (investment and operations), then reconcile every finding with severity and one action: eliminate, simplify, defer, experiment, monitor, accept, or kill. Do not add a service to patch every concern. Independent final review must check budget/count/threshold consistency and disclose open blockers.
