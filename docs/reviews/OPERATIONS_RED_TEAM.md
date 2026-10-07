# Independent operations red team — raw critique

Ngày kiểm tra: **2026-10-07 (Asia/Bangkok)**. Phạm vi: PHASE 13, technical/product operations. Đây là phản biện độc lập, không phải kế hoạch đã được sửa để tự bảo vệ. Không đọc bản investment red team và không sử dụng kết luận của bản đó.

Đã đọc các bản provisional của [PRODUCT_THESIS](../PRODUCT_THESIS.md), [MVP](../MVP.md), [VALIDATION_PLAN](../VALIDATION_PLAN.md), [UNIT_ECONOMICS](../UNIT_ECONOMICS.md), [ARCHITECTURE](../ARCHITECTURE.md). Snapshot checkout lúc review: README và năm tài liệu trên; `git status` ghi `?? docs/`. AGENTS.md và RECONNAISSANCE.md chưa tồn tại lúc kiểm tra. Những tài liệu khác được link trong bản provisional chưa được coi là bằng chứng đã hoàn thành. Không có implementation, lab, customer observation, payment hoặc security test được cung cấp để kiểm chứng.

**FACT nội bộ** dưới đây chỉ có nghĩa nội dung đã đọc trong các tài liệu. **INFERENCE** là hệ quả logic hoặc tính toán từ tài liệu. **HYPOTHESIS** là đường thất bại có thể xảy ra; chưa có dữ liệu xác suất. Không có market claim mới hoặc nguồn web mới trong pass này. Severity đánh giá tác động đến quyết định đầu tư/phát hành, không phải khẳng định một sự cố đã xảy ra. Mọi đề xuất xử lý đều là phương án rẻ nhất để chặn sai lầm, không là lý do mở rộng platform.

## Kết luận đối kháng

Thiết kế giảm cloud bill bằng cách chuyển execution, inference và phần lớn troubleshooting sang learner. Nó đồng thời chuyển những chi phí khó quan sát nhất ra ngoài P&L, rồi dùng dữ liệu tự khai để đánh giá giá trị. Một evaluator xác định có thể chứng minh output cụ thể đúng mà vẫn không chứng minh người học học được gì. Pack có thể vượt cổng demand, completion và repeat mà chỉ bán cảm giác yên tâm hoặc khả năng chạy agent hiện tại.

Tôi sẽ không chấp nhận claim learning, scale gate hoặc phát hành executable artifact dựa trên tài liệu hiện tại. P0 vẫn có thể thu thông tin bằng tài liệu tĩnh, nhưng pre-order tạo nghĩa vụ thật trước khi năng lực giao content an toàn/đúng đã được chứng minh. Chi phí tồi nhất có thể là founder labour và mất lòng tin, không phải hóa đơn LLM.

## Findings

### OP-01 — CRITICAL: Cổng learning value không đòi learning value

- **FACT:** G4 yêu cầu 6/20 hoàn thành transfer; phần counterfactual yêu cầu ghi lỗi invariant/false positives nhưng không có ngưỡng chất lượng hoặc improvement quyết định pass/fail.
- **Failure path — HYPOTHESIS:** Sáu người mở/chạy/nộp case mới với câu trả lời sai hoặc được agent giải hết vẫn được tính hoàn thành; G4 pass, founder công bố sản phẩm giúp kiểm chứng tốt hơn. Counterbalancing không sửa được primary endpoint sai.
- **Cheapest response:** Trước exposure, khóa rubric cho case chưa thấy: invariant cần phát hiện, bằng chứng tái lập, test có giá trị và false positive nghiêm trọng. Ghi answer trước feedback; đánh giá mù treatment khi khả thi. Tách completion, correctness, self-reported independence và payment. Không dùng một con số tổng hợp để che trade-off.
- **Kill condition:** Nếu không đo được outcome có ý nghĩa với chi phí pilot, bỏ thesis/claim đào tạo hiệu quả; chỉ được đánh giá một sản phẩm practice/content hữu hạn. Không đưa sang hiring signal. Ngưỡng số cụ thể phải được ghi trước cohort, không do reviewer chọn sau kết quả.

### OP-02 — HIGH: Inventory content thật lớn hơn “demo + hai labs”

