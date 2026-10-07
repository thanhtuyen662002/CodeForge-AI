# Content economics và lifecycle

2026-10-07. DESIGN/HYPOTHESIS, chưa có lab được viết hoặc review. Không coi fixtures foundation cũ là catalog production. Không sao chép proprietary challenges hoặc incidents của khách hàng.

## Inventory cố định và cost đã tính

| ID | Artifact / purpose | Exposure | Hours budget |
|---|---|---|---:|
| DEMO | Static excerpt: incident/spec + một câu hỏi dự đoán | Public, không giải đáp paid lab | Nằm trong LAB-A |
| LAB-A | Retry/idempotency invariant, flawed PR, tests, reference, debrief | Starter trước; reference/debrief giao riêng sau attempt |12|
| LAB-B | Tenant/boundary decision trong context khác | Sau LAB-A; không cùng starter bundle |12|
| PROBE-A/B | Hai form tương đương cho baseline/post comparator | Private delivery theo assignment trước feedback |4|
| PROBE-C/D | Hai form context mới cho delayed transfer/counterbalance | Sau7–14 ngày; không nằm trong repo learner |4|
| QA | Independent subject review, one alternative-correct solution/lab, ambiguity + mutation checks, rework | Reviewer chưa đọc answer trước khi thử |8|
| **Total** |2 labs+4 static probes; demo là excerpt, không thêm track | Không có pack2 |**40**|

Hard cap44h gồm rework lấy4h từ buffer; fail→giảm experiment hoặc refund/PAUSE. $1,200 shadow cost ở$30/h; có thuê reviewer thì cash cũng trong$500 overall. Competent reviewer chưa được cung cấp; **release blocker**, không giả nhận xét của coding agent là pedagogical expert approval.

## Permanent library, competency tags trước graph

Ba tags: identify invariant/counterexample; test discrimination; explain merge/rollback uncertainty. Tag→prerequisite là bảng nhỏ có version, không graph service/mastery estimate. Graph chỉ có giá trị nếu recommendation dùng nó cải thiện transfer; chưa cần algorithm hay adaptive engine.

Giữ≤2 paid labs trong experiment,≤4 measurement probes. Không season, weekly league hay hứa new content. Hoàn tất pack không phải churn bất thường. Nếu có nhu cầu novelty phải tính chi phí content mới; không đổi tên season thành pack series.

Reusable template: spec→plausible faulty change→invariants→valid and invalid traces→reference+alternative→mutants→test oracle→debrief→unseen context. Parameterization đổi IDs/time ordering/payload giúp luyện cùng family; không làm “năng lực mới” hoặc protected hidden tests. Seed/time anchors fixed và recorded. Không dùng current timestamp/network để grading nondeterministic.

## Deterministic evaluation và calibration

Reference pass mọi required invariant,≥4 faulty versions phải bị bắt,≥1 alternative đúng không bị reject. Thêm một reviewer counterexample ngoài bộ mutants founder nghĩ sẵn. Kiểm tra order/duplicate/null/type/boundary theo spec, không mỗi happy-path. Cấm sửa expected answer tự động cho khớp generated solution. Reference/test đúng cùng một hiểu lầm vẫn có thể sai: review spec riêng trước evaluator.

Learning test output khác assessment validity. Rubric structured evidence được người có chuyên môn chấm blind ở comparator; disagreement ghi reason, ambiguous item quarantine. Pilot≥2 người độc lập hiểu được spec trước cohort chính; không dùng họ như chưa-seen transfer participants. Initial difficulty là hypothesis, không label validated.

MVP **không có confidential hidden tests**. Learner kiểm soát local filesystem và có thể sửa test/report. Reference/probes phân phối từng stage để giảm contamination, không lời hứa anti-cheat. Hidden tests tương lai chỉ có ý nghĩa khi trusted evaluator ngoài user machine; toàn bộ high-stakes use hoãn, không build server để giữ bí mật bài tập.

## Publish / maintenance / retirement

Draft→spec review→reference+mutant checks→clean environment smoke→independent content review→immutable release. Repository CodeForge public chỉ chứa demo, manifest/digest, provenance và advisory. Paid bundle và staged probes được giao riêng bằng merchant delivery/private link cho đúng cohort; không commit answer/probe vào public Git history. Private authoring storage có backup và reviewer access tối thiểu. Buyer vẫn có thể chia sẻ bản tải; không DRM hoặc anti-cheat guarantee. Publisher/reviewer record đi cùng version. Hash chỉ xác nhận integrity, không tự chứng minh source authenticity nếu attacker đổi cả bundle/hash. Không auto-run hooks, no installer fetching latest arbitrary package, không community submissions trong MVP.

Manifest version/runtime/evaluator/fixture/provenance pin theo [ARCHITECTURE](ARCHITECTURE.md). Content bug→quarantine catalog, advisory canonical, xác định delivered-version recipients có consent trong30-day support window, gửi correction/refund khi owner thực hiện. Download offline không thu hồi được; không remote kill switch/auto-update. Giữ old version reproducible có warning, không sửa lịch sử điểm.

Maintenance envelope≤4h/tháng:1h runtime/security compatibility,1h appeals/errors,1h agent-baseline check,1h debrief/calibration. Không rewrite theo mỗi model release. Chỉ runtime LTS/minor thực sự test; tối đa2 OS profiles đã test, một packaging route chính. Dependency/framework drift giảm bằng stdlib; trade-off là fidelity, phải hỏi buyer liên hệ với incident thực.

Retire nếu critical flaw không sửa trongcap, review disagree về spec, model+checklist làm bài vô nghĩa, hoặc support>trần. Một lab retired không kéo theo tạo3 lab mới. Pilot record reviewer/date/hash/licensing; AI được draft, không tự publish.

## What scales / what does not

Một debrief tốt có thể reuse nhiều learner; một meaningful counterexample giúp chỉnh rubric cả library. Custom incident tư vấn, phiên bản framework mới, model-specific transcripts và individual code reviews không scale trong scope này. Chỉ mở thêm corpus nếu actual contribution trả được authoring/maintenance và same failure taxonomy vẫn tạo value.
