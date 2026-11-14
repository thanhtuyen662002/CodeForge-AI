# Release Gates — evidence-linked acceptance

**Status snapshot checked:** 2026-11-14
**Verified main:** `4ea8f8dc8401bfa3790e6aeabf3ffb80b8b28989`
**Scope:** full owner-authorized requirements traceability and production acceptance, pending the owner-scope reconciliation PR #28. This document is a gate contract and point-in-time evidence ledger, not a claim that any capability is implemented.

A gate is PASS only when its evidence is linked and independently reproducible. A design document, code comment, agent self-review, skipped CI job, stale SHA or successful planning-only check is not a substitute for runtime evidence.

## Status vocabulary

- **PASS** — every required item has exact evidence for the current release candidate and the required reviewer/owner sign-off.
- **BLOCKED** — a prerequisite or permission prevents valid verification.
- **OPEN_NOT_VERIFIED** — implementation or evidence is incomplete.
- **NOT_RUN** — the required test/action was not executed. This is not PASS or FAIL.
- **FAIL** — an executed test disproved the acceptance condition and needs remediation.

Unknown is not zero. Never convert NOT_RUN into PASS, or close a gate because a PR merged.

## Gate namespace

This document uses G0–G7 for **release acceptance**. In cross-document status reports, call its first gate **Release-G0**. `docs/VALIDATION_PLAN.md` separately uses G0 for P0 demand/payment feasibility; call that **P0-G0**. These are independent gates: passing or pausing one does not pass or pause the other. Do not use an unqualified “G0” in cross-document status reports.

## Current gate summary

