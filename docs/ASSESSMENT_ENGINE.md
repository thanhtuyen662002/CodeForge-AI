# Assessment Engine

## Hai diagnostic khác nhau

Quick: 18 item, khoảng 15–30 phút; ưu tiên logic, khái niệm lập trình, đọc Python và SQL căn bản. Dùng branching nhẹ từ câu dễ, có “chưa biết”. Đây là định tuyến sơ bộ, không đo đủ cả 10 miền. Miền không đo hiển thị unknown. Học viên tuyệt đối mới có đường học từ zero thay vì bắt làm full test.

Full: blueprint thử nghiệm 39 item / 90 phút, cho phép biến thể 60–120 phút theo blueprint version. Thiết kế ban đầu, không phải cấu trúc đề VinUni.

| Miền | Item | Phút dự toán |
|---|---:|---:|
| Logic | 5 | 7 |
| Quantitative | 4 | 6 |
| Programming concepts | 4 | 6 |
| Python, gồm 2 bài viết/sửa code | 5 | 16 |
| SQL, gồm 2 query | 4 | 14 |
| Data handling | 4 | 8 |
| Debugging | 4 | 10 |
| Algorithmic thinking | 3 | 9 |
| AI fundamentals | 4 | 6 |
| Practical problem solving | 2 | 8 |

Kiểm chứng thời gian và item quality trước publish. Không dùng thời gian nhanh/chậm như bằng chứng duy nhất của năng lực; hỗ trợ accommodations được lưu server-side.

## Item contract

Các loại trong full engine: single/multiple choice, fill, code ordering, predict output, find/fix bug, code, SQL, dataset analysis, case, short answer, practical task. Slice triển khai choice + Python + SQL trước; không giả lập đã hỗ trợ mọi loại. Partial credit theo rubric version; multi-choice scoring phải chống chọn tất cả. SQL dùng multiset hoặc order-sensitive theo đề, null/type/float tolerance được khai báo.

QuestionVersion, dataset hash, runtime image, seed, blueprint version và grading rubric được pin khi tạo attempt. Published version là bất biến. Hủy một item sai tạo correction/regrade event với lý do, không viết đè lịch sử.

## Exam state machine

created → in_progress → submitted/expired → grading → graded; nhánh infrastructure_failed → retryable_grading. submitted/expired là trạng thái khóa đáp án. Một transaction khóa row, dùng DB server time, kiểm tra owner, deadline, state, optimistic revision và idempotency key. Key giống + payload khác trả 409. Timeout backend không được biến thành điểm 0.

Autosave trả server revision và saved_at. Client không tự tuyên bố saved trước ACK. Deadline không gia hạn khi reload; kết thúc dựa server time. Late packets bị từ chối có giải thích; không cho khai thời gian client để vượt giờ. Submit lặp không tạo nhiều attempt/evidence. Tab thứ hai không được ghi đè bản revision mới bằng dữ liệu cũ.

## Integrity và feedback

Practice có trợ giúp; Timed Practice tùy blueprint; Mock/Pressure/Weakness/Adaptive modes có policy rõ. Pressure tự nguyện, không bắt người mới. Exam cấm tutor/hint bằng server entitlement, không gửi hidden tests/keys/solutions. Tab-switch chỉ tín hiệu phi kết luận; không tự gắn nhãn gian lận, không webcam surveillance. Copy/paste mặc định không khóa vì accessibility; bài thi nào cần hạn chế phải có policy và giải thích.

Result: breakdown, coverage, evidence, mistakes và next step; không chỉ tổng điểm. Case study dùng rubric người duyệt; LLM có thể đề xuất feedback nhưng không là ground truth hoặc người quyết định chứng nhận. Item exposure của repo public không thể là bảo mật đề thi; dùng ngân hàng private cho mock kín, giảm claim high-stakes.
