# Validation protocol v2 — reconciled trước launch

2026-10-07. Status: **NOT STARTED**; mọi count = chưa đo, không phải 0 người từ một experiment đã chạy. Các ngưỡng là quyết định đầu tư HYPOTHESIS, không phải benchmark thị trường. Commit protocol này trước tuyển người. Ngày T0 = ngày bắt đầu experiment được ghi; không giả sử đã launch hôm nay.

## Population và rules

Discovery interview eligibility: 18+, đã làm Python backend 1–5 năm (senior hơn tách cohort), Git/local Python đang dùng được, coding agent ≥1 lần/tuần. **Không yêu cầu recent incident để nhận vào15interviews**: đo xem≥8/15 có incident cụ thể trong30ngày; người không có vẫn giữ denominator. Paid-offer eligibility thêm incident đã substantiated và khả năng tự quyết định chi$49. Reimbursed/employer-paid là cohort phụ, không gộp để pass personal-pay gate. Khởi đầu developer nói tiếng Việt mà founder tiếp cận được; không suy sang quốc tế. Giá v1$29 bị red team bác về cost completeness; **v2$49 khóa trước mọi exposure**, chưa có dữ liệu nào bị đổi ngưỡng hậu nghiệm.

Eligibility khóa trước offer; ghi tất cả qualified prospects kể cả bỏ cuộc. Exclude duy nhất: duplicate, bot, founder/friends, không đủ ICP trước exposure; không loại người setup fail khỏi activation denominator. Không trả thưởng cho mua hàng; interviews có compensation thì tách khỏi paid-conversion cohort. Một người tối đa một observation mỗi stage. Dropout tính là không thành công; không đổi primary metric sau xem kết quả.

## Gates và kill criteria

| Gate | Cỡ mẫu / thời hạn | Pass | Fail và hành động |
|---|---|---|---|
| G0 demand + payment feasibility | P0 tối đa10 ngày làm việc,20h/$100;15 interviews,30 eligible offers;≤60 targeted contacts qua2 kênh | ≥8/15 incident cụ thể;≥5/30 người không quen tự trả đủ$49; merchant/refund route và feasibility paper review hoạt động | Recruitment thiếu trong trần→PAUSE; đủ offers nhưng<5 payments→STOP B2C; không build app |
| G1 lab safety/correctness | Trước đưa file chạy cho learner | Review file/dependency; reference + mutant tests; manifest/hash; dry run trong môi trường sạch; công bố giới hạn OS | Có critical safety hoặc evaluator bug → không phát hành; không bù bằng disclaimer |
| G2 delivery/usability | 10 ICP nhận reviewed LAB-A pilot bundle; ≤14 ngày; có thể gồm G0 buyers và free pilot testers, ghi riêng | ≥8/10 đạt first meaningful local check ≤15 phút không founder rescue; ≥6/10 hoàn thành ≤60 phút; median setup support ≤10 phút, p90 ≤30 phút | Một vòng sửa docs tối đa 8h rồi cohort 10 mới; vẫn fail → bỏ execution, thử static review fallback một lần hoặc STOP |
| G3 self-serve WTP | 30 eligible người mới chưa interview/coaching; cùng$49 offer ngày1, payment cutoff ngày7; tối đa1 standard follow-up; readout ngày21 | ≥5 self-funded paid trước cutoff;≥4 giữ purchase đủ14 ngày sau delivery; log mọi qualification/sales minutes, không custom deal/discount | <5 paid hoặc<4 retained→STOP self-serve; G0 không thay G3 |
| G4 repeat + learning mechanism | 20 paid buyers, enrollment cuối ngày70, kết quả ngày90; thêm≤60 offers ngoài G0/G3;≤120 offers/240 targeted contacts tổng,160h/$500 | ≥10/20 lab2 start;≥8/20 lab2 complete;≥12/20 trả delayed probe;≥8/20 rubric delayed≥3/4 có correct decision, không critical false positive;≥6/20 tăng≥1 điểm vs baseline; P2 comparator bên dưới đạt | Thiếu20 buyers trong cap→PAUSE; fail value dù engagement cao→STOP learning thesis. Missing tính fail. Không repeat-pack preorder trong v2 |
| G5 team fallback/expansion | Chỉ khi ≥3/8 manager interviews có cùng pain và buyer authority; ≤30 ngày, ≤20h founder | 2 team độc lập trả ≥$300/clinic tối đa 6 người; delivery+sales ≤5h/team; 1/2 mua lần hai trong 30 ngày | Không đạt → STOP B2B fallback; không thêm SSO/ATS/custom content để cứu sales |
| G6 scale | Sau≥2 cohort và3 tháng; ngoài quyết định P0 | Delivery margin≥70%;≥50% sau content+maintenance trên sales **đã đạt**; recurring CAC≤$10 gồm labour; first-order profit sau CAC+overhead dương; không critical security issue | Không forecast sales để pass. Không đạt→finite product nếu tự hoàn vốn hoặc STOP; không subscription |