- **FACT:** MVP dự trù 24h cho demo + hai labs. Protocol còn yêu cầu matched baseline/intervention, transfer context mới và mua/đặt trước pack kế tiếp.
- **Failure path — INFERENCE:** Nếu transfer trùng lab2, người học đã xem kiến thức/fixture liên quan; nếu transfer độc lập, có thêm case cần author/QA. Pack tiếp theo lại thêm nghĩa vụ giao content. Nếu dùng cùng case cho baseline và treatment, familiarity/carryover tạo improvement giả. Trần ba artifact không bao quát tất cả vai trò đo lường.
- **Cheapest response:** Lập một inventory cố định gồm mỗi case, mục đích, quyền được xem ở từng stage, review/QA hours và trạng thái. Chỉ reuse khi không gây contamination. Tính mọi case assessment vào content cost; không gọi nó là “research miễn phí”.
- **Kill condition:** Không thể tạo inventory tối thiểu có transfer hợp lệ trong cap đã cam kết → giảm câu hỏi nghiên cứu hoặc PAUSE; không âm thầm tăng số lab/season. Không bán pack2 chưa có khả năng giao đúng hạn.

### OP-03 — HIGH: Scale gate có thể pass khi business chưa đạt chính target của nó

- **FACT:** Model pack $29 đạt 71.5% contribution trước content/CAC, chỉ 46.7% sau content amortization trên 100 sales và trước maintenance. Target sau phân bổ là ≥50%. G6 chỉ ghi ≥70% sau support và content “bounded”.
- **Failure path — INFERENCE:** G6 pass với 71.5% trong khi target 50% sau content không đạt; doanh số giả định 100 làm chi phí sản xuất trông thấp hơn số buyer thật. Repeat order đòi corpus mới khiến amortization liên tục khởi động lại.
- **Cheapest response:** G6 phải hiển thị hai cửa riêng: contribution giao hàng và thu hồi chi phí content/acquisition theo cohort quan sát. Không lấy forecast lifetime sales làm bằng chứng economics đã đạt. Theo dõi time-to-payback cùng cash còn phải giữ cho refund.
- **Kill condition:** Mức giá khách thực trả không trả nổi support + sản xuất/duy trì ở quy mô quan sát được → không scale self-serve; thử giá/scope khác như experiment mới hoặc STOP. Không cứu bằng recurring subscription trước nhu cầu lặp lại.

### OP-04 — HIGH: Kiểm tra starter an toàn không kiểm tra mã agent tạo sau đó

- **FACT:** Local execution dùng Python stdlib; tài liệu thừa nhận venv không là sandbox. Founder không nhận/chạy mã learner. Learner được phép sửa code bằng agent.
- **Failure path — HYPOTHESIS:** Starter sạch nhưng agent sửa một import/test thành thao tác filesystem/network hoặc chạy lệnh ngoài repo; test runner import mã đó dưới quyền learner. “Không network trong test chuẩn” chỉ đúng với bản phát hành ban đầu. Fixture synthetic không bảo vệ những file/secrets khác trên máy.
- **Cheapest response:** Mô tả boundary bằng hành vi rõ: chỉ code đã review do founder phát hành; mọi agent edit trước run phải được learner xem; không yêu cầu admin, agent unrestricted hoặc credentials. Pilot trong môi trường sạch đã sẵn có. Nếu không có workflow quyền hạn phù hợp, dùng static review-only. Đừng bổ sung sandbox cloud để chữa một drill $29.
- **Kill condition:** Onboarding yêu cầu agent quyền rộng hoặc chạy code không thể giải thích/kiểm tra → không phát hành executable format. Disclaimer không được tính là một control kỹ thuật.

### OP-05 — HIGH: Hash cùng chỗ với bundle chỉ kiểm tra tính toàn vẹn

- **FACT:** Architecture đề xuất release/hash, không xác định người có quyền publish, review authority hoặc source-of-trust của hash.
- **Failure path — HYPOTHESIS:** Tài khoản/distribution link bị thay, attacker đổi cả ZIP và hash. Learner thấy checksum đúng và tin code đã review. Một repo instruction độc hại cũng có thể điều khiển agent dù Python/tests không chứa network call.
- **Cheapest response:** Chỉ một canonical release source, author/reviewer rõ, quyền publish tối thiểu; record commit/release digest sau review, kiểm tra cả README/agent instructions, không nhận community bundles. Có hướng dẫn dừng phân phối và thông báo phiên bản bị thu hồi. Không xây signing service riêng cho MVP.
- **Kill condition:** Không thể xác định bundle nào đã review và ai nhận nó → dừng executable delivery cho đến khi truy được provenance.

