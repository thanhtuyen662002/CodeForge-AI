# Content Model and Quality Pipeline

## Versioned content

Course → Module → Lesson; Track/LearningPath là cấu hình tham chiếu lessons/skills/blueprints, không phải UI hard-code. Lesson 5–15 phút: concept, visualization có text alternative, simple/interactive example, exercise, challenge, real-world task, independent check. Không bắt mọi lesson chứa toàn bộ chuỗi nếu làm loãng mục tiêu.

Question logical id → immutable QuestionVersion → parameterized QuestionInstance. Version lưu skill weights, difficulty 1–10, estimated_time, prerequisites, prompt, public examples, accessibility notes, source provenance, grading reference và allowed modes. Không trộn learner DTO với grading keys. DatasetVersion có schema, fixture bytes/hash, license, locale, time anchor, generation seed và expected comparator.

## Pipeline

Draft (human/AI proposal) → schema validation → deterministic expected-output tests → edge/adversarial tests → pedagogy/content review → publish. Author và reviewer phải được ghi rõ; automation không giả mạo human review. Thiếu người duyệt: giữ draft. AI không tự sửa expected answer để hợp thức hóa câu sinh sai.

Mỗi Python challenge: reference solution + public cases + private test generation contract, edge cases và anti-hardcoding variants. Không commit production hidden tests vào repo public. Mỗi SQL item: disposable dataset, reference query, unordered multiset mặc định trừ khi đề yêu cầu ORDER BY; duplicates, nulls, ties, decimals và timezone phải được kiểm thử. Ngày tương đối như “90 ngày gần nhất” dùng as_of cố định, không now() thay đổi theo ngày chạy CI.

Question family giữ quan hệ các biến thể; các biến thể không được đếm như kỹ năng mới. Hidden-test confidentiality khác tính đúng: public practice có thể công khai đáp án nhưng không được tái dùng nguyên dạng cho high-stakes assessment.

## Seed content và phạm vi

Mục tiêu đầy đủ của brief: 100 Logic, 150 Python, 150 SQL, 100 Data, 75 AI, 50 debugging exercises, 25 business cases, 10 coding mini-projects, 5 full mock exams. Các loại có thể overlap về tagging; thống kê primary content type tránh đếm hai lần. Không tuyên bố đã có các số lượng này.

Slice đầu: đề xuất 24 câu được duyệt (8 Logic, 8 Python, 8 SQL), 3 lessons và 1 mini mock. Foundation chỉ có fixtures kiểm tra contract, không phải 24 câu production đã review. Sau khi pipeline và slice đạt mới tăng đến 60, 150 rồi các mức brief. Chất lượng, coverage, duplicate-family rate và review capacity quyết định mở rộng, không số câu AI sinh trong một lần.

## Publishing and correction

RBAC author/reviewer/admin; không cho learner đổi status. Published versions không UPDATE/DELETE; unpublish chỉ đổi catalog visibility cho lần chọn mới. Attempt cũ giữ snapshot. Khi phát hiện lỗi: quarantine item, dừng chọn mới, báo ảnh hưởng, regrade có version + reviewer, cho người học appeal. Không trừ năng lực vì lỗi đề/hạ tầng.

Business cases phải giả lập và ghi rõ giả lập. Nội dung VinUni gắn FACT/INFERENCE/PRACTICE CONTENT. Licenses/quyền ảnh/video/dataset được kiểm tra trước publish; quyền xem công khai không đồng nghĩa quyền sao chép.
