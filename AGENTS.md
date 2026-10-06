# AGENTS — operating contract

## Mission and authority

Put independent learner capability before feature count, engagement tricks or attractive dashboards. User mandate: Supabase data/auth/storage, Vercel web hosting; implementation decisions may be made autonomously. Ask only for external credentials, new cost approval, irreversible production actions, unresolved business/legal policy or contradictory requirements. Never request a token in source code, logs, issues or chat; use the provider's secure secret settings.

## Required workflow

Read README, docs/INDEX.md, docs/ROADMAP.md and the relevant issue before editing. One issue and one reviewable vertical increment per branch; no force push or direct feature push to main. Record an ADR for trust-boundary, scoring, schema or provider changes. Keep factual research separate from inference and original practice content. Do not silently shrink the full MVP to the initial slice.

For each PR, perform these distinct passes: learner/UX, pedagogy/assessment, engineering, security/privacy, QA/reliability, content integrity and cost. These are structured self-review perspectives, NOT independent human approvals. Include an adversarial counterexample and an automated regression test where executable code exists.

## Non-negotiable invariants

- Never execute learner code in Next.js, a Supabase database, Edge Function, CI runner or host process. Test fixtures may contain instructor-authored code; never run submitted untrusted code outside a disposable sandbox.
- Browser execution and client scores are untrusted. Only authoritative grading creates mastery evidence.
- Hidden tests, keys and answer rubrics never enter learner DTOs, frontend bundles or a public repository for confidential assessment items.
- RLS on every exposed learner table. Do not use service-role credentials as a shortcut around authorization. Never put privileged credentials in NEXT_PUBLIC_*.
- Exam deadline and entitlement are server-owned. AI/hint denial is a server control, not merely a hidden button.
- Idempotency, item version pinning and append-only evidence are required for graded submissions.
- Unknown skill is not zero skill. Do not infer job readiness or admission probability from a handful of questions.
- No self-published AI-generated content; deterministic validation plus accountable content review is mandatory.
- No fake dashboards, nonfunctional buttons, invented CI results or claims that design reviews equal pentests.

## Definition of done

Code + tests + observed running flow for the changed feature, including error/empty/offline/permission states. CI passes on the exact head SHA; schema/contract/docs and source provenance are updated. Accessibility keyboard checks and data minimization are part of acceptance. No failing or skipped required checks. Never auto-approve your own work; leave required human approvals and admin-only activation clearly outstanding.

## Repository conventions

English identifiers/code; Vietnamese learner copy and primary product documentation. UTC persisted timestamps; learner timezone used only for display/review scheduling. Small domain functions independent of Next/Supabase. Explicit error outcomes rather than silent fallbacks. Feature flags default off until associated release gates pass. Do not add Redis, a second API framework, microservices or paid telemetry without a measured need and an ADR.
