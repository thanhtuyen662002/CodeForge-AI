# P0 assets — internal drafts only; not published or for sale

2026-10-27. Đây là tài liệu nội bộ cho nghiên cứu; validation vẫn NOT_STARTED. Hiện chưa có starter code/labs đã được review hoặc phát hành; demo giấy/checklist dưới đây là bản nháp, không phải sản phẩm chạy được. Không outreach/thu tiền/deploy trong planning. Chỉ sửa thành offer thật sau khi merchant/refund, ledger/privacy, delivery feasibility và ngày giao được xác nhận, đồng thời chủ dự án cho phép.

## Landing / offer copy

**Bạn có thể chứng minh bản sửa do AI tạo ra thực sự đúng?**

CodeForge đang kiểm tra giả thuyết về gói thực hành dành cho kỹ sư Python backend đã biết Git và đang dùng coding agent. Nếu các cổng P0/G0 và an toàn sau này được thông qua, gói dự kiến có hai bài 30–45 phút: xem một PR có vẻ hợp lý, tìm phản ví dụ, viết kiểm tra hồi quy và giải thích vì sao nên merge hoặc từ chối. Đây là mô tả ý tưởng, không phải xác nhận rằng bài đã sẵn sàng.

Nếu được duyệt để triển khai, người học dự kiến có thể dùng agent đang có hoặc tự giải, với spec, starter code được review, bộ kiểm tra local công khai và giải thích từng lỗi. Hiện chưa có starter code đã review hoặc lab được phát hành; tài liệu/demo giấy này không thay thế chúng. Không bao gồm tài khoản agent, coaching riêng, chứng chỉ tuyển dụng hay bảo đảm tăng năng suất.

**Giá giả thuyết: US$49 một lần cho hai bài. Chưa mở bán, chưa có pre-order và không nhận thanh toán.** Chỉ sau khi merchant/refund, privacy, delivery feasibility và review gates được xác nhận, đồng thời chủ dự án cho phép mở bán, mới được chốt ngày giao và điều khoản hoàn tiền cụ thể. Mốc dự kiến T0+35 (không quá42 ngày lịch sau thanh toán) là giả định lập kế hoạch, không phải cam kết giao hàng hiện tại. Điều khoản hủy, hoàn tiền và hỗ trợ30 ngày phải được xác minh trước mọi offer thật.

Trước bất kỳ offer thật nào, phải xác minh môi trường **[runtime/OS đã kiểm tra]**, chính sách dữ liệu **[đường dẫn thực]**, merchant/đơn vị cung cấp và kênh hỗ trợ **[thông tin thật]**. Chỉ dùng dữ liệu giả lập, đọc thay đổi agent trước khi chạy. Kết quả là tự kiểm tra luyện tập, không chứng minh ai viết code hoặc kỹ năng nghề nghiệp.

**CTA placeholder — KHÔNG XUẤT BẢN:** hiện không có CTA mua hàng hoặc pre-order. Chỉ sau khi prerequisites ở issue #20 được nghiệm thu và chủ dự án cho phép outreach/payment, chủ dự án mới duyệt CTA phù hợp. Không countdown/stock scarcity/social proof giả; luôn nêu lựa chọn miễn phí/checklist công bằng, không che đối thủ.

## Demo giấy / free checklist

Tình huống giả lập: handler nhận webhook có `event_id`, `account_id`, `amount`. Vendor có thể retry cùng event; cùng ID khác payload phải bị từ chối; nếu ghi ledger thất bại thì không được tăng balance. Một PR mới chỉ lưu seen-ID sau khi đã cập nhật balance; các happy-path tests đều xanh.

Hãy mô tả một chuỗi sự kiện mà balance có thể sai, bằng chứng cần thấy trước khi merge, và trường hợp nào câu trả lời của bạn chưa bao quát. Không cần tải/chạy gì ở bước này. Demo không phải một benchmark production.

