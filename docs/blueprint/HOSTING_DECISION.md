# Hosting decision: conserve cash first

Checked 2026-10-07. **FACT** means the vendor page says the stated thing; actual account eligibility, region, tax, usage and invoice remain unverified. **HYPOTHESIS** covers architecture workload, labour and budget estimates. No resource was provisioned.

## Source ledger

| ID | Official source, checked 2026-10-07 | Limited FACT |
|---|---|---|
| H01 | [Cloudflare Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/), [limits](https://developers.cloudflare.com/pages/platform/limits/), [product](https://www.cloudflare.com/products/pages/) | Static requests that do not invoke Functions are free; Free plan has500builds/month,25MiB/file. Functions use Workers quotas. Product offers a free start. |
| H02 | [Cloudflare agreement](https://www.cloudflare.com/terms/) | General self-serve agreement covers free services; free service can change/terminate. No Vercel-style personal-only clause was identified in the reviewed Pages material. This is a limited observation, not a legal guarantee; verify account terms before actual publication. |
| H03 | [Vercel pricing](https://vercel.com/pricing), [Hobby](https://vercel.com/docs/plans/hobby) | Pro$20/month with included usage credit; extra usage/add-ons/seats can cost more. Hobby is personal/non-commercial. Do not put the commercial pilot on Hobby to claim zero costs. |
| H04 | [Supabase pricing](https://supabase.com/pricing), [billing](https://supabase.com/docs/guides/platform/billing-faq) | Free exists; Pro$25/month includes compute credit for one Micro; additional Micro project about$10/month. Free limits/pausing differ from Pro. |
| H05 | [Supabase cost control](https://supabase.com/docs/guides/platform/cost-control) | Spend Cap excludes compute, branching compute and several opted-in add-ons; it is not a whole-invoice cash ceiling. |
| H06 | [Supabase backups](https://supabase.com/docs/guides/platform/backups) | Database backups exclude Storage objects. DB recovery alone cannot restore deleted paid bundles. |
| H07 | [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp) | Built-in SMTP is for testing, team addresses only, currently2messages/hour; custom SMTP needed for ordinary production email auth. |
| H08 | [Resend pricing](https://resend.com/pricing) | Free transactional tier3,000emails/month and100/day; Pro$20/month for50,000 then usage charges. Domains/setup/actual deliverability still required. |
| H09 | [DigitalOcean Droplets](https://www.digitalocean.com/pricing/droplets), [backups](https://docs.digitalocean.com/products/backups/details/pricing/) | Basic2GiB/1vCPU VM$12/month; weekly percentage backup adds20%, daily30%. The$4entry tier is512MiB, not comparable capacity. Region availability/tax/extras require checkout. |
| H10 | [Hetzner June2026 prices](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/) | Singapore CPX12 listed$17.99/month excludingIPv4 in the updated table. Cheap EU headlines cannot be assumed for Southeast Asia. No VM chosen. |
| H11 | [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) | Workers Paid minimum$5/month plus overages; free request/CPU limits apply. This is not a flat unlimited application/server price. |
| H12 | [Cloudflare Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) | Current guide recommends vinext; it is beta and requires compatibility checks. Do not rely on older OpenNext search snippets as current production compatibility proof. |
| H13 | [Vercel regions](https://vercel.com/docs/functions/configuring-functions/region), [limits](https://vercel.com/docs/functions/limitations) | Functions can be placed near the database; default new-project region is US iad1. Generally available Pro max duration800s; larger beta features are not a reason to add long-running jobs. |
| H14 | [Next.js support](https://nextjs.org/support-policy), [Node releases](https://nodejs.org/en/about/previous-releases) | Next16 is Active LTS in observed page; Node24 is LTS, Node26 Current. Select latest secure patch at implementation, not an untested version pin today. |

## Options for this founder

| Option | Cash floor before domain/merchant/usage | What it solves | Main cost/risk | Decision |
|---|---:|---|---|---|
| Existing documents + manual delivery | $0 new infrastructure | P0 interviews/offer, S1 delivery | Founder time, merchant/storage eligibility | **Default now** |
| Cloudflare Pages static + existing eligible merchant/private delivery | $0 hosting under static plan | Public offer/demo/advisory when launch is authorized | No accounts/backend; free-service availability; private files must stay elsewhere | **Cheapest publication candidate** |
| Pages + Supabase Free | $0 provider floor | Synthetic prototype or bounded noncritical metadata | More auth/RLS/backup work; pause/quota; no reason yet | Defer; no real order system just because free |
| Vercel Pro + Supabase Pro | $45 core/month | Conventional full-stack app after automation gate | SMTP/staging/usage/operations are extra | Conditional S2 default for maintainability |
| Pages + small Worker + Supabase Pro | $30 core/month at Workers Paid floor | A small API when static delivery stops being enough | Additional runtime/adapter burden; avoid full Next beta migration | Alternative only with a capped proof |
| VM replaces Vercel + Supabase Pro | $37 core + backup/extras | Node app on controlled server | Patch/TLS/deploy/recovery/security/on-call work | Not justified for current workload |
| VM added to Vercel + Supabase | $57 core + backup/extras | Only a distinct trusted background workload | Three infrastructure providers and duplicate compute | **Reject now** |
| Self-host database on VM | Appears cheaper | All services on one bill | DB restore, auth, security, uptime and founder bus factor | Reject for a tiny team at this stage |

Cloudflare recommendation is for **plain static pages**, not a claim that a future Next.js app drops into the same free plan with no engineering work. No worker, D1, R2, queue or third database is needed in S0. If an existing eligible commercial host is already paid for, reuse it when simpler; current provider bills are unknown.

## Like-for-like optional S2 budget, not a purchase order

HYPOTHESIS: low volume, one developer, one production plus one small synthetic staging database, no hosted AI/execution. USD excludes tax, FX, merchant fees and content/support. The earlier$80 unit-economics scenario was a lean allowance; this **$100 planning envelope** explicitly includes staging and paid-email headroom, not an invoice or new authorization.

| Monthly allowance | Managed Vercel | VM replaces Vercel | VM added to managed |
|---|---:|---:|---:|
| Web/runtime |20|12|32|
| VM weekly backup |0|2.40|2.40|
| Supabase production + staging |35|35|35|
| SMTP budget (Free may suffice) |20|20|20|
| Domain/off-provider asset backup allowance |10|10|10|
| Overage contingency |15|15|15|
| **Cash planning envelope** |**100**|**94.40**|**114.40**|
| Infra operations effort hypothesis |2h|4h|4h|
| At$30/h: cash + infra labour |**160**|**214.40**|**234.40**|

VM replacement saves only$5.60cash in this matched configuration and adds a hypothesized2h/month. These are not observed effort benchmarks. If cash cannot cover even$45core, stay static/manual; do not solve a revenue gap with self-hosting obligations.

Cost equations: managed100 + infra labour60 + content maintenance120 +100freeactives×.55 = $335/month overhead. At v2 pack contribution$39.035 before initial content/CAC:9packs/month. With hypothetical100-sale content allocation$12:13packs; with recurring CAC$10:20packs. Extra illustrative founder income$1,500 raises the latter to108packs/month. Forecast sales cannot pass the economics gate. Do not double-count invoice and shadow labour for the same work.

Cash-first S0/S1 has **no recurring app-hosting commitment**. Optional domain is not required; a real merchant can still impose fixed/variable costs and holdbacks, so$0hosting is not$0business cost. Never spend refundable preorder liability on a VM.

## When to change the choice

### Compare against no app; do not confuse saved time with cash

S0/S1 baseline: $0 new app infrastructure; merchant fixed/per-order fees, private delivery subscription if needed, actual minutes/order and existing bills are **UNKNOWN**, to resolve under issue20. No zero-cost business claim. For a given task compare deleting the step, a saved template or the merchant's delivery, a narrow automation, then S2. Do not count work as eliminated if it reappears as reconciliation/support.

**HYPOTHESIS model:** exact90days/7weeks, three monthly invoice envelopes, $30/hour. At2h/week eliminated and zero remaining manual work: benefit=$771.43. Managed S2 adds3×($100cash+2h×$30)=$480; only$291.43 remains for construction, **9.714 build hours**. Raw investment critique uses twelve weeks (8h build capacity); operations uses thirteen weeks (10h). Both show the same failure; neither is observed demand or savings.

Initial full reference app estimate, not a quotation: **80–140h** including auth/claim/delivery12–20h; commerce/reconciliation16–28h; public/private views12–20h; security/privacy/recovery20–36h; integration/release20–36h. At the80h floor, 90-day net is$771.43−$480−$2,400=**−$2,108.57**. Even optimistic complete task removal requires≈7.47h/week saved at80h build, or12.13h/week at140h, before extra setup cash/new support. The existing>2h trigger only warrants looking at the problem; it never authorizes S2 by itself. Build estimates are uncertain; reject S2 now, not the ROI gate. A narrow merchant/template improvement can be priced separately once a real bottleneck exists; no minimum app scope follows from this design.

Use actual values: `90day_net = 90/7 × (manual_hours_week − remaining_hours_week) × labour_rate − build_hours × labour_rate − setup_cash − 3 × (incremental_cash_month + added_ops_hours_month × labour_rate)`. Require nonnegative result and payback≤90days at observed volume, plus G3/G4 and first-order profit. Avoid double-counting support already in remaining hours. Compare the lower-cost feasible alternative, not only VM versus Vercel.

**Separate cash veto:** unrestricted available cash minus existing unavoidable bills, refundable preorder liability and merchant holdbacks must cover setup cash plus90days incremental invoices without speculative future receipts. Freed unpaid founder hours are not spendable money. Available funds are unknown; therefore no new recurring service is approved. Planning/design effort is separate sunk cost: agent goal wall time will be recorded at completion; human review effort is unknown, not zero. Freeze this blueprint after review; reopen only for new evidence that changes a decision.

S2 requires existing G3/G4/profit/ROI gate. Add a VM only for a named workload that cannot be eliminated or handled by the current services, with measured execution characteristics, cost including ops, least privilege and a tested recovery owner. Examples to investigate later: a trusted batch export beyond limits or measured sustained-load savings. Running arbitrary learner code is a separate high-risk product decision, **not** a VM-sizing task.

Before each upgrade: actual invoices/quotas, region/latency, usage by route and founder time; compare90day total cost. No Kubernetes, Redis, queue or self-hosted Supabase to rescue an unprofitable two-lab product. Read back the historical Supabase project before any reuse, pause or migration; do not presume it is empty/free.
