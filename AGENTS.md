# CodeForge working rules

## Owner scope override — 2026-10-24

The owner has explicitly directed the Lead to deliver the full approved requirements-traceability scope and production acceptance. This supersedes the prior P0-only / no-platform-implementation restriction for implementation authorization. It does **not** mean market validation passed: customer counts, payments, learning efficacy, and product/deployment status remain unknown until evidence exists. Product implementation may proceed in bounded, reviewable changes; all applicable G0–G7 evidence gates remain mandatory. Do not create fake backends or mark an unproven capability as tested.

This authorization does not authorize new spend, paid-provider activation, external outreach/payment/publication, destructive database operations, production migrations, or production deployment without the necessary explicit approval, rights, verified target environment, and rollback plan. Missing credentials or runtime evidence is NOT_RUN, not a reason to simulate success. The active ruleset read-back on 2026-10-24 is a governance defect: it is ACTIVE but requires zero approving reviews; do not treat that as satisfying independent review or merge through that defect.


## Source of truth and current scope

Read `docs/PROJECT_STATE.yaml`, `docs/DECISION_MEMO.md`, `docs/VALIDATION_PLAN.md`, and the live issue before starting. Latest explicit owner instruction wins. GitHub/repository evidence wins over chat recollection. Do not infer launch, payment, user count, review approval or deployed resources from a design document.

Historical strategy decision is BUILD WITH CONDITIONS; validation remains NOT_STARTED. The $49 finite Python backend verification pack and BYO-agent path remain hypotheses, not validated demand. The owner scope override above supersedes the former P0-only implementation restriction, but does not turn old issues into completed work. Re-read every issue/PR and preserve existing resources/history.

P0 cap10workingdays/20h/$100; full90day160h/$500; budgets are ceilings, not authorization to buy services or contact people. P0 issues remain valid research work, but they are no longer the only authorized implementation scope. Do not duplicate backlog issues or mark P1–P6 accepted without evidence. Outreach/payment/publication execution still needs explicit owner authorization and resolved prerequisites.

Owner additionally authorized the system blueprint and disconnected synthetic screen prototype under `docs/blueprint`, prioritizing scarce cash. This is design scope only. Default now: static/manual, no VM/app DB; Cloudflare Pages is a conditional publication candidate. No recurring purchase, app implementation or launch is inferred. Freeze further design after its review unless new evidence changes a decision.

Owner's2026-10-08 language request, followed by choosing both regional groups, authorizes localization of this prototype/design. Draft UI locales: en,vi,ja,ko,zh-Hans,de,fr,es,pt-BR; further candidates/gates in blueprint/LOCALIZATION. Native technical review, translated learning-content availability and commercial country/support eligibility are separate from UI completeness. Run `node scripts/check-locales.mjs` for catalog edits and `node scripts/check-prototype-browser.cjs` with existing Playwright/Chromium for rendered coverage; no runtime translation service or silent changes to protocolv2 cohorts/thresholds.

## Evidence discipline

- Label FACT/INFERENCE/HYPOTHESIS. Every material market fact needs direct URL and checked date. Vendor page establishes an offer, not traction/learning validity. Recheck volatile prices/quotas before using them to charge or purchase.
- Preserve failed experiments and raw red-team critiques. Never change a threshold after inspecting results to manufacture success. Record new protocol version before new cohort; old results retain old criteria.
- Count missing/failed setup in denominators; separate self-funded, reimbursed, employer-funded and friend cohorts. Publish only de-identified aggregate data. No user contacts, receipts, source code, credentials or transcripts in this public repo.
- No agent-generated approval substitutes for an eligible GitHub reviewer or competent independent content reviewer. Unresolved critical risks block dependent steps, not hide under future work.

## Product/architecture boundaries

Product implementation is now owner-authorized, but every capability must remain off until its release gate is proven. Isolated learner-code execution requires G3; tutor requires G4; the complete learner flow requires G5; CMS/exam/content and accessibility require G6; public production requires G7. No stored provider API keys, hiring-score claims, surveillance, hidden-test secrecy claims, seasons, custom agent integrations, microservices, Kubernetes, queues, or vector DB without a separate evidence-based decision.

Local venv is not a sandbox. Reviewed starter code does not guarantee safety of agent edits. Do not run learner-submitted code in CI or founder environment. Public repo keeps demo/manifests/advisories only; paid artifacts and probes delivered privately by stage. Self-reported checks must stay labelled self-reported.

Future web default remains a modular monolith. The owner scope override authorizes bounded implementation, but paid/hosted services and recurring infrastructure remain gated by owner approval, relevant G3/G4 evidence, actual first-order economics, a measured manual bottleneck and ≤90-day fully loaded incremental payback, plus unrestricted cash coverage excluding refund liabilities. The 2h trigger alone does not authorize spend. No app practice-history/feedback persistence or pre-purchase login by default unless the owner revises that design decision. Isolate providers behind thin adapters; avoid a premature generic LLM abstraction. Contracts/version/migration/security details remain in ARCHITECTURE and blueprint/SYSTEM_DESIGN.

## Git and checks

Use `codex/` branches from intended reviewed base; preserve unrelated changes. Run `node scripts/check-planning.mjs` and `git diff --check` for planning changes. Its merge-gate is documentation integrity only; future executable content/product requires appropriate tests and a new gate design.

Never self-approve, lower protections, bypass required checks/reviews or merge deliberately failing negative controls. Historical read-back recorded ruleset24379959 with review count0 and last-push approval false. Live read-back on2026-10-24 confirms the same mismatch: active strict `merge-gate`, but zero required approving reviews and no required reviewers. Do not merge until an authorized administrator restores the independent-review policy and reads it back. Agent review never replaces eligible human approval or competent content review. Keep PR links/issues/state synchronized. No deploy/provision/production migration is implied by scope authorization.

## Adversarial review

For major thesis changes obtain two independent attacks (investment and operations), then reconcile every finding with severity and one action: eliminate, simplify, defer, experiment, monitor, accept, or kill. Do not add a service to patch every concern. Independent final review must check budget/count/threshold consistency and disclose open blockers.
