# Independent operations attack — system blueprint

Checked **2026-10-07 (Asia/Bangkok)**. Raw independent PHASE 13-style critique. I read the five blueprint documents and `model.json`, plus the working rules, canonical project state, decision memo, validation protocol v2 and live [issue 20](https://github.com/thanhtuyen662002/CodeForge-AI/issues/20). I did not read the investment review. I did not change the blueprint, prototype, resources or product. **No UI, auth, payment, infrastructure or challenge execution tests were performed.** The prototype was unfinished at assignment time; nothing below attests that its controls work.

Evidence labels: **FACT** means an inspected document/source states something, not that its proposed control exists. **INFERENCE** means reasoning/arithmetic from that evidence. **HYPOTHESIS** describes a plausible failure to test. Severity is attached to the affected future release gate. No current deployed vulnerability is asserted: the proposed app is not implemented. Already-documented precautions are acknowledged; findings identify unresolved details or ways those precautions could fail, not proof they have already failed.

Reviewed artifacts: [README](../README.md), [hosting](../HOSTING_DECISION.md), [features/screens](../FEATURES_AND_SCREENS.md), [system](../SYSTEM_DESIGN.md), [operations](../OPERATIONS_AND_RELEASE.md), [model](../model.json).

## Adversarial verdict

The cheapest architecture is still not an application. S0 can fail on merchant eligibility, safe delivery, content competence and demand while spending no hosting money. S2 introduces account recovery, payment identity, asset permissions, state transitions, email abuse and data deletion to automate distribution of two files. These are not erased by choosing two managed vendors. Near the stated automation threshold, its own cost assumptions leave very little time to build a safe implementation and recover that investment.

I would reject S2 implementation funding without measured hours eliminated and a priced implementation/recovery scope. I would block private delivery until the actual channel is demonstrated and block automated commerce until the adversarial cases below have executable evidence. This does not require a VM, queue, generic workflow engine or more telemetry. Several cheapest responses are to keep the work manual or delete an optional feature.

## Findings

### BO-01 — HIGH — A free static host can permanently publish the paid asset by mistake

**Evidence:** FACT: S0/S1 public files must exclude paid bundles, references and probes; authoring storage is private. The future publication gate checks absence of such files. An explicit publish artifact allowlist/root is not specified.

**Failure path — HYPOTHESIS:** A deployment points at the repository root, a preview/build output includes a private export, or paid text is imported into a public client bundle to make S05/S07 easy to render. Hiding navigation or checking the page handler leaves the bytes public. Deleting the URL later does not remove downloaded copies. Probe exposure also invalidates the experiment rather than merely reducing revenue.

**Cheapest response:** Keep private authoring outside the public checkout; publish only a small allowlisted public directory/artifact. Review the actual exported file inventory, not just source paths. Verify generated HTML/JS/maps/previews contain no paid/reference/probe material before publication. In S2, paid content must not enter static prerender/client assets.

**Kill condition:** If approved public bytes cannot be enumerated or separation depends on an obscure URL, do not publish. Remove the paid page/export rather than adding obfuscation or DRM.

### BO-02 — HIGH — “Existing private delivery” is still an unresolved dependency

**Evidence:** FACT: S1 requires named-recipient or merchant-controlled delivery, staged artifacts, a version record and independent backup. No actual eligible merchant or delivery channel has been verified; issue 20 explicitly remains feasibility work.

**Failure path — HYPOTHESIS:** The free channel requires an identity the buyer lacks, its access defaults to link sharing, its operator cannot stage debriefs, or lost account access removes every purchased bundle. A zero-hosting cost slide hides subscription, support or identity-recovery work. A paid promise is made before these operations are demonstrated.

**Cheapest response:** Before charging, use synthetic buyer/operator identities to demonstrate grant, receipt, deny another recipient, stage release, withdraw future access and restore a bundle. Record the real recurring price/limits and one fallback channel. Do not add an app simply to avoid choosing and testing the manual channel.

**Kill condition:** No eligible payment/refund route or acceptable private delivery within the P0 cap means PAUSE payment-dependent work, even if the static page is ready.

### BO-03 — HIGH — S1 purchases have no defined identity bridge into S2

**Evidence:** FACT: S1 has merchant/contact records without app accounts; S2 `orders` has an auth-user foreign key and email OTP. The migration/claim policy binding a manual order to a later auth identity is unspecified.

**Failure path — HYPOTHESIS:** Receipt email differs from OTP email; email changes; a shared employer mailbox buys a personal pack; somebody forwards a receipt. Auto-claim by requester-supplied email or order number assigns another person's purchase. Refusing all mismatches loses legitimate access and turns migration into support debt.

**Cheapest response:** Preserve a private immutable merchant order reference and original delivery record. For a tiny cohort, migrate by explicit owner-reviewed assignment after proving control of the original delivery channel. New S2 checkout binds its server-created order to an authenticated user before the merchant interaction. Define email-change/recovery separately; never bulk-link historical orders on an unverified email string.

**Kill condition:** If entitlement ownership cannot be resolved cheaply and safely, retain S1 delivery for those purchases. Do not require an app migration to keep what a customer bought.

### BO-04 — HIGH — Checkout idempotency needs to cross the merchant boundary

**Evidence:** FACT: checkout returns an existing pending/paid order, uses actor+key idempotency and server pricing. No durable local-order/merchant-idempotency sequence or concurrent-active-order rule is defined.

**Failure path — HYPOTHESIS:** Two tabs use different client keys, both observe no pending order, and each creates a merchant checkout. Alternatively, merchant creation succeeds but the app crashes before storing its ID; retry creates another payable checkout. A server-owned price does not prevent a second correct-price charge.

**Cheapest response:** Specify one durable local purchase intent before the external side effect, a stable provider idempotency reference derived from that intent where the merchant supports it, and a database-enforced or serialized active-intent rule. Reconciliation must find an orphan provider order after a timeout. Test different client keys and crash after provider success, not only same-key replay.

**Kill condition:** The selected merchant cannot support safe retry/reconciliation at pilot scale, or duplicate charge remains possible in the fault test → keep manual checkout/reconciliation; no automated payment launch.

### BO-05 — HIGH — Durable webhook receipt is not necessarily completed financial processing

**Evidence:** FACT: the blueprint already calls for event insertion, order transition and entitlement in one database transaction, and stale-event reconciliation. It also says a known durable event/duplicate returns success. Event processing status/error/replay semantics are not explicit. This is an ambiguity, not proof that the proposed transaction is wrong.

**Failure path — HYPOTHESIS:** To handle a slow merchant lookup, an implementation commits `received`, then fails before processing; retry sees the unique event and acknowledges it without applying the change. Or two workers fetch provider snapshots at different times and commit in reverse order; a stale paid snapshot incorrectly restores access after a refund unless the latest stored state participates in validation. Remote lookup cannot be part of a fully atomic cross-provider transaction.

**Cheapest response:** Freeze the invariant: either receipt and its financial effect commit together, or `received/unresolved/applied/rejected` are distinct and duplicate ACK does not masquerade as applied. Use the existing event table/manual reconciliation for bounded replay; no external queue is necessary. Serialize/version-check each order and derive access from the validated current state. Test every crash point plus reversed concurrent commits.

**Kill condition:** A durable but unresolved event can silently disappear, or stale processing can grant invalid access → block automated commerce. “We have idempotency” is not acceptance evidence.

### BO-06 — HIGH — Partial refunds and disputes have no product-access policy

**Evidence:** FACT: financial states include partially refunded, refunded and disputed; totals/version are monotonic; dispute suspends delivery. The design does not define what a partial refund buys, when a disputed order resumes, or how failed/reversed adjustments affect entitlement.

**Failure path — HYPOTHESIS:** Refund one lab of a two-lab SKU and either revoke both or retain both arbitrarily. A dispute ends in the seller's favour but the suspended order never recovers. Treating every financial field as permanently increasing cannot itself model every state reversal. Support/operator overrides diverge from webhook logic.

**Cheapest response:** For the first automated version, choose a narrow full-pack policy compatible with the real merchant and published terms; handle exceptional partial adjustments manually with an explicit recorded access decision. Define the provider-specific transition table before coding; financial amount, delivery status and research participation are separate facts.

**Kill condition:** Generic payment logic is being implemented before the actual merchant/terms can define these cases → stop that implementation. Do not build a universal payment engine for one SKU.

### BO-07 — HIGH — The download handler is not the only possible Storage access path

**Evidence:** FACT: `/downloads` checks entitlement, stage and quarantine and issues a ≤60s URL; buyer requests use scoped clients. Supabase Storage permissions are controlled through RLS, with operation-specific policies available [T1].

**Failure path — HYPOTHESIS:** Storage policy grants a buyer broad read access to owned/entitled product objects. The same buyer calls Storage directly and fetches LAB-B, a debrief or a quarantined object without using the handler. If they can independently create signed links, the app handler's expiry/rate rules need not govern those links. UserA-versus-userB tests still pass because the bypass concerns the buyer's own premature/withdrawn access.

**Cheapest response:** Define one authoritative permission path. Either operation-aware Storage policies enforce the same stage/status predicate, or direct buyer access/signing is denied and a narrowly scoped trusted signer enforces it. Do not add a general service-role client to ordinary learner modules. Test the same buyer through every allowed Storage operation, including list/read/sign and post-refund/quarantine cases.

**Kill condition:** Any alternate path bypasses stage, current order state or quarantine → block private automated delivery. A private bucket label is insufficient.

### BO-08 — HIGH — Owner RLS alone cannot implement write quotas

**Evidence:** FACT: tables describe owner writes through a constrained API; report/feedback limits appear in HTTP contracts. The exact grants/RPC path, database constraints and atomic quota accounting are not yet chosen. RLS scopes rows; service credentials can bypass it [T2].

**Failure path — HYPOTHESIS:** Direct authenticated REST writes are permitted by an owner-only insert policy, so a user skips the Next handler's length/rate/schema checks. Concurrent requests each pass a read-then-increment quota check. Many free accounts stay under per-account limits but create a large aggregate bill. Report bytes may be bounded per day while lifetime rows remain unbounded for a finite two-lab product.

**Cheapest response:** Delete stored practice history if it does not reduce fulfilment work. If kept, define grants so every write reaches the chosen constrained path, put non-negotiable size/shape/ownership checks at the database boundary, account quotas atomically and add a finite retention/lifetime envelope. Use existing Postgres, not Redis. Test direct own-row abuse as well as cross-user access.

**Kill condition:** Caps only exist in UI/HTTP handlers while a permitted alternate write path skips them → no production data launch. Per-account caps without an aggregate admission strategy are not a cash ceiling.

### BO-09 — HIGH — OTP is an unauthenticated shared resource and a purchase prerequisite

**Evidence:** FACT: S2 puts email OTP before checkout; SMTP is required. Explicit app quotas cover reports/downloads/feedback, not the OTP lifecycle. Supabase has project, user and IP-based auth limits that require configuration and interact with proxies [T3].

**Failure path — HYPOTHESIS:** Bot OTP requests consume sender quota/reputation; legitimate paid users cannot sign in to download or request support. Limits only at Next do not govern direct provider calls. Proxy-level IP handling accidentally groups all buyers under one limit. A tight cap protects the bill but disables sales and recovery at the same time.

**Cheapest response:** Test selected provider auth limits and actual SMTP quota against expected legitimate bursts, abuse and recovery; configure provider-side controls, not only a form timer. Keep support/refund contact reachable without a successful OTP. Do not add a second identity provider merely for failover. Use manual delivery during a pilot outage.

**Kill condition:** A small synthetic abuse/burst test can exhaust the pilot's legitimate login capacity with no safe fallback → do not put OTP in front of paid access. Retain manual delivery or simplify the app.

### BO-10 — MEDIUM — A 60-second URL and ten requests/day trade bandwidth risk for support friction

**Evidence:** FACT: download signing initially allows ten requests/account/day and links last ≤60s. A signed URL is temporary bearer access [T4]; already-downloaded bytes cannot be recalled.

**Failure path — HYPOTHESIS:** Slow connection, switching devices, expired links and multiple staged assets burn the signing quota before a buyer receives all files. Conversely, one valid signed URL is not defined as one-time or one-download, so request count does not bound transferred bytes. Strengthening anti-sharing rules increases support without making local content uncopyable.

**Cheapest response:** Count/reuse intentional download attempts consistently; give an accessible expiry message and a bounded manual recovery path. Specify an asset-size/workload envelope and measure actual egress. Accept ordinary copying risk for a small content pack instead of building DRM.

**Kill condition:** Normal delivery exceeds quotas or requires founder rescue enough to erase the margin → simplify limits/delivery. Do not claim the signing cap is a provider billing hard stop.

### BO-11 — HIGH — Operator authority and content approval must be enforced on the resulting bytes

**Evidence:** FACT: staff allowlist/MFA, independent competent lab review, scoped credentials and immutable versions are design requirements. The production binding between approved digest, uploaded object, publish action and operator assurance is not yet specified.

**Failure path — HYPOTHESIS:** The reviewed starter differs from the ZIP uploaded; an object is overwritten under the same key; an operator account has provider-console MFA but its app operations endpoint only checks email/role. A compromised operator can publish a harmful lab or withdraw all deliveries, and content review exists only in a document.

**Cheapest response:** Keep S09 manual until it demonstrably saves time. If built, check current authorization and required auth assurance in the privileged action itself. Publishing must reference the exact approved digest/review record, verify uploaded bytes and refuse overwrite of a published version. Keep owner-console recovery separate from shared learner flows. This is not a request to override the owner's GitHub review settings.

**Kill condition:** Approval can attach to different bytes, or an ordinary/stale staff session can perform protected operations → no executable content/operations release.

### BO-12 — HIGH — Account deletion races with valid sessions and late payment events

**Evidence:** FACT: deletion should stop new personal writes and reach a terminal status; financial records may need pseudonymization/retention. `orders` still has a user FK; a concrete deletion state/FK policy is unspecified. Session behaviour depends on token/refresh expiry and configuration [T5].

**Failure path — HYPOTHESIS:** A deleted account's still-valid token writes practice/feedback rows because checks only verify token ownership. A late webhook creates/links a new profile to satisfy the order FK. Alternatively, hard deletion cascades financial evidence or makes refund processing fail. Re-registering the same email accidentally recovers someone else's old record after mailbox ownership changes.

**Cheapest response:** Freeze the lifecycle: block app writes/entitlement actions first, revoke refresh capability, preserve only necessary pseudonymous financial linkage, then erase optional data. Every ingress, including direct DB policies and webhooks, respects terminal deletion state. Financial reconciliation must not recreate a learner profile. Test stale tokens, webhook-after-delete and same-email re-registration.

**Kill condition:** Deletion can be undone by normal processing, or removes evidence needed to honour an existing refund → no automated privacy release. Use the manual privacy workflow until semantics are safe.

### BO-13 — HIGH — Restore can resurrect deleted data and withdrawn content

**Evidence:** FACT: the plan now correctly includes DB plus object restore and merchant reconciliation. The restore policy does not explicitly replay deletion/quarantine decisions newer than the backup. Supabase DB backups exclude object bytes [T6].

**Failure path — HYPOTHESIS:** Restoring yesterday's DB reactivates a quarantined release and a deleted profile, then restores its matching old object faithfully. Financial reconciliation catches refunds but not privacy deletion or an oracle/security withdrawal. A technically successful restore recreates the state the founder deliberately removed.

**Cheapest response:** Keep a small independently recoverable record of authoritative withdrawal/deletion decisions with minimized identifiers. Before reopening any reads/downloads/writes, reconcile those decisions and merchant state against the restored snapshot. A single restore scenario must include one refund, one deletion and one quarantined version. No event-sourcing platform is required.

**Kill condition:** Recovery cannot demonstrate that forbidden data/access stays forbidden → do not accept real paid data. A DB connection test is not a recovery test.

### BO-14 — HIGH — Immutable product versions can strand buyers after a correction

**Evidence:** FACT: product versions contain immutable challenge-version IDs; quarantine blocks downloads; content changes create new versions. Correction/retry is promised, but replacement entitlement and compatible-report rules are not explicit.

**Failure path — HYPOTHESIS:** The customer owns product v1 containing LAB-A v1. A corrected LAB-A v2 is published, but access logic correctly rejects it because the order bought v1; the only entitled version is withdrawn. To fix this, an operator edits the immutable order/product or makes all current versions readable, defeating provenance/staging. Runtime upgrades cause the same problem later.

**Cheapest response:** A small explicit replacement grant links the original paid product/version to an approved corrective release, with reason and delivery record. Preserve original versions/results and distinguish withdrawal from compatible deprecation. No automatic blanket entitlement to every future pack.

**Kill condition:** A buyer cannot receive a safe correction without mutating purchase history or bypassing review → pause that version's sales/delivery, fulfil/refund manually.

### BO-15 — HIGH — Daily caps do not bound lifetime storage or make synchronous export safe

**Evidence:** FACT: optional report writes may reach 100KiB/account/day; export is described as bounded synchronous JSON. Research notes have TTLs; a concrete retention/row/lifetime bound for app practice history is not stated.

**Failure path — INFERENCE:** At the allowance ceiling an account adds roughly 3MiB in 30 days before DB/index overhead. A finite pack does not imply data stops arriving. Export eventually exceeds an unspecified synchronous bound; silently truncating loses data, while adding a queue/export service is a scope expansion caused by a feature that was optional.

**Cheapest response:** Prefer no stored practice history initially. If needed, specify an explicit retention/count envelope and make export complete within it; disclose deletion policy. Keep mandatory financial exports separate from optional practice data. Avoid solving this with a new asynchronous service.

**Kill condition:** Export/retention cannot meet the promised behaviour inside a small known bound → remove history persistence from S2 until justified.

### BO-16 — HIGH — S2 may fail the 90-day payback gate at its own threshold

**Evidence:** FACT: automation requires a manual bottleneck above 2h/week for two weeks and payback within 90 days. `model.json` budgets managed S2 at $100 cash/month plus 2h/month infrastructure labour at $30/h. No priced S2 build/security/migration scope is provided.

**Failure path — INFERENCE / illustrative scenario:** Near 2h/week, 13 weeks of fully eliminated manual work saves at most 26h × $30 = **$780**. Three months of the stated S2 allowance plus infra labour costs **$480**. Only **$300**, or **10 build hours**, remain before break-even. This assumes every minute disappears and excludes remaining manual reconciliation, migration, buyer recovery and extra support. These are scenario arithmetic, not observed effort or a vendor invoice. Lower actual cash spend changes the result; it does not prove the nine screens/ten data domains are affordable.

**Cheapest response:** Calculate incremental 90-day ROI from the actual task eliminated, measured volume, realistic implementation/test hours and continuing obligations before opening a product ticket. Compare removing steps or using merchant delivery. Price only the smallest bottleneck solution; do not fund all proposed screens because one task exceeded 2h/week.

**Kill condition:** No positive payback with observed volume and an honest implementation/recovery estimate → reject S2 funding. Stay static/manual or stop the business if manual economics also fail. A VM saving a few cash dollars does not repair this equation.

### BO-17 — MEDIUM — The operating-time envelope omits a demonstrated maintenance cadence

**Evidence:** FACT: S2 introduces Next/React/Node, Python content, SQL/RLS, auth/SSR SDK, merchant, SMTP, storage and backups. The runbook asks for daily attention, monthly updates, critical patch triage, staged migrations and restore exercises. Two infrastructure hours/month are hypothetical.

**Failure path — HYPOTHESIS:** A runtime/SSR update changes auth or cache semantics; a provider policy/email change disrupts login; a security fix needs work during a content deadline. The owner defers patches because the content business does not finance this workload. Replacing Vercel with a VM adds duties; changing to a beta adapter trades the bill for compatibility work.

**Cheapest response:** Measure one synthetic release/rollback/restore and maintain a small dependency/update inventory before accepting the S2 budget. Assign an owner and a sales-stop/manual-fulfilment fallback for absence. Treat measured app maintenance separately from the four content hours. No second production stack for theoretical portability.

**Kill condition:** Required recurring work exceeds the available validated margin/time → eliminate components or decline automation. Do not silently raise the cost cap to protect the architecture.

### BO-18 — MEDIUM — The repository currently gives conflicting machine-readable state

**Evidence:** FACT at review snapshot: blueprint README records PR23 merged at `a0e7296…` and the owner's zero-required-review ruleset change. Canonical `PROJECT_STATE.yaml` still says `NOT_MERGED`/approval required; AGENTS.md describes the earlier independent-approval requirement. README calls historical descriptions historical, but the project-state file is still presented as current authority. This review did not independently re-check GitHub protections.

**Failure path — HYPOTHESIS:** The next agent follows the machine state instead of the checkpoint, repeats old integration work or treats an obsolete review requirement as a current blocker. Conversely, a prose merge statement is overread as launch or implementation permission. Versioned protocol/gates drift when prose and model diverge.

**Cheapest response:** Update current state to the verified checkpoint with timestamp/evidence, preserve prior status as history, and keep strategy merge distinct from all unpassed customer/security gates. `model.json` is a design model, not proof of funding or a release authorization. Validate contradictory state values during the planning check where practical.

**Kill condition:** Current authority cannot be resolved from durable records → block dependent release/integration decisions, not independent research. Do not silently edit failed evidence or protections to make records agree.

## Second-order failures worth keeping visible

| Apparently economical choice | How it backfires | Findings |
|---|---|---|
| Static public front door | Paid/reference bytes enter deploy output; monetary loss and experiment contamination happen together | BO-01/02 |
| No accounts until later | A later migration must prove who owns old purchases; apparent automation savings become recovery support | BO-03/16 |
| One generic commerce module | Cross-provider idempotency, stale snapshots and partial refunds become a hidden state machine | BO-04/05/06 |
| Managed direct APIs/RLS | HTTP controls are skipped through legitimate own-user DB/Storage paths | BO-07/08 |
| Short signed links and small caps | Copying remains possible; legitimate low-bandwidth buyers consume support | BO-10 |
| Cheap email OTP | One exhausted sender resource blocks purchase, delivery and recovery together | BO-09 |
| Immutable releases and backups | A correction strands entitled buyers; restore resurrects withdrawn content/deleted data | BO-11/12/13/14 |
| Optional practice history | Storage grows, export needs another service, and privacy work appears without increasing value | BO-08/15 |
| $100/month managed stack | At a small manual bottleneck, the assumed recurring burden consumes most possible automation savings | BO-16/17 |

## Primary technical sources checked in this pass

All checked **2026-10-07**. These document vendor behaviour/controls; they do not prove this project implements them.

- **T1:** [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control) — Storage RLS, operation-aware policies and service-key bypass. Used narrowly for BO-07.
- **T2:** [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security) — row access policies and privileged bypass. Used for BO-08; specific CodeForge grants/quotas remain unimplemented.
- **T3:** [Supabase Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits) — distinct project/user/IP controls and proxy considerations. No default quota is represented here as CodeForge's actual configuration.
- **T4:** [Supabase createSignedUrl](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl) — caller-specified expiry for a temporary signed URL. This is not an attestation of one-time use, revocation or a billing cap.
- **T5:** [Supabase sessions](https://supabase.com/docs/guides/auth/sessions) — access-token/refresh behaviour and session-lifetime controls. Used for stale-session scenarios; actual project settings were not inspected.
- **T6:** [Supabase database backups](https://supabase.com/docs/guides/platform/backups) — DB backup and Storage object recovery are distinct. Actual restore capability must be demonstrated.

## What would falsify the blueprint economically

No VM is required to reach the first evidence gate. Nor is S2. If a finite $49 pack cannot pay for safe content review and bounded manual delivery, eliminating a $20 hosting line cannot create a business. If manual delivery works but the calculated automation payback fails, the right result is to retain the finite manual product rather than construct an account platform to make the screen design real. If even the cheapest private channel or trustworthy lab cannot be operated within the owner's resources, the correct operational verdict is PAUSE/STOP before taking new obligations.
