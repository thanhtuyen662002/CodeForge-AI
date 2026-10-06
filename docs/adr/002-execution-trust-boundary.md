# ADR-002 — browser preview is not authoritative grading

Status: accepted boundary; provider selection conditional on spike, 2026-10-02.

Decision: isolated-origin browser Pyodide/PGlite for practice preview, disposable provider compute for authoritative code/SQL, and a trusted external comparator holding expected values. Preferred candidate Vercel Sandbox; Judge0/Piston considered alternatives. Web/BFF and Supabase app DB never execute arbitrary learner programs.

Rationale: client-controlled results are forgeable; guest code can inspect its own files, so a microVM alone cannot protect evaluator secrets inside the same guest. Keep production secrets and expected answers outside submission runtime; explicit denied egress and resource limits.

Tradeoff: additional startup latency, orchestration and usage cost. Durable job/retry/cleanup controls are mandatory. Feature remains disabled until real-provider isolation and unit-cost evidence pass G3.
