# Red team và reconciliation

2026-10-07. Hai reviewer agent độc lập đọc cùng draft v1, không đọc critique của nhau, không viết strategy. Đây là **independent agent reviews**, không human approval, market validation hay security audit. Raw findings được giữ nguyên: [Investment committee](reviews/INVESTMENT_RED_TEAM.md), [Technical/product operations](reviews/OPERATIONS_RED_TEAM.md). Chúng mô tả draft$29/24h; canonical v2 đã đổi trước launch. Không xóa các phản đối chưa được trả lời.

## Strongest case NOT BUILD

Engineer đã có agent có thể tự tìm/sửa/giải thích lỗi; gói2 bài có thể quá toy hoặc dễ sao chép để đáng trả. Phần hữu ích nhất—chẩn đoán, chất lượng feedback và trust—tốn người. Tìm khách $49 có thể đắt hơn contribution; privacy tối giản khiến dữ liệu chưa tạo moat. Nếu muốn trust tuyển dụng hoặc thực tế production, chi phí evaluation/security/content tăng mạnh. **Không có evidence hiện tại biện minh đầu tư platform.**

## Reconciliation rules

Severity=CRITICAL/HIGH/MEDIUM/LOW/ACCEPTED RISK. Action đúng một trong eliminate/simplify/defer/experiment/monitor/accept/kill thesis. “Design changed” chỉ đóng design inconsistency; outcome/demand risk vẫn OPEN. Threshold v2 chưa từng chạy nên thay trước launch không là moving goalposts. Khi có cohort thật không sửa threshold của cohort đó.

## Investment findings — mỗi ID một disposition

| ID | Severity | Action | Disposition / evidence cần |
|---|---|---|---|
| IC-01 | CRITICAL | experiment | Self-funded cohort tách employer/reimburse; G0/G3 payment veto. **OPEN** |
| IC-02 | CRITICAL | experiment | Agent+free checklist comparator, ceiling/value veto, model/version recorded. **OPEN** |
| IC-03 | CRITICAL | simplify | G4 thêm correct decision/counterexample/gain; P2 comparator threshold; completion không pass learning. Design fixed, efficacy **OPEN** |
| IC-04 | HIGH | experiment | G3 chưa interview/coaching, fixed offer,≤1 follow-up; rapport sales không là self-serve validation |
| IC-05 | CRITICAL | experiment | Recurring CAC≤$10 gồm labour và first-order actual profit; không unmeasured LTV. **OPEN** |
| IC-06 | HIGH | experiment | V2$49/content40h; actual sales allocation, không forecast100 để pass. WTP/margin **OPEN** |
| IC-07 | HIGH | eliminate | Bỏ next-pack preorders và recurring-product claim; no pack2/season trong90days |
| IC-08 | HIGH | accept | Chưa moat; compound evidence gate trong MOAT. Không tăng telemetry để có câu chuyện |
| IC-09 | HIGH | experiment | Competent independent content review và feasible paper design trước sale; reviewer chưa có→PAUSE |
| IC-10 | HIGH | experiment | Interview map invariant tới incident thật qua sanitized description; reject stack-specific expansion |
| IC-11 | HIGH | simplify | Narrow supported runtime/OS, static demo, no integration; include setup failures và total effort |
| IC-12 | HIGH | defer | Clinic là service riêng; two paid teams và5h total cap, no SaaS inference |
| IC-13 | HIGH | experiment | Explicit160h/$500 và illustrative income economics; decision includes opportunity cost, không cash-only success |
| IC-14 | MEDIUM | simplify | Scores công khai trọng số/sensitivity; demand/safety/CAC veto overrides |
| IC-15 | HIGH | simplify | Total≤120 offers/240 contacts,28h extra acquisition; enrollment cutoffday70, readoutday90; underpowered→PAUSE |
| IC-16 | HIGH | simplify | No independent skill credential; structured observed reasoning + assistance labels; learning mechanism only |
| IC-17 | MEDIUM | experiment | VN-speaking reachable segment, payment failures/funding tracked; no geographic silent pivot |
| IC-18 | MEDIUM | simplify | Automation needs ROI≤90days at actual volume + G3/G4+profit;2h threshold alone insufficient |
| IC-19 | ACCEPTED RISK | accept | Finite corpus copyable/low switching; show free alternative during sale; no venture moat claim |
| IC-20 | HIGH | simplify | Hold100% preorder liability,feasibility/deadline/refund before charge; no new obligation to hit metric |

