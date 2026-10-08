# Independent final blueprint review

Checked **2026-10-08**, Asia/Bangkok. Scope: the owner-requested architecture, features, screens, low-cash hosting comparison, two independent attacks and reconciliation. This review uses repository files and live [issue20](https://github.com/thanhtuyen662002/CodeForge-AI/issues/20), which was OPEN with feasibility work uncompleted at read-back. It does not treat chat recollection, prototype figures or vendor offers as customer evidence.

**Verdict: PASS for the reconciled design, with explicit execution blockers.** Two MEDIUM consistency findings were raised, corrected by the author, and independently read back before this verdict. No CRITICAL/HIGH design-completion defect remains in the reviewed scope. This is not approval to implement, charge, publish, provision or deliver executable content. PR publication metadata and the final design-effort snapshot remain the root agent's completion steps; neither is fabricated here.

## Review method and limits

Read AGENTS, PROJECT_STATE, DECISION_MEMO, VALIDATION_PLAN v2, the live feasibility issue, all five blueprint design documents, README, model, both raw attacks, their reconciliation and QUALITY_GATE. Cross-checked canonical ARCHITECTURE and UNIT_ECONOMICS. Inspected prototype HTML/CSS/JS, the recorded browser result and the desktop/mobile/lab screenshots.

I independently ran `node scripts/check-planning.mjs`, `git diff --check` and `git diff --cached --check`. The planning check passed for34documents/113local links before this report was added, including the existing strategy model and33blueprint dispositions. Diff checks returned success; Windows line-ending notices were warnings. The script checks documentation consistency and arithmetic, not product efficacy or production security.

I did **not** independently rerun the browser. The81case result is the author's recorded local smoke-test evidence, supported here by source and screenshot inspection; it is not81independent review cases. The screenshots show readable desktop/mobile layouts, permanent synthetic-design labelling and no real checkout. Static source contains no external-service call, persistent storage or submitted-code execution. No authentication, RLS, payment, restore, challenge, customer or provider-account test was performed by this reviewer. The hosting source ledger has direct URLs and checked dates; this pass did not freshly verify every vendor price or inspect an actual bill.

## Findings, required corrections and closure

### BQ-01 — MEDIUM — Removed practice persistence still appeared in two specifications

**FACT-doc at initial review:** FEATURES F12 justified authentication for “entitlements/history”; the operations test strategy still named cross-user report access and report rejection “before persistence.” These remnants contradicted the eight-table design, removed report endpoint and explicit `stored_practice_history: false` decision. A later implementer could reintroduce the discarded feature while following the checklist.

**Required correction:** describe auth as optional order/delivery access; remove app report storage tests or explicitly scope them to a separately justified local parser. Do not add a table, endpoint or service to make the obsolete prose true.

**CLOSED by independent read-back:** F12 now states optional automated order/delivery access and no practice history. Operations now tests order/storage ownership and separately labels local parsing “if implemented,” explicitly excluding app report storage/API. The prototype reflection remains ephemeral and clears with screen navigation. No new persistence was added.

### BQ-02 — MEDIUM — The machine-readable implementation gate omitted the cash veto

**FACT-doc at initial review:** AGENTS and HOSTING_DECISION required unrestricted cash coverage in addition to fully loaded90day payback, while `model.json.implementation_gate` ended with payback at actual volume. The separate scenario field correctly said cash feasibility was unknown, but an automated consumer of the gate string could still miss the mandatory second condition.

**Required correction:** encode fully loaded incremental payback and the separate unrestricted-cash condition in the gate; exclude existing unavoidable bills, refundable liabilities, merchant holdbacks and speculative receipts as available funding.

**CLOSED by independent read-back:** the gate now explicitly contains both conditions. The baseline still records unrestricted cash as unknown and the scenario remains `UNKNOWN_BLOCKS_PURCHASE`. The correction did not invent funding or increase the160h/$500validation ceiling.

## Requirement-by-requirement result

| Requirement | Inspected evidence | Result and limit |
|---|---|---|
| Clear product/customer and scope | Decision memo, protocol, feature/job table | PASS design: finite$49two-lab Python verification pack; WTP and learning value remain unknown. |
| Features, journeys and screens | F01–F12, S01–S09, all nine prototype renderers | PASS design: manual/current versus conditional app forms are distinguished; nine screens are not nine executable tickets. |
| Viewable disconnected prototype | HTML/CSS/JS, three screenshots, recorded81case result | PASS artifact review: synthetic states, no payment/data submission/runner. Production authorization and accessibility certification are not claimed. |
| Low-cash provider comparison | HOSTING_DECISION, source ledger, model | PASS: static/manual selected; no VM/app DB now; Vercel/Supabase conditional; alternative runtime carries compatibility/operations caveats. Actual merchant/provider bills remain unknown. |
| System architecture and contracts | SYSTEM_DESIGN and ARCHITECTURE | PASS design: modular monolith, eight conceptual tables, bounded APIs, local versioned report contract, provider adapters, migrations/privacy/recovery; no report-history database. |
| Security boundaries | Auth/Storage/payment/deletion/restore contracts and operations gates | PASS specification only: direct API bypass, stale tokens, replay, quarantine and financial reconciliation are addressed as unimplemented release requirements. |
| Two attacks and every disposition | Raw BI01–15/BO01–18 and RED_TEAM | PASS: all33findings each have one severity/action/disposition; raw critiques retain the earlier ten-table/auth assumptions as history. Critical commercial unknowns are not relabelled resolved. |
| Cost and timing consistency | Model, hosting equations, UNIT_ECONOMICS | PASS arithmetic: managed$100/$160cash-plus-infra labour; replacement VM$94.40/$214.40; additional VM$114.40/$234.40. Exact90day benefit$771.43less$480recurring leaves9.714build hours;80hscenario loses$2,108.57. |
| Broader economic model consistency | Original labelled$80scenario versus new$100S2scenario | PASS: distinct scenarios, not contradictory invoices. New$335overhead yields9/13/20pack break-even cases and108with the illustrative extra$1,500income. All volume/effort assumptions remain hypotheses. |
| Frozen experiment rules | VALIDATION_PLAN, state, unchanged protocol diff | PASS: P0=10workingdays/20h/$100; full plan160h/$500; only issues20–22 executable. G0/G3/G4 denominators, thresholds and NOT_STARTED status are preserved. |
| Research opt-out and purchased access | Buyer journeys, operations privacy, delivery contracts | PASS design: research participation does not unlock purchased learning; missing outcomes still remain failures in locked research denominators. No pre-purchase CodeForge OTP by default. |
| Durable integration status | Current state, main commit, source references | PASS repository consistency: strategy merge `a0e7296d78bec368ef1c22bd022a916c2bf6c754` is distinct from blueprint publication and unpassed customer gates. This reviewer did not independently reread GitHub ruleset settings. |

The80–140hreference estimate's components sum correctly. It remains an unmeasured estimate, not a funded roadmap. Removing hypothetical practice-history/auth friction reduces scope without claiming that the remaining app pays back. Both economic ROI and cash coverage must pass before any S2 funding.

## Execution blockers retained explicitly

1. **Before charging:** actual eligible merchant, settlement/refund fees and terms, liability reserve, feasible delivery promise, private recipient access and recovery must be demonstrated under issue20. No real receipt or eligible account has been established by design work.
2. **Before executable delivery:** competent independent content review, exact supported runtime/OS, reference/alternative/mutant evidence and G1 safety gate. Agent design review does not replace that reviewer.
3. **Before S2 investment:** G3/G4, first-order profit, measured removable work, fully loaded90day payback and unrestricted cash coverage. The illustrated full app fails ROI now; the>2h/week observation trigger alone cannot fund it.
4. **Before production data:** actual auth/RLS/Storage/payment/privacy tests, configured SMTP, immutable asset binding, combined refund/deletion/quarantine restore and an available operator. Written controls are not executed controls.
5. **Before claiming business viability:** WTP, incremental learning value, repeatable distribution, CAC and support/content economics. Validation remains NOT_STARTED; the strongest case for STOP remains open.

These blockers are appropriately attached to dependent execution. Performing customer experiments or buying infrastructure is not necessary to finish this design review. Finish publication/accounting metadata, freeze further platform design, and keep the next authorized evidence work bounded by the existing P0 protocol.
