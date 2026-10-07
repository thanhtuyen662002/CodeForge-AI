# Pre-mortem / risk register

2026-10-07. Giả định18 tháng sau CodeForge thất bại. Mọi likelihood là **HYPOTHESIS**, không tần suất thống kê. H/M/L=high/medium/low; severity C/H/M=critical/high/medium. Owner mọi dòng hiện là founder; chưa có đội security/content/sales được tuyển. MVP test Yes/Partial/No không đồng nghĩa đã test.

| ID | Lý do thất bại | Likelihood / severity | Early warning | Response rẻ nhất | MVP test? |
|---|---|---|---|---|---|
| R01 | Người học không trả tiền | H/C | <5/30 self-funded$49 | STOP B2C sau G0/G3 | Yes |
| R02 | Agent giải quyết luôn việc cần học | H/C | Free agent+checklist đạt ceiling | Baseline honest; kill learning wedge nếu không incremental value | Yes/Partial future |
| R03 | Copycat/free incumbent có cùng bài | H/H | Buyers chọn free sau xem alternatives | Accept copyability, đừng build platform như moat | Partial |
| R04 | Assessment thành commodity | H/H | Feature agentic có khắp vendors | Bỏ hiring thesis | Yes: desk research |
| R05 | Users/agents giả score và telemetry | H/H | Report pass nhưng reasoning sai | No credential/rank; observed sample+trust labels | Partial |
| R06 | Content authoring quá đắt | H/C | >44h inventory tối thiểu | Refund/PAUSE; không AI auto-publish | Yes |
| R07 | Version/framework drift ăn maintenance | M/H | >4h/tháng hai tháng | Stdlib/pin/retire; không thêm framework | Partial |
| R08 | LLM bill vượt doanh thu | M/H nếu thêm tutor | Requests/tokens/user tăng | Eliminate provider-paid tutor MVP | Yes: scope |
| R09 | Cloud execution/retry/abuse đốt tiền | M/C nếu thêm sandbox | Cost per run/concurrency tăng | Eliminate cloud execution/upload | Yes: scope |
| R10 | Weak retention/repeat value | H/H | Lab2<10/20 start; delayed outcome fail | Finite pack; không subscription/season | Yes |
| R11 | Không distribution | H/C | Không đủ prospects/buyers trong cap | PAUSE, không invent TAM/SEO plan | Yes |
| R12 | Price không vừa WTP và cost | H/C | $49 không convert; lower price âm after costs | Kill economics; không subsidize vô hạn | Yes |
| R13 | B2B sales cycle quá lâu | H/H | 30days không 2 paid clinics | STOP fallback; không SSO/custom feature | Yes |
| R14 | Hiring market giảm/change | M/H | Requisitions/budget hoãn | Không dependent hiring revenue; monitor only | Partial |
| R15 | Evaluator/rubric sai, ambiguity | M/C | Alternative đúng bị reject | Spec review/mutants/counterexamples/quarantine | Yes |
| R16 | Model/provider đổi behaviour/quota | H/H | Một agent vượt mọi bài, setup instructions hỏng | Optional BYO/manual, rerun baseline, no rankings | Partial |
| R17 | Release bị chèn code/instructions độc | M/C | Unexpected network/import/credential prompts | Canonical source/review/withdrawal; block release | Partial |
| R18 | Founder spread quá mỏng | H/H | 160h cap nhưng roadmap cứ tăng | WIP1; one track; only next-gate issues | Yes |
| R19 | Overengineering trước paid evidence | H/H | Auth/queue/graph/CMS trước5 buyers | P0 lock; architecture ROI gate | Yes |
| R20 | Product quá rộng | H/H | Student+hiring+team mọi thứ thành requirement | Reject thesis list; no “full brief” obligation | Yes |
| R21 | Local/BYO UX thành support nightmare | H/H | p90>30min, rescued majority | Một docs fix; static review fallback or STOP | Yes |
| R22 | Metric hoàn thành giả learning | H/C | Users finish nhưng transfer không đúng | Correctness/gain/false-positive gate, free baseline | Yes |
| R23 | Privacy harm qua telemetry/support | M/C | Corporate logs/prompt history được gửi | Collect less, synthetic-only, delete incidentally shared info | Partial |
| R24 | Badge/employer score không được tin | H/H | Buyer đòi validation/cheat prevention | Không bán chứng chỉ/employee ranking | Yes: reject feature |
| R25 | “Data moat” không hình thành | H/H | Data không tạo improvement/reduced cost | Accept content business or STOP platform | Partial |
| R26 | Presale liabilities lớn hơn capacity | M/H | Late delivery/refund unavailable | Hold full liability; no pack2; refund if G1 fails | Yes |
| R27 | Merchant/payment friction chặn mua hàng | M/H | Cannot settle/refund/invoice in chosen market | PAUSE before charging; don't invent successful checkout | Yes |
| R28 | Founder credibility/teaching chưa đủ | M/H | Reviewers/learners bác debrief | Independent expert review trước release | Yes |
| R29 | Toy problem không chuyển giao | H/H | ICP không map to recent incident | Validate relevance; no fake realism via more services | Yes |
| R30 | Support hết30 ngày nhưng buyer còn kỳ vọng | M/M | Inbox cost tăng sau delivered sale | Explicit scope, separate consulting/refund reason | Yes |
| R31 | Fake retention do reminder/coaching | H/H | Chỉ moderated cohort quay lại | Assisted/unassisted separate; one standard reminder | Yes |
| R32 | Recovery mất order/consent/version | M/H | Restore không tái dựng entitlement | Private ledger drill + merchant reconciliation | Yes |

## Risks đang mở, không giấu sau future work

**CRITICAL unresolved:** R01 WTP; R02 substitute/agent progress; R06 content cost/authoring capacity; R11 distribution/CAC; R12 price viability; R15 rubric correctness; R22 learning value. Chúng chặn *product release/scale theo gate tương ứng*, không chặn việc chuẩn bị thí nghiệm giấy. Không tự đánh dấu resolved sau viết tài liệu.

**Operational prerequisites unresolved:** merchant/entity/refund route, nơi lưu participant ledger có kiểm soát, competent reviewer và founder capacity. Không có tiền được thu, người dùng được tuyển, lab được thực thi hoặc app được deploy trong planning task.

Pre-mortem tổng hợp: cheap cloud không cứu được labour economics; learner satisfaction không chứng minh skill transfer; privacy minimization làm data moat yếu hơn; stronger verification trong hiring làm UX/cost nặng hơn; content novelty có thể phá library reuse. Phản ứng mặc định là xóa scope/kill thesis, không thêm lớp hạ tầng.
