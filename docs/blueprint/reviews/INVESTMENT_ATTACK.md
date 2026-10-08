# Independent investment/product attack on the blueprint

Date: **2026-10-07**, Asia/Bangkok. Independent pass; no operations-review output was read. Reviewed the blueprint README, HOSTING_DECISION, FEATURES_AND_SCREENS, SYSTEM_DESIGN, OPERATIONS_AND_RELEASE and model.json, plus canonical PRODUCT_THESIS, VALIDATION_PLAN v2, DECISION_MEMO, UNIT_ECONOMICS and working rules. This review targets the specifications. **The prototype was not tested**, and no simulated screen is treated as a working product. No customer contact, payment, deployment or provider-account inspection was performed. A live issue read through the available GitHub CLI failed because that CLI session is not authenticated; the review does not assert current issue status from that failed read.

**FACT-doc** means directly stated in the reviewed repository documents, not independently established market evidence. **INFERENCE** is reasoning from those statements. **HYPOTHESIS** is a testable failure mechanism or proposed threshold. No fresh market facts are necessary for this pass, so no new vendor price or quota is claimed beyond the blueprint's cited assumptions. All dollar calculations below are USD scenarios, not actual invoices or customer results.

## Committee decision

**STOP investment in S2 now. Retain only the bounded static/manual falsification experiment after its existing prerequisites.** A cheap hosting selection cannot resolve the absence of paid demand, incremental learning value, affordable distribution or a competent content reviewer. The decisive unresolved question remains whether anybody benefits enough from the two exercises to pay $49 when the alternatives include their existing agent and a free checklist.

The strongest new objection is economic: the minimum manual-work trigger does not by itself support the specified app. At the threshold, new recurring cash and operations can consume most of the labour savings before construction, maintenance and account support. For a cash-constrained founder, even positive shadow-labour ROI can make actual runway worse. The attractive S2 journey also risks selling convenience and completeness that the manual experiment does not provide.

Severity here applies to the dependent decision. A CRITICAL finding blocks purchase, release or S2 commitment as specified; it does not prohibit completing this requested design review. Every finding needs an explicit reconciliation action. Do not edit this raw attack to make the later decision look unanimous.

## BI-01 — The automation threshold can finance only eight build hours

**CRITICAL · FACT-doc:** S2 requires a manual bottleneck above two hours/week for two weeks and payback within ninety days. The managed scenario is $100/month cash plus two hours of infrastructure operations at $30/hour. The model contains host bills but no implementation-cost or incremental-payback input.

**INFERENCE:** take a conservative four-week month and a bottleneck just above the two-hour threshold. Even if automation eliminates all eight hours, it saves approximately $240/month in shadow labour. Subtract $100 recurring cash and $60 operations: about **$80/month** remains before new account/customer support, security work, merchant integration, defects or migration. Ninety days generates approximately $240, funding only **eight implementation hours at $30/hour**. The selected S2 specifies ten data tables/domains, authentication, commerce, protected delivery, refunds, privacy and an operations UI; no evidence shows that its full build/release burden fits that allowance. The two-week observation can also be a transient fulfilment spike.

**Cheapest action:** cost the specific repeated task and a narrow alternative such as merchant delivery or a saved manual template. Add the static/manual baseline, actual removable minutes, remaining minutes, build/rework hours, cash setup cost and ongoing operations to the payback calculation. Do not count an hour as saved if the same reconciliation still happens elsewhere.

**Kill condition:** do not build S2 if measured savings minus all incremental recurring costs are nonpositive, or if fully loaded one-time implementation cost cannot be recovered inside ninety days at actual volume. Failing this test is not permission to assume more future sales.

## BI-02 — Positive economic ROI can still exhaust scarce cash

**CRITICAL · FACT-doc:** S0/S1 introduce no app-hosting commitment. S2 plans $100/month before tax, FX and merchant costs. Preorder proceeds must remain refundable. The owner explicitly has very limited capital, while the actual available discretionary cash is unknown.

