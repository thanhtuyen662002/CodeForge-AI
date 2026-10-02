# Release Gates

All unproven gates are OPEN. A design doc is evidence of a design decision, not evidence the gate passed.

| Gate | Required evidence | Enables |
|---|---|---|
| G0 Repository governance | CI exact head green, ruleset read-back active, failed merge blocked, reviewer available | Safe main workflow |
| G1 Identity/data isolation | Real Supabase auth + migrations + anon/A/B/staff API/RLS/storage tests; safe private cache | Account-bearing pilot |
| G2 Assessment integrity | Server deadlines, immutable versions, atomic idempotency/revision, safe DTOs, deterministic grading | Diagnostic and exam results |
| G3 Execution isolation | Owned-provider adversarial report, host-side grader, limits/egress/cleanup proven, quota | Server-graded Python/SQL |
| G4 Tutor safety | Consent, server exam denial, hint/eval suite, spend controls, static fallback | External AI tutor |
| G5 Learner flow | Observed real signup→diagnostic→lesson→code→grade→explanation→persistent profile; no fake state | Vertical slice complete |
| G6 Content/UX | Reviewed content coverage, mobile/keyboard/screen-reader flows, correction/appeal, pilot findings resolved | Full MVP beta |
| G7 Operational/privacy | Owner-approved age/privacy policy, deletion/export, rollback/restore drill, budget alerts and on-call ownership | Public production release |

Launch flags default false: AUTH_PUBLIC_ENABLED, GRADED_EXECUTION_ENABLED, EXAM_ENABLED, AI_TUTOR_ENABLED. These are logical flag names to implement server-side, not existing environment functionality. Never expose a client flag as authorization. A restricted pilot may omit capabilities, but its release notes must say what is unavailable.
