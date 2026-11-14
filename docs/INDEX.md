# CodeForge AI — Product, implementation and evidence index

Checked 2026-11-14. Start with [Founder decision](DECISION_MEMO.md), then [current machine state](PROJECT_STATE.yaml) and the [single Lead coordination tracker](https://github.com/thanhtuyen662002/CodeForge-AI/issues/17). This index is a navigation aid, not proof that a design, gate or feature has been implemented.

| Question | Durable source |
|---|---|
| What actually exists? | [Repository reconnaissance](RECONNAISSANCE.md), [API snapshot](research/repository-snapshot.json) |
| What does the market offer? | [Source ledger](MARKET_RESEARCH.md), [competitive landscape](COMPETITIVE_LANDSCAPE.md) |
| Who might pay and why? | [Customer/JTBD analysis](CUSTOMERS.md), [eight competing theses](PRODUCT_THESIS.md) |
| What is the approved product scope? | [39-section requirements traceability](REQUIREMENTS_TRACEABILITY.md), [implementation backlog CF-01–CF-15](IMPLEMENTATION_BACKLOG.md), [owner scope reconciliation PR #28](https://github.com/thanhtuyen662002/CodeForge-AI/pull/28) |
| What are we selling / can it pay? | [Business model](BUSINESS_MODEL.md), [unit economics](UNIT_ECONOMICS.md), [numeric inputs](research/economics-model.json) |
| Can a tiny team maintain it? | [Content strategy](CONTENT_STRATEGY.md), [moat analysis](MOAT.md) |
| What is the cheapest valid test? | [MVP](MVP.md), [frozen prelaunch protocol](VALIDATION_PLAN.md), [draft validation assets](VALIDATION_ASSETS.md) |
| How would it work safely? | [Conditional architecture](ARCHITECTURE.md), [threat model](SECURITY_THREAT_MODEL.md), [release gates G0–G7](RELEASE_GATES.md) |
| Why might it fail? | [32-case premortem](RISK_REGISTER.md), [red-team reconciliation](RED_TEAM.md) |
| Where are the independent attacks? | [Investment committee](reviews/INVESTMENT_RED_TEAM.md), [operations](reviews/OPERATIONS_RED_TEAM.md) |
| What happens next? | [Roadmap](ROADMAP.md), [quality gate](QUALITY_GATE.md), [independent final review](reviews/FINAL_QUALITY_REVIEW.md), [agent instructions](../AGENTS.md) |

## Evidence discipline

The owner-authorized full implementation scope is recorded in PR #28; this PR is still open and must not be treated as merged. Authorization does not mean validation, implementation, deployment or production acceptance has passed. Read [RELEASE_GATES.md](RELEASE_GATES.md) for the evidence required by each gate and verify live GitHub/provider state before changing a status. The detailed architecture, API, data, sandbox, content, privacy, UX and deployment contracts remain on the verified PR #1 head `42b5a6aa678baabf711e1000e9b4127e870aecff`; PR #1 is still open, so those contracts are not represented as merged into main.

FACT = checked observable statement/source, not vendor efficacy validation. INFERENCE = interpretation. HYPOTHESIS = untested customer/economic/architecture assumption. Unknown data stays unknown. Raw critique refers to draft v1$29/24h; reconciled canonical v2 is$49/40h before launch, with no customer exposure yet.
