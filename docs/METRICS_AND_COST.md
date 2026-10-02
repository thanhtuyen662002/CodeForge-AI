# Metrics and Cost

## North-star and guardrails

Primary learning measure: proportion of active learners completing a new independent transfer task and retaining the skill in a delayed check. Supporting funnel: first meaningful practice, diagnostic completion (separate skipped path), recommended lesson start/finish, unassisted challenge success, mistake remediation and return-to-learn. Denominators and exposure windows must be explicit. Do not optimize minutes online, hint volume or XP as proxies for mastery.

Pilot targets proposed, not measured: at least 80% of observed beginners find and complete the first meaningful action without moderator rescue; zero lost server-acknowledged answers; all users can distinguish unknown skill from low observed score. Small usability sample is not statistical proof of learning effectiveness. Compare before/after with held-out equivalent families; no admission-success prediction claims.

Events: onboarding_started/completed/skipped, diagnostic_started/submitted, answer_saved/conflicted, lesson_started/completed, practice_submitted/graded, hint_requested, independent_check, review_due/completed, content_reported. Carry event_id, schema version and pseudonymous user id; never code, raw prompt, email, hidden answer or sensitive inferred attributes.

## Variable cost model

Monthly variable cost = LLM input_tokens*input_rate + output_tokens*output_rate + sandbox billed CPU/memory/time + database/storage/egress + auth email + logging/monitoring. Rates must be loaded from actual provider account/official pricing when provisioning; none are invented here. Daily active users × sessions/user × runs/session × average billable run cost drives the sandbox estimate. Account quotas/minimum billable units matter more than optimistic execution milliseconds.

Reserve user and global budget atomically before dispatch; bound per-user concurrent runs, retry count, max VM TTL and LLM tokens. Show understandable quota messages. Owner approves daily/monthly spend ceiling before enabling paid adapters. Alert at configurable 50/80/100% reservation+actual spend and stop new paid work at ceiling; running cleanup must remain allowed. Per-instance memory rate limits are insufficient across Vercel instances.

Cost experiment records p50/p95 startup, execution, cleanup success, billing units and error retry amplification. Do not choose a provider on a nominal free tier without validating data policy, isolation, availability and sustainable unit economics.