**INFERENCE:** eliminating unpaid founder hours does not deposit money into a bank account. The plan could rationally value the hours at $30 while being unable to afford the recurring invoice. A ninety-day labour-payback result can therefore approve a change that reduces runway. The old $500 experiment ceiling is not a dedicated S2 cash reserve, and existing subscriptions/bills have not been inspected.

**Cheapest action:** require a separate cash-only view: accessible unrestricted funds, existing unavoidable bills, refundable liabilities, payment holdbacks when applicable, one-time setup cash and ninety days of incremental invoice exposure. Count increased sales from freed time only after observing them. Staying manual needs no migration.

**Kill condition:** no new recurring service if its ninety-day cash obligation cannot be covered without customer refund liabilities or speculative receipts, even when shadow-labour ROI appears positive. If a safe delivery/refund route itself needs unavailable cash, pause new orders.

## BI-03 — Comparing managed hosting with VMs can anchor the wrong decision

**HIGH · FACT-doc:** model.json compares managed, VM-replacement and VM-added configurations. The actually selected static/manual arrangement appears only as a zero-recurring-infrastructure field, with no delivery, merchant, support or founder-time scenario.

**INFERENCE:** the detailed comparison makes the managed stack look like the natural winner while the most consequential option — never building the app — receives no comparable economic model. A $5.60 monthly VM saving is immaterial beside a $100 service bill that might never be necessary. Neither managed nor VM is the appropriate baseline for two privately delivered labs.

**Cheapest action:** put static/manual and an existing eligible merchant's delivery arrangement beside S2, including actual recurring fixed fees, per-order fees and minutes per order. Use a named current manual bottleneck, not a generic infrastructure benchmark. Leave unknown prices explicitly unknown until a real account is eligible.

**Kill condition:** reject the app if a simpler delivery arrangement meets the measured job at lower ninety-day total cost and acceptable cash exposure. Choosing Vercel over a VM does not satisfy this test.

## BI-04 — The prototype can validate the wrong thing

**HIGH · FACT-doc:** the disconnected design depicts S2 library, order, result, debrief and operations screens, while current delivery is S0/S1 and validation has not started. The specification requires a permanent simulation banner and forbids treating UI events as payments or learning.

**HYPOTHESIS:** even labelled simulation can create enthusiasm for an integrated learning portal. A respondent may value polished access, immediate feedback, dependable accounts and instant delivery that the manual offer does not include. Comparing the appeal of that imagined experience with purchase of a delayed private bundle confounds the actual offer. Internal sunk-cost attachment can also turn screen coverage into a perceived commitment to implementation.

**Cheapest action:** separate design-usability sessions from fixed-offer demand cohorts. The paid offer must describe the experience actually deliverable at the test date, including manual timing and support boundaries. Record prototype exposure; do not silently mix exposed buyers with the untouched G3 cohort.

**Kill condition:** if buyers only want the app depicted in the mockup and decline the deliverable manual pack, the pack has failed its gate. Do not build the app to reinterpret that failure as validation. Prototype clicks, positive comments and synthetic states never satisfy G0, G2, G3 or G4.

## BI-05 — Checkout asks for an account before earning the sale

**HIGH · FACT-doc:** the S2 journey is offer → email OTP → order review → merchant checkout. Authentication is justified by later automated entitlements/history, not by an observed need before payment.

**HYPOTHESIS:** for a two-lab purchase, an extra email round trip can create delay, missing-message support, corporate-mail problems and abandonment before the buyer sees the final merchant terms. It also introduces a new party handling the buyer's identity while the merchant may already provide receipts and delivery. A working auth flow would not establish that the step belongs in the conversion path.

**Cheapest action:** prefer the existing eligible merchant's supported purchase/delivery flow; do not invent a second identity ceremony unless a measured entitlement problem requires it. Review the actual guest-purchase/account-claim options when a merchant is selected rather than assuming support. Prototype testing should include inability or unwillingness to use OTP.

**Kill condition:** remove pre-purchase app authentication if it adds measurable lost purchases or support without solving a demonstrated control requirement. If no safe simple purchase path exists at the budget, stay manual or pause instead of building account recovery infrastructure.

