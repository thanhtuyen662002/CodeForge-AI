# Red-Team / Pre-mortem

Scope: adversarial **design review** of our own proposed product. Role-playing is not independent expert review and no live third-party attack occurred. Foundation domain regression tests cover only explicitly named invariants; all infrastructure/UX/pedagogy checks below need implementation and evidence. Severity is a project judgment, not a CVSS assessment.

## Attack the reason to exist

| ID / adversarial role | Failure that could kill the project | Mitigation / acceptance oracle | Priority / owner |
|---|---|---|---|
| R01 Skeptical beginner | Long diagnostic makes novice quit before first value | Optional familiarization, zero-entry path, observe novice flow end-to-end | P0 Product/UX |
| R02 Learning scientist | User passes with AI but cannot solve unseen task | Assistance tagging, independent transfer/delayed test; never count assisted attempt as mastery | P0 Assessment |
| R03 Psychometric critic | “81% ready” from 2 questions misleads user | Unknown/coverage, sample counts, thresholds labeled heuristic; prohibit admission probability | P0 Assessment |
| R04 Frustrated learner | Adaptive engine traps them in repeated failure | Prerequisite repair, bounded retries, alternative route and content-gap fallback | P1 Learning |
| R05 Content skeptic | Hundreds of generated items have false answers | Reference tests, edge cases, provenance, accountable review; quarantine/regrade | P0 Content |
| R06 Competitor | Product only rebrands an AI chat and quizzes | Pilot complete loop and independent improvement; integrated competitors already exist | P1 Product |
| R07 Accessibility advocate | Editor/timer makes learning impossible | Keyboard/textarea mode, screen reader, 360px, accommodations and reduced motion | P0 UX |
| R08 Cost adversary | Free users create unbounded model/sandbox bills | Central atomic reservations, max concurrency/TTL, global spend kill switch and static fallback | P0 Platform |

## Attack the implementation

| ID | Controlled attack / latent issue | Required defense and observable test | Priority / owner |
|---|---|---|---|
| R09 | Learner A swaps IDs to read B's attempt/code | Real RLS/API/storage A/B tests; 404/403 and zero leaked bytes | P0 Security |
| R10 | Client writes own grade, role, deadline or profile mastery | Columns/RPC restricted; server-owned claims; negative tests reject mutation | P0 Backend |
| R11 | Public repo or JS bundle exposes exam answer keys | Repo practice fixtures labeled public; confidential bank outside repo; DTO/bundle scan | P0 Content/Security |
| R12 | Submitted Python escapes or reads credentials | Separate disposable microVM, no secrets/network, controlled isolation test before enablement | P0 Execution |
| R13 | Submission can rewrite grader or claim passed=true | Expected values and comparison outside guest; forged-output regression | P0 Execution |
| R14 | SQL reaches application DB or consumes all resources | Disposable DB, restricted role, egress denied, statement/work/memory limits; no production connection | P0 Execution |
| R15 | Worker running code accesses app cookies/tokens | Dedicated untrusted origin; no secrets; validated messages; outbound probe blocked | P0 Frontend |
| R16 | Prompt injection in code or dataset leaks test/user data | Tutor gets minimal public context, no dangerous tools, server policy, injection eval set | P0 AI/Security |
| R17 | Hidden tutor button can be bypassed by direct API call | Server exam entitlement; cross-tab/API denial tests | P0 Backend |
| R18 | Change client clock/reload to gain exam time | Server-created deadline + DB time under row lock; boundary tests including exact deadline | P0 Assessment |
| R19 | Concurrent submit/webhook replay awards mastery twice | Idempotency key+hash, unique grading evidence, atomic transaction; repeated requests one result | P0 Backend |
| R20 | Stale autosave overwrites newer code or tab | Revision compare-and-swap, conflict UX, ACK and reconnect tests | P0 Backend/UX |
| R21 | Edited published item changes historical exam score | Immutable question/dataset/rubric/runtime snapshots; correction ledger | P0 Content |
| R22 | Sandbox/provider outage grades a correct answer as wrong | Infrastructure status not evidence; durable retries and cancellation keep answer intact | P0 Reliability |
| R23 | Preview deploy leaks production credentials/data | Separate projects; fork secrets off; environment audit and no public PII fixtures | P0 Platform |
| R24 | Auth response cached across users; XSS via stdout/markdown | no-store private responses, text output, CSP and two-user cache/XSS tests | P0 Security |
| R25 | Pipeline dependency/action exfiltrates secrets | SHA-pinned Actions, read-only token, no pull_request_target, no PR secrets, dependency review | P0 Platform |
| R26 | Job creation succeeds but serverless request dies before dispatch | Transactional job/outbox, external dispatch/lease/reaper, kill-controller chaos test | P0 Reliability |
| R27 | Reviewer role self-granted or author self-publishes bad content | Server-controlled membership, separate publish capability, audit; policy tests | P0 Content |
| R28 | Public tab-switch logs wrongly accuse a learner | No automatic cheating verdict; disclose low-confidence signals and allow appeal | P1 Product |
| R29 | Deletion ignores backups, AI provider or shared-device drafts | Data inventory, deletion/export tests, truthful backup retention and logout wipe | P0 Privacy |
| R30 | GitHub says checks pass but main has no protection | Activate ruleset with admin authorization, read back, verify failed PR blocked | P0 Maintainer |

## Residual risk and stop conditions

P0 is a release blocker for the affected capability, not proof the issue is fixed by writing this table. Do not enable graded execution until R12–R15/R22/R26 have real-provider evidence. Do not enable public accounts without R09/R10/R23/R24/R29. Do not claim learning effectiveness without R01–R07 pilot evidence. Confidential exams stay off while R11 remains unresolved.

If evidence is missing, narrow the pilot explicitly rather than label a demo “production ready”. Content mistakes remain possible after review; provide appeal/quarantine/regrade. Off-platform AI cheating cannot be reliably prevented without unacceptable claims; product is a learning/preparation tool, not a high-stakes credential issuer.

## Evidence ledger rule

Each risk closure records issue/PR, commit, test name, environment, observed result, remaining limitations and reviewer. A checklist tick alone cannot close a risk. Foundation self-review and pure domain tests are not a network pentest, RLS validation, usability study or independent audit.