G0+G3 minimum chỉ có10 buyers;60 offers thêm không đảm bảo10 buyers. Scenario5/30 cần120 offers cho20 buyers, không là forecast. Recruitment chậm vẫn là kết quả; không kéo lịch vô hạn. Fallback cần manager evidence và budget còn lại. G5clinic execution dùng corpus đã quaG1; nếu dừngB2C trướcG1, chỉ manager discovery, không thu tiền clinic trước một fallback protocol/feasibility decision riêng. Tối đa **một pivot** trong90 ngày. Không thu tiền pack2 để làm đẹp retention; repeat purchase chưa đo, subscription gate đóng.

G0 count chỉ gồm settled, chưa refunded/cancelled tại fixed readout10workingdays; đây là snapshot có unequal offer age, không mature14day conversion. Pre-order cash là liability, không recognized revenue/retention. Deadline giao cụ thể được ghi trước charge, targetT0+35 và tuyệt đối≤42ngày sau payment; khách có thể hủy trước giao, refund đủ nếu trễ hoặc G1fail.

G3 chạy sau content/G2 đã qua. Qualify và khóa list30prospects trước offer (qualification labour vẫn trong P3/acquisition budget); cùng exposure ngày1, accept qualifying payment đến hếtngày7, giao trongngày settlement. Follow-up tối đa1 theo cùng lịch/script. Readout cuối ngày21 sau mọi qualifying order đủ14ngày delivery/refund. Settlement muộn ghi riêng, không cộng để cứu G3; giao trễ làm metric chưa mature→PAUSE thay vì tính giữ tiền là retention. G3 calendar bắt đầu first offer, không giấu giờ chuẩn bị list ngoài totalcap.

G4 cohort khóa là **20distinct eligible self-funded buyers đầu tiên theo settlement timestamp**, enrollment tự động tại settlement, gồm G0/G3. Mọi refund/dropout sau payment vẫn ở denominator20 và missing=failure; không thay bằng người thành công hơn. Ít nhất8observed reasoning phải từ chính20người này, không lấy free P2testers thay thế. Các đơn vượt20 vì hoàn thành G3 offer cohort được báo riêng và vẫn phải giao/refund; dừng extra recruitment ngay khi đủ20settlements, không nhận quá capacity/deadline. Không giảm số30G3offers chỉ vì đã đạt20buyers; giới hạn nhận đơn được ghi rõ trước offer nếu capacity không đủ, cohort bị giới hạn không thể pass G3 bằng denominator đã sửa.

## Funnel với denominator

| Metric | Công thức / window | Vai trò |
|---|---|---|
| Landing conversion | qualified demo requests / unique qualified visits trong 14 ngày | Diagnostic, mục tiêu 10% nếu ≥100 qualified visits; traffic chưa đủ thì unknown; không kill gate một mình |
| Challenge start | meaningful first local check / tất cả người nhận reviewed LAB-A trong7ngày | G2; paper DEMO không có executable check; link click/download không là start |
| Completion | report + short explanation / tất cả LAB-A pilot recipients,7ngày | G2; self-report có nhãn |
| Second challenge | lab2 start hoặc completion / tất cả paid buyers, 14 ngày | G4; báo riêng start và finish |
| D7 retention | một hành động meaningful ngày 6–8 / activated cohort đủ tuổi | Diagnostic, mục tiêu ≥30%; không đo app-open |
| D14 retention | meaningful action ngày 12–16 / activated cohort đủ tuổi | Diagnostic, mục tiêu ≥20%; pack có điểm kết thúc nên lab2/transfer quan trọng hơn streak; repeat purchase chưa đo |
| Payment conversion | G0: settled/nonrefunded tại fixed close /30offers; G3: settled đếnday7 /30same-day offers, đọc retained sau14ngày delivery | Primary G0/G3 có window riêng; báo offer ages; không dùng checkout click/deposit làm paid |
| Refund | refunded orders / orders đủ14ngày từ delivery; preorder chưa giao báo riêng là outstanding liability | Báo count và lý do; tất cả refund kể cả do chậm giao; không dùng payment age thay delivery age |
| AI review usage | N/A: CodeForge không có AI review | Ghi optional BYO usage yes/no/unknown; không tạo feature để đo metric |
| Recommend | unsolicited qualified referral trong 14 ngày / completers | Mục tiêu ≥3/10; “would recommend” chỉ supporting interview response |
| Employer interest | named budget owner + dated paid pilot / contacted managers | LOI/lời khen không là revenue |
| Support/CAC | toàn bộ phút setup/support/sales × $30/h + cash / buyers | Phân biệt cash với economic cost; không gọi founder labour miễn phí |