### OP-06 — HIGH: Hai OS smoke tests chưa đại diện ma trận hỗ trợ

- **FACT:** MVP dự trù 8h packaging/hướng dẫn/hai OS pilots và support 10 phút/paid buyer. Một runtime được pin; Git hoặc ZIP đều được phép; nhiều agent được tự chọn.
- **Failure path — HYPOTHESIS:** Python path, shell, permissions, agent workspace, line endings và stale local files tạo tổ hợp support. “Bring your own” khiến founder không tái lập lỗi; yêu cầu screen share kéo thêm privacy burden. Người đã có setup tốt được chọn làm pilot che onboarding failure của khách sau này.
- **Cheapest response:** Công bố matrix hẹp trước bán: chính xác runtime, một packaging path, môi trường đã thử; tách assisted và unassisted cohort. Ghi tất cả phút setup, chẩn đoán agent và refund, không chỉ thời gian viết câu trả lời. Có bản đọc không chạy được xem trước.
- **Kill condition:** Sau một vòng sửa docs, p90 support vượt cap hoặc cần live rescue cho majority → bỏ execution format hoặc STOP. Không mở thêm OS/provider để tăng TAM trước khi support ổn.

### OP-07 — HIGH: Provider independence ở code không tạo independence ở giá trị

- **FACT:** CodeForge không gọi API model; agent/model tự khai và không gộp ranking.
- **Failure path — HYPOTHESIS:** Một model mới giải cả fault detection/test/reasoning trong một lượt; paid drill mất giá. Model rẻ khác liên tục hallucinate khiến learner đổ lỗi content. “Manual solving vẫn dùng được” không chứng minh nhu cầu khách đã mua vì AI review. User API/subscription cost vẫn là tổng chi phí trải nghiệm.
- **Cheapest response:** Theo dõi model/version/assistance dưới dạng optional cohort field; một phép kiểm tra định kỳ nhỏ bằng workflow khách thực dùng và checklist free. Đo thời gian/chi phí learner đã mất cùng willingness to pay. Đóng cohort rõ khi provider behavior thay đổi đáng kể, không gộp score xuyên phiên bản.
- **Kill condition:** Workaround hiện hữu giải được tương đương và buyer không trả cho debrief/transfer → kill thesis. Không thêm prompt adapter/provider router để tạo vẻ độc lập.

### OP-08 — HIGH: Bốn faulty implementations dễ trở thành bốn lỗi founder đã đoán

- **FACT:** Mỗi lab có reference fix và ít nhất bốn faulty implementations; tests phải không phạt alternative đúng.
- **Failure path — HYPOTHESIS:** Reference và mutants cùng do một người/model tạo từ cùng hiểu sai spec. Tất cả tests pass nhưng exercise dạy invariant sai hoặc bỏ trade-off hợp lệ. Learner giỏi trả lời khác chuẩn bị chấm sai; appeal tốn nhiều hơn $29.
- **Cheapest response:** Review spec trước test, liệt kê ambiguity, dùng ít nhất một correct alternative khác cấu trúc và counterexample ngoài bốn mutants. Người pilot chưa xem solution thử bác spec; error/ambiguous không tính skill failure. Đo time-to-resolve content appeal.
- **Kill condition:** Không có reviewer hoặc founder không thể tự giải thích oracle đúng → không phát hành bài đó. Không thay oracle bằng LLM judge để giữ lịch.

### OP-09 — HIGH: Public tests và debrief cạnh starter làm transfer bị lộ