## BI-06 — Merchant and private delivery are still unnamed critical dependencies

**CRITICAL · FACT-doc:** the blueprint repeatedly relies on an already eligible merchant and existing private delivery channel. Actual availability, fees and refund handling remain unresolved. S1 requires named-recipient or merchant access controls, immutable version records and an off-provider backup.

**INFERENCE:** $0 static hosting does not make this an operationally complete low-cash plan. Merchant onboarding, settlement timing, refund execution, per-order fixed fees, file-access support and independent review may dominate the first five orders. A specific receipt/download screen cannot substitute for a usable account and an end-to-end delivery/refund check.

**Cheapest action:** resolve one real permitted merchant route and one real private delivery mechanism under P0 feasibility, including their actual account costs, recipient access and a synthetic restoration/refund rehearsal where permitted. Keep the payment CTA absent until the canonical prerequisites are met. This finding does not authorize any signup, purchase or charge.

**Kill condition:** if safe collection, delivery and full refund cannot operate inside the P0 cash/time cap and promised schedule, pause payment collection. Do not use a public paid bundle, unrestricted hidden link, optimistic checkout return or invented payment success to preserve the zero-cost story.

## BI-07 — The product's valuable part is the part the screens do not provide

**CRITICAL · FACT-doc:** the offer is a $49 finite pack. The app does not provide an AI tutor, individualized expert review, trusted credential or hiring evidence. Practice summaries are optional and self-reported; explanations are authored ahead of time. WTP, incremental value and competent content review remain unknown.

**INFERENCE:** accounts, a library and progress screens mainly package access. They cannot repair an exercise that is obvious, ambiguous or solvable by an existing agent without learning. The buyer may actually want contextual feedback on their reasoning; adding that would increase the founder support burden and change the tested offer. Raising the price from the earlier draft to cover content costs is an economic hypothesis, not evidence that perceived value rose with it.

**Cheapest action:** spend the next evidence budget on the fixed, accurately described offer and the bounded independent paper/content feasibility review already required. Keep the counterfactual agent/checklist and the v2 learning veto intact. Test the actual feedback promise, including what a buyer receives when their alternative solution is valid.

**Kill condition:** stop the learning-pack thesis if qualified buyers will not pay $49 or the fixed v2 incremental-value criteria fail. Do not add a tutor, expert feedback subscription or certificate to convert that failed thesis into a different offer without a new decision and budget.

## BI-08 — Local execution may cost more attention than the lesson earns

**HIGH · FACT-doc:** the learner must handle a supported Python runtime, local files, optional coding agent, checks and reflection. Corporate-device restrictions and unsupported runtime are enumerated screen states. No cloud runner or general installer is planned.

**HYPOTHESIS:** a smooth lab-guide screen can hide the expensive boundary where the buyer leaves the site and configures their machine. Setup, checking trust, opening the correct folder and returning a summary may compete with a 30–45 minute learning task. Some qualified buyers already have Python but cannot run unfamiliar bundles on their work machine. BYO inference cost and permission decisions remain buyer costs.

**Cheapest action:** use the actual G2 bundle and supported environment to measure first meaningful local check, support and abandonment. Compare the cheapest static review form if the current protocol's local-failure branch is triggered; do not require a technical integration to test reasoning. Disclose exact supported environments and total effort before purchase.

**Kill condition:** follow G2's bounded correction/fallback/stop rule. If enough value requires a broader installer matrix, live setup rescue or a hosted runner outside the margin, kill this delivery mode. A prototype navigation pass cannot override setup failures.

## BI-09 — Research staging can turn the paid product into unpaid study labour

**HIGH · FACT-doc:** the S1 journey includes baseline before practice, reflection, staged debrief, LAB-B and delayed probes. Research opt-out must preserve purchased access. G4 correctness/gain counts depend on unaided consented probes and observed reasoning, not merely buying the pack.

**HYPOTHESIS:** the customer may have paid to learn on their schedule, then encounter founder timing, forms and assessments that primarily serve the experiment. If release of explanations or the second lab implicitly waits for research participation, the buyer experiences a different bargain. Refusal to complete a study may indicate research burden rather than absence of educational value, although it still cannot be excluded from the locked protocol to save the gate.