N=5/30 có uncertainty lớn (Wilson 95% xấp xỉ 7–34%). Không tuyên bố conversion thị trường 16.7%. Hai cohort vẫn không phải RCT đủ mạnh để claim tăng năng suất production.

## Kiểm tra value và counterfactual

P2:10 người làm baseline ngay trước khi nhận LAB-A, phân ngẫu nhiên5 nhận lab/debrief và5 dùng cùng problem brief+checklist miễn phí/agent workflow trước post-probe; sau đo control cũng nhận lab/debrief. Agent hiện tại được dùng trong practice/workaround, ghi model/version. **Baseline/post/delayed micro-probes dùng cùng chế độ không AI có consent**, không trộn agent-assisted baseline với unaided delayed. Alternate matched forms A/B cho baseline/post; C/D cho delayed sau7–14ngày, assignment khóa trước, không crossover giả vờ xóa carryover. Independent reviewer kiểm tra độ khó/rubric trước exposure; chấm blind assignment khi khả thi. So sánh change score, không raw score giữa model.

Rubric0–4: correct merge/reject; counterexample thật; regression check bắt lỗi nhưng không reject correct alternative; remaining uncertainty đúng. Pass cần≥3, bắt buộc correct decision; critical false positive veto. Người có chuyên môn đọc structured answers, không chạy submitted code. Reference/debrief và probes ngoài starter workspace, giao theo stage. Prior exposure báo riêng;≥3/10 contaminated probes→invalid/PAUSE, không thay case hậu nghiệm.

**P2 mechanism veto:**≥4/5 treatment gain≥1; median gain treatment−control≥1 điểm; critical false-positive rate không cao hơn control. Missing=no gain. Nếu control đạt ceiling(≥3 ở≥4/5) và treatment không hơn, STOP incremental-learning claim. N10 không chứng minh causal efficacy; chỉ threshold bác bỏ cơ chế yếu. G4 delayed phải đạt riêng.

Transfer: context mới, không chỉ đổi seed; pre-feedback answer/micro-probe không AI tự nguyện. Assistance yes/no/unknown; changed/unknown assistance hoặc từ chối unaided probe không được tính vào correctness/gain numerator, vẫn giữ denominator. Baseline bắt đầu lúc reviewed content delivery, **không ở P0 offer/interview**. Cần observed reasoning trên ít nhất8người có consent trong G4 cohort20, không recording toàn màn hình; chỉ quan sát bài synthetic, không claim kiểm tra cả thiết bị. Thiếu quan sát→gate unknown/fail, không nâng self-report thành verified. Vẫn không là authorship proof/credential. Workaround agent+checklist đủ và buyer không trả→negative evidence, không tăng difficulty tùy tiện.

## Evidence và privacy

Private participant ledger: pseudonym, consent version, ICP eligibility, source channel, relationship to founder, offered price, timestamp, settled/refunded amount, stage times, support minutes, task versions, assistance mode và short reason. Không commit email, receipt, transcript/code hay IP vào public GitHub. Repo chỉ lưu tổng hợp counts, missingness, caveats, protocol hash và quyết định.

Raw interview/observation notes TTL30ngày từ collection. Baseline tại content delivery + delayed≤14ngày cho phép đóng matched participant result trong30ngày, rồi chỉ giữ aggregate bins/counts không PII để tổng hợp ngày90. Contact/order mapping giữ riêng qua delivery+30ngày support/refund; payment record retention theo merchant/legal obligations thực. Trước TTL, đóng aggregate snapshot: protocol hash, denominators, pre-exposure exclusions, missingness, observed/self-reported/payment-verified, funding/channel, gain distributions, refunds, labour và decision. Late corrections là delta. Không xóa mapping cần giao/hoàn tiền chỉ vì interview note đã hết hạn. Chỉnh protocol chỉ trước cohort mới; kết quả cũ giữ nhãn threshold cũ. Không có payment route hợp lệ→PAUSE, không mô phỏng payment.
