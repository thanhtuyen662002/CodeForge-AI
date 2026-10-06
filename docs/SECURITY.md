# Security Architecture

Assets: learner identity/code/history, unpublished items/keys, staff publishing rights, provider credentials, grading integrity, compute budget. Trust zones: browser, untrusted execution origin, BFF, Supabase public Data API/private schema, execution guest, trusted grader, AI provider, CI and deployment control plane.

## Access controls

Authentication is not authorization. Verify identity on every protected entry point, derive actor server-side, scope each query and enforce RLS. Staff permissions come from protected membership, not editable user_metadata. Use short-lived signed Storage URLs with owner/path policy; private bucket default. Service-role and database credentials are server-only; isolate privileged maintenance clients from user-request clients and require explicit capability checks.

RLS tests must exercise anon, A, B and staff against the real DB, including malicious IDs and unauthorized updates. Turning RLS on without correct grants/policies is insufficient. New exposed tables without policy tests block release. SECURITY DEFINER requires fixed search_path, safe ownership and minimized EXECUTE privilege.

## Application hardening

Schema validation and byte/row/token limits at boundaries. Parameterized application SQL; user-written SQL only in disposable playground DB. Origin/CSRF protection for cookie mutations; no GET with side effects. Escape stdout/stderr/markdown; prohibit unsanitized HTML. CSP reviewed with Next nonce/caching design; headers should not be copied blindly in ways that break workers or create unsafe-inline shortcuts. Private responses no-store.

Rate-limit by authenticated user and IP signal with privacy limits; central transactional counters, not Vercel instance memory. Protect auth email/OTP abuse. Enforce per-user/global job and tutor budgets before expensive side effects. Audit administrative changes and grading corrections without logging tokens/full learner submissions.

## Execution and AI

No eval/vm/child_process of learner code in web services; no production database access from playground. See CODING_SANDBOX for microVM/host-grader split and provider acceptance. Prompt injection defense is restricted data/context/tools, not solely a system prompt. Tutor cannot change scores, staff roles, deadlines or invoke privileged production tools.

## Supply chain and CI

Use PR workflows with read-only permissions, full SHA action pins and lockfile. No pull_request_target executing head code, no tokens/secrets in fork tests, no curl|bash unchecked installers. Dependency updates reviewed; high/critical audit alerts block unless a time-limited, owner-reviewed exception explicitly documents non-exploitability. Secret scanning is defense-in-depth and must not be advertised as detecting every secret.

## Security rollout

Security review applies to actual implementation, not just this design. Before pilot: auth/RLS/storage/IDOR/XSS/CSRF/session tests, callback replay/idempotency, budget abuse, backup/restore and deletion drill. Before graded sandbox: independent isolation observation and resource-exhaustion tests in owned test environment. Before public launch: external human review appropriate to risk; no self-certification claim.
