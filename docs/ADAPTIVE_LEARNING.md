# Adaptive Learning

## Baseline có thể giải thích

Phase đầu dùng luật minh bạch, không gọi một heuristic là IRT/BKT đã kiểm định. Tách 3 loại sự kiện: practice feedback, independent assessment evidence, review scheduling. Bài đã xem lời giải hoặc dùng AI vẫn có giá trị học tập nhưng không trực tiếp chứng minh mastery độc lập.

Lõi foundation lấy tối đa một observation đầu tiên hợp lệ cho mỗi question family trong một assessment window đã xác định ở caller. Chỉ nhận server-graded, không trợ giúp và không solution_seen. Cùng family với nhiều seed không phải nhiều bằng chứng độc lập. Nếu dữ liệu cho cùng event id mâu thuẫn thì từ chối, không lặng lẽ chọn bản có lợi.

Heuristic quan sát: Beta(1,1), posterior mean=(1+successes)/(2+n). Đây chỉ là smoothed practice estimate, KHÔNG là xác suất có năng lực nghề nghiệp. Label evidence: insufficient khi n<5. Cổng mastery đề xuất cần mean≥0.8, ≥5 families, ≥2 sessions, ít nhất 1 delayed independent check và prerequisite đạt. Các ngưỡng là giả thuyết cần hiệu chỉnh. Không hiển thị con số phần trăm với độ chính xác giả; profile luôn kèm n/coverage và ngày đo.

Retest đúng thời điểm có thể đo lại family cũ trong window mới. Lưu history/window/version để không vĩnh viễn kẹt vì câu sai đầu tiên. Không cho client tự tạo window để farm điểm. Historical attempts bất biến; recomputation tạo profile snapshot mới.

## Đề xuất bài

Ưu tiên: prerequisite gap → misconception lặp → spaced review đến hạn → bài mới đúng mục tiêu. Difficulty dựa kết quả và loại lỗi, không phạt chậm đọc hoặc nhu cầu accessibility. Mỗi recommendation có reason_code, target_skill, algorithm_version, input_snapshot và alternative ids. Học viên có thể nói “quá dễ/khó/không phù hợp” và chọn đường thay thế.

Nếu thiếu câu phù hợp, công khai content gap và chuyển lesson nền, không dùng AI tự tạo bài chưa validation như assessment. Không lặp vô hạn cùng một câu; tối đa số retry được cấu hình rồi chuyển hình thức giải thích.

## Mistake notebook

Lưu code/câu sai chỉ khi cần, cùng rubric/misconception/version và consent policy. Review dự kiến 1,3,7,14,30 ngày theo brief; ngày đến hạn dùng timezone learner, tính lưu UTC. Học viên có thể snooze và nghỉ; không reset năng lực vì đứt streak. Delayed review cần biến thể chưa gặp và không hỗ trợ để được dùng làm evidence.

## Sau pilot

Ghi dữ liệu exposure, item parameters, assistance, elapsed active time, confidence self-report, difficulty, outcome, version và selection reason. Từ đó mới so sánh rule baseline với BKT/IRT/knowledge tracing trên holdout theo learner và question family. Kiểm tra calibration, subgroup error và transfer trước rollout; tránh leakage train/test. Thay thuật toán không thay ngược điểm lịch sử nếu chưa có policy regrade.
