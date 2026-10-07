# Evidence-gated roadmap

2026-10-07. Không phase nào đã chạy. P0 là next executable phase; P1–P6 là options, không backlog cam kết. Canonical thresholds ở [VALIDATION_PLAN](VALIDATION_PLAN.md); effort trong [MVP](MVP.md). Không mở issue cho phase chưa được unlock.

| Phase | Hypothesis | Deliverable | Acceptance / metric | Cost cap / allowance | Risk | Exit |
|---|---|---|---|---|---|---|
| P0 validation assets | Recent verification pain chuyển thành self-funded demand | Freeze protocol, paper feasibility, merchant/refund check, landing/offer draft, interviews, private ledger + aggregate decision | G0:15 interviews≥8 concrete incidents;30 eligible offers≥5 full$49 paid;≤60 contacts/2channels/10workdays |20h/$100 | Friends/discount/rapport bias; presale obligation | PASS chỉ unlock bounded content; fail STOP; missing recruitment/merchant PAUSE |
| P1 MVP foundation | Hai case an toàn/đúng có thể giao trong bounded authoring cost |2labs/4static probes/demo excerpt, stdlib bundle, manifest, debrief, independent review | G1; reference+≥4mutants+≥1correct alternative/lab,2spec pilots, runtime/OS smoke, withdrawal drill |40hcontent+8hpackaging;44hcontenthardcap lấy4hbuffer; up to$250 cash allowance | Reviewer chưa có; ambiguity/localexecution | No reviewer/safe delivery→PAUSE/refund; không tạo app |
| P2 first real users | Local/BYO friction chấp nhận được, debrief có incremental value |10user usability ledger +10person comparator (có thể cùng participants); blind rubric/summary | G2≥8firstcheck/≥6complete + supportcaps; P2mechanism veto trongprotocol |12h; up to$50 cash; one8hdocsfix từbuffer | Support cost; model solves probes; smallN | Failafter1fix→staticfallbackonce/STOP; valuefail→STOP learning |
| P3 payment validation | Sales không dựa interview/coaching có thể lặp |30new fixedoffers, receipts/refunds/private sales minutes | G3≥5paid,≥4retained14days,≤1follow-up |12h trong28hacquisition; cash allowance$25 | CAC/checkout/refund | Fail→STOP self-serve; pass unlock≤60extraoffers |
| P4 retention/value | Người mua thực hành lần2 và transfer reasoning có ý nghĩa |20buyer aggregate cohort + delayed probes/observations, economic readout | G4≥10lab2starts/8completes/12returns/8correctrubrics/6gain;≥8observed; buyer entry≤day70/readout90 |16hrecruit+12hfollowup; cash allowance$25 | Not enough20buyers; missingness/contamination | Underpowered→PAUSE; valuefail→STOP; success chưa unlock scale |
| P5 B2B experiment | Manager có buyer job riêng cho team clinic |8manager conversations nếu budget;2paid clinics on same assets | G5:≥3pain+authority,2×$300paid,≤5h/teamtotal sales+delivery,1repeat |20h optional; use only remaining cash/buffer | Bespoke-service trap; employee misuse | Fail→STOPteam; noSSO/ATS/customincidents |
| P6 scale only after evidence | Actual margins/acquisition/content quality sustain |2cohort/3month economics, limited operational improvements | G6; data-moat gates separate; app also needs measured bottleneck+≤90dayROI | **Unfunded; no current implementation budget** | Forecast used as fact; premature recurring promise | New explicit investment decision; otherwise finitepack/service or STOP |

Cash allowances total$450; retain$50 overall contingency=$500. P0 $100 hard cap; later allocations may be reduced, never silently raise total. Preorder proceeds held as refundable liability, not spending allowance. Reviewer cash fit may be impossible: that is a feasibility constraint, not free expert labour. Shadow hours160 total:20+40+8+12+28+12+20+20buffer. Planning itself is sunk cost outside this future execution budget.

## Calendar: conditional, no forced concurrency

- Days1–14: P0 ten working days. Before charge confirm real delivery date/terms and refund capacity; if cannot promise feasible delivery within later gates, do not collect.
- Days15–28: nominal P1 if G0 passed (48h content+packaging across14days). Reviewer availability is prerequisite. If deadline slips, communicate via owner and refund/decline further orders; calendar is not permission to ship unsafe content.
- Days29–38: nominal P2 only after reviewed artifacts; reviewed LAB-A goes to10pilot users, not the paper DEMO. Comparator allocation/forms/unaided probes frozen before exposure; G2 allows≤14days but this nominal schedule budgets10.
- Byday38: qualify G3 list30people within acquisition hours. Day39 all receive fixedoffer; settlements throughday45 and same-day delivery; final G3 readoutday59 after14days for latest order. One standard follow-up; late payments reported separately. If P1/P2 slip, recruit less later or PAUSE; no immature refund counts.
- Byday70: last G4 enrollment; throughday90: delayed probes + refund maturity + aggregate readout. Up to120eligible offers/240contacts all stages; repeat contacts counted, no indefinite extensions.
- P5 only if managers already identified and sufficient time/cash remains. It can replace failed B2C with one gated pivot; cannot use combined employer/personal counts to rescue G0/G3. Repeat window may exceedday90→defer, do not claim pass.
- Day90: make STOP/PAUSE/finite-product decision. P6 needs observed≥3months, not an obligation to scale onday91.

## Only three P0 work items

1. **Freeze feasibility and protocol:** merchant/refund route, calendar, reviewer feasibility, private ledger/restore, existing provider billing inventory, two paper briefs. No executable labs or new paid resources.
2. **Recruit/interview and run fixed offer:** after prerequisites,15interviews and30eligible offers, separated funding/relationship, all denominators/labour; founder performs/explicitly authorizes communications and payment execution.
3. **Close G0:** reconcile receipts/refunds/missingness/caps; publish aggregate decision and unlock P1 or STOP/PAUSE. No shifting thresholds after outcome.

Created: [P0-1 feasibility](https://github.com/thanhtuyen662002/CodeForge-AI/issues/20) → [P0-2 demand](https://github.com/thanhtuyen662002/CodeForge-AI/issues/21) → [P0-3 readout](https://github.com/thanhtuyen662002/CodeForge-AI/issues/22). All remain NOT_STARTED. Exact state: [PROJECT_STATE](PROJECT_STATE.yaml). Existing issues#2–#17 are historical strategy-hold, not a parallel delivery roadmap.

P5 clinic execution assumes the same reviewed G1 assets already exist (e.g. B2C failed at G3). If B2C stops before G1, only manager discovery is available in this plan; do not collect clinic payments or promise delivery from a nonexistent corpus. A confirmed manager opportunity needs a separate frozen fallback protocol/cap decision before content investment, still respecting the one-pivot and overall limits.
