# AI Tutor

## Learning policy

Tutor explains a misconception and asks a useful next question rather than dumping a solution. Ladder: hint 1 → hint 2 → concept reminder → partial solution → full solution when learner explicitly requests it in learning mode. Do not trap learners indefinitely behind a Socratic script. Every assistance action is logged as assistance; an independent follow-up question is needed for mastery evidence.

Code/SQL outputs are graded deterministically; AI can explain a failure, not decide ground truth. For cases/open answers, AI proposes rubric-aligned observations to a human reviewer and expresses uncertainty. Missing context leads to “chưa đủ thông tin”, not invented evaluation.

## Contract

Adapter: `TutorProvider.generate(safeContext, budget, abortSignal)` returning structured explanation, hintLevel, misconceptionTags and citations to approved lesson blocks. Keep provider/model configurable, including future OpenAI/Anthropic/Google/local adapters; do not include SDKs or credentials for every vendor in the first slice. No paid provider is activated in foundation.

SafeContext contains task public prompt, approved lesson excerpts, sanitized learner code/error, current hint level and minimal skill summary. Never include private tests, expected hidden outputs, other users' records, authentication data or whole profile. Content and code are untrusted data, not executable instructions.

## Enforcement

Auth and session ownership at server. During an active restricted assessment deny tutor access according to server-owned exam policy, including calls made from another tab to the same account. This cannot prevent off-platform assistance; do not claim perfect anti-cheating. No tools that browse arbitrary URLs, run user SQL or access production resources. Retrieval scoped to published approved content with source IDs. Treat prompt injection in datasets/comments as input data; refusal prompt alone is not a boundary.

Sanitize output as text or allowlisted markdown without HTML execution. Stream caps/timeouts/abort propagate upstream; reserve per-user and global token/cost budget transactionally before call and reconcile after. Retry only retryable errors with a tight bound; no multi-provider fan-out by default.

## Degradation

AI unavailable, quota reached or user declines external processing → reviewed static hints and concept links; practice still works. UI must say whether response is AI-generated, show report-incorrect action, and allow disabling tutor. Tutor failure does not deduct score or lose code.

## Evaluation suite before enablement

Vietnamese beginner explanations; progressively helpful hints; no full answer at level 1; admission uncertainty; wrong public example; adversarial code comments; request for secrets/tests; harassment/shaming; prompt injection; cross-user context; active-exam denial; timeout and quota exhaustion. Compare blinded reviewer ratings and independent follow-up performance. Numeric targets must be agreed on pilot evidence, not invented model capability claims.
