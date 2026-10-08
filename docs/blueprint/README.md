# System blueprint — CodeForge

2026-10-07. **DESIGN / NOT IMPLEMENTED.** Owner requested architecture, features, screens and adversarial review after strategy merge, then clarified that cash is scarce and the cheapest early services should win. This expands design work; it does not manufacture G0–G6 evidence or authorize purchases/deployment.

Strategy [PR23](https://github.com/thanhtuyen662002/CodeForge-AI/pull/23) merged normally at `a0e7296d78bec368ef1c22bd022a916c2bf6c754`, 2026-10-07T09:09:51Z. The owner changed the ruleset: required review count0, last-push approval false, required `merge-gate` still active, bypass actors empty. No protection was edited by this task. Historical documents describing a blocked PR record the earlier checkpoint, not current merge state.

## Decision before design

**Do not rent a VM now. Do not pay for a database just to host two exercises.** Start with a static offer/demo and private manual delivery; the buyer runs reviewed exercises locally using their own optional agent. This answers the same $49 willingness-to-pay question with less infrastructure. Supabase is the preferred managed database *when one is required*. Vercel is a good conventional Next.js host later, but its commercial Pro fee is unnecessary for a static P0 experiment.

Recommended progression:

1. **S0 — current validation:** local/static draft; if the owner later publishes, Cloudflare Pages Free is the low-cash candidate. No accounts, application DB, Functions, VM, hosted AI or payment integration. Use an already eligible merchant's checkout/invoice and existing private delivery channel. Merchant availability and actual fees remain unresolved.
2. **S1 — reviewed content delivery after G0/G1:** same static front door; private, versioned bundles and staged reference/probes. Order ledger and entitlement reconciliation remain manual. Static does not mean putting paid files in public Git or relying on a hidden URL.
3. **S2 — conditional automation:** only after G3/G4, positive first-order economics and measured manual-work ROI. One TypeScript/Next.js app on Vercel Pro with Supabase Postgres/Auth/private Storage; no separate API server or VM. A smaller static UI plus a tiny Worker is a price alternative only if a short compatibility/maintenance experiment proves it simpler; do not prebuild both.

The screen prototype depicts the possible S2 experience so decisions can be reviewed. It does not change the S0 execution gate, perform payments, collect personal data, run code or prove learning efficacy. Every screen is mapped to a gate in [FEATURES_AND_SCREENS](FEATURES_AND_SCREENS.md).

## What to review

| Decision | Artifact |
|---|---|
| Cheapest hosting and when a VM becomes justified | [HOSTING_DECISION](HOSTING_DECISION.md) |
| Features, journeys, screens and error states | [FEATURES_AND_SCREENS](FEATURES_AND_SCREENS.md) |
| Modules, data, API and security boundaries | [SYSTEM_DESIGN](SYSTEM_DESIGN.md) |
| Release, recovery, tests and workload envelope | [OPERATIONS_AND_RELEASE](OPERATIONS_AND_RELEASE.md) |
| Clickable design, synthetic data only | [Prototype](prototype/index.html) |
| Architecture assumptions and cost arithmetic | [Model](model.json) |
| Independent attacks and reconciled decisions | [RED_TEAM](RED_TEAM.md) |
| Prototype checks and unresolved release blockers | [QUALITY_GATE](QUALITY_GATE.md) |
| Independent final design verification | [FINAL_REVIEW](reviews/FINAL_REVIEW.md) |

## Role-based decisions

Founder/CFO: preserve runway; no infrastructure purchase before its workload exists. Product/education: sell practice on two concrete invariants, not a school or certification. UX: a short path from incident to evidence, with a static demo before installation/payment. Architect: one future app and managed data; no always-on execution worker. Security: local results remain self-reported; no learner-code upload. Operations: fixed content inventory, explicit refunds, restore tests and a weekly time budget. Growth: measure qualified offers, paid receipts and delayed outcomes, not dashboards/streaks. Red team: try to invalidate every one of these decisions before treating this as build-ready.

## Scope and remaining proof

This task produces documentation and a disconnected visual prototype only. No executable challenge, app framework, database migration, production API, purchase, provisioning or public launch. WTP, learning effect, distribution, reviewer competence and support cost are still unknown. A beautiful screen does not unlock a gate.

Current planning effort is separately recorded as design sunk cost, not hidden in future CAC. No new 90-day spending budget is granted. The 160h/$500 validation ceiling remains; hosted S2 would require a separate investment decision after evidence.

After33new adversarial findings: **STOP S2 funding now; retain P0 only**. Drop app practice history/feedback storage and pre-purchase CodeForge login. At2h/week manual savings, the exact90day model funds only9.714build hours; the illustrative full reference needs80–140h. Prototype screens are an aid to review, not a backlog. Freeze further platform design unless new evidence changes a decision.

Independent final QA passed with explicit execution blockers on2026-10-08; two consistency findings corrected/rechecked. Proposed design record: [PR24](https://github.com/thanhtuyen662002/CodeForge-AI/pull/24). See QUALITY_GATE for requirement-by-requirement completion evidence and measured design-effort checkpoint. Strategy is merged; this blueprint is a separate reviewable PR.