- **FACT:** Local checks công khai; learner dùng coding agent có thể đọc repo. Tài liệu dùng “unseen transfer”, không hidden tests.
- **Failure path — HYPOTHESIS:** Agent index toàn bundle gồm reference/debrief hoặc task kế tiếp; câu trả lời “trước feedback” thực chất đã thấy đáp án. Seed mới chỉ đổi bề mặt. Dữ liệu trông như retention/learning nhưng là retrieval.
- **Cheapest response:** Phân phối từng artifact đúng thời điểm; reference/debrief để ngoài starter workspace; không coi đây là anti-cheat guarantee. Ghi prior exposure và biết rằng learner có thể copy/share. Unseen chỉ là điều kiện nghiên cứu được tự khai.
- **Kill condition:** Transfer không thể giữ chưa được phơi bày ở mức pilot → không dùng nó để claim learning độc lập. Không xây secret test cloud hoặc surveillance để giữ claim.

### OP-10 — HIGH: Report giả không hại leaderboard nhưng vẫn hại quyết định founder

- **FACT:** JSON được gắn self_reported, không có leaderboard/hiring score; G2/G4 lại dùng completion/start từ learner.
- **Failure path — HYPOTHESIS:** Người muốn làm hài lòng founder, agent tự sinh report, hoặc lỗi clock tạo events giả. Schema hợp lệ/hash đúng không chứng minh execution. Nhãn self_reported không sửa selection bias. Founder quyết định đầu tư bằng con số đẹp nhưng sai.
- **Cheapest response:** Tách observed, self_reported, payment_verified và missing; quy tắc pass không được lặng lẽ coi chúng ngang nhau. Dùng vài buổi quan sát consent cho workflow và đọc explanation ngắn; không telemetry recorder. Báo kết quả giới hạn nếu chỉ có self-report.
- **Kill condition:** Chỉ có report không thể xác minh và không có outcome/payment corroboration → không được mở scale hoặc competency claims.

### OP-11 — HIGH: Cổng 20 buyers chưa có acquisition budget tương ứng

- **FACT:** G0 tối thiểu 5 payments; G3 tối thiểu 5 mới. G4 cần 20 buyers trước ngày 60. Effort P3 chỉ mô tả 30 offers và 12h.
- **Failure path — INFERENCE:** Các minimum pass chỉ đảm bảo 10 buyers. 10 còn lại cần acquisition thêm; nếu lấy giả thuyết 5/30, cần thêm khoảng 60 offers. Đây là scenario, không dự báo conversion. Follow-up D14 của buyer cuối cũng cần thời gian. Không có supply buyers “miễn phí” từ passed G0.
- **Cheapest response:** Dự trù thêm recruitment hours/offer count trong cùng cap, hoặc ghi G4 là cổng có thể không đạt trong 90 ngày và kết luận đúng là chưa được đầu tư thêm. Đặt last-entry date cho D14. Không tăng paid cohort bằng người được coaching/giảm giá mà không tách denominator.
- **Kill condition:** Không đủ buyer độc lập trong cap → distribution chưa có bằng chứng; PAUSE. Không đổi denominator 20 thành số thực có sau launch.

### OP-12 — HIGH: “Mua pack kế tiếp” có thể tạo content treadmill bằng nghĩa vụ thanh toán

- **FACT:** G4 dùng 4/20 mua/đặt trước pack kế tiếp để pass; MVP tránh season và hứa permanent small corpus.
- **Failure path — HYPOTHESIS:** Repeat chỉ đạt khi founder hứa liên tục có case mới. Để đo retention founder nhận tiền cho content chưa sản xuất; để giao đúng hạn founder bỏ QA hoặc tăng labour. User không muốn mua lại cùng library, vậy reusable corpus không tự giải quyết renewal economics.
- **Cheapest response:** Khóa trước số pack tối đa được offer, khả năng delivery và refund reserve. Tách nhu cầu học cùng competency với nhu cầu novelty. Ghi cost của pack mới vào repeat cohort, không chỉ revenue.
- **Kill condition:** Repeat phụ thuộc bespoke/new content vượt maintenance/creation cap → không subscription/library SaaS; giữ sản phẩm hữu hạn hoặc STOP. Không đổi tên season thành pack để né bản chất treadmill.

### OP-13 — HIGH: Pre-order safety gate nằm sau nghĩa vụ giao hàng

