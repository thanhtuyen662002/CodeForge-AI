# Unit economics — USD, model v2

2026-10-07. HYPOTHESIS: mọi volume, conversion, effort, support, reserve và CAC. FACT tariff sources ở [MARKET_RESEARCH](MARKET_RESEARCH.md#infrastructure). Chưa có doanh thu/usage CodeForge thật. [Model inputs](research/economics-model.json) lưu số dùng cho tính toán. Các con số làm tròn để đọc, không giả độ chính xác của forecast.

## Thay đổi sau phản biện

Draft v1 $29 với24h content bỏ sót measurement probes/review. V2 tính **40h content** và chọn **$49/2-lab pack** trước launch; đây là giả thuyết phải vượt payment gate mới, không WTP đã xác minh. Giữ raw critiques nói $29 để không xóa lịch sử. Giá $49 cao hơn nhiều lựa chọn free/course monthly; nếu buyer không trả ở giá đủ bù cost thì STOP, không lấy sales giá thấp làm validation giá cao.

## Inputs và accounting

- Shadow labour $30/h; sensitivity $15/$60. Không coi giờ founder miễn phí.
- P0 cash cap$100, toàn90 ngày cash cap$500 và160h **combined work** gồm founder + external reviewer. $5,300=160h×30+$500 là conservative exposure ceiling, có thể double-count phần external labour đã nằm trong cash, không là actual P&L. Khi báo thực tế: unpaid founder hours×shadow rate + external invoices + non-labour cash, mỗi khoản chỉ một lần; paid reviewer invoice thay shadow estimate của cùng giờ, không cộng cả hai. Không giảm cap để che cost. Đây là trần đề xuất, không purchase authorization.
- Pack$49,2 paid labs;40h×30=$1,200 content gồm2 labs24h,4 probes8h,review/rework8h. Maintenance cap4h/mo=$120. Model amortize trên100 sales=$12/pack;25 sales=$48. **Forecast100 không đủ pass margin gate.**
- Payment reserve3.5%+$0.50, stress6%+$0.50. Đây không phải merchant quote; Stripe US domestic benchmark2.9%+$0.30 có source, cross-border/FX/eligibility khác. Refund/chargeback reserve5% price; không hoàn processing fee trong model.
- Optional hosted stage fixed cash$80/mo=Vercel Pro20+Supabase Pro25+email/domain/backup allowance10+overage contingency25. Không cần P0; staging local/disposable. Thêm hosted project có phí riêng. Không giả định provider spend cap bao phủ mọi SKU.
- Preorder cash giữ100% face value có thể hoàn; fees cần founder bù nếu refund toàn bộ. Chỉ recognized delivered revenue được dùng P&L; payment verification là merchant receipt/status, không screenshot.

## Unit cost

| Cost line | Free active/month | Pro$19/month — chưa bán | Pack$49/sale, support window30 ngày |
|---|---:|---:|---:|
| CodeForge LLM inference |0|0|0|
| CodeForge learner execution |0|0|0|
| Web/API/database/auth variable allowance |.010|.080|.100|
| Storage |0|.020|.020|
| Bandwidth |.005|.030|.030|
| Observability |.005|.020|.050|
| Support labour |.50|2.50 (5min)|5.00 (10min)|
| Payment fee |0|1.165|2.215|
| Refund reserve |0|.950|2.450|
| Abuse/incident reserve |.030|.100|.100|
| **Variable economic cost** |**.550**|**4.865**|**9.965**|
| **Contribution before fixed/content/CAC** |**−.550**|**14.135/74.4%**|**39.035/79.7%**|

Free marginal cash$.05, economic$.55; not a provider tariff.1,000 free actives=$50 cash+$500 support labour under this allowance. P0 usability/research cost is separate but still shown in total experiment cost, never called free acquisition.

**Submission:** local run costs CodeForge$0 inference/compute; optional tiny metadata report budget$.01 cash/report within allowances above, not added twice. Manual review5min costs$2.50/report;8 reviews=$20, greater than Pro price. No unlimited personal review. User supplies agent subscription/API and machine; those costs/friction do not disappear from total customer cost.

**Targets:** delivered contribution including support/refund≥70%; after actual content+maintenance allocation≥50%; then first-order contribution after recurring CAC+fixed allocation positive. Not a GAAP statement. Pack at100 cumulative sales allocates$12 content, leaving$27.035 (55.2%) before maintenance. At50 orders in a month, maintenance$2.40/order leaves$24.635 (50.3%) before fixed/CAC. At lower realised volume the target may fail. No claim these volumes are reachable.

## Break-even scenarios

1. Cash-only margin=49−4.965=$44.035; optional$80 fixed needs**2 packs/mo**. This excludes founder labour/content and is not founder viability.
2. Economic fixed=$80+$120 maintenance+100 free actives×.55=$255/mo. $39.035 contribution→**7 packs/mo**, before content/CAC.
3. At100-sale content allocation, contribution$27.035→**10 packs/mo** for$255 overhead. Add5h monthly outreach($150), need**15 packs/mo** for$405. Do not also count those same outreach hours in per-order CAC.
4. Illustrative extra founder income target$1,500/mo beyond support/maintenance labour:1755/27.035→**65 packs/mo** before acquisition. With recurring CAC$10,1755/17.035→**104 packs/mo**. Founder has not confirmed this target; inspect opportunity cost before continuing.
5. Recover full initial$1,200 content plus$255 first-month overhead, no amortization counted again:1455/39.035→**38 pack sales**, before acquisition. Five preorders=$245 cash, not enough to finance labour.
6. Hypothetical Pro:255/14.135→**19 active paid/month**, before content/CAC. No recurring customer need has been observed, so Pro remains deferred.

Annual subscriptions, sales tax, currency conversion, merchant reserves, refunds and recurring renewals change timing; revenue here is net of taxes collected for government, not gross checkout total. Merchant jurisdiction/tax treatment must be confirmed before payment, not assumed from language/timezone.

## Stress

| Scenario | Result for pack unless noted |
|---|---|
|30min support vs10|Contribution$29.035,59.3% before content|
|Labour$60/h,10min support|Contribution$34.035,69.5%; content/maintenance also double|
|Refund15%|Extra$4.90 cost→69.7% before content|
|Fee6%+$0.50|Extra$1.225→77.2% before content|
|Only25 lifetime buyers|Content$48 each→−$8.965 after content, before maintenance/CAC|
|Hosted tutor20 calls×(50k input+10k output), scenario rates$3/$15 per1M|$6/user; reduces hypothetical Pro margin by31.6 points|
|Cloud evaluator assumed$.02/run×100|$2/user before retry/abuse/support; no evidence needed in MVP|
|CAC30min labour/order|$15, already above≤$10 gate before cash promotion|

LLM formula=(input×rate_in+output×rate_out)/1e6×calls. Scenario bands$.5/$2,$3/$15,$10/$50 are **not vendor prices**. Actual API call would need current tariff including caching/reasoning/tools. Proposed MVP has no provider-paid inference. This avoids provider coupling; it does not validate the paid value of BYO practice.

## Small team reality

Recurring CAC=prospecting+qualification+sales+follow-up+distribution content labour×30+cash, divided by actual new buyers; separate initial research. Track lifetime cohort cost30/60/90days so one-time sales are not compared to one month of support. Free support is docs/group capped, pack includes30-day content-error support, no indefinite consulting. Stop expansion if hosted cash>$100/mo before30 customers, maintenance>4h/mo for2 months, or margin/CAC gates fail.

Team fallback$300/up to6 people: sales+delivery5h=$150;fees$11;refund$15;delivery/incident reserve$4→contribution$120/40%. Discovery service, not SaaS margin. If customization pushes beyond5h, reject/defer the deal or test a new price in a new protocol; do not subsidize hidden bespoke work.

## Thesis score arithmetic / sensitivity

Weights sum33, maximum165. T1=52/31.5%;T2=86/52.1%;T3=72/43.6%;T4=70/42.4%;T5=120/72.7%;T6=116/70.3%;T7=87/52.7%;T8=62/37.6%. These are preferences, not market data. Lower T5 pain+WTP one point each→114/69.1%, below T6. Winner is fragile. Demand/distribution/safety veto always overrides score. Correlated cheapness criteria bias this ranking toward cheap experiments deliberately, not toward proven company value.
