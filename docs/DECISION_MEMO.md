# Founder decision — 2026-10-07

**BUILD WITH CONDITIONS: chỉ thực hiện P0 để mua thông tin. Dừng đầu tư platform cho tới khi có bằng chứng.** Nếu không có willingness-to-pay hoặc agent + checklist miễn phí đủ tốt, STOP là kết quả thành công của planning.

1. **CodeForge là gì:** hypothesis về gói hai Python backend verification drills: tìm counterexample, regression checks và quyết định merge/reject một thay đổi có vẻ đúng. Chưa là product được validate.
2. **Ai trả:** engineer Python backend 1–5 năm, dùng coding agent hằng tuần, vừa gặp lỗi/nghi ngờ AI change trong30 ngày; tách người tự trả khỏi employer-funded.
3. **Vì sao trả:** giả thuyết họ muốn luyện judgment trên case có feedback rõ mà không tự soạn bài. Chưa có receipt/interview chứng minh.
4. **Why now:** agentic tools/assessment đã có trong offer của đối thủ; việc kiểm chứng đáng nghiên cứu. Survey hoặc agent adoption không chứng minh demand học trả tiền. Sources/check date ở [MARKET_RESEARCH](MARKET_RESEARCH.md).
5. **Đối thủ thiếu gì:** chưa chứng minh có khoảng trống. Kodwai đã local/BYO/free; CodeSignal/Codility/CoderPad có agentic assessment; agent review là substitute. CodeForge chỉ tiếp tục nếu người mua đánh giá debrief/relevance tốt hơn workaround cụ thể.
6. **Wedge:** retry/idempotency và boundary/tenant reasoning, synthetic Python stdlib; finite pack, không curriculum rộng.
7. **Moat dài hạn:** chưa có. Opt-in, adjudicated failure evidence có thể cải thiện debrief/counterexamples và giảm authoring cost; đo ở cohort sau. Không coi model, prompts, tags hay lượng telemetry là moat.
8. **MVP:** P0 tài liệu tĩnh + offer + private ledger. Chỉ sau G0 mới author hai labs/bốn probes, một demo excerpt, local public deterministic checks, optional BYO agent. Không nhận code/transcript hoặc chấm tuyển dụng.
9. **Giá thử:** $49/2-lab pack; full-price, pre-order có deadline/refund rõ. Draft$29 đã bị red team bác vì content cost thiếu. Không discount để đạt gate$49.
10. **Distribution hypothesis:** warm-introduction ngoài friends và Python/backend communities cho phép outreach; hai kênh, ≤60 targeted contacts P0. Chưa có audience hay CAC được chứng minh. Không spam; outbound chưa được thực hiện bởi task planning này.
11. **Operating cost:** CodeForge LLM/cloud-execution $0 trong MVP. Shadow labour$30/h; content40h=$1,200; pack variable economic cost$9.965, contribution79.7% **trước** content/CAC/fixed. Với100 sales giả định content$12/pack; chỉ25 sales thì lỗ$8.965/pack sau content. Optional host$80/mo chưa cần.
12. **Rủi ro lớn nhất:** không ai tự trả, agent thay thế value, đo completion thay learning, khó recruit, content/reviewer/support tốn hơn dự kiến. Merchant và reviewer còn unresolved, không được che bằng roadmap.
13. **Kill:** trong10 ngày làm việc/20h/$100:15 interviews,30eligible offers,≥8 incidents và≥5 stranger self-funded payments. Đủ mẫu mà fail→STOP B2C. Không recruit/merchant feasible trongcap→PAUSE. Sau đó cần G2 onboarding, G3 self-serve$49, G4 learning/repeat, G6 actual margins; [protocol](VALIDATION_PLAN.md) là canonical.
14. **Không xây:** general coding school, AI tutor/judge, browser IDE/cloud sandbox, hidden-test service, seasons, leaderboard, certificate/hiring passport, custom agent integrations, microservices/queues/vector DB. Supabase/Vercel là lựa chọn có điều kiện, không requirement P0.
15. **90 ngày:** ngày1–14 P0; nếu pass,15–28 content/review;29–38 pilot/comparator;ngày39 G3offers, payment cutoff45 và refund-mature readout59; sau pass tuyển thêm đếnngày70, đọc delayed outcomes ngày90. Lịch trễ có thể dẫn PAUSE, không nới gate. G5 team clinic$300 chỉ khi manager demand riêng và budget còn; không ép chạy song song. Tổng160h/$500, một pivot tối đa; thiếu mẫu→PAUSE.

**Open blockers được chấp nhận chỉ để làm research:** WTP, incremental value và distribution. **Blockers trước charge/release:** merchant/refund readiness, feasible delivery promise; competent independent content reviewer và G1 trước executable release. **Blockers trước merge:** required CI + eligible independent GitHub approval. Hai agent phản biện không phải human approval hoặc content expert sign-off.

Strongest reason NOT BUILDING: mọi phần dễ scale đã có free substitutes; phần có giá trị như feedback đáng tin và distribution lại cần founder labour. Một pack bán được chưa chứng minh recurring business, hiring signal hoặc defensibility. [42 red-team findings](RED_TEAM.md) và [32 failure scenarios](RISK_REGISTER.md) giữ luận điểm này mở.
