# API Contracts — target, not implemented routes

Version `/api/v1`. JSON request schema validation on server; same-origin CSRF/origin checks for cookie-auth mutations; unknown fields rejected for privileged operations. Errors: `{error:{code,message,requestId,retryable}}`, no raw SQL, stack traces or secrets. 401 unauthenticated, 403 denied, 404 missing/not-owned where appropriate, 409 conflict, 422 invalid input, 429 quota with Retry-After, 503 dependency unavailable.

| Endpoint | Contract |
|---|---|
| POST /diagnostics | Create attempt from published blueprint, server assigns pinned items/deadline; Idempotency-Key required |
| GET /attempts/:id | Owner-only safe snapshot and server time, no grading keys/hidden tests |
| PUT /attempts/:id/answers/:item | expectedRevision + answer; atomic revision check; ACK server saved_at |
| POST /attempts/:id/submit | Finalize once; canonical deadline; changed body with reused idempotency key → 409 |
| POST /practice/submissions | code/query + assigned instance id, strict byte limits; 202 job_id, not client score |
| GET /submissions/:id | Owner-only pending/running/graded/infrastructure_failed; bounded sanitized output |
| POST /internal/execution/events | Signed raw body + replay window + event dedup; not public trust in score |
| POST /tutor/messages | Auth, entitlement, active exam restriction, budget and approved context; never arbitrary tools |
| GET /me/skills | Evidence/coverage/version; unknown=null; no invented percentages |
| GET /me/next-step | Recommendation id/reason/target/alternatives from known content |
| POST /content/:id/publish | Staff scope, immutable validated version, reviewer recorded, audit event |
| POST /me/export; DELETE /me | Verified identity, async job, private download, clear retention notices |

## Grading boundary

Browser sends answers, never trusted score/skill updates. CodeExecutionResult contains exit class, bounded stdout/stderr, runtime digest, job id and timing. Trusted grader outside the submitted program compares actual output with private expected values; a line saying “passed=true” is merely learner output. AI sees safe error category/public examples, not private tests.

## Limits — design starting values

Source ≤32 KiB; answers JSON ≤64 KiB; stdout+stderr ≤64 KiB per run; tutor input capped by bytes/tokens; pagination default 20 max 100. Reject before storing or dispatching. Tune after tests, publish user-friendly limits. Quota transactions are centralized in Postgres rather than per-instance in-memory counters.

## Concurrency tests

Concurrent final submit returns one stable result; reused key with changed answer fails; stale revision cannot clobber latest save; result webhook replay cannot create evidence twice; deadline uses controlled server clock in tests; ownership checked at every lookup; provider failure leaves answer intact and outcome unscored.
