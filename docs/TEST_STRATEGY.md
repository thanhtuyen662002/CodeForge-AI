# Test Strategy

## Layers and honest coverage

Foundation: pure TypeScript domain tests, skill/content contract validation, repository policy/lint checks, typecheck/build. These run without credentials and do not prove Supabase, Next UI, AI accuracy or sandbox security. Add test infrastructure with each capability, not a dummy command returning success.

Integration: real disposable Supabase migrations and RLS role tests, transaction concurrency/idempotency, private Storage and source/answer separation. E2E: Playwright against a real local/staging app with synthetic accounts; signup/diagnose/learn/submit/review/relogin and negative states. Use test email provider/local mail capture, never production learner email.

Execution: owned disposable provider account, cost budget, bounded adversarial workloads, external observation of egress/cleanup/limits; separate trusted grader tests. Content: reference solutions and deterministic dataset variants with null/duplicates/ties/order/timezone cases. AI: reviewed fixed eval set and model/prompt version, not equality-to-a-single-string tests.

## Required regression catalog

Assistance excluded from mastery; untrusted score excluded; duplicate family cannot farm; insufficient evidence stays unknown/insufficient; multiple sessions/delayed requirement; graph cycle and missing prerequisite rejected; exact deadline boundary; client time ignored; unknown answer ID rejected; multiselect cannot pass by selecting all.

Implementing submission APIs adds same-key/different-body conflict, double submit, webhook replay, stale revision, expired lease, provider outage, user A/B ID swap and score/role tampering. Implementing content adds published immutability and regrade history. Implementing web adds keyboard/mobile/error/offline/accessibility and cache isolation.

## Test evidence

CI report lists exact job/commit and results. A skipped required job is not success. Core build is not web build. No percentage target used to excuse missing security assertions; require invariant coverage plus readable negative tests. For app code, add coverage reporting and review uncovered critical branches before setting sensible floors.

No uncontrolled infinite loops, network probes or hostile code on CI hosts. Adversarial sandbox tests execute only inside the approved isolated provider and stay behind an explicit environment/budget gate. Fork CI never has cloud credentials.
