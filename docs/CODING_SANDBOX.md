# Coding Sandbox — hard trust boundary

## Decision

Practice preview: Python/Pyodide Worker and SQL/PGlite Worker in a dedicated untrusted origin, loaded only on demand. These improve responsiveness but are not authoritative graders. Vercel Sandbox is the preferred candidate for authoritative disposable compute, subject to a security/cost spike; the provider adapter prevents lock-in. No paid runtime is provisioned in foundation.

Alternatives reviewed: Judge0 and Piston offer sandbox execution but require patching/operations or a vetted managed operator; plain Docker is not accepted as the sole isolation assurance. Never use an anonymous public judge for learner data. See primary sources in RESEARCH.

## Browser boundary

Web Worker keeps heavy work off UI; Worker alone does not make arbitrary Python/JS safe. Use a separate origin with no application cookies, credentials or local storage, tightly restricted CSP/network, verified message origin/source and schema, bounded messages, kill/recreate for timeout/reset. Do not combine same-origin app privileges with untrusted interpreter access. Prefer a separate registrable domain before public rollout to reduce cookie mistakes. Host runtime packages deliberately; do not let learner code fetch arbitrary packages. Mobile can read/run; memory pressure must fail gracefully.

## Authoritative boundary

BFF writes job; broker creates per-submission microVM; no shared user filesystem or production network. Set egress deny-all explicitly before executing untrusted code; bake dependencies into a reviewed image. No network credentials, service keys, metadata route or app environment inside guest. Runtime/dataset/image hash pinned; block user-selected executable flags/paths and arbitrary archive extraction. Destroy in finally and enforce independent TTL/reaper after controller crashes.

Initial product budgets (hypotheses): 3 seconds CPU for basic exercises, 10 seconds wall time, 256 MiB process memory where provider permits, output 64 KiB, source 32 KiB, one active grading job per learner, bounded global concurrency. These are not promises about vendor VM minimum sizes. Spike must prove the actual enforcement mechanism; if a limit cannot be enforced, adapt policy and cost model or keep feature off.

## Hidden tests and scoring

A microVM isolates production from a submission; it does NOT hide files from a malicious process with guest privileges. Therefore do not place full expected-answer files or evaluator secrets beside the submission. Trusted orchestration retains expected results; feed one input, run code in guest, collect bounded actual output, compare outside guest. SQL expected query/results stay outside the user database. Return coarse feedback in exam mode, not hidden case contents. Limit attempts to reduce test-oracle probing. Known public repo examples cannot be advertised as hidden tests.

## SQL

PGlite provides browser Postgres-like practice, but authoritative grading must pin an actual PostgreSQL runtime/dialect and test compatibility, collation, extension, null/float/date semantics. Each job gets a synthetic disposable database, restricted role and statement/resource limits. No connection, fdw or extension enabling access to production. Read-only beginner tasks: restricted privileges + transaction timeout; SQL regex filtering alone is not a sandbox. Reset even after timeout or cancellation.

Compare typed row multisets by default, preserving duplicates; ordered comparison only when the task requests it. Fixed time anchor and seed; several synthetic variants catch hardcoded outputs. SQL dialect/runtime shown to learner.

## Controlled adversarial acceptance

Test infinite loops, recursion/memory/output/process floods, filesystem reads, cross-job leakage, outbound requests, guest metadata access, shell/path injection, forged judge output, SQL expensive queries, and cancellation/cleanup. Run only in owned disposable test sandboxes with explicit budgets. Verify with external observer, not only guest claims. No exploit attempts against third-party tenants. None of these real-provider tests has been completed in this foundation.