**Cheapest action:** specify an equally usable nonparticipant fulfilment path and the exact delivery/debrief timing before charging. Separate paid access from study consent in copy and the private checklist. No new workflow service is required; staged manual delivery needs clear owner rules and a time log.

**Kill condition:** do not launch an offer that makes paid access contingent on optional research participation. If the existing protocol cannot reach valid measurement within consent, workload and cash caps, report inconclusive/failed evidence under that protocol and pause; do not coerce participation or reinterpret missing outcomes as success.

## BI-10 — The proposed two-hour operations budget may count servers but omit running the business

**HIGH · FACT-doc:** the S2 estimate assumes two infrastructure hours/month. The runbook separately calls for daily attention to order failures, delivery, refunds, content quarantine, quota and invoices; periodic security/dependency work; backups and restoration; credentials and merchant reconciliation.

**INFERENCE:** the docs label operations effort a hypothesis, but the cost scenario is easy to read as a complete run-rate. Daily operations only ten minutes per working day would add about 3.3 hours/month. That is an illustration, not an assertion of actual load. Ten minutes of per-buyer support cannot also pay for every fixed reconciliation/restoration task. Conversely, charging the same order handling to CAC, support and infrastructure would exaggerate cost. The current broad buckets leave both omissions and duplication possible.

**Cheapest action:** create a small time ledger separating one-time setup, per-order delivery/support, fixed infrastructure/recovery, content upkeep, research and acquisition. Record each action once. During manual delivery, learn which recurring tasks actually exist before adopting an S2 monthly allowance.

**Kill condition:** if measured remaining operations plus new app obligations consume the automation savings or breach first-order economics, stop the app. Do not make unpaid evening availability the reconciliation plan or turn a small pilot into an unsupported service promise.

## BI-11 — Screens and schemas introduce obligations without demonstrated buyer benefit

**HIGH · FACT-doc:** S2 covers nine screen categories, twelve features and ten conceptual data tables/domains. Optional practice history, identity, privacy exports/deletion, operations auditing and staged debrief access are designed even though the current sale is two files plus authored explanation.

**INFERENCE:** each stored practice state creates authorization, retention, support and migration work. The user can already keep a local result. A two-item library does not need progress synchronization unless losing that state causes a measured problem. Security requirements cannot simply be deleted once the data is stored, so the cheapest intervention is often to avoid owning it.

**Cheapest action:** require a named measured bottleneck and positive incremental ROI for each automated capability, not just the app as a whole. If only entitlement delivery hurts, automate only that with an existing service if feasible. Delete optional history/profiles/results collection before designing their recovery or export surfaces.

**Kill condition:** no implementation ticket for a screen/table solely because it appears in the blueprint. If no user need or operational savings can be demonstrated for a stored state, remove it from the executable scope. A polished comprehensive plan is not evidence for comprehensive implementation.

## BI-12 — Free hosting is a price, not a business continuity plan

**MEDIUM · FACT-doc:** the blueprint recommends plain static Pages as a publication candidate and records free-service change/termination risk. No account was inspected or resource provisioned; the current prototype is local. Actual existing hosting/provider bills are unknown.

**INFERENCE:** “current new recurring infrastructure = 0” is a statement about the proposed design, not verified total spend. Static hosting can fail, links can move and a provider account can become inaccessible. Choosing a free runtime later to save a modest invoice can add compatibility work far beyond the saving. None of this establishes that a paid host is required today.

**Cheapest action:** retain the deployable static folder and a manual contact/delivery route; record the actual account/plan and cost before publication. Reuse an eligible existing paid service only after checking it, not from an old issue. Do not upgrade a free host to support speculative backend features.

**Kill condition:** keep publication local/manual if the real account or permitted plan cannot be established within the P0 budget. Reject a future free-stack migration when its measured setup/maintenance cost exceeds the invoice it would avoid within the actual decision window.

## BI-13 — The supported experience has no explicit lifetime beyond a finite purchase

