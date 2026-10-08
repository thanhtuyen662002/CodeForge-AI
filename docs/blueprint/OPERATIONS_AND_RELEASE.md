# Operations, recovery and release gates

2026-10-07. Proposed runbook; **NOT_RUN** unless an evidence record later says otherwise. Original [security model](../SECURITY_THREAT_MODEL.md) and [validation protocol](../VALIDATION_PLAN.md) remain in force.

## Current deliverables versus real implementation

Design files and disconnected prototype may be reviewed now under the owner's instruction. P0 demand work stays in issues20–22. No P1–P6 implementation ticket, provider signup, VM rental or deployment follows automatically from this blueprint. Future code needs a specific evidence gate and a small executable issue.

S0 private operation needs a responsible owner, merchant/refund feasibility, minimal contact/consent ledger, protected storage and a restore exercise before real personal/payment records. Cloud hosting is optional. No email/OTP application, analytics tracker or support subscription just for fifteen interviews.

Before charging, demonstrate the actual private channel using synthetic identities: grant, receipt, deny another recipient, release learning materials without compulsory research, withdraw future downloads and restore the version. Keep a second delivery route available manually. Channel, merchant and actual fees are unresolved blockers, not an assumption that free hosting solves fulfilment.

## Future release checkpoints

| Gate | Required evidence | Cheapest failure response |
|---|---|---|
| Static commercial publication | Actual offer terms/currency/merchant, no placeholder checkout, permitted account plan, no PII/paid assets, mobile/keyboard review | Keep draft/local; remove payment CTA |
| Reviewed lab delivery | G1 spec/reference/alternative/mutants, runtime/OS smoke, provenance/hash, independent competent review, withdrawal drill | Quarantine/refund; no rushed release |
| Accounts/orders automation | G3/G4+economics+ROI; real auth/RLS negative tests, SMTP, merchant signature/replay/refund tests, private storage access tests | Continue manual delivery |
| Paid-data production | Separate staging/prod configuration, restore proof for DB **and objects**, least-privilege credentials, error/redaction checks | No production migration |
| VM | Named trusted workload, measured cost/latency/runtime, recovery owner, patching/firewall/backups, isolated staging | Do not rent it |

## Test strategy proportionate to risk

Planning/prototype: documentation links/numeric arithmetic, no-network assertion, navigation and pending/withdrawn scenarios, desktop/mobile overflow, keyboard focus and screenshot inspection. These checks do not test production auth, payments or labs.

When web exists: test server-owned amount/currency and duplicate/refund/out-of-order events; same idempotency key with changed request fails; return URL never grants access; concurrent payment handling atomic. Auth: missing/expired/forged session, userA↔B order/storage attempts, direct Supabase API bypass attempts, role escalation, session refresh and no-store caching. Private assets: public/anonymous denied, guessing keys/listing denied, signed-link expiry, refunded/quarantined order denied, URL never logged. Local report parsing (if implemented separately) rejects oversized/unknown-schema/nonfinite/extra fields/code payload; no app report storage/API or learner-code execution by tests.

Use disposable synthetic data; migrations apply on reset/seed and upgrade from last release. Test restore to a separate project before first paid-data launch and after a material migration. A green documentation `merge-gate` cannot be reused as proof of this future checklist.

## Environments and delivery

S0 publication must enumerate an allowlisted artifact root (offer/demo HTML/CSS/assets only), never the repository root. Private authoring stays outside the public checkout; inspect generated files, client bundles, source maps and previews for paid/reference/probe bytes. This design prototype is not that approved commercial offer. S2 dev uses local Supabase or a synthetic disposable project; staging isolated from production, no production secrets in preview builds or fork PRs. Never connect a preview to real buyer data just to save$10. Deployment credentials scoped; workflows use minimal permissions and pinned actions. Production migration is separate from preview and requires safe expand/backfill/contract sequencing.

