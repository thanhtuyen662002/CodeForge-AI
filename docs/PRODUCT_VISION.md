# Product Vision

## Kết quả người học cần đạt

Từ không biết trình độ của mình đến xác định được điểm yếu, luyện đúng bài, tự giải bài mới và nhìn thấy bằng chứng tiến bộ. Vòng lặp cốt lõi là Diagnose → Learn → Practice → Fail → Explain → Retry → Master → Simulate → Review → Improve. Không tối ưu số màn hình, thời gian bị giữ trong app hay lượng hội thoại AI.

## Personas — giả thuyết cần kiểm chứng, chưa phải nghiên cứu người dùng

| Persona | Job to be done | Nỗi sợ / rào cản | Cam kết UX |
|---|---|---|---|
| Người mới hoàn toàn | Bắt đầu mà không bị kết luận là kém | Thuật ngữ, cài môi trường, bài test quá dài | Chế độ làm quen; giải thích lỗi bằng tiếng Việt; thao tác đầu tiên nhỏ và có phản hồi |
| Người học lệch kỹ năng | Bỏ qua phần đã biết, sửa đúng lỗ hổng | Python khá nhưng SQL yếu; lộ trình cố định | Chẩn đoán từng kỹ năng; cho biết lý do đề xuất và đường thay thế |
| Người chuẩn bị assessment | Biết mình làm độc lập đến đâu dưới thời gian giới hạn | Điểm ảo do hint/AI; mất bài khi mạng lỗi | Tách practice/assessment; autosave có xác nhận; chấm có bằng chứng |
| Người đi làm ít thời gian | Hoàn thành một bước có giá trị trong 10–15 phút | Bị phạt vì đứt streak; mobile khó dùng | Resume đúng chỗ; lesson ngắn; không shame; dashboard chỉ rõ hành động tiếp theo |
| Biên soạn viên/mentor | Xuất bản bài đúng, giải thích được tại sao chấm như vậy | AI tạo đáp án sai; sửa bài làm đổi lịch sử | Version bất biến, tests, review và khả năng thu hồi |

Personas có thể chồng lấn. Accessibility, thiết bị yếu và mạng không ổn là yêu cầu xuyên suốt, không phải nhóm bị loại khỏi sản phẩm.

## Luồng ưu tiên

Người học xem giá trị → thử làm quen không bắt buộc đăng ký → chọn mục tiêu, thời gian và mức tự tin → đăng ký để lưu → quick diagnostic hoặc bắt đầu từ zero → kết quả có coverage/uncertainty → một lesson được giải thích lý do → tự làm bài → nhận hint tăng dần → thử biến thể không trợ giúp → sổ lỗi và lịch ôn → mock exam khi đủ bằng chứng.

Một action chính trên dashboard: “Tiếp tục bước phù hợp nhất”. Skill graph là dữ liệu hỗ trợ quyết định; không bắt người mới hiểu một mạng hàng trăm nút.

## Phạm vi

Vertical slice đầu tiên chỉ là lát cắt kiểm chứng, không thay thế MVP trong brief. Full MVP vẫn bao gồm auth, onboarding, diagnostic, skill graph, Logic/Python/SQL, coding/SQL playground, exam simulator, AI tutor, dashboard, mistake review, AI Practical track và admin question manager.

Không làm giai đoạn đầu: mạng xã hội, marketplace, proctoring qua camera, chứng chỉ tuyển dụng, leaderboard toàn cầu, billing phức tạp, nhiều ngôn ngữ code, IRT/BKT chưa hiệu chỉnh.

## Điều kiện được gọi là có giá trị

Mời 8–12 người thử theo các persona, có ít nhất người mới và người dùng bàn phím/thiết bị yếu; xin đồng ý trước khi ghi nhận. Quan sát họ hoàn thành luồng, hiểu coverage và tự làm một bài chuyển giao sau đó. Cỡ mẫu này dùng phát hiện vấn đề UX, không dùng tuyên bố hiệu quả giáo dục. Ngưỡng pilot dự kiến ở METRICS_AND_COST cần được điều chỉnh theo dữ liệu thật.

Không hứa “Job Ready” chỉ vì hoàn thành course hoặc tăng XP. Không gắn tuyên bố chính thức VinUni/Vingroup. Không bán xác suất đỗ dựa trên mô hình chưa được kiểm định.
