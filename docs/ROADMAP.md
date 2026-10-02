# Roadmap — gates, not invented delivery dates

Ownership roles in this document are work responsibilities; staffing and independent reviewers have not been supplied. No promise of a completion date without team capacity and real integration evidence.

| Phase | Deliverable | Exit gate |
|---|---|---|
| F0 Design/foundation | Product/UX, research, red-team, architecture, domain tests, CI and governance config | Reviewable PR; accurate CI report; rule activation tracked separately |
| F1 Secure web foundation | Next.js UI shell, Supabase auth/profile/catalog RLS, migration tests, Vercel staging | Real register/login/logout, A/B isolation, keyboard/mobile auth; separate preview data |
| F2 Diagnostic/evidence | Choice diagnostic, immutable item versions, atomic attempts, meaningful profile | Submit twice once, unknown skills preserved, next lesson from evidence |
| F3 Learning + Python/SQL execution | 3 lessons, reviewed public examples, browser preview, isolated authoritative grader | Real code/query grading, cancellation, sandbox security/cost spike accepted |
| F4 Complete vertical slice | Mistake review, AI tutor with fallback, dashboard evidence and independent follow-up | Register → diagnostic → lesson → challenge → grade → explanation → profile persists after relogin |
| F5 Exam/CMS beta | Timed simulator, full diagnostic types incrementally, author/reviewer workflow | Clock/reload/offline tests, version correction, content publishing tests |
| F6 Full MVP content/tracks | Logic/Python/SQL courses, all MVP modules, AI Practical track, broader question bank | Original brief coverage plus content audit and learner pilot |
| F7 Growth/calibration | Spaced/adaptive refinement, Data/AI/cases, stronger analytics | Holdout evaluation, cost/retention evidence, no spurious readiness claims |
| F8 Production scaling | More tracks/languages, cohorts, IRT/BKT after evidence | Measured bottleneck justifies queue/cache/services; security and reliability review |

Critical path: admin/environment readiness → F1 RLS/auth → F2 state/evidence → F3 isolated execution → F4 end-to-end. Content validation can run alongside F1; AI provider integration only after assistance policy and budget controls. Mobile/keyboard states are part of every phase, not a final polish sprint.

F0 success does not mean F4 or MVP is complete. Never replace missing integrations with fake progress numbers. Do not enable production deployment simply because library unit tests are green.
