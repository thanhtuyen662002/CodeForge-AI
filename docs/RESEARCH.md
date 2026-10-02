# Research log — 2026-10-02

Method: desk review of public primary product pages and official technical documentation. No account-based benchmark, learner interviews, security audit or independent verification of marketing performance claims. Observations below are narrow; opportunity/risk is our hypothesis, not an asserted competitor defect. No interface or proprietary exercise is copied.

## Learning and assessment products

| Product / primary source | Publicly described emphasis | Lesson / hypothesis for CodeForge |
|---|---|---|
| LeetCode — https://leetcode.com/discuss/post/2163754/study-plan-75-questions-till-interview-ready/ | Curated technical interview study plans | Provide a clear next action; hypothesis: absolute beginners need a gentler entry than interview preparation alone |
| HackerRank — https://www.hackerrank.com/products/screen | Coding assessments and screening | Borrow explicit test/rubric concepts, not surveillance-first product goals |
| CodeSignal — https://codesignal.com/learn-app/ and https://codesignal.com/cosmo/ | Practice, AI tutor, personalized paths and IDE | AI + adaptive is not a unique differentiator by itself; validate Vietnamese explanations, evidence clarity and continuity |
| Codecademy — https://www.codecademy.com/ | Interactive coding courses and paths | Keep the first code interaction low friction; test transfer to unseen tasks rather than assume completion proves ability |
| DataCamp — https://www.datacamp.com/ | Data/AI learning paths and practice | Integrate realistic dataset work with SQL/Python prerequisites |
| Brilliant — https://brilliant.org/ | Interactive learn-by-doing | Short concept interactions before independent challenge |
| Khan Academy/Khanmigo — https://khanmigo.ai | Guided AI learning support | Hints should support thinking; don't infer any vendor's claimed learning impact applies to us |
| Exercism — https://exercism.org/ | Coding exercises, analysis and mentoring | Actionable code feedback; retain misconception history |
| freeCodeCamp — https://github.com/freeCodeCamp/solana-curriculum | Public project-based curriculum example | Use complete projects for transfer; the main learn page was not text-readable in this review, so detailed feature comparison remains unverified |

Differentiation hypothesis: a Vietnamese-first foundation-to-assessment loop with transparent uncertainty, mistake remediation and real business cases. It must be tested against existing integrated products; no unsupported “first/only/best” claim.

## Official technical sources

- Next.js installation/App Router: https://nextjs.org/docs/app/getting-started/installation and https://nextjs.org/docs . Supports the selected full-stack framework; exact app dependencies will be pinned during web implementation, not inferred from “latest”.
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security . RLS is a database authorization control; privileged roles can bypass it. This motivates user-scoped clients and separate privileged services.
- Supabase SSR: https://supabase.com/docs/guides/auth/server-side/creating-a-client . Server/client auth responsibilities and verified identity must be implemented correctly; a client session is not an authorization proof.
- Vercel Functions: https://vercel.com/docs/functions/limitations . Runtime limits are plan-dependent and change; no hardcoded vendor quota is promised.
- Vercel Sandbox: https://vercel.com/docs/sandbox and https://vercel.com/sandbox . Documents disposable isolated compute and configurable network policies. Runtime/OS details differ across retrieved pages; validate exact SDK/runtime in the spike rather than assuming defaults. Explicit deny-all and no production credentials remain project requirements.
- Pyodide Worker: https://pyodide.org/en/stable/usage/webworker.html . Running Python in a Worker moves work off the UI thread; this alone is not an app-origin security boundary.
- PGlite: https://pglite.dev/docs/ . Browser/WASM Postgres capability is a practice candidate; authoritative runtime parity needs tests.
- Judge0: https://judge0.com/ and Piston: https://github.com/engineer-man/piston . Execution alternatives; source descriptions are not proof that our deployment is secure.
- GitHub rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets . Required PRs/status checks need repository-side activation; committing config is insufficient.
- W3C WCAG 2.2 target reference: https://www.w3.org/TR/WCAG22/ . Accessibility conformance must be evaluated, not inferred from a UI library.

## Program facts

Official source https://vinuni.edu.vn/aithucchien/ states entrance skill groups: logic, basic programming/data, practical situations. That is not evidence for our exact Python/SQL weights, mock duration or pass thresholds. See EXAM_TRACK_AI_PRACTICAL for FACT/INFERENCE/PRACTICE CONTENT separation.

## Research gaps to close

Usability with real beginners and assistive tech; retention/transfer effectiveness; calibrated skill scores; sandbox cost and limits in the actual account; service data-processing/region/retention approvals; licensing of any non-original material. All remain open, tracked as release gates rather than guessed facts.