| Gate | Current status | Current evidence / next required proof |
|---|---|---|
| Release-G0 Governance | **BLOCKED** | [Live ruleset #24379959](https://github.com/thanhtuyen662002/CodeForge-AI/rules/24379959) is ACTIVE and requires strict `merge-gate`, but read-back has zero approving reviews, no required reviewers, latest-push approval disabled and no trusted workflow pin. [PR #40](https://github.com/thanhtuyen662002/CodeForge-AI/pull/40) changes the workflow that emits the only required check. A real eligible independent reviewer and negative-control merge-block proof are not evidenced. |
| G1 Identity/data | **OPEN_NOT_VERIFIED** | The owner-designated Supabase ref is `qvufngaseebmaxzthrdi`; current connector read returned permission denied. Staging identity, Auth, migrations, RLS, grants and private Storage tests are NOT_RUN. Vercel project/environment access is NOT_VERIFIED. |
| G2 Assessment | **OPEN_NOT_VERIFIED** | Server-authoritative assessment, deadlines, revisions, idempotency, immutable versions, trusted grading and safe DTOs are not proven on a running application. |
| G3 Execution | **OPEN_NOT_VERIFIED** | No real isolated Python/SQL runtime, deny-egress/resource-limit/cleanup evidence or external trusted-grader proof is available. |
| G4 Tutor | **OPEN_NOT_VERIFIED** | No approved provider/runtime evidence for consent, progressive hints, quotas, exam denial, evaluation or static fallback. Keep tutor disabled. |
| G5 Learner flow | **OPEN_NOT_VERIFIED** | The complete real registration-to-grading-to-explanation-to-persisted-dashboard flow, including re-login and A/B isolation, has not been observed. |
| G6 Content/UX | **OPEN_NOT_VERIFIED** | Full reviewed content, CMS/version/correction flow, exam behavior, accessibility and pilot evidence are not complete. |
| G7 Operations | **OPEN_NOT_VERIFIED** | No verified Vercel production deployment, post-deploy smoke, privacy/retention approval, export/delete, backup/restore, rollback, observability, budget or on-call evidence. |

## Release-G0 — Repository governance and trusted integration

**Enables:** safe integration to `main`.
**Current status: BLOCKED.**

- [ ] Read back the effective ruleset on the current default branch; record rule ID, enforcement, exact required contexts and source integration.
- [ ] Require at least one eligible independent approval; dismiss stale approvals and require approval of the latest push. The author cannot approve their own PR.
- [ ] Verify no bypass actors, no force-push/deletion, linear history, strict up-to-date checks and resolved review threads.
- [ ] Ensure the required check producer is trusted independently of the PR being evaluated. A PR must not be able to weaken the workflow that supplies its own required result.
- [ ] Verify the eligible reviewer has WRITE-or-higher permission and is not the PR author.
- [ ] On the current base, demonstrate that an unapproved PR cannot merge.
- [ ] On the current base, demonstrate that a deliberately failing required check cannot merge.
- [ ] Record exact main/base SHA, PR head SHA, check run IDs/results, reviewer identity, ruleset read-back and negative-control result.

**Current observations:** ruleset #24379959 is ACTIVE, but `required_approving_review_count=0`, `required_reviewers=[]`, and `require_last_push_approval=false`; no bypass actors are present. The only required `merge-gate` is emitted by `.github/workflows/planning.yml`, which PR #40 modifies. Collaborator `thienvu1996` has READ permission only. The branch-protection API returned 403 and the available GitHub connection exposes ruleset reads but no ruleset-write action. No merge, approval reduction, self-approval or bypass is authorized.

**Evidence:** [ruleset read-back](https://github.com/thanhtuyen662002/CodeForge-AI/rules/24379959) · [PR #40 trust-root finding](https://github.com/thanhtuyen662002/CodeForge-AI/pull/40) · [Release-G0 issue #2](https://github.com/thanhtuyen662002/CodeForge-AI/issues/2).

## G1 — Identity, database and private data isolation

**Enables:** account-bearing pilot.

- [ ] Confirm the exact owner-designated Supabase project ref/URL, environment identity, region, plan and billing visibility. Do not create a replacement project.
- [ ] Confirm a separate development/staging environment and prove previews cannot access production data or secrets.
- [ ] Read the current Supabase migration, grants, RLS, Storage and pgTAP guidance before SQL/DDL changes.
- [ ] Replay migrations and seed only against a disposable local/staging database with synthetic data; prove clean reset/replay and rollback strategy.
- [ ] Test anon, learner A, learner B and staff: own-profile access works; cross-user reads/writes/deletes fail; privileged role/score/deadline/mastery fields cannot be client-mutated.
- [ ] Verify every exposed learner table has RLS and least-privilege grants; private schema and Storage objects are not public.
- [ ] Verify service-role secrets remain server-only and are not in client bundles, logs, fixtures or Git history.
- [ ] Record exact project/environment identity, migration SHA, test commands/results and remaining NOT_RUN items.

**Current status:** the exact project ref `qvufngaseebmaxzthrdi` is known, but `get_project` and `get_project_url` returned permission denied. This does not prove the project was deleted. No database mutation was attempted. Vercel project identity and deployment access are NOT_VERIFIED.

**Evidence:** [CF-04 issue #5](https://github.com/thanhtuyen662002/CodeForge-AI/issues/5) · [CF-02 issue #3](https://github.com/thanhtuyen662002/CodeForge-AI/issues/3) · [PR #1 data/security contracts](https://github.com/thanhtuyen662002/CodeForge-AI/pull/1).

## G2 — Server-authoritative assessment and grading integrity

**Enables:** trustworthy diagnostic, practice and exam results.

- [ ] Pin question, rubric, dataset, runtime and evaluator versions for each attempt.
- [ ] Server owns identity, entitlement, start/deadline, assigned items and score; ignore client-supplied authority fields.
- [ ] Use atomic revision compare-and-swap for saves and idempotent final submission; same key/different payload returns conflict.
- [ ] Ensure only trusted server grading creates mastery evidence; browser scores, AI hints and self-reports do not.
- [ ] Keep expected outputs, grading keys and confidential assessment data outside learner DTOs and bundles.
- [ ] Test exact deadline boundaries, stale revisions, double submit, replay, concurrency, A/B isolation and malformed/oversized input.
- [ ] Preserve immutable historical attempts and provide correction/regrade with a versioned audit record.

**Evidence:** [CF-06 issue #7](https://github.com/thanhtuyen662002/CodeForge-AI/issues/7) · [assessment/data contracts on PR #1](https://github.com/thanhtuyen662002/CodeForge-AI/pull/1).

## G3 — Isolated Python/SQL execution and trusted grader

**Enables:** server-graded code and SQL. Keep the capability disabled until PASS.

- [ ] Identify an owner-approved disposable runtime and budget; no learner code runs on Next.js, Supabase app DB, CI host or developer host.
- [ ] Prove deny-egress, no production secrets/metadata access and cross-job isolation with controlled adversarial tests.
- [ ] Prove CPU, memory, wall-clock, process, output, concurrency and source-size limits are enforced by the actual runtime.
- [ ] Keep expected outputs/comparator and official grading outside the guest; guest stdout or files cannot assert a pass.
- [ ] SQL runs only against synthetic disposable databases with restricted roles, query limits and cleanup.
- [ ] Prove timeout, cancellation, retry, controller crash, lease expiry, callback signature/replay defense and TTL/reaper cleanup.
- [ ] Record runtime/image/version, exact test SHA, measured cost/latency, observed egress and residual risk.

**Evidence:** [CF-07 issue #8](https://github.com/thanhtuyen662002/CodeForge-AI/issues/8) · [CF-08 issue #9](https://github.com/thanhtuyen662002/CodeForge-AI/issues/9) · [coding sandbox contract on PR #1](https://github.com/thanhtuyen662002/CodeForge-AI/pull/1).

## G4 — AI tutor safety and cost controls

**Enables:** external AI assistance. Keep the tutor disabled until PASS.

- [ ] Obtain explicit provider/budget approval and verify the exact environment; no paid activation by inference.
- [ ] Obtain learner consent before sending code/content externally; send only minimum approved public context.
- [ ] Implement progressive hints and assistance labels; AI/hints never directly grant score or mastery.
- [ ] Enforce exam denial server-side, including direct API calls and cross-tab attempts.
- [ ] Apply atomic quota/budget reservation, concurrency limits, bounded output, timeout and retry caps.
- [ ] Maintain reviewed static fallback when provider is unavailable, refused or over quota.
- [ ] Test prompt injection, secret requests, hidden-test exfiltration, hallucination, Vietnamese quality and output sanitization with versioned evaluations.

**Evidence:** [CF-10 issue #11](https://github.com/thanhtuyen662002/CodeForge-AI/issues/11) · [AI tutor contract on PR #1](https://github.com/thanhtuyen662002/CodeForge-AI/pull/1).

## G5 — Complete persisted learner flow

**Enables:** vertical-slice acceptance, not the full MVP by itself.

- [ ] Run against real staging Auth/database and the owned isolated runtime, with synthetic learner A/B accounts.
- [ ] Observe registration → diagnostic → skill profile → matched lesson → Python/SQL submission → official grading → explanation → dashboard update.
- [ ] Log out and log back in; verify progress and evidence persist for the same learner.
- [ ] Prove learner A cannot read or alter learner B's profile, attempts, code or evidence.
- [ ] Prove one submission cannot award duplicate evidence after retry/replay; infrastructure failure never becomes a wrong-answer result.
- [ ] Test mobile 360px, keyboard-only, screen reader, offline/reconnect, reload, empty/error/permission states and saved-submission acknowledgement.
- [ ] Record browser/version, environment, exact SHA, test report/artifacts and human observations.

**Evidence:** [CF-11 issue #12](https://github.com/thanhtuyen662002/CodeForge-AI/issues/12) · [UX and test contracts on PR #1](https://github.com/thanhtuyen662002/CodeForge-AI/pull/1).

## G6 — Reviewed content, CMS, exam and accessibility

**Enables:** full MVP beta.

- [ ] Preserve all committed modules/content targets; a vertical slice does not count as the full MVP.
- [ ] Record source, license, fact type (FACT / INFERENCE / PRACTICE CONTENT), version, deterministic validation and accountable reviewer for each published item.
- [ ] Keep confidential assessment answers/private tests outside public repo and learner DTOs.
- [ ] Published versions are immutable; correction, quarantine, appeal and regrade preserve historical attempts.
- [ ] CMS author/reviewer permissions are server-controlled; an author cannot self-publish around review policy.
- [ ] Exam timer/deadline/autosave/flags/navigation are server-authoritative and survive reload, stale tabs and network interruption.
- [ ] Verify keyboard, screen-reader, contrast, reduced motion, zoom and mobile workspace behavior; no shame-based feedback or fake mastery.
- [ ] Complete pilot findings, correction flow and content quality review before widening the bank.

**Evidence:** [CF-05 issue #6](https://github.com/thanhtuyen662002/CodeForge-AI/issues/6) · [CF-12 issue #13](https://github.com/thanhtuyen662002/CodeForge-AI/issues/13) · [CF-13 issue #14](https://github.com/thanhtuyen662002/CodeForge-AI/issues/14) · [CF-14 issue #15](https://github.com/thanhtuyen662002/CodeForge-AI/issues/15) · [CF-15 issue #16](https://github.com/thanhtuyen662002/CodeForge-AI/issues/16).

## G7 — Production, privacy and operations

**Enables:** public production release.

- [ ] Owner/legal approves age eligibility, privacy notice, jurisdiction, processor terms and retention schedule.
- [ ] Export/delete works for accounts, attempts, private Storage and provider state; backup retention and deletion limits are stated honestly.
- [ ] Prove backup restore, migration rollback/forward recovery and documented RPO/RTO with a real drill.
- [ ] Configure observability, redacted logs, incident ownership, alert routing and support/on-call responsibility.
- [ ] Verify budgets, quotas, billing alerts and cost owners for Supabase, Vercel, sandbox and tutor providers.
- [ ] Verify target Vercel project/team/environment and production rights; deployment record must include deployment ID, URL, exact SHA and successful post-deploy smoke.
- [ ] Verify database backup/restore and migration compatibility for the exact release SHA; app rollback is not a database rollback.
- [ ] Record residual risks, owner approvals, operational runbooks and rollback decision before release.

**Evidence:** [CF-02 issue #3](https://github.com/thanhtuyen662002/CodeForge-AI/issues/3) · [CF-14 issue #15](https://github.com/thanhtuyen662002/CodeForge-AI/issues/15) · [deployment contract on PR #1](https://github.com/thanhtuyen662002/CodeForge-AI/pull/1).

## Production acceptance

Mark **PRODUCTION_ACCEPTED** only when all committed traceability scope/content is complete; there is no unresolved P0/P1 or core-flow blocker; code is on main; exact-release-SHA required CI/security and integration/E2E pass; Release-G0–G7 have evidence and required human/owner approvals; the correct Supabase environment and Vercel deployment are proven; sandbox and tutor gates are proven; privacy, export/delete, backup/restore, rollback, observability, budget and accountable owners are ready; and a final acceptance report links every item plus residual risk.

A percentage, a merged PR, a successful planning-only workflow, or a design document is not production acceptance.
