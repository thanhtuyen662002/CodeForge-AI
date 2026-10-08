# Security / abuse / cheating threat model

2026-10-07. DESIGN, chưa pentest/implementation verification. Reference principles: [Docker security](https://docs.docker.com/engine/security/), [OWASP LLM risks](https://owasp.org/projects/top-10-for-large-language-model-applications), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), checked2026-10-07. Không xem prompt là security boundary.

Assets: learner machine/secrets, release supply chain, contact/payment ledger, evaluation honesty, founder budget/time. Trust zones: canonical reviewed content; learner-controlled filesystem/agent; voluntary data; merchant source of payments; future web/auth/database. Local report untrusted; a digest does not attest execution or human authorship.

The later owner-requested [blueprint attack/reconciliation](blueprint/RED_TEAM.md) adds18 technical findings and15 investment findings. Current refinements remove app practice/feedback storage, deny direct buyer Storage access, distinguish webhook receipt from applied effect, handle deletion/restore races and grant corrective releases explicitly. See [contracts](blueprint/SYSTEM_DESIGN.md) and [recovery gates](blueprint/OPERATIONS_AND_RELEASE.md). These are required design controls, not implemented or pentested protections.

| Threat | Concrete attack / consequence | Cheapest boundary + verification gate |
|---|---|---|
| Malicious challenge repo | Changed README tells agent to upload credentials; starter imports harmful module | No third-party repo ingestion. Review all files/instructions, canonical release/commit, no hooks/install scripts, reviewer record before publish |
| Arbitrary code execution | Agent edits tests to read home/network before normal run | Starter review does not cover later edits. Learner reviews diff before run; no admin/unrestricted agent requested; clean learning environment. If cannot support acceptable permissions→static format or no release |
| Secrets exfiltration | Agent has home keys/production config; code sent to cloud despite local runtime | Synthetic only, no secrets in folder, no collection of agent keys; provider policy disclosed. Least-privilege agent workflow checked in pilot; local ≠ private cloud-free |
| Prompt injection | Spec/output tells agent to ignore limits | Plain task data, reviewed prompts, no auto tool instructions; do not give CodeForge autonomous privileged agent role |
| Hidden test extraction | Agent reads evaluator/reference/probe files | Public tests admitted; reference/probes separate staged delivery, no secret guarantee; hiring claims disallowed |
| Evaluator gaming | User changes expected outputs/check IDs | All local outcomes self-reported; human-reviewed structured reasoning for research, no ranking/pay based on score |
| Score spoofing | Valid JSON produced without execution | Trust level fixed self_reported; observations/payment verified separately; schema/hash never upgrades trust |
| Fake telemetry | Fabricated duration/start/completion creates apparent traction | Frozen denominators, observed sample, missingness, merchant reconciliation; don't pass learning gate from event count alone |
| Plagiarism | Copy solution or agent produces explanation | Learning product allows tools; prior exposure/assistance noted. No claim authorship/credential; no surveillance fix |
| Account farming | Free accounts multiply subsidy/paid unlock | No free LLM/compute credits or payout. If accounts later: verified entitlement server-owned, throttle small reports |
| Leaderboard abuse | Coordinated fake high scores | Eliminate leaderboard and rewards |
| Malicious package / release | Dependency/lifecycle script runs unexpectedly | Stdlib, no arbitrary packages, pinned runtime/distribution, inspect lockfiles if dependency ever needed; no auto-update |
| Crypto mining | Uploaded code consumes host compute | No cloud execution/upload→attack surface absent; adding execution requires separate thesis/security/cost gate |
| Denial of service | Large JSON/requests consume server resources | P0 static/no upload; later≤16KiB/50 checks, quotas before persistence, bounded parsing, edge limits and spending alert |
| Oversized/zip bomb submission | Artifact extracted before validation | No zip/source upload endpoint; report JSON allowlist; no archive decompression |
| Storage abuse | Many logs/blobs without value | No raw source/transcript/stdout; capped reports with TTL and account quotas |
| LLM cost amplification | Recursive prompts/retries consume tokens | No CodeForge model endpoint/keys. Later API feature needs hard admission budgets, not just warning |
| Employer misuse | Team manager treats score as performance ranking | Clinic contract aggregate learning only; no individual report to manager by default; decline sale requiring ranking/hiring signal |
| Privacy/support leakage | Participant pastes secret/log or shares whole screen | Ask synthetic/rephrased example; category+bounded text; immediately delete accidental sensitive copy; no recordings/full-screen capture |
| Cross-user access (future) | Change owner ID to read another report | User-scoped server access + RLS, A/B/anon tests, no-store responses; service-role narrowly restricted |
| Payment spoof/replay | Fake event grants access, delayed refund regrants | Merchant signature+state transition+semantic order reconciliation; manual until app justified |
| Content correction failure | Offline bundle continues teaching/running wrong code | Canonical advisory, delivered version+consented contact during support; quarantine and notify/refund workflow; cannot remotely revoke copies |

## Release checklist proportionate to phase

P0: no executable distribution; private ledger location/access/backup/delete defined; feasibility spec review; merchant/refund path verified before charge. No payment screenshots stored as proof in public repo.

P1: know reviewer, commit and recipients; spec reference/alternative/mutants correct; supported runtime/OS smoke in clean environment; no third-party deps or hidden agent instructions; user sees permission/read-before-run instructions; one content withdrawal drill. **Critical unresolved finding blocks execution release even if preorders collected**; refund instead of rushing.

Future web: only after ROI gate; input caps + RLS negative tests, raw webhook signature, state machine and replay/refund ordering, restore order/consent/version mapping, secret handling and log redaction. A code patch can never be executed by web/CI to “verify” learner JSON.

## Incident response / recovery

Suspected malicious bundle: stop delivery, pin advisory, invalidate download link, preserve minimal hash/versions, notify affected recipients through owner-authorized channel, investigate; no automatic learner-machine actions. Content oracle wrong: quarantine, recompute only under new version if evidence exists, mark older report affected; refund/retry. Payment outage: defer order acceptance, reconcile merchant transactions before issuing access. Private-data leak: restrict location/share, revoke impacted key if any, document exposure and applicable notification requirements; don't post incident PII to GitHub.

Backup plan before contact/payment data: encrypted private ledger with tested restore; contact mapping separate from cohort data; raw notes30days from collection, matched outcome summary before deletion. Contact mapping remains through actual delivery+30day support/refund window unless separately consented; baseline begins at reviewed delivery and delayed probe≤14days. Payment retention follows actual merchant/legal obligations, not generic promise. Customer-export/delete ownership verified manually in pilot. No production uptime/SOC2/compliance claim.

## Accepted residual risk

User-owned agent can send synthetic code to its provider and produce unsafe edits. CodeForge cannot guarantee user machine isolation or anti-cheat. This risk is accepted only for voluntary practice with a narrow supported workflow and honest disclosure; it **does not authorize** using confidential employer code, requesting broad privileges, or publishing executable labs without review. If safe enough onboarding is infeasible within cap, eliminate execution rather than add orchestration.