- **FACT:** G0 thu full-price trước executable lab; G1 mới kiểm safety/correctness. 5 pre-orders $145 không đủ trả shadow labour content $720.
- **Failure path — HYPOTHESIS:** G0 pass, G1 phát hiện không thể tạo lab đúng trong cap, founder mắc sunk-cost incentive phải ship. Merchant hold/chargeback hoặc không đủ refund cash làm experiment demand biến thành nghĩa vụ chưa giải quyết.
- **Cheapest response:** Offer ghi rõ static description/prototype status, delivery deadline, refund condition; giữ toàn bộ liability refundable cho đến giao hàng hợp lệ. Một feasibility review giấy/spec trước thu tiền không cần build platform. Ledger payment phải đối soát giao dịch merchant thật, không ảnh receipt.
- **Kill condition:** Không có merchant/refund path vận hành được hoặc không giữ đủ tiền hoàn → PAUSE trước offer trả tiền. G0 pass không được override G1 fail.

### OP-14 — HIGH: Privacy tối giản dễ bị support và research phá vỡ

- **FACT:** Không upload code/transcript; private ledger vẫn có eligibility, incidents, relationship, payment timestamps, model và free-text reason. Raw observations 30 ngày.
- **Failure path — HYPOTHESIS:** Learner paste stack trace chứa đường dẫn/token, kể incident khách hàng thật, hoặc screen share lộ workspace khác. Trong cohort Việt Nam rất nhỏ, kết hợp dữ liệu không cần email vẫn có thể nhận ra một người. Support inbox/notes thành data store ngoài schema/API caps.
- **Cheapest response:** Trước interview nói rõ chỉ synthetic/rephrased incident; dùng category và bounded text, không xin screenshot toàn màn hình; có thao tác xóa accidental sensitive input ngay. Chọn chỗ giữ ledger và backup thực tế trước recruitment, giới hạn người đọc và tách payment contact map. Repo chỉ counts đủ lớn/aggregate, không kể case hiếm có thể định danh.
- **Kill condition:** Experiment chỉ đo được khi thu corporate source, raw agent history hoặc surveillance → bỏ phép đo/claim, không mở rộng collection để cứu thesis.

### OP-15 — MEDIUM: Retention window và deletion window có thể làm bằng chứng không audit được

- **FACT:** Raw pilot observations TTL 30 ngày; aggregate 90 ngày; G6 cần ba tháng. Protocol cần chống đổi denominator và exclusions.
- **Failure path — HYPOTHESIS:** Xóa raw đúng hạn nhưng chưa chốt signed-off cohort summary; ba tháng sau không thể phân biệt dropout, refund đến muộn, assisted buyer và duplicate. Ngược lại giữ tất cả để audit phá privacy promise.
- **Cheapest response:** Trước xóa, đóng cohort snapshot không PII gồm denominators, missingness, version, assistance, revenue/refund và protocol hash; ghi late corrections bằng delta. Không cần giữ transcript để giữ quyết định audit được. Retention payment data xác nhận riêng.
- **Kill condition:** Không tái tính được primary gate từ aggregate được lưu hợp lệ → gate unknown, không được pass dựa trí nhớ founder.

### OP-16 — HIGH: Quarantine không thu hồi được lab đã chạy local

- **FACT:** Published immutable, refund/retry khi nội dung lỗi; local static assets vẫn chạy khi provider outage.
- **Failure path — HYPOTHESIS:** Lỗi nguy hiểm/false teaching được phát hiện sau tải; learner tiếp tục chạy bản cũ offline. Private contact map bị xóa sớm hoặc delivery không ghi version khiến không báo đúng người. “Immutable” biến bug thành bản lưu lâu dài.
- **Cheapest response:** Record version delivered + contact có consent trong thời gian hỗ trợ; một danh sách advisory canonical và template thông báo lỗi/hoàn tiền; current bundle dẫn tới advisory. Không auto-update executable hay remote kill switch. Tập diễn một bản nội dung sai được rút và thay thế.
- **Kill condition:** Không biết người nhận/cách thông báo trong support window hoặc không thể giải thích việc sửa scoring → ngừng bán version đó; không rewrite report cũ.

### OP-17 — MEDIUM: Automation trigger 2h/tuần dễ hợp thức hóa app trước economics

