# Independent investment committee attack — raw findings

Checked: **2026-10-07**, Asia/Bangkok. Role: adversarial investment/product committee. This is the un-reconciled attack, not an approval memo. The reviewer read the provisional PRODUCT_THESIS, MVP, VALIDATION_PLAN, UNIT_ECONOMICS and ARCHITECTURE only; no other red-team review was read. No interviews, payments or product tests were performed.

FACT means a statement directly observed in those drafts or on a cited primary page. INFERENCE means the committee's reasoning. HYPOTHESIS means a failure mechanism or a proposed experiment. Proposed thresholds below are committee suggestions, not retrospective changes to an already-running experiment.

## Investment verdict

**STOP investment in a platform or recurring-product thesis on present evidence.** The drafts describe a possible small educational product; they do not establish a viable business, a learning effect, affordable distribution or a compounding advantage. A bounded demand experiment can be bought as information, but its success would authorize only delivery of the promised pack, not a platform, subscription or hiring business. The strongest reason not to build is that every cheap part of the offer is easy to substitute, while the potentially valuable parts — credible instruction, diagnosis, feedback and trust — consume scarce founder time.

Critical gaps: who actually pays for the problem; incremental value over an existing agent and free checklist; a gate that measures that value rather than participation; and a repeatable acquisition cost that fits a $29 sale. These are unresolved, not implementation tasks. The committee does not treat a five-person presale as their resolution.

## Sources used by this pass