CI never runs learner uploads. Trusted content fixtures are reviewed code with scoped runner/no production credentials. Dependency scripts are reviewed before allowed execution. Monthly stable/security dependency window; critical security patch triaged same business day as a target, not a24/7 SLA. No beta framework adapter in production without compatibility evidence and an exit path.

## Recovery and observability

Target for a small paid pilot: RPO24h, RTO one business day, both hypotheses to demonstrate before accepting real records. DB daily backup alone omits Supabase Storage objects [H06](HOSTING_DECISION.md); keep immutable bundle/digest inventory and independent private object backup, test matching version/entitlement restore. Configuration/secret rotation record separate from public repo. Reconcile merchant records after a restore before reopening sales.

Quarantine path: disable new downloads for affected version, publish a minimal advisory, identify delivered-version recipients within consent/support window, owner-authorized correction/refund communication; offline copies cannot be revoked. A corrective release gets a new reviewed digest and explicit replacement grant tied to the original delivery; never mutate the SKU/history or grant all future packs. Verify uploaded bytes match the independent approval and forbid overwriting a published key. Auth/DB outage: stop new orders if cannot reconcile safely; existing local bundles keep working. Merchant outage: no optimistic entitlement grant. Content oracle error: no silent historical score rewrite.

Before restoring service, replay a minimized independent deletion/quarantine decision ledger newer than the snapshot, plus current merchant refunds/disputes. Test refund + deleted user/stale token + withdrawn content in the same restore drill before enabling reads/downloads/writes. The ledger needs only pseudonymous necessary identifiers and a documented retention tied to backup lifetime; no raw profile or transcript. DB connectivity and successful object retrieval alone do not pass recovery.

Only operational events: request_id, action, version, bounded error code, pseudonymous actor where needed. Never raw body, prompt/code/transcript, email, signed URL or auth headers. App diagnostic logs target≤7days; provider-native retention and access must be separately checked instead of promising deletion from a provider's internal systems. Daily attention: failed paid orders, missing deliveries, unresolved refunds, quarantined content, quota and upcoming invoice. No distributed tracing/SIEM purchase at this volume.

Cash guardrails are application admission limits + real invoice checks + provider-specific caps. A budget alert is not a universal billing stop. S0 should have zero new recurring infrastructure. Conditional S2 envelope$100/month from HOSTING_DECISION is not a bill cap; if forecast cash exceeds available runway, keep manual mode or stop new obligations. No unlimited retries, file uploads, free inference or arbitrary compute subsidy.

## Privacy and retention

Research baseline begins at reviewed delivery, delayed probe≤14days, matched result closed before raw-note30day TTL; only de-identified aggregate counters afterward. Keep order/contact mapping separately through delivered support/refund window and actual merchant retention requirements. Avoid storing private long-form reasoning in the app by default. Learner optional practice summaries self-report only, owner export/delete available manually before automation.

Minimized telemetry must support the fixed denominators, not create a skill dossier. No session recording, employer ranking, repo ingestion or model key collection. Default research opt-out does not remove purchased learning access. Synthetic fixtures may still be transmitted by a user's own agent to its provider; disclose that local execution does not mean no cloud processing.

## Upgrade and exit

Static files can move to another static host without a backend migration. Future Next app keeps standard Node deployment capability; no promise of one-click Cloudflare beta compatibility. PostgreSQL export/restore tested; auth migration can require login reset, storage export separate, merchant identifiers preserved privately. Replace only one provider at a time and rehearse rollback with synthetic data.

Stop adding components if maintenance/support exceeds the validated envelope or a free substitute removes value. Content maintenance remains≤4h/month; hypothetical S2 infra operations2h/month is a separate cost, not hidden inside content. No new lab added simply to justify an existing server.

Time ledger records each task once: one-time design/build/release; per-order delivery/support; fixed infrastructure/recovery; content maintenance; research; acquisition. Two infra hours are unverified and may be too low. Measure a synthetic release/rollback/restore and patch routine before funding S2; use real time in ROI. No available operator means stop taking new obligations and retain manual fulfilment. The cash and exact 90-day incremental ROI vetoes in HOSTING_DECISION are both required.
