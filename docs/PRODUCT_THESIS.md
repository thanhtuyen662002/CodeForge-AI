# Product thesis — quyết định sau research, trước validation

Ngày: **2026-10-07**, Asia/Bangkok. Trạng thái: đề xuất chiến lược được đối soát; chưa phải customer validation hay founder approval để chi tiền. FACT = nguồn đã kiểm tra; INFERENCE = diễn giải; HYPOTHESIS = điều phải thử. Mọi điểm số bên dưới là HYPOTHESIS, không phải dữ liệu thị trường.

## Quyết định

**BUILD WITH CONDITIONS: chỉ làm P0 để kiểm chứng; không xây platform trước cổng thanh toán.** Bỏ hướng mặc định “học lập trình/data/AI từ zero đến thi thử”. Không tiếp tục backlog đó theo quán tính. Nếu không qua cổng trong [VALIDATION_PLAN](VALIDATION_PLAN.md), dừng thesis, không thêm tính năng để cứu nó.

**PRIMARY — Python backend verification drills:** gói hai bài thực hành 30–45 phút về đọc một thay đổi do AI tạo ra, tìm lỗi, viết phản ví dụ/test hồi quy, sửa lỗi và giải thích quyết định merge/reject. Người học đã biết Python/Git, đang dùng coding agent hằng tuần, từng phải sửa hoặc nghi ngờ AI-generated change trong 30 ngày qua. Một demo miễn phí. Dùng agent riêng nếu muốn, chấm kết quả bằng kiểm tra xác định trên máy người dùng; report là kết quả luyện tập tự khai, không phải chứng nhận năng lực.

**SECONDARY — team review clinic:** cùng corpus và bài chuyển giao, bán buổi thực hành cho engineering manager của team 5–10 người. Chỉ thử khi có manager chịu trả tiền; không đổi nhãn lượt học B2C thành demand B2B. Khối lượng phục vụ và thời gian bán hàng phải tính vào giá. Đây có thể là dịch vụ nhỏ, không mặc nhiên trở thành SaaS.

**REJECTED NOW:** general AI tutor/curriculum, agent leaderboard clone, hiring assessment, verified skill passport, browser/cloud IDE và SRE sandbox. Có thể xét lại bằng một thesis mới có evidence, không âm thầm đưa vào roadmap.

## Tại sao chọn một gói nhỏ

- FACT: Kodwai mô tả challenge chạy local với Claude Code/Cursor/Codex, developer dùng miễn phí; ba lượt chấm đầu do họ trả, sau đó người dùng cung cấp Anthropic API key. CodeSignal đã quảng bá agentic assessments. Xem nguồn K1/K2/A2 trong [MARKET_RESEARCH](MARKET_RESEARCH.md), kiểm tra 2026-10-07.
- INFERENCE: local + BYO + scoring tự thân không khác biệt. Đấu với mạng lưới tuyển dụng hoặc catalog rộng là bất lợi cho founder nhỏ.
- HYPOTHESIS: một người vừa bị AI tạo lỗi sẽ trả $49 để luyện kiểm chứng có feedback rõ, thay vì tự thiết kế bài. Đây là nhu cầu hẹp có thể kiểm tra bằng tiền thật trước khi có app.
- HYPOTHESIS: lợi ích là quyết định kiểm chứng tốt hơn trên một case mới; không phải viết prompt dài hơn, số lượt agent ít hơn hoặc tổng số test xanh.
- Phản đề mạnh: agent hiện tại hoặc tháng sau có thể review tốt hơn người học, và người học thích dùng agent đó hơn bỏ thời gian luyện. P0/P2 phải cho phép kết quả này giết thesis.

## Thi đấu tám thesis

Điểm 1–5, **5 luôn thuận lợi**. Competition = ít áp lực cạnh tranh; cost/complexity/risk = rẻ/đơn giản/rủi ro thấp. Trọng số cố định: pain 3, WTP 3, competition 2, differentiation 2, moat 1, MVP 3, operations 3, AI 2, infrastructure 2, founder complexity 3, first revenue 3, retention 1, B2B expansion 1, defensibility 1, risk 3 (tổng 33). Tổng = tổng điểm×trọng số / 165 ×100. Điểm không được dùng lấn át veto về safety, demand hoặc distribution.

