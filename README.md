# CodeForge AI

**Research/foundation. Decision: BUILD WITH CONDITIONS — a capped demand experiment only.** No deployed product, customer validation, learning efficacy or moat is claimed.

Current thesis: two Python backend practice labs for developers already using coding agents, focused on finding counterexamples, testing an AI-generated change and explaining merge/reject decisions. Proposed price: **$49 for two labs**, unvalidated. Optional BYO agent; local deterministic practice checks; no hiring score or certification.

The next step is **P0: ten working days, ≤20 founder hours and ≤$100**, with 15 interviews and 30 eligible offers. At least 8 concrete incidents and 5 unrelated self-funded full-price buyers are required to invest in content. Merchant/refund feasibility comes before charging. Failure means STOP or PAUSE according to the preregistered protocol; a waitlist does not pass.

- [Founder decision and 90-day plan](docs/DECISION_MEMO.md)
- [Complete strategy index](docs/INDEX.md)
- [System blueprint, hosting choice and adversarial review](docs/blueprint/README.md)
- [Interactive screen prototype — synthetic, local only](docs/blueprint/prototype/index.html)
- [Market sources and checked dates](docs/MARKET_RESEARCH.md)
- [Validation gates / kill criteria](docs/VALIDATION_PLAN.md)
- [Independent red teams and reconciliation](docs/RED_TEAM.md)
- [Current state and executable issue links](docs/PROJECT_STATE.yaml)
- [Repository history and legacy backlog disposition](docs/RECONNAISSANCE.md)

Strategy [PR23](https://github.com/thanhtuyen662002/CodeForge-AI/pull/23) is merged into main. The owner-requested blueprint adds a disconnected design prototype; it does not unlock customer gates. Cheapest current plan: static/manual, no VM or app database; conditional Cloudflare Pages publication, then managed Supabase/Vercel only if evidence and incremental cash/ROI justify automation. Actual merchant/delivery route remains unresolved.

The old broad beginner/data/AI school and its open foundation backlog are on strategy hold. No app, cloud sandbox, AI tutor, leaderboard, season, custom agent integration or production implementation belongs in the planning phase.

Read [AGENTS.md](AGENTS.md) before work. Documentation integrity check: `node scripts/check-planning.mjs`. This check does not establish product correctness or customer demand.
