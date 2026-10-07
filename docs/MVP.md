# MVP — experiment trước platform

2026-10-07. Tất cả phạm vi, effort và ngân sách dưới đây là HYPOTHESIS/giới hạn đề xuất; **chưa implement, chưa deploy**.

## P0: cheapest valid experiment

10 ngày làm việc, tối đa **20 giờ founder + $100 tiền mặt**, không mua hạ tầng mặc định. Research hiện tại là planning sunk cost riêng, không tính giả vào chi phí acquisition sau launch. Có landing copy, interview script, sample brief và offer $49 trong [VALIDATION_ASSETS](VALIDATION_ASSETS.md). Dùng tài liệu tĩnh và thanh toán/invoice hợp lệ sẵn có sau khi kiểm tra merchant eligibility. Không cần auth, database, CLI hay thanh toán tích hợp.

15 phỏng vấn ICP, 30 offer đủ điều kiện, tối đa 60 liên hệ có chủ đích qua hai kênh; không gửi hàng loạt tự động. Ít nhất 5 khách không phải người quen trả đủ $49, biết đây là pre-order cho hai bài, có deadline và hoàn tiền rõ. Nếu thất bại → STOP B2C thesis hoặc thử fallback theo cổng riêng. Waitlist và lời khen không thay payment.

## P1–P3: MVP học tập sau G0

Một **free demo + hai paid labs**, một Python backend track, ba competency: requirement/counterexample; regression verification; merge/rollback reasoning. Hai lab khác context, không tính đổi seed là bài chuyển giao mới. Starter code, flawed PR, public tests, reference fix, debrief và regression fixtures do founder review. Bài warm-up không cần cài đặt.

Loop: đọc incident/spec → ghi dự đoán lỗi trước feedback → dùng agent riêng tùy chọn để điều tra → viết test/fix → chạy local deterministic checks → đọc debrief → thử case chuyển giao sau 7–14 ngày. AI được phép trong bài thực hành; một micro-probe không AI có consent và self-report để thăm dò hiểu biết độc lập, không phải kỳ thi chống gian lận.

Không có uploader code/transcript. Learner có thể chia sẻ JSON report đã xem trước và checklist phản tư giới hạn ký tự; đó là dữ liệu không tin cậy. Founder không chạy mã học viên. Buổi quan sát chỉ xem workflow trong repo synthetic, không quay toàn màn hình, không thu repo công ty.

| IN MVP | NOT IN MVP |
|---|---|
| Một runtime Python được pin, Git hoặc tải bundle nguyên bản | Browser IDE/cloud sandbox, multi-language/framework |
| Demo + 2 labs, explanations viết sẵn, deterministic local tests | AI tutor, AI judge, LLM proxy, stored API keys |
| File manifest/report versioned, hướng dẫn 3 bước | Agent transcript adapters, background recorder, plugin marketplace |
| Order/entitlement xử lý thủ công có đối soát | Dashboard, complex auth, automatic recommendations |
| Đo onboarding/support/payment/second lab/transfer | Leaderboard, certificate, hiring score, social graph |
| Plain text và keyboard-friendly assets | CMS, season, streak, daily challenge treadmill |

LATER: monolith chỉ sau G3/G4, first-order profit, bottleneck>2h/tuần trong2 tuần **và** payback build/security/maintenance≤90 ngày tại actual volume. Cắt việc hoặc merchant delivery trước. Không thêm accounts chỉ để lưu report; BYO không cần API adapter.

NEVER unless evidence changes: nhận repo tùy ý; tự động chạy uploaded code; camera/keystroke surveillance; bán điểm tuyển dụng chưa được validate; một cloud sandbox chỉ để giấu test; adaptive/IRT/BKT “mastery” từ vài bài; trả phí LLM không trần.

## Effort và sequencing

| Work | Effort giả thuyết | Trần / dependency |
|---|---:|---|
| P0 demand experiment | 20h | G0 trước viết executable lab |
| Hai labs24h + bốn static measurement probes8h + independent review/rework8h | 40h | Demo là excerpt; hard cap44h, inventory trong CONTENT_STRATEGY |
| Local packaging + hướng dẫn + hai OS smoke pilots | 8h | Không agent-specific integration |
| P2 10 người dùng đầu, troubleshoot/observation | 12h | Tách assisted và self-serve |
| P3/G4 thêm tối đa90 eligible offers + follow-up | 28h | 30 G3 trước,60 thêm chỉ sau G3 pass |
| P4 D7/D14 transfer/retention + phân tích | 12h | Có trước khi thêm content |
| P5 team experiment nếu đủ điều kiện | 20h | Hai manager prepay, không tự build team UI |
| Buffer/maintenance/reconciliation | 20h | Không dùng để mở scope |

Tổng160h gồm option team20h: P0=20, content40, packaging8, P2=12, acquisition28, P4=12, team20, buffer20; cash cap$500. Reviewer labour nằm trong40h content; tiền thuê cũng thuộc$500. Không có pack2 trong inventory/cam kết. Thiếu competent independent content reviewer→PAUSE. Giữ100% preorder liability refundable riêng, không tiêu như budget. Giá v2$49 sửa từ draft$29 trước launch sau red-team cost audit.

## Một case để kiểm tra trước khi nhân rộng

Lab A: xử lý sự kiện trùng ID; PR xanh với happy-path nhưng retry có thể cập nhật số dư hai lần. Learner tìm chuỗi đầu vào tái lập, viết regression test và sửa; spec định nghĩa duplicate, khác payload cùng ID và failure rollback. Lab B: cùng tư duy invariant trong xử lý quyền/ranh giới trên synthetic tenant data. Không phải tình huống production được copy; không dùng tiền thật, service thật hay secrets.

Các test local kiểm tra một implementation trên fixture, không chứng minh tác giả, độ bao quát hay hiểu biết. Có reference đúng và ít nhất bốn faulty implementations cho mỗi lab để kiểm tra chất lượng test; phải bắt mutation vi phạm invariant và không phạt một alternative đúng. Không “đếm test xanh” như universal skill.

## Feature challenge

WTP có thể kiểm tra không account → bỏ auth P0. Có thể giao file thủ công → bỏ CLI distribution service. Có thể feedback viết sẵn → bỏ AI review. Có thể bán pack → bỏ subscription. Có thể dùng ba competency tags → bỏ graph engine. Có thể dùng local tests công khai → bỏ hidden-test infrastructure. Chỉ thêm thứ rút ngắn một bottleneck đã đo.