| Thesis | Pain | WTP | Competition | Differentiation | Moat | MVP rẻ | Ops rẻ | AI rẻ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| T1 Broad beginner AI school | 3 | 2 | 1 | 1 | 2 | 1 | 1 | 2 |
| T2 General agent engineering courses | 3 | 3 | 1 | 2 | 2 | 3 | 2 | 3 |
| T3 BYO agent scoreboard | 3 | 2 | 1 | 1 | 2 | 3 | 2 | 3 |
| T4 Employer hiring assessment | 4 | 5 | 1 | 2 | 3 | 1 | 1 | 2 |
| T5 Verification drill pack | 4 | 3 | 2 | 3 | 2 | 5 | 4 | 5 |
| T6 Team review clinic | 4 | 4 | 2 | 3 | 3 | 4 | 2 | 5 |
| T7 Production/SRE debugging lab | 4 | 3 | 2 | 2 | 3 | 2 | 2 | 5 |
| T8 Verified skill passport/network | 3 | 2 | 1 | 2 | 4 | 1 | 1 | 3 |

| Thesis | Infra rẻ | Founder đơn giản | Revenue nhanh | Retention | B2B | Defensible | Risk thấp |
|---|---:|---:|---:|---:|---:|---:|---:|
| T1 | 1 | 1 | 2 | 3 | 3 | 1 | 1 |
| T2 | 4 | 3 | 3 | 2 | 3 | 2 | 2 |
| T3 | 4 | 2 | 2 | 3 | 3 | 1 | 1 |
| T4 | 2 | 1 | 1 | 3 | 5 | 3 | 1 |
| T5 | 5 | 4 | 4 | 2 | 3 | 2 | 3 |
| T6 | 5 | 3 | 4 | 3 | 5 | 3 | 3 |
| T7 | 1 | 2 | 3 | 3 | 4 | 3 | 2 |
| T8 | 3 | 1 | 1 | 3 | 5 | 2 | 1 |

Điểm tính và sensitivity sẽ được lưu ở [UNIT_ECONOMICS](UNIT_ECONOMICS.md). T5 được ưu tiên do rẻ để bác bỏ, không do moat đã tồn tại. T6 có WTP có thể cao hơn nhưng bán hàng và delivery tốn công. T4 có doanh thu/khách hàng hấp dẫn nhưng độ tin cậy, acquisition và privacy vượt khả năng MVP.

## Khác biệt phải được chứng minh

Một bài bắt đầu từ PR lỗi có vẻ hợp lý, yêu cầu tạo phản ví dụ tái lập và ghi trade-off. Feedback giải thích vì sao fix/test không đủ; bài tiếp theo kiểm tra cùng năng lực trong ngữ cảnh khác. Không có tuyên bố đối thủ không thể làm vậy. CodeForge chỉ thắng nếu khách trả tiền vì chất lượng thực hành và tiết kiệm công chuẩn bị; “niche” không phải moat.

Initial wedge: Python backend correctness, xử lý retry/idempotency và boundary/tenant isolation trên fixture giả lập, standard library, không web framework/database thật. Chỉ hỗ trợ môi trường đã pilot; không hứa mọi hệ điều hành ngay từ landing.

## Kỹ năng con người có thể còn đáng trả tiền

HYPOTHESIS: đặt tiêu chí chấp nhận, phân biệt vấn đề nghiệp vụ với triệu chứng, tìm counterexample, xác minh kết quả, quyết định rollback/merge, giải thích giới hạn bằng chứng, giới hạn quyền agent. Agent cũng có thể làm nhiều việc này; quyền chịu trách nhiệm không tự động tạo demand học tập. Đo kết quả trên case mới và so với workaround “nhờ agent review + checklist miễn phí”, không chấm phong cách prompt.

Không bắt đầu bằng CS students. Không suy từ số developer toàn cầu ra TAM. [CUSTOMERS](CUSTOMERS.md) phân tích mười segment; chưa có segment nào có WTP được xác thực.

## Quyền quyết định

Research này cho phép chuẩn bị experiment assets và issues P0; không chứng minh cần ngân sách cloud, không xác nhận doanh thu, không cho phép gọi dữ liệu giả là người dùng thật. Các artifact ở nhánh foundation cũ giữ như lịch sử, không phải cam kết sản phẩm tiếp tục. [RECONNAISSANCE](RECONNAISSANCE.md) ghi rõ cái gì có thật.