**HIGH · FACT-doc:** the canonical pack includes a thirty-day content-error support window. The screens depict repeat access to library, debrief, privacy requests and orders. Content maintenance is capped at four hours/month, while no future sales volume or recurring subscription is validated.

**HYPOTHESIS:** buyers may interpret a persistent portal as ongoing compatibility, indefinite download access or continual corrections. Maintaining old runtimes and accounts for a small installed base can cost more than the original one-time revenue. Conversely, closing a portal without clear terms can create dissatisfaction and support even if the files were downloadable.

**Cheapest action:** describe the finite deliverable, exact delivery/support period, supported version and access expectations in the real offer. Give the buyer a durable permitted copy of the purchased material and distinguish that from indefinite hosted access. Do not imply lifetime updates or add a subscription to finance a promise that was never costed.

**Kill condition:** reject any persistent-service promise whose liability cannot be supported by the one-time price and measured maintenance budget. If customers require such a promise to pay, the finite-pack thesis has not validated.

## BI-14 — Planning may become the cheapest-looking way to postpone the difficult experiment

**HIGH · FACT-doc:** the new blueprint/prototype is authorized design work. It records that planning effort is separate sunk cost and not hidden in future CAC. It does not show the actual cumulative design hours or a stop rule for further design; customer validation remains NOT_STARTED.

**INFERENCE:** excluding historical research from recurring CAC is correct accounting, but does not make additional design free or justify unlimited elaboration. Further screens, implementation alternatives and schemas can create a feeling of progress while the unknown reviewer, merchant and paying customer remain unchanged. A very small team can exhaust attention before cash.

**Cheapest action:** finish this requested review, record actual design effort as its own category and freeze the blueprint as a conditional reference. The next work should close one executable P0 evidence gap, not enlarge S2. Reopen architecture only when observed delivery or demand changes a decision.

**Kill condition:** stop further platform design if another design iteration cannot state which current evidence decision it will change. No new service, framework comparison or speculative implementation backlog simply because the prototype now exists.

## BI-15 — Unresolved demand still dominates all cost optimizations

**CRITICAL · FACT-doc:** validation is NOT_STARTED, payments/customer counts remain unknown, the product has no demonstrated moat, and first-order distribution/CAC has not been observed. The current protocol deliberately requires personal full-price purchases and comparison with an agent/checklist workaround.

**INFERENCE:** reducing hosting from $100 to $0 does not solve a negative return on content creation, recruitment, support and independent review. Even a technically zero-marginal-cost download can lose money if few qualified engineers pay or if every buyer needs persuasion. Narrow scope can reduce the cost of discovering this; it cannot transform that uncertainty into a likely business. Team clinics are a separate sales and delivery job, not an automatic rescue for a failed consumer funnel.

**Cheapest action:** preserve the locked $49 offer, full buyer/failure denominators, self-funded cohort separation, labour-inclusive CAC and G0/G3/G4 vetoes. Use the blueprint solely to explain what would happen if evidence earns the next step. Do not claim a founder income or compounding advantage from break-even arithmetic.

**Kill condition:** obey the canonical STOP/PAUSE outcomes when demand, incremental value, sample recruitment or economics fail. Do not interpret lower hosting cost, beautiful UI, free users or manager compliments as counter-evidence. A two-lab product that cannot pass these gates should not become a platform.

## Strongest combined case for not building

CodeForge can spend no money on hosting and still lose the founder's time. It can sell five packs and still owe more instructional work than those receipts finance. It can deliver a smooth portal and still teach no more than the agent the learner already owns. It can shift execution to the learner and then repay the saving through setup support. It can improve measurement validity and make the experience too burdensome for a paying customer. It can avoid those burdens and then possess no defensible evidence that its product works. Finally, it can automate two weekly hours, add cash invoices and security obligations, and discover that almost no economic capacity remains to pay for construction.

The proposed architecture does not remove these conflicts. They are reasons to refuse S2 now and buy only the cheapest valid evidence. If the evidence fails, the desired outcome is a documented stop with preserved cash and time, not a smaller VM or another screen.
