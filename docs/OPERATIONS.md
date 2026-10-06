# Operations

## Proposed service objectives — to calibrate in pilot

Track availability of auth/save/submit separately from AI/sandbox dependencies; preserve answers when optional services fail. Initial internal targets: autosave ACK p95 <2s, normal API p95 <1s excluding execution/AI, authoritative basic grading p95 <15s at agreed load. These are design targets, not measured results or vendor guarantees.

## Telemetry

Structured logs: request_id, pseudonymous actor reference, route, outcome code, duration, dependency and version. Never full code/token/prompt by default. Metrics: job queue age, leases expired, callback retries, save conflicts, grader mismatch, content quarantine, error rates, AI token reservation/reconciliation and cost. Link trace to event id without leaking private data in a public error screen.

## Incident responses

Sandbox anomaly: stop new jobs/disable execution, revoke affected provider credentials, preserve minimal incident metadata, verify no production linkage, investigate with owner. Tutor abuse/cost spike: disable provider route and fall back to reviewed hints; no loss of lessons. Bad question: quarantine selection, identify version-pinned attempts, reviewer-led regrade and learner notification. Data exposure: restrict access, rotate keys, preserve evidence, involve owner/legal for notification obligations. Database outage: keep local draft clearly marked unsynced, retry bounded; exam fairness follows approved interruption policy rather than quietly extending all deadlines.

## Jobs and cleanup

Durable state, atomic claim, lease_until, retry count, next_attempt_at and terminal failure. Reaper deletes abandoned sandboxes and stale temporary data; external TTL protects against reaper failure. Outbox writes in same transaction as grading; consumers idempotent. Recovery test kills dispatcher after row commit and before acknowledgment.

## Recovery

Document actual Supabase backup/restore features of selected plan before making RPO/RTO commitments. Initial desired RPO 24h/RTO 4h are hypotheses requiring plan/cost approval and restoration into a separate test project. Run a restore drill before public production. Verify auth/storage linkage, immutable content hashes and evidence after restore; app redeploy alone is not recovery.

An on-call owner and escalation contact must be nominated before production. No 24/7 support SLA is promised by this repository.