Checklist baseline miễn phí: (1) Viết invariant từ spec; (2) tìm failure giữa hai side effects; (3) xét retry/duplicate/conflicting input; (4) yêu cầu test fail trước fix và pass sau fix; (5) thử alternative đúng để tránh overconstraint; (6) ghi điều chưa kiểm chứng. Hỏi agent hiện tại review cùng checklist là đối thủ công bằng của offer.

## Interview 25 phút — không pitch trước pain

1. “Lần gần nhất bạn phải kiểm tra hoặc sửa code do agent tạo là khi nào? Kết quả thực tế là gì?” Không xin code, tên khách hàng hoặc credentials.
2. “Bạn làm gì để biết fix đúng? Ai khác tham gia, mất bao lâu, có lỗi nào lọt qua?”
3. “Bạn đã trả tiền cho cách giải quyết nào? Tự trả, công ty trả hay chỉ dùng công cụ đã có?”
4. “Nếu chỉ hỏi agent review thêm và dùng checklist thì còn thiếu gì? Có lần nào cách này đã đủ không?”
5. “Một bài synthetic về invariant này có liên hệ với quyết định bạn vừa kể không? Nếu không, điều gì khiến nó vô dụng?”
6. “Bạn có thể dùng local Python/agent trên máy nào? Quyền cài/run có bị hạn chế không?” Không gợi ý bypass policy công ty.
7. Sau ghi pain: chỉ cho xem bản demo giấy/checklist như concept nội bộ và hỏi điều chưa rõ. Không mời mua, nhận pre-order hoặc thu tiền khi merchant/refund/delivery/privacy gates chưa đạt và chưa có chỉ đạo rõ ràng của chủ dự án. Nếu hỏi về mức US$49 trước đó, ghi rõ là câu hỏi giả định; không tính là offer hoặc payment. Không đếm “có lẽ mua”.

Ghi categories/pseudonym, current workaround, prior paid behaviour, funding owner, recent incident, tool/OS, minutes và refusal reason. Không verbatim transcript hoặc recording mặc định. Không follow-up pressure khi từ chối.

## Standard outreach draft — founder thực hiện khi launch

“Mình đang kiểm tra liệu kỹ sư Python backend đang dùng coding agent hằng tuần có cần bài thực hành ngắn để kiểm chứng thay đổi do AI tạo ra. Mình muốn nghe cách bạn đang kiểm tra code trong một buổi25 phút, kể cả khi workflow hiện tại đã đủ tốt. Không cần chia sẻ code/dữ liệu công ty. Mình có một demo tĩnh và sẽ ghi rõ pilot nào miễn phí, phần nào trả tiền; tham gia trao đổi không buộc mua.”

Không gửi trong task này; cần kênh phù hợp và moderator consent nếu community yêu cầu. Không invent recipient/address. New self-serve G3 cohort không dùng interview rapport này để pass.

## Manager interview / clinic offer

Hỏi lần gần nhất review rework khiến team chậm; training hay công cụ review giải quyết tốt hơn; budget owner; mua service nào gần đây; procurement mất bao lâu. Offer fallback cố định$300,≤6 người, một buổi thực hành/debrief tổng scope≤5h sales+delivery, synthetic cases, aggregate learning notes. Không individual employee ranks, hiring recommendation hoặc company-code ingestion. Manager chỉ trả nếu có ranking→reject deal.

## Evidence record template — private only

Fields: experiment/protocol hash; pseudonym; eligibility trước exposure; channel; interviewed/friend flag; funding_source; actual currency/price; consent; offer/deadline; merchant transaction reference; payment/refund states; delivered content version; assistance/trust category; task/check/rubric outcome; start/finish/return dates; support/sales/content minutes; dropout/refusal reason; deletion due date. Repo nhận aggregate summary đã scrub, không các record này.

Weekly readout: eligible offers→settled self-funded payments→deliveries→unassisted activation→lab2→correct delayed evidence. Luôn hiển thị missing và cost. Pass/fail theo v2, không dùng waitlist/likes/star làm cứu cánh.