- **FACT:** Modular monolith khi manual fulfilment >2h/tuần trong hai tuần, sau payment/delivery evidence; proposed stack thêm Auth, DB, entitlement, reports, export/delete, webhooks.
- **Failure path — HYPOTHESIS:** Hai tuần founder làm chậm do quy trình chưa chuẩn khiến full app được xem là tối ưu. App thêm security/backup/oncall nhiều hơn 4h manual đã tiết kiệm; hosting fixed $80 chưa gồm maintenance app. Metrics/report upload kéo account system vào pack vốn giao file được.
- **Cheapest response:** Trước app, đo loại thao tác lặp lại, cắt thao tác hoặc dùng merchant delivery sẵn có nếu phù hợp. Tính giờ build+security+maintenance so với số giờ thực tiết kiệm; chỉ automate bước tắc cụ thể. Không dùng một time threshold duy nhất làm authorization cho toàn schema.
- **Kill condition:** Không hoàn vốn công automate trong horizon kiểm chứng được hoặc demand chưa lặp lại → không app. Thiết kế Next.js/Supabase là option, không roadmap commitment.

### OP-18 — MEDIUM: Idempotency và giới hạn upload không thay reconciliation/recovery

- **FACT:** Web stage đề xuất unique payment event ID, transaction entitlement, backup/restore trước dữ liệu thật và weekly spot check. Đây chỉ là design.
- **Failure path — HYPOTHESIS:** Refund/event đến trước purchase, repeated semantic event có ID khác, provider outage hoặc sai product mapping để paid user mất access hoặc refunded user được cấp lại. Copy local không thể revoke thực; cố DRM gây support nhiều hơn abuse. RPO 24h có thể mất entitlement của người vừa trả tiền.
- **Cheapest response:** Chỉ khi có web: state-transition table rõ, reconciliation từ merchant là source of payment truth, replay receipt/event bằng record nhỏ; manual entitlement override có audit. Một restore drill gồm recovering order+consent+artifact version, không chỉ mở DB được.
- **Kill condition:** Không phục hồi được danh sách ai đã trả tiền/giao gì sau outage → không automate billing; giữ manual cho pilot. Không bắt learner upload lại chứng cứ nhạy cảm để chữa recovery kém.

### OP-19 — HIGH: Free-user labour có thể phá unit economics trước paid evidence

- **FACT:** Free economic cost dự trù $0.55/active/tháng, support labour $0.50 = một phút ở $30/h. P0/P2 cần observation và setup diagnosis nhiều hơn.
- **Failure path — HYPOTHESIS:** Demo lỗi, người chưa fit ICP hỏi nhiều nhất; unpaid pilot labour được ghi là research nên bảng free-user cost vẫn đẹp. Một free user mua một lần nhưng tiếp tục support hàng tháng; cost monthly và revenue per-pack mất cùng horizon.
- **Cheapest response:** Báo cost theo cohort lifetime/window 30/60/90 ngày và tách research khỏi delivery nhưng hiển thị cả hai. Nêu support scope ngay offer, support miễn phí group/docs theo cap; không nhận inbox không giới hạn. Không cộng amortization và sunk cost hai lần nhưng cũng không bỏ chúng khỏi cash/time runway.
- **Kill condition:** Free acquisition không tạo paid margin đủ trả actual support/CAC → đóng free acquisition channel đó; không gọi 0 cloud cost là 0 marginal cost.

### OP-20 — HIGH: Team clinic có thể lén chuyển practice data thành đánh giá nhân viên

- **FACT:** Team fallback bán manager, không hiring/verified score; dự kiến $300/6 seats, ≤5h total sales+delivery, margin service 40%.
- **Failure path — HYPOTHESIS:** Manager chỉ trả nếu có điểm cá nhân hoặc so sánh nhân viên. Consent từ employee chịu áp lực không tương đương B2C; BYO models và prior experience làm comparison sai. Founder thêm report/anti-cheat để chốt hai deal, vượt scope và mất trust.
- **Cheapest response:** Offer trước sale chỉ collective learning outcomes, voluntary feedback; không chuyển practice report cá nhân cho manager mặc định. Ghi buyer yêu cầu surveillance/score là rejection signal, không feature request.
- **Kill condition:** Hai khách độc lập chỉ chịu trả khi có ranking/evaluation personnel → STOP fallback hiện tại; không coi đó là validation của clinic low-risk. Hiring/employee assessment phải là thesis mới với validation và safeguards khác.

### OP-21 — MEDIUM: Framework independence có thể làm bài quá giả để đáng trả tiền