## Operations findings — mỗi ID một disposition

| ID | Severity | Action | Disposition / evidence cần |
|---|---|---|---|
| OP-01 | CRITICAL | simplify | Same correction as IC-03, rubric0–4 with mandatory decision/false-positive veto; **learning evidence OPEN** |
| OP-02 | HIGH | simplify | Inventory2 labs+4 probes+review40h, cap44h, no hidden measurement labour |
| OP-03 | HIGH | simplify | G6 delivery≥70%, after actual content/maintenance≥50%, CAC and positive first-order economics separate |
| OP-04 | HIGH | simplify | Review learner edits before run, restrictive supported workflow, starter review not blanket safety; no acceptable workflow→static/no release |
| OP-05 | HIGH | simplify | Canonical release/commit + publisher/reviewer record; hash not authentication; no signing service project |
| OP-06 | HIGH | experiment | Runtime/OS matrix from pilot, one delivery path, all troubleshooting logged; after one correction fail→STOP execution |
| OP-07 | HIGH | monitor | Tool/version optional+monthly baseline within4h content cap; stop if substitute removes value |
| OP-08 | HIGH | experiment | Reviewer ambiguity/counterexample + correct alternative outside author mutations; G1 blocks publish |
| OP-09 | HIGH | simplify | Reference/probes separate staged delivery, prior-exposure tracking; no anti-cheat guarantee |
| OP-10 | HIGH | simplify | observed/self_reported/payment_verified separate;8 observed reasoning cases minimum G4; no fake attestation |
| OP-11 | HIGH | simplify | Reconciled counts/calendar/caps as IC-15; no “20 buyers” magically from10 |
| OP-12 | HIGH | eliminate | Delete repeat-pack gate; no subscription evidence claimed |
| OP-13 | HIGH | simplify | Paper feasibility before charge,100% refundable reserve, safety gate overrides paid demand |
| OP-14 | HIGH | simplify | Synthetic/rephrased incidents, no screen recording, delete accidental sensitive input, private ledger separated |
| OP-15 | MEDIUM | simplify | Aggregate cohort closure before raw TTL,protocol hash/missingness;late corrections as deltas |
| OP-16 | HIGH | simplify | Delivered-version map/support consent/canonical advisory; offline copies not revocable; withdrawal drill |
| OP-17 | MEDIUM | simplify | ROI gate replaces sole2h trigger; try no-code merchant delivery before app |
| OP-18 | MEDIUM | defer | Manual payments first; later explicit payment state/reconciliation/restore gate before web automation |
| OP-19 | HIGH | experiment | Cohort30/60/90day support cost, capped free help, close unprofitable acquisition channel |
| OP-20 | HIGH | eliminate | No manager individual ranking/surveillance; sale requiring these is rejected, not B2B validation |
| OP-21 | HIGH | experiment | Test relevance vs real decision before adding frameworks; fidelity risk remains OPEN |
| OP-22 | ACCEPTED RISK | accept | Data moat absent; only consented adjudicated improvements count; no data-platform investment |

## What changed and what remains

Changed: price$49,content40h,explicit probes/reviewer,correctness+gain comparator,recurring CAC gate,count/calendar budget,staged answer release,ROI automation gate; removed pack2 presales/subscription/hiring inference. No microservice/sandbox/telemetry recorder added to fix these risks.

Still critical and unresolved: WTP, incremental value, distribution/CAC, content review competence, real support burden and actual margin. Therefore **BUILD WITH CONDITIONS = permission to test P0 cheaply, not endorsement of product/platform investment**. If these do not pass, STOP is preferred to further architecture.
