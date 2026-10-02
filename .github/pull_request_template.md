## Learner problem and scope

Issue / CF key:
What becomes usable, and what explicitly remains unavailable?

## Changes and adversarial review

Learner/UX:
Pedagogy/assessment:
Security/privacy:
Content correctness:
Reliability/cost:
Counterexample and regression test:

These are self-review perspectives, not independent approvals.

## Evidence

Exact head SHA:
Commands and observed results:
Real running flow / environment (or state why this PR has no app flow):
CI run:
Open release gates / known limitations:

## Checklist

- [ ] No fake data used to imply a completed backend or learner progress.
- [ ] Tests cover failure/permission/concurrency cases relevant to the change.
- [ ] No secrets, real learner data or confidential exam keys committed.
- [ ] Docs, contracts, migration/rollback and content provenance updated as needed.
- [ ] Accessibility/error/empty/offline states reviewed for changed UI.
- [ ] All required CI jobs pass on this exact head; no skipped job called passed.
- [ ] Independent approval and live branch rules verified before merge.
