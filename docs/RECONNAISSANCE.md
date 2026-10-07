# Repository reconnaissance

Checked 2026-10-07; source of truth là Git objects và live GitHub API, không chat history. [Machine snapshot](research/repository-snapshot.json) ghi trạng thái **trước** strategy publication. Source: [repository](https://github.com/thanhtuyen662002/CodeForge-AI), [branches](https://github.com/thanhtuyen662002/CodeForge-AI/branches), [issues](https://github.com/thanhtuyen662002/CodeForge-AI/issues), [pull requests](https://github.com/thanhtuyen662002/CodeForge-AI/pulls), [Actions](https://github.com/thanhtuyen662002/CodeForge-AI/actions).

## FACT: cái có thật

- Main tại `ada0ce62eb2721fb21e7a0524cb6c50f9934bc0d`: chỉ README, một commit khởi tạo. Working tree sạch trước task này. Repository tạo 2026-10-02; 13 commits reachable across fetched branches, không tag trước planning.
- PR [#1](https://github.com/thanhtuyen662002/CodeForge-AI/pull/1), head `42b5a6aa678baabf711e1000e9b4127e870aecff`: bộ thiết kế rộng, pure TypeScript domain functions, tests, fixtures và CI. Có skill DAG, evidence heuristic, deadline/selection/row helpers. Không có app Next.js, database migration production, cloud evaluator hay khách hàng đã chứng minh.
- Branch `foundation/cf02-env-contract-20261003` tại `4ae51189e42c540f96b471fbebdce7e23e257984`: environment-readiness contract; contract không chứng minh staging đã provision/deploy.
- Branch `foundation/cf05-content-contract-20261003` tại `0fe35495e760c6f5e89ace24cd88ff0810c02c9e`: năm draft fixtures công khai (ba MCQ, Python age threshold, SQL active filter). Không phải 24 bài approved hay corpus verification mới.
- PR [#18](https://github.com/thanhtuyen662002/CodeForge-AI/pull/18), head `a52ebea47a29b3f19772ac3b5229d15580291fe9`: governance read-back, base foundation. PR [#19](https://github.com/thanhtuyen662002/CodeForge-AI/pull/19), head `d6447e74cad5995c70471a230b9f58caaed13606`: negative control, base main. Cả ba PR open, chưa merged tại audit.
- Actions API ghi negative-control run `37430680885` failure; governance `37400058695`, content `37115205239`, env `37101800867` success. Đây là historical CI status, không customer/product tests trong lượt planning này.
- Ruleset `CodeForge main` id24379959 **active**, default branch: một approving review, dismiss stale approvals, last-push approval, resolved threads, linear history, no delete/force-push; strict required `merge-gate` từ GitHub Actions. Đọc config/check failure không tự chứng minh mọi bypass bị khóa. Không thử merge hoặc sửa ruleset trong planning.

Đã đọc tree/history của mọi remote branch; nội dung docs/domain/tests/fixtures/workflows và các thay đổi env/content/governance, live Issues/PRs. Main README không được coi là product mandate cuối cùng.

## Provider state: không được nhầm “chưa deploy” với “không có resource”

[Tracker #17](https://github.com/thanhtuyen662002/CodeForge-AI/issues/17) có ghi ngày 2026-10-03 một Supabase project `CodeForge AI`, region ap-northeast-1, ACTIVE_HEALTHY, chưa development branch; Vercel chưa verified. **FACT: issue chứa báo cáo này. Current provider health, billing, schema và quyền truy cập chưa được read-back trong audit 2026-10-07.** Không có connector phù hợp trong session để xác nhận. Không coi resource đó là disposable hoặc tự xóa. P0 inventory cần owner kiểm tra bill/retention của resource có sẵn; $80/mo trong model là kịch bản tương lai, không invoice hiện tại.

## Sunk cost và quyền đổi hướng

INFERENCE: sunk cost chủ yếu là research/docs và một ít reusable domain/CI code, chưa có migration/customer contract được chứng minh. Actual hours/spend unknown. Domain/fixtures cũ không phù hợp đủ để kéo product về beginner curriculum. Có thể đổi ICP, value proposition, pricing, track, onboarding, evaluation và stack gần như miễn phí về migration. Không chứng minh free về thời gian founder hoặc provider bill.

Giữ branches/history để tra cứu; không merge foundation rộng chỉ vì đã viết. Governance practices có thể reuse. Content/skill graph/AI tutor/adaptive assumptions phải qua evidence mới. Strategy branch từ main không kéo dependency hoặc product code cũ.

## Legacy backlog disposition

| Issues | Scope cũ | Disposition sau strategy |
|---|---|---|
| #2 | Governance negative control | HOLD historical proof/cleanup; giữ protections, không prerequisite để nghiên cứu khách hàng |
| #3 | Supabase/Vercel staging | HOLD provisioning; chỉ inventory billing/access trong P0 |
| #4–#5 | Web/auth/schema/RLS | HOLD đến G3/G4 + profit + automation ROI |
| #6 | 24 content items | Superseded bởi cap hai labs/bốn probes sau G0 |
| #7–#10 | Diagnostic/sandbox/playground/lessons | HOLD; sandbox/cloud execution ngoài thesis |
| #11–#14 | Tutor/E2E/exam/CMS | Superseded/out of current scope |
| #15–#16 | Learner pilot/full broad MVP | Superseded bởi narrow P0–P4 gates |
| #17 | Lead coordination tracker | Giữ historical evidence, thêm strategy pointer và hold notice |
| PR #1/#18/#19 | Foundation/governance/negative control | Giữ review history, strategy-hold; không merge, approve hay bypass |

Open status không là lệnh thực thi. Chỉ issues P0 được link trong PROJECT_STATE là next executable work. Labels/tracker note không tự dừng automation bên ngoài; cần các worker đọc durable state trước làm việc. Task này không sửa recurring automations, credentials hay provider resources.

## Trạng thái sau planning

Xem [PROJECT_STATE](PROJECT_STATE.yaml) cho strategy PR và P0 issue URLs. Main vẫn cần independent eligible GitHub approval; independent agent red teams không thay approval đó. Planning đã tạo văn bản/kiểm tra tài liệu, **không** app, executable labs, payments, interviews hay deployments.
