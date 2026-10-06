# Privacy and learner integrity

This is a proposed product policy, not legal advice or a finding of statutory compliance. Jurisdiction, age eligibility, processing agreements, data locations and official retention periods require owner/legal approval before public collection. Use an adult-only closed pilot assumption until an age/guardian policy is approved; do not collect minors' data under an improvised policy.

## Minimize

Collect auth identifier, chosen display name, locale/timezone, learning goals and necessary learning evidence. Do not require employer, income, exact address, national ID, camera/microphone or biometric data. Diagnostic self-confidence is optional; never infer disability or other sensitive traits. Tab switches are optional low-confidence integrity telemetry, never automated cheating verdicts.

## Inventory and candidate retention

| Data | Purpose | Proposed retention, pending approval |
|---|---|---|
| Profile/auth | Sign in and preferences | Account lifetime + documented deletion process |
| Attempts/evidence | Learning history and appeal | Account lifetime or configurable shorter period; separate PII |
| Raw tutor conversations | Context and quality review | Default 30 days, opt-out where feasible |
| Execution raw outputs | Feedback/debugging | Default 7 days; redact sensitive data |
| Security/admin audit | Incident investigation | Default 90 days with restricted access |
| Aggregates | Product measurement | Only non-identifying aggregates after minimization |

These periods are project proposals, not claims about default Supabase/Vercel/model-provider retention. Provider/backups may have distinct lifecycle and must be documented. No unconditional promise of instant deletion from backups.

## Rights and controls

Consent notice before sending code/content to an external AI provider; reviewed static hints must remain available without AI. Show export/delete controls, verify requester, log deletion job progress and remove private Storage objects/provider state. Shared-device drafts are cleared on logout/account switch and expire. Analytics opt-out when required by approved policy; pseudonymous IDs still treated as personal data where applicable.

Do not log complete requests by default. No learner code in public issues, Git commits, CI artifacts or analytics payloads. Content sources and synthetic fixtures are separate from user-generated submissions.
