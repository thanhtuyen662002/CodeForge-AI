# P0 assets — drafts ready to use, not published

2026-10-07. Không outreach/thu tiền/deploy trong planning. Chỉ publish/offer sau prerequisites merchant/refund, ledger/privacy, feasible deliverable và delivery date được xác nhận. Thay placeholders trước use, không để webpage giả nhận preorder.

## Landing / offer copy

**Bạn có thể chứng minh bản sửa do AI tạo ra thực sự đúng?**

CodeForge là thử nghiệm thực hành dành cho kỹ sư Python backend đã biết Git và đang dùng coding agent. Trong hai bài30–45 phút, bạn xem một PR có vẻ hợp lý, tìm phản ví dụ, viết kiểm tra hồi quy và giải thích vì sao nên merge hoặc từ chối.

Dùng agent đang có hoặc tự giải. Nhận spec, starter code được review, bộ kiểm tra local công khai và phần giải thích từng lỗi. Không bao gồm tài khoản agent, coaching riêng, chứng chỉ tuyển dụng hay bảo đảm tăng năng suất.

**Giá thử nghiệm: US$49 một lần cho hai bài.** Đây là pre-order của pilot, chưa phải sản phẩm đã chạy. Giao trước **[ngày cụ thể đã kiểm tra feasibility; planning target T0+35, không quá42 ngày lịch sau thanh toán]**. Nếu chưa giao bản qua review đúng hạn, hoàn đủ tiền. Có thể hủy trước giao để hoàn đủ tiền; trong14 ngày từ khi nhận bài cũng có thể yêu cầu hoàn tiền theo điều khoản pilot đã công bố. Nội dung lỗi được hỗ trợ trong30 ngày, không tư vấn dự án công ty.

Trước khi mua: xem demo tĩnh, yêu cầu môi trường **[runtime/OS đã kiểm tra]**, chính sách dữ liệu **[đường dẫn thực]**, tên merchant/đơn vị cung cấp và kênh hỗ trợ **[thông tin thật]**. Chỉ dùng dữ liệu giả lập, đọc thay đổi agent trước khi chạy. Kết quả là tự kiểm tra luyện tập, không chứng minh ai viết code hoặc kỹ năng nghề nghiệp.

CTA trước payment prerequisites: **Nhận demo và thông tin pilot**. Sau prerequisites: **Đặt trước gói hai bài — US$49**. Không countdown/stock scarcity/social proof giả. Có link tới alternative miễn phí/checklist trước lựa chọn; không che đối thủ.

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
7. Sau ghi pain: cho xem cùng demo/offer, hỏi điều chưa rõ. Nếu eligible, đưa lựa chọn thực: mua pilot giá cố định khi merchant ready hoặc dùng checklist miễn phí. Không đếm “có lẽ mua”.

Ghi categories/pseudonym, current workaround, prior paid behaviour, funding owner, recent incident, tool/OS, minutes và refusal reason. Không verbatim transcript hoặc recording mặc định. Không follow-up pressure khi từ chối.

## Standard outreach draft — founder thực hiện khi launch

“Mình đang kiểm tra liệu kỹ sư Python backend đang dùng coding agent hằng tuần có cần bài thực hành ngắn để kiểm chứng thay đổi do AI tạo ra. Mình muốn nghe cách bạn đang kiểm tra code trong một buổi25 phút, kể cả khi workflow hiện tại đã đủ tốt. Không cần chia sẻ code/dữ liệu công ty. Mình có một demo tĩnh và sẽ ghi rõ pilot nào miễn phí, phần nào trả tiền; tham gia trao đổi không buộc mua.”

Không gửi trong task này; cần kênh phù hợp và moderator consent nếu community yêu cầu. Không invent recipient/address. New self-serve G3 cohort không dùng interview rapport này để pass.

## Manager interview / clinic offer

Hỏi lần gần nhất review rework khiến team chậm; training hay công cụ review giải quyết tốt hơn; budget owner; mua service nào gần đây; procurement mất bao lâu. Offer fallback cố định$300,≤6 người, một buổi thực hành/debrief tổng scope≤5h sales+delivery, synthetic cases, aggregate learning notes. Không individual employee ranks, hiring recommendation hoặc company-code ingestion. Manager chỉ trả nếu có ranking→reject deal.

## Evidence record template — private only

Fields: experiment/protocol hash; pseudonym; eligibility trước exposure; channel; interviewed/friend flag; funding_source; actual currency/price; consent; offer/deadline; merchant transaction reference; payment/refund states; delivered content version; assistance/trust category; task/check/rubric outcome; start/finish/return dates; support/sales/content minutes; dropout/refusal reason; deletion due date. Repo nhận aggregate summary đã scrub, không các record này.

Weekly readout: eligible offers→settled self-funded payments→deliveries→unassisted activation→lab2→correct delayed evidence. Luôn hiển thị missing và cost. Pass/fail theo v2, không dùng waitlist/likes/star làm cứu cánh.
