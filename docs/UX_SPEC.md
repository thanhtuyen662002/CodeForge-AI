# UX Specification — learner first

## Information architecture

Public: trang giới thiệu, cách học, chính sách, bài làm quen. Learner: Today, Learn, Practice, Exams, Mistakes, Progress, Settings. Author: content drafts, validation reports, review queue, publish history. Admin không hiện trong điều hướng học viên; authorization vẫn kiểm tra phía server.

## Luồng màn hình và trạng thái

| Màn hình | Nội dung / action chính | Trạng thái khó bắt buộc |
|---|---|---|
| Onboarding | Mục tiêu, thời gian mỗi buổi, đã biết gì; chọn quick/full/bắt đầu từ zero | Bỏ qua; resume; không yêu cầu thông tin không cần thiết |
| Diagnostic intro | Mục đích, thời gian ước lượng, hỗ trợ accessibility; “chưa biết” không bị bêu xấu | Đổi sang bài làm quen; không gài full test 120 phút |
| Question | Một câu, tiến trình, câu đã lưu, flag; code có ví dụ input/output | Loading, mạng mất, retry trùng, version conflict, hết giờ |
| Skill profile | Kỹ năng đã quan sát, số bằng chứng và vùng chưa đo; bước tiếp theo + vì sao | Coverage thấp: “Chưa đủ dữ liệu”, không vẽ 0% |
| Lesson | Concept ngắn → ví dụ → tự sửa/viết → biến thể | Lỗi đọc được, undo/reset có xác nhận, không mất code |
| Workspace | Đề / editor / output; nút Run khác Submit | Sandbox bận/lỗi khác code sai; stdout bị cắt có nhãn |
| Review | Lỗi, misconception, lời giải thích đã duyệt, bài tương tự | Người học phản hồi chấm sai; không trừ mastery vì lỗi hạ tầng |
| Exam | Timer server, điều hướng, flag, autosave ACK, submit | Tab kép, reload, mất mạng, hết giờ, gửi lại |
| Today | Một việc tiếp theo, bài cần ôn, tiến độ có diễn giải | Tài khoản mới không có chart giả; nghỉ học không bị shame |
| Author | Draft, provenance, expected results, test report, người duyệt | Không publish khi validator lỗi hoặc thiếu quyền |

## Workspace trên mobile

Ba tab Đề / Code / Kết quả; giữ code khi chuyển tab; Run và Stop trong vùng dễ chạm; bàn phím không che lỗi. Dashboard, lesson, quiz thiết kế từ 360px. IDE desktop dùng hai pane có resize, mobile vẫn đọc/chạy code và sửa ngắn được. Không quảng cáo trải nghiệm viết dự án dài trên điện thoại như desktop.

## Accessibility và copy

Mục tiêu WCAG 2.2 AA, xem nguồn W3C trong RESEARCH. Có focus visible, skip link, semantic heading, label lỗi gắn input, đủ tương phản, không truyền nghĩa chỉ bằng màu, giảm motion và hỗ trợ zoom. Editor phải có chế độ textarea có nhãn cho screen reader; không keyboard trap. Timer không liên tục spam aria-live; cảnh báo theo mốc, thời gian được điều chỉnh trước khi bắt đầu theo chính sách accessibility.

“Chưa đủ bằng chứng” thay “Bạn yếu”. “Kết quả chưa lưu, đang thử lại” chỉ hiện khi thật sự chưa nhận ACK. “Sandbox đang lỗi, bài của bạn được giữ nguyên” khác “Code chưa đúng”. Luôn phân biệt đã lưu trên thiết bị và đã lưu trên server.

## Persistence và privacy

Draft cục bộ có owner/session namespace, TTL và xóa khi logout/đổi tài khoản. Không lưu credential. IndexedDB chỉ là convenience, không phải bản nộp chính thức. Exam không nhận submission đến sau deadline chỉ vì đồng hồ client hoặc local timestamp ghi trước đó.

## Nghiệm thu UX

Test bàn phím toàn luồng; 360px và desktop; reload/mất mạng/2 tab; đổi tài khoản trên máy chung; hiểu trạng thái skill chưa đo; xin hint mà chưa lộ đáp án; người học tự tìm được next step. Ghi findings và sửa trước khi mở pilot. Chưa có wireframe ảnh, khảo sát hay usability test được thực hiện trong foundation này.
