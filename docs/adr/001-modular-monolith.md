# ADR-001 — Next.js modular monolith, Supabase, Vercel

Status: accepted design, 2026-10-02. Context: user mandates Supabase/Vercel and delegates FE/BE; product needs rapid iteration across auth/content/assessment with a small initial operating footprint.

Decision: Next.js App Router + React/TypeScript, server services by domain, Supabase Postgres/Auth/Storage and Vercel deployment. Domain library stays framework-independent. Separate only untrusted execution and any durable dispatch infrastructure genuinely required.

Rejected initially: Next + separate FastAPI/NestJS without measured need; microservices; default Redis. Benefits: one application release and shared contracts. Costs: maintain strict server/client imports, auth cache behavior and request limits; prevent domain logic from becoming route-handler spaghetti.

Revisit when measured workload, staffing boundaries or independent scaling requirements justify another service. Foundation contains domain code only; accepting this ADR does not mean web/auth deployed.
