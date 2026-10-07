# Customer / jobs-to-be-done

2026-10-07. **Mọi segment analysis là HYPOTHESIS** để ưu tiên interview, không customer evidence. Qualitative market size chỉ so sánh reach/pool, không TAM dollars. WTP không được suy từ lương hay competitor pricing.

| Segment | Pain + workaround hiện tại | WTP / urgency / frequency | Acquisition / retention / competition / size | AI làm gì với job? |
|---|---|---|---|---|
| CS students | Không biết hiểu hay chỉ copy; course/TA/agent/free exercises | Low; cao quanh exam; hàng tuần theo kỳ | Campus distribution cần access; term retention; free/code courses rất mạnh; pool lớn nhưng ít tiền | Có thể tăng skill gap nhưng giảm cần syntax drills; khó bán thêm tool |
| Self-taught | Không có lộ trình/feedback; YouTube/freeCodeCamp/Discord/agent | Low–medium, không đều; tuần | SEO/social đắt thời gian; dropout cao; cạnh tranh catalog; pool rộng/khó qualify | Agent giúp bắt đầu và làm project, có thể thay tutor chung |
| Junior engineers | Không tự tin review/fix trên team; senior/code review/agent | Medium nếu reimburse; deadline cao; hàng tuần | Cần trust và cụ thể stack; retention nếu practice giúp việc; cạnh tranh mentoring; pool vừa | Volume code tăng có thể làm verification cần hơn, nhưng agent tự review là substitute |
| Experienced engineers adapting to AI | Khó quyết định code đúng/đủ an toàn; test/review tools/colleague | Medium; cao sau incident; tuần, nhưng training episodic | Reach qua chuyên môn, khả năng trả tiền nhưng hoài nghi cao; pool hẹp theo language | Chịu trách nhiệm còn, nhưng không đồng nghĩa trả tiền học; **primary discovery** |
| Job seekers | Cần vượt interview/prove skill; LeetCode/mock/interview platforms | Medium nhưng ngắn hạn; urgency cao; daily khi tìm việc | Search intent có, competition cao; churn sau job; pool chu kỳ | AI làm take-home dễ giả; badge startup chưa đáng tin; không initial wedge |
| Bootcamps | Muốn placement và chương trình cập nhật; instructor/custom projects | Medium institutional; cohort calendar; kỳ | Founder-led sales/partnership chậm; retention contract; pool nhỏ | AI làm curriculum cũ kém thuyết phục; nhu cầu instructor kit có thể có nhưng budgets căng |
| Universities | Academic integrity/graduate readiness; assignments/oral defense/LMS | Low per student, larger contract; urgency theo học kỳ | Procurement/calendar lâu; high switching LMS; pool lớn nhưng inaccessible solo | Cần đổi assessment, không bằng chứng muốn mua thêm SaaS |
| Engineering teams | Review rework và onboarding AI workflow; guidelines/pairing/review tools | Medium–high manager budget; khi rollout/incident; monthly/quarterly learning | Warm access quan trọng; sales/support tốn công; **fallback clinic**, pool hẹp reachable | Verification/performance có thể đau hơn; product tool có thể tốt hơn training |
| Recruiters | Khó phân biệt skill/authorship; ATS/screening/vendor | High nếu giảm hiring cost; urgency theo requisition; campaign | Entrenched vendors/privacy/integration; cyclical retention; không giant TAM accessible | AI giảm giá trị bài nhà, nhưng scale/trust barrier cao |
| Hiring managers | Muốn signal gần công việc mà ít tốn senior hours; paired task/review interview | High value nhưng đòi validity; hiring-driven | Relationship/sales/psychometrics; strong incumbent; fewer buyers | AI collaboration là job mới nhưng model confounding; **reject high-stakes MVP** |

## Job hypothesis chọn để hỏi

“Khi chuẩn bị merge một thay đổi backend có AI tham gia, tôi muốn tìm được tình huống làm nó sai và biết test nào thực sự kiểm chứng fix, để không giao code mình không hiểu.” Buyer ban đầu tự trả; reimbursement phải báo riêng. Learning purchase trigger giả định: một incident gần đây hoặc team bắt đầu dùng agents. Không trigger cụ thể→thesis yếu.

Functional outcome: counterexample đúng, regression check phù hợp, merge/rollback decision có giới hạn rõ. Emotional outcome: tự tin có căn cứ. Social outcome: giải thích cho teammate; không cần leaderboard/certificate.

Người trả tiền cho “chứng minh kỹ năng” thường cần bên thứ ba tin; CodeForge chưa có trust đó. Vì vậy primary chỉ bán practice. Nếu interview chỉ hỏi certificate/job guarantee, không đổi landing để hứa điều chưa đo.

## Interview sampling / disconfirmation

15 discovery interviews: eligibility theo role/tool frequency, không yêu cầu incident trước khi nhận vào sample;≥8/15 concrete recent incidents là outcome cần đo. Paid offers mới yêu cầu recent incident. Tối thiểu5 người tự nhận review với agent hiện tại đã đủ; ít nhất5 chưa mua khóa coding gần đây; phân bố kinh nghiệm/OS/agent, ghi referral chain. Không chỉ mời AI enthusiasts. Hỏi last incident/paid workaround/time lost, ai chịu cost, tại sao không dùng miễn phí. Không hỏi “bạn có thích ý tưởng này?” để tính demand.

Sau primary, tối đa8 manager interviews nếu có access thực. Founder chưa chứng minh access đến community/manager; không fabricated list/partnership. Qualitative reach hypothesis: có thể tìm30 eligible prospects trong20h; nếu không, distribution gate fail ngay, dù developer population toàn cầu lớn.

Longer-term addressable revenue phải tính bottom-up từ reachable qualified prospects × conversion đã đo × price × observed repeat. Hiện mọi input trừ price experiment đều unknown; không trình bày market-size dollar estimate.
