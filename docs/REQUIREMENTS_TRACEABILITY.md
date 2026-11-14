# Requirements Traceability

Basis: owner's attached Vietnamese brief with 39 numbered sections, plus explicit Supabase storage and Vercel hosting instruction. No official/public research overrides those product requirements. Full source was reviewed; below is a mapping, not a claim the features are implemented.

| Brief section | Preserved requirement | Design / implementation stage |
|---|---|---|
| 1 | Learning+playground+adaptive+assessment+coach+analytics; general engine, not VinUni-only | PRODUCT_VISION; F1–F6 |
| 2 | Diagnose→Improve loop; personal skill graph | SKILL_GRAPH, ADAPTIVE_LEARNING; F2–F4 |
| 3 | Quick 15–30m/full 60–120m; ten skill groups; varied item types; breakdown | ASSESSMENT_ENGINE; F2/F5 |
| 4 | Adaptive next item, confidence/prerequisites; future IRT/BKT | ADAPTIVE_LEARNING; F2/F7 |
| 5 | Short interactive lessons, learn by doing | UX_SPEC, CONTENT_MODEL; F3 |
| 6 | Python/SQL first, editor/test/output; isolated runtime | CODING_SANDBOX; F3 |
| 7 | Synthetic SQL database, deterministic result comparison | CODING_SANDBOX; F3 |
| 8 | Fix-the-Bug and misconception history | CONTENT_MODEL, ADAPTIVE_LEARNING; F4/F6 |
| 9 | Timer/autosave/flags/random pool and six modes | ASSESSMENT_ENGINE, UX_SPEC; F5/F6 |
| 10 | AI Practical stages 0–11, internal readiness disclaimer | EXAM_TRACK_AI_PRACTICAL; F6 |
| 11 | Customer support/invoice/agent business cases | EXAM_TRACK_AI_PRACTICAL; F6/F7 |
| 12 | Graduated AI hints and skill-aware explanation | AI_TUTOR; F4 |
| 13 | Learning vs exam integrity, no invasive surveillance | SECURITY, PRIVACY; F5 |
| 14 | Templates/parameters/datasets; AI validation/review before publish | CONTENT_MODEL; F5/F6 |
| 15 | Difficulty 1–10 and empirical calibration | CONTENT_MODEL, ADAPTIVE_LEARNING; F6/F7 |
| 16 | Actionable dashboard, not meaningless charts | UX_SPEC; F4 |
| 17 | Mistake notebook, 1/3/7/14/30-day review | ADAPTIVE_LEARNING; F4 |
| 18 | Extensible learning paths incl. Python/SQL/Data/AI/Backend/interview | DATA_MODEL, SKILL_GRAPH; F6/F8 |
| 19 | Levels based on mastery, not XP | ADAPTIVE_LEARNING; job-ready claims gated |
| 20 | Optional gamification subordinate to learning | PRODUCT_VISION; later optional |
| 21 | Mobile-first lessons/quiz/dashboard, desktop-friendly IDE, light/dark | UX_SPEC; every web phase |
| 22 | Admin CMS, versioned bank, historical results unchanged | CONTENT_MODEL; F5 |
| 23 | Named entities and ERD | DATA_MODEL; staged migrations |
| 24 | Activation/accuracy/drop-off/skill gains/retention with minimization | METRICS_AND_COST; F4–F7 |
| 25 | Maintainable architecture, provider abstraction, no overengineering | ARCHITECTURE, ADRs; F0 onward |
| 26 | Auth/RBAC/rates/injection/isolation/secrets/audit/PII | SECURITY, RED_TEAM; all release gates |
| 27 | Research nine named platforms without cloning | RESEARCH; desk review complete, hands-on gaps explicit |
| 28 | Integrated learning-assessment-real-world-AI | PRODUCT_VISION; F4/F6 |
| 29 | All named MVP modules retained | ROADMAP F6; slice not renamed MVP |
| 30 | Target 100/150/150/100/75/50/25 plus 10 projects/5 mocks; quality first | CONTENT_MODEL; staged expansion, not yet created |
| 31 | Unit/integration/E2E/content/output/sandbox/security tests | TEST_STRATEGY; actual jobs added with capabilities |
| 32 | lint/typecheck/tests/build/security; no merge on fail | GOVERNANCE; config plus separate admin activation |
| 33 | All 15 requested README/AGENTS/docs files | INDEX and repository paths |
| 34 | Phased roadmap | ROADMAP |
| 35 | Autonomous implementation decisions, ask only consequential blockers | AGENTS |
| 36 | FACT / INFERENCE / PRACTICE CONTENT | RESEARCH, EXAM_TRACK_AI_PRACTICAL |
| 37 | Quantitative evidence of improvement | METRICS_AND_COST; efficacy not yet proven |
| 38 | Research→definition→taxonomy→assessment→architecture→UX→roadmap→foundation→slice | This foundation and CF-01..15 |
| 39 | No fake demo; CODE+TEST+RUNNING FLOW | RELEASE_GATES; no MVP completion claim |

Initial scope assumptions: Vietnamese-first, closed adult pilot pending policy, PostgreSQL SQL dialect, single learner tenancy with future cohorts, no paid provider activation without approval. More limited early delivery is a staged rollout, not deletion of requirements.