| ID | Primary source; checked 2026-10-07 | Limited FACT established |
|---|---|---|
| IC-S1 | [Kodwai product/pitch](https://www.kodwai.com/pitch) | Vendor describes free developer challenges on the learner's machine using Claude Code, Cursor or Codex; it markets scoring and a developer profile. Its planned revenue, market-size and moat claims are not verified evidence. |
| IC-S2 | [CodeSignal agentic assessments](https://codesignal.com/agentic-assessments/) | Vendor offers agentic AI assessments for candidates and employees, including coding/simulations. This establishes a competing offer, not proof of assessment validity or its commercial performance. |
| IC-S3 | [Cursor Bugbot documentation](https://cursor.com/docs/bugbot) | Vendor offers automated code review and usage-based billing. This establishes a practical substitute for part of the proposed customer job. |
| IC-S4 | [Cursor May 2026 Bugbot update](https://cursor.com/blog/may-2026-bugbot-changes) | Announcement described average review cost of $1–$1.50 at that time. It is neither an October quote nor evidence that review quality is sufficient for every task. |

Market facts below cite these sources. All other findings reason from the provisional documents and remain INFERENCE/HYPOTHESIS. No competitor revenue, customer count or learning efficacy is assumed.

## Findings

### IC-01 — The person with the pain may not be the person who pays

**CRITICAL · Recommendation: TEST, then KILL B2C if falsified.**

The draft's ICP has encountered an AI-generated defect. That is an incident criterion, not a purchasing job. The employer bears much of the production loss; the engineer can respond by adding another agent review, asking a colleague, copying a checklist or accepting ordinary professional learning. Personal embarrassment can produce interview engagement without personal spending. Reimbursement is a different buyer path and must not quietly rescue a personal-pay thesis.

**Falsification:** separate self-funded, reimbursed and employer-funded orders before analysis. If the fixed personal-use offer misses G0/G3 while only employer-paid or founder-assisted buyers convert, kill the personal-pay claim. Do not blend these groups to reach five sales. An interview must establish the last paid workaround and budget owner, not merely agreement that AI mistakes are bad.

### IC-02 — Better agents can remove the job faster than CodeForge teaches it

**CRITICAL · Recommendation: TEST the substitute, then KILL the learning wedge if unnecessary.**

FACT: automated review is already sold by Cursor [IC-S3](https://cursor.com/docs/bugbot); local agent practice is advertised free by Kodwai [IC-S1](https://www.kodwai.com/pitch), checked 2026-10-07. INFERENCE: the relevant competitor is often the tool the learner already pays for, not another course. A Python standard-library exercise has explicit rules and small context, which may be especially easy for an agent to solve and explain. Improving agents can compress the learning benefit, while CodeForge still incurs content and acquisition cost.

**Falsification:** freeze the cases and baseline prompts before viewing results. Test the actual buyer's existing agent plus a free checklist without CodeForge feedback. If it reliably gets the target decision right and users decline to pay after seeing that alternative, stop. Do not make the baseline artificially weak or select a less capable model merely to preserve the thesis. A future model change requires rerunning this comparison before selling claims about persistent value.

### IC-03 — The learning gate can pass with no learning

**CRITICAL · Recommendation: SIMPLIFY the claim or repair the experiment before launch.**

FACT in the draft: G4 requires starts, completions, transfer completions and repeat purchases. It does not require a correct transfer decision, a stronger counterexample, fewer false positives or improvement against the named counterfactual. A cohort can finish every activity, buy the next pack out of curiosity, and learn nothing. The counterbalanced P2 description is not connected to a numerical pass/fail rule. Calling the outcome “learning value” would therefore overstate the evidence.

**Falsification:** before recruitment, define a small blind rubric for an unseen case — correctness of merge/reject decision, a valid counterexample and explanation of remaining uncertainty — and specify the minimum incremental result versus the agent/checklist condition. Count missing results as missing/failure under the locked rule. If the paired result does not improve, kill the learning-effect claim even if G4 engagement passes. A small pilot can reject a bad mechanism; it cannot establish production productivity or causal efficacy for a population. No amount of completion can override this veto.

### IC-04 — Five strangers can still buy the founder's attention

**HIGH · Recommendation: TEST a genuinely repeatable offer; do not infer product-market fit.**

“Not friends” does not make a cohort independent of personal rapport, interview priming, founder credibility or a desire to help. The G0 sequence includes fifteen conversations; a low-price preorder sold after a tailored discussion may purchase access to the founder. G3 excludes private coaching to buy, but it does not yet specify the allowable sales interaction or quantify it. Settled money is evidence of an order, not evidence that an anonymous product can sell repeatedly.

**Falsification:** log founder interaction before purchase; freeze the same offer and follow-up script; report conversion separately for interviewed and previously uncontacted qualified buyers. If the unfamiliar cohort fails while rapport-heavy buyers pass, stop the self-serve distribution claim. Do not add unlimited private feedback to the offer to recover conversion.

### IC-05 — Customer acquisition may exceed the entire lifetime margin

**CRITICAL · Recommendation: TEST recurring CAC before any scale claim.**

FACT from UNIT_ECONOMICS: contribution after assumed content amortization is $13.535 per pack, before maintenance and acquisition. At $30/hour, one 30-minute sales conversation costs $15 before prospecting or follow-up. P0's 20 hours are worth $600; five sales would divide that total to $120 each. Not all P0 time is recurring CAC, so $120 must not be presented as measured steady-state CAC; nevertheless, a cheap cash experiment can conceal an uneconomic sales motion. A “CAC recovered within 90 days” rule cannot be satisfied by assuming an unmeasured second purchase.

**Falsification:** split one-time research/setup from repeatable prospecting, qualification, sales and follow-up. Before scaling, the contribution from actually observed purchases within the window must exceed recurring acquisition cost plus allocated overhead. As a conservative proposed gate, test recurring CAC at or below $10 for the first pack; even that leaves only $3.535 after the assumed content allocation, before maintenance. If only labour-heavy acquisition works, stop the $29 self-serve business. Organic posting is not free: count content/distribution time.

### IC-06 — The margin depends on the demand it is supposed to justify

**HIGH · Recommendation: TEST price and amortization; KILL the scalable-margin claim if they fail.**

FACT in the draft: content is amortized across 100 sales, yet G0 passes at five and G4 at twenty. At twenty-five lifetime buyers, allocated content alone is $28.80 per buyer. The 71.5% delivery contribution headline excludes the corpus cost; after the hundred-sale allocation it is 46.7% before maintenance, below the proposed 50% target. Raising price may fix arithmetic and break conversion. Neither choice is validated by the present model.

**Falsification:** retain both cash and fully loaded cohort P&L. Test a fixed price that can meet the target at measured volume and support time. If no tested price yields positive contribution after content, maintenance and recurring acquisition within the experiment budget, stop. Do not justify current losses using an untested 100-sale lifetime or future SaaS margin.

### IC-07 — “No content treadmill” conflicts with the repeat-purchase gate

**HIGH · Recommendation: SIMPLIFY to a finite product, or TEST paid reuse.**

The permanent library has two paid labs. G4 asks customers to buy a next pack. That requires either more authored content or a second payment for reuse whose value is unspecified. New contexts require new specs, references, mutants, explanations and support. Parameter changes are explicitly insufficient for transfer. The plan has removed seasons in name while leaving a possible sequential-pack treadmill in its revenue mechanism.

**Falsification:** before accepting a next-pack preorder, cost its bounded deliverable and reserve delivery/refund capacity. If repeat purchase requires bespoke or continually novel cases beyond the maintenance/content cap, stop the recurring-product thesis. A one-time reference product must be evaluated as one-time economics; finishing it successfully is not churn that a subscription should fix.

### IC-08 — Nothing demonstrably gets stronger with every user

**HIGH · Recommendation: KILL the moat claim until measured.**

Optional self-reported outcomes from tiny exercises are not necessarily reliable labels. They can reflect model quality, tool setup, time available or copied answers. Privacy limits and the absence of source/transcript collection reduce both harm and the amount of diagnostic data. A competency graph of three tags is a taxonomy. A small corpus is replicable. Learning which instructions confuse users can improve the product, but is ordinary product maintenance, not automatically an accumulated competitive barrier.

**Falsification:** require concrete examples of consented failure data changing a rubric/case and producing better outcomes on a later cohort without increasing founder delivery time. If this does not happen, remove data/network/moat language. Do not add intrusive telemetry or employer scores merely to manufacture a moat story. Assess the business as a copyable education product with low switching cost.

### IC-09 — Credibility and teaching quality are unbudgeted founder dependencies

**HIGH · Recommendation: TEST authoring competence before selling efficacy.**

The draft does not demonstrate that the founder can author and calibrate these particular exercises. That is absence of evidence, not a claim that the founder lacks skill. Correctness, pedagogical sequencing and plausible alternative solutions are different competencies. An LLM can cheaply draft all three while reproducing the same mistaken invariant across spec, reference and evaluator. A learner discovering an ambiguous answer can consume more support time than the pack's margin.

**Falsification:** one knowledgeable independent reviewer should attempt to find an alternative correct implementation or counterexample to each rubric before the delivery promise expands. Record review/rework time. If correctness or instructional value cannot be obtained within the bounded authoring cap, pause or stop; do not replace the reviewer with another unvalidated AI score and count it as independence.

### IC-10 — Toy fidelity can eliminate the expensive problem being sold

**HIGH · Recommendation: TEST relevance, not realism by assertion.**

Python standard-library fixtures remove deployment, database isolation, asynchronous execution, framework behavior and organizational ambiguity. Those omissions make the lab operable and may remove the reasons real backend reviews are difficult. A retry toy can teach a known invariant while leaving the learner unable to establish a real system boundary. Adding realistic integrations to recover fidelity would consume the very cost advantage used to select the thesis.

**Falsification:** ask qualified buyers, before exposing the paid answer, to identify a recent decision where the same reasoning would have changed their action. Verify only a sanitized description; do not collect company code. If users call the task obvious, irrelevant or unlike the decision they need help with, stop this wedge. Do not count difficulty caused by unclear wording or setup as useful challenge.

### IC-11 — BYO shifts cost to the buyer and creates a support tax

**HIGH · Recommendation: TEST total customer effort; SIMPLIFY or KILL local execution if it fails.**

Zero CodeForge inference cost is not zero total cost. The buyer supplies a subscription or API spend, a working local setup and permission to run unfamiliar files. Different agents produce different hints and fixes. Support can involve Python versions, Git, shell behavior, editor trust and company device restrictions. A p90 setup intervention of thirty minutes consumes $15 of labour at the chosen rate — before helping with the actual learning objective.

**Falsification:** include setup failures and refusals in the offered-cohort denominator; record learner minutes, incremental model expense when known and every founder rescue. If an execution-free version performs equally well on the predeclared value metric, remove execution. If credible value requires environments the founder cannot support inside the cost cap, stop; do not build a sandbox to conceal a broken margin.

### IC-12 — A team clinic is a different business, not proof of SaaS expansion

**HIGH · Recommendation: TEST separately; KILL automatic expansion inference.**

FACT: CodeSignal already markets assessment and upskilling-related capabilities [IC-S2](https://codesignal.com/agentic-assessments/), checked 2026-10-07. INFERENCE: a manager can buy internal coaching, existing learning tools or a review tool; there is no demonstrated empty category. The proposed $300 clinic leaves 40% contribution under its own five-hour sales/delivery assumption. Scheduling, procurement, customization and follow-up can erase it. Two managers buying a workshop do not establish recurring software demand, and a second session within thirty days may test a particular training calendar rather than the claimed long-term job.

**Falsification:** predeclare a fixed scope, buyer, preparation limit and buying trigger. Count all sales, coordination, facilitation and follow-up time. If buyers require custom company cases, hiring validity or integrations to pay, reject those sales rather than treating them as proof of the reusable pack. Keep the fallback's cash, hours and results separate from B2C.

### IC-13 — The plan has not chosen an economic success condition for the founder

**HIGH · Recommendation: SIMPLIFY the objective before committing the 90 days.**

FACT from the draft: the maximum experiment is 160 hours and $500 cash; at the chosen shadow wage that is $5,300 of economic exposure. The example of a $1,500 founder draw requires about 130 monthly pack sales under assumptions that omit meaningful acquisition cost. No evidence supports that volume. “Can make some revenue” is a much weaker claim than “best use of this founder's time.” A profitable small pack can still be an inferior business to a workshop or other paid work.

**Falsification:** set the desired monthly income, sustainable weekly hours and maximum time to reach them before interpreting success. If measured sales/support/content rates cannot plausibly meet that objective at an accessible number of buyers, stop at a finite product or stop entirely. Do not use cash break-even of four packs to claim founder viability.

### IC-14 — The thesis score rewards cheapness and can disguise missing demand

**MEDIUM · Recommendation: SIMPLIFY the score's authority.**

The matrix gives cheap MVP/operations/AI/infrastructure/founder complexity separate votes, several of which are correlated. A small file-based pack wins partly by construction. The pain, willingness-to-pay and differentiation scores are hypotheses selected by the author. Numerical precision does not make those demand assumptions independent or true.

**Falsification:** vary the demand scores down by one or two points and test whether the ranking remains stable. More importantly, apply demand and affordable-distribution vetoes regardless of ranking. If a rejected thesis has stronger direct payment evidence, the numerical winner has no priority. Never describe the matrix as market validation.

### IC-15 — The paid-cohort and calendar requirements are not fully funded

**HIGH · Recommendation: TEST recruitment capacity and reconcile the schedule before promising delivery.**

G0 and G3 can each pass with five payments, yielding at most ten from those minimum passes. G4 requires twenty paid buyers by day sixty, so the plan needs at least ten additional buyers and another acquisition workload. At the assumed five-of-thirty rate, twenty buyers imply roughly 120 eligible offers, not the first thirty. G0's ten working days, content preparation, G2's fourteen days, G3's twenty-one days and a mature D14 observation do not fit comfortably into day sixty if executed sequentially. Overlap may be possible, but the current dependencies and hours do not specify it.

**Falsification:** write the exact cohort counts, overlap rules, eligible-offer capacity and delivery dates within the same 160-hour/$500 ceiling. Treat inability to obtain a mature cohort as distribution failure or inconclusive evidence, never an automatic pass. Do not extend the deadline after seeing slow recruitment or recruit refunded/ineligible buyers into the count.

### IC-16 — The evaluator may measure the agent and the lesson may teach its own test

**HIGH · Recommendation: TEST the mechanism; KILL skill claims beyond the evidence.**

Public deterministic tests establish behavior on fixtures, not the learner's judgment. A strong agent can produce a passing fix and the accompanying explanation. Self-reported no-AI micro-probes provide weak attribution; adding surveillance would change both privacy and the offer. Explanations can also teach the exact trick, making a near-transfer case look like broader skill. No employer should infer production competence from these records.

**Falsification:** keep assistance mode visible and separate task success from independent understanding. Use a genuinely different decision context and a pre-feedback answer. If observed advantage disappears outside the demonstrated pattern or is entirely agent-generated, remove general learning/competency claims. Do not introduce anti-cheat machinery to rescue a learning product whose buyer is paying voluntarily.

### IC-17 — Price and geography can select a misleading micro-market

**MEDIUM · Recommendation: TEST the actual reachable segment; defer broader market claims.**

The initial audience is Vietnamese-speaking Python developers reachable by the founder; the price is in dollars and some buyers may need reimbursement. No present evidence connects this group's discretionary budget, payment friction or purchasing habits to $29. International expansion would change trust, language, acquisition channels and price competition. A small affluent network or cross-border audience cannot establish the economics of the broader segment.

**Falsification:** report geography, language, funding source and payment failures in aggregate. A merchant/payment failure is not refusal to pay, but neither is verbal willingness a payment. If the reachable cohort cannot use the payment route or buy at a viable price, pause/stop that market. Do not silently swap audience or currency after failing the original gate.

### IC-18 — Manual fulfilment is not automatically a reason to build an app

**MEDIUM · Recommendation: SIMPLIFY the architecture trigger.**

The draft introduces a monolith when manual fulfilment exceeds two hours per week for two weeks. That may be only $120 of labour over two weeks, less than the cost of building, maintaining and securing accounts, payments and data storage. More manual work can indicate support-heavy customers or content confusion that an app will not remove. A time threshold alone is an engineering invitation without return-on-investment evidence.

**Falsification:** identify the repeated task, actual minutes eliminated, build/maintenance time and payback at observed order volume. If a existing delivery/payment tool or better instructions removes it more cheaply, do that. If automation cannot pay back within the experiment economics, reject the monolith even when the two-hour trigger fires.

### IC-19 — Competitors need only copy the useful lesson, not the whole platform

**HIGH · Recommendation: TEST willingness to pay under substitution; accept low defensibility or STOP.**

FACT: Kodwai offers the broad local agent-practice shape without charging developers [IC-S1](https://www.kodwai.com/pitch), checked 2026-10-07. INFERENCE: the narrow differentiation is content selection and debrief quality. An educator, open-source repository or agent-generated walkthrough can reproduce a two-lab package without copying CodeForge infrastructure. A free competitor does not have to prove an equally valid assessment to reduce perceived value. Switching cost for a downloaded lab is negligible.

**Falsification:** show the buyer the real free workaround and ask for the same fixed-price purchase, without hiding alternatives. Record why paying remains preferable. If value is solely novelty or lack of awareness of alternatives, stop investing in proprietary-product economics. A durable competitive advantage must be demonstrated, not asserted from a corpus existing.

### IC-20 — Preorders can finance an obligation while being mistaken for validation capital

**HIGH · Recommendation: SIMPLIFY the financial gate and hold the liability.**

Five $29 payments create only $145 cash before fees and refunds. They also create a delivery promise for reviewed instructional work whose modelled initial labour is $720, plus packaging and pilots. If the creator hits the content cap or finds the hypothesis invalid, the paid cohort still needs delivery or refund. Repeat-pack preorders compound this obligation. The willingness to buy a promise is useful evidence but cannot simultaneously fund all validation and count as earned profitable revenue.

**Falsification:** keep preorder cash/liability, delivered revenue, refunds and founder investment separate. State a delivery date and retain enough accessible cash for the promised refund route. If delivery within the bounded budget is not credible, refund and stop before collecting more. Never sell a second pack merely to satisfy G4 without an affordable, specified deliverable.

## Strongest combined case for not building

The proposed purchaser is an engineer who already owns a powerful assistant. The offer removes cloud execution, custom feedback, trusted certification, workflow integration and deep production realism to preserve margin. What remains may be a pair of exercises that the assistant can solve and explain. If the learner still values them, finding that learner and answering their questions can cost more than the price. If they ask for more realism or individual feedback, cost rises; if they ask for employer value, the business enters an established assessment market with an untrusted signal. If they want new lessons, content production becomes recurring. If telemetry is minimized, the supposed proprietary data advantage may never emerge. If it is expanded to manufacture such an advantage, privacy and support costs rise.

This is a coherent route to a small finite educational product, but it is not evidence for a compounding company. The burden of proof is on incremental paid value and affordable distribution, not on finding a clever architecture. Until those gaps close, the investment committee's recommendation remains **STOP platform development; permit only a capped falsification experiment, with no implication that the thesis has earned continuation**.

The strategist must explicitly accept, eliminate or test every finding ID during reconciliation. This raw review must remain intact even if the eventual decision differs.