- **FACT:** Một Python stdlib track, không database/framework thật, synthetic retries/idempotency và tenant isolation.
- **Failure path — HYPOTHESIS:** Đơn giản hóa giúp code portable nhưng loại bỏ transaction/isolation, ORM/cache, concurrent request và deployment constraints gây lỗi thực. Một counterexample trên dictionary không chuyển sang incident người mua thực gặp. Ngược lại thêm stack thật làm content drift và setup tăng mạnh.
- **Cheapest response:** Trong interview kiểm bằng một incident cụ thể xem invariant synthetic có cùng quyết định kiểm chứng hay không; debrief chỉ rõ giới hạn transfer. Case mới cần đổi context thực chất nhưng giữ dependency budget, không ngụy trang framework mới thành fixture.
- **Kill condition:** ICP coi bài toy không liên quan và chỉ trả nếu có stack riêng → không mở multi-framework catalog; thử clinic với scope/cost riêng hoặc STOP self-serve.

### OP-22 — HIGH: Corpus/telemetry không tự tạo moat khi quyền dùng dữ liệu bị giới hạn

- **FACT:** Thu tối thiểu, opt-in de-identified error category; tests/reference công khai hoặc phân phối cho learner; không profile verified, hiring network hay code/transcripts.
- **Failure path — INFERENCE:** Dữ liệu nhận được thưa, self-reported, model-confounded và dễ public-copy. Founder có thể biết lỗi nào phổ biến hơn nhưng không có ground truth hoặc calibration population đủ để cải thiện evaluation đáng tin. Content reuse hữu ích không đồng nghĩa lợi thế khó sao chép.
- **Cheapest response:** Chỉ claim compounding nếu đo được một error category mới khiến debrief/case tốt hơn, và cohort sau tốt hơn trên case mới với provenance/version rõ. Đặt mục tiêu cải thiện quality/time-to-author, không dựng graph/profiles để biểu diễn moat.
- **Kill condition:** Sau các cohort trả tiền, không có cải tiến chi phí hoặc value lặp lại từ dữ liệu dùng hợp lệ → chấp nhận đây là content/service nhỏ; không đầu tư như platform có data moat. Không tăng thu thập dữ liệu để cứu slide moat.

## Tương tác bậc hai cần chặn trước quyết định

| Quyết định tưởng giúp | Chuỗi tác động xấu có thể xảy ra | Finding liên quan |
|---|---|---|
| BYO agent/local để giảm cash | ít quyền kiểm soát → ma trận support rộng → labour/refund tăng → $29 không đủ margin | OP-04/06/07/19 |
| Public deterministic tests để rẻ/minh bạch | đáp án dễ đọc → agent giải → report đẹp → learning gate pass sai | OP-01/08/09/10 |
| Thu ít dữ liệu để bảo vệ privacy | khó audit outcome/cohort → metric tự khai → moat calibration yếu | OP-10/14/15/22 |
| Thu nhiều evidence để giải vấn đề trên | screen share/code/transcripts → incident/privacy/support burden tăng | OP-14/20 |
| Immutable bundles để reproducible | vulnerability/answer lỗi không thu hồi → người học tiếp tục dùng bản sai | OP-05/16 |
| Permanent library để chặn treadmill | repeat payment đòi novelty → presale pack2 → content debt/QA rush | OP-02/12/13 |
| Stdlib để chống framework drift | case thiếu context thật → transfer/value thấp → thêm frameworks → maintenance trở lại | OP-08/21 |
| B2B để tăng WTP | manager đòi điểm nhân viên → trust/anti-cheat/privacy → đổi hoàn toàn risk và sales cycle | OP-20 |
| Automate manual work khi >2h/tuần | Auth/billing/data lifecycle xuất hiện → oncall/recovery workload lớn hơn tiết kiệm | OP-17/18 |

## Điều chưa được phép suy từ pass này

Không có bằng chứng implementation an toàn, evaluator đáng tin, willingness to pay, learning transfer hoặc distribution khả thi. Một kiến trúc đơn giản chỉ làm thí nghiệm rẻ hơn; nó không biến outcome tự khai thành evidence mạnh. Cần giữ riêng quyết định **được thử P0**, **được giao executable lab**, **được claim learning** và **được scale**. Pass một cổng không cấp quyền bỏ qua ba cổng còn lại.
