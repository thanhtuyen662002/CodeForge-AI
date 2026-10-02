# Implementation backlog

Issue IDs below are stable local work-item keys; GitHub issue numbers may differ. Each item should be split further if a PR becomes difficult to review. Dependency list makes parallel work explicit.

| Key | Deliverable / acceptance | Depends on | Role |
|---|---|---|---|
| CF-01 | Activate and verify GitHub ruleset: required merge-gate, one independent approval, no force/delete; failing PR cannot merge; private security reporting | F0 CI checks exist | Maintainer |
| CF-02 | Provision/link development Supabase and Vercel staging using secure provider setup; separate prod/preview; no new charge without approval | Owner account access | Platform |
| CF-03 | Next.js + TypeScript web app and accessible auth: real sign up/login/logout/expiry; no mock dashboard; pinned deps/lockfile and browser tests | CF-02 | Full-stack |
| CF-04 | Supabase schema migrations + generated types + real RLS/storage tests for anon/A/B/staff; profile cannot set role/score | CF-02 | Backend/security |
| CF-05 | Content schema, skill DAG, reviewed 24-item slice bank, immutable public/private item split, deterministic Python/SQL validators | F0 contracts | Content/assessment |
| CF-06 | Quick diagnostic, item assignments, deadline/revision/idempotency transactions, profile coverage and next-step reason | CF-03/04/05 | Assessment/backend |
| CF-07 | Sandbox spike: actual provider limits, deny egress, no secrets, guest cannot alter grader, concurrency cost, destroy/reaper; written pass/fail report | CF-02; cost approval for paid usage | Execution/security |
| CF-08 | Python/PGlite practice origin and authoritative job broker, deterministic comparators, cancel/timeouts/replay; no prod SQL access | CF-04/05/07 | Execution |
| CF-09 | Three lessons, misconception feedback, mistake notebook, scheduled review, reload/account-switch-safe drafts | CF-06/08 | Learning/UX |
| CF-10 | Tutor adapter + hint ladder, server exam denial, injection evals, quotas, provider consent, static fallback | CF-06/09; provider access | AI/backend |
| CF-11 | Vertical-slice E2E with real staging auth/db and owned execution sandbox; persistence after relogin; two-user isolation | CF-03..10 | QA |
| CF-12 | Mock exam UX: navigation/flags/server timer/autosave, stale-tab/reload/offline/late-submit, accommodations | CF-06/08 | Assessment/UX |
| CF-13 | Author/reviewer CMS, provenance, review evidence, publish/quarantine/regrade, private assessment delivery | CF-04/05/06 | Content/backend |
| CF-14 | Learner pilot, keyboard/screen-reader/mobile sessions, export/delete and recovery drill; fix all observed P0 issues | CF-11/12/13 | Product/QA/security |
| CF-15 | Expand to complete MVP brief and target bank counts without duplicate/low-quality padding; stage quality gates | CF-14 | Content/product |

Every issue result must include positive and negative acceptance tests, changed files, exact commit, known limitations and launch flag. CF-11 is the acceptance centerpiece, not optional polish. No CF item is marked done solely because a document exists.
