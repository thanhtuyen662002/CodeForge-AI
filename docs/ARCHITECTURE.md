# Architecture

## Quyết định

FE: Next.js App Router, React, TypeScript strict; UI primitives có accessibility, Tailwind/shadcn chỉ thêm khi cần, không thêm toàn bộ bộ thư viện từ đầu. BE: Next.js Route Handlers + server-only application services trong modular monolith. Supabase: Postgres, Auth, Storage private buckets. Vercel: web/BFF deployments. Không thêm FastAPI/NestJS chỉ để có một backend riêng.

Một codebase giúp giữ hợp đồng TypeScript đồng bộ và ít vận hành; đổi lại cần kỷ luật server/client boundary, auth cache và thời gian thực thi. Ràng buộc Vercel Functions không phù hợp để biến request thành arbitrary-code worker; managed Sandbox là primitive tách biệt. Tham khảo nguồn chính thức trong RESEARCH.

## Component boundaries

Browser → Next web/BFF → Supabase (user-scoped auth/RLS)

BFF → assessment/content/learning services → transactional SQL + evidence ledger

BFF → execution broker → isolated execution provider → validated result → grading service

BFF → tutor gateway → approved context + model adapter → constrained feedback

Practice browser runtimes chạy ở origin riêng, không nhận app cookies/tokens. Kết quả browser chỉ advisory. Grading keys nằm private server data; execution provider nhận code/input tối thiểu, không nhận Supabase/service-role/AI secrets. Parent grader giữ expected outputs bên ngoài process chạy bài.

## Repository target layout

`apps/web` cho Next khi triển khai F1; `packages/domain` chứa core thuần; `content` cho metadata/practice fixtures; `supabase/migrations` và `supabase/tests`; `scripts` cho checks/governance; `docs` cho contracts/ADRs. Foundation chưa có web app; CI hiện không được gọi domain build là Next build.

## Durable execution

Submission tạo row + idempotency trong transaction rồi trả 202 job_id. Dùng Supabase/Postgres job table ban đầu; worker/scheduler phải có deployment riêng được xác minh, lease/heartbeat/retry/dead-letter. Không giả định request Vercel tiếp tục chạy sau khi trả response. Tích hợp provider có callback hoặc polling + reaper; nếu chưa có durable dispatch thì feature graded coding giữ off. Redis/queue ngoài chỉ khi đo ra nhu cầu.

Callback: verify signature trên raw body, timestamp window, event id dedup; map provider job về owner/item/runtime đã pin. Không nhận score do client/provider stdout tự khai. Transaction commit grading + evidence/outbox đúng một lần; retry không nhân đôi điểm.

## Access and caches

Server verify identity bằng Supabase method xác thực phù hợp; không tin session object client hoặc middleware như authorization cuối cùng. Role quản trị từ server-controlled membership, không user_metadata. RLS defense-in-depth trên bảng learner. Nội dung public có thể cache; auth pages, exam item responses, tutor và submissions no-store. Không dùng shared CDN cache cho profile hoặc Set-Cookie response.

## Environments

Local/disposable integration, staging và production tách Supabase projects/credentials. Preview từ fork không có secret; không nối preview vào production. Migrations kiểm tra reset→seed→RLS tests trước deploy; expand/contract, backup và restore drill trước production.

## Giới hạn nền tảng hiện tại

Chỉ domain core và governance có test chạy được trong foundation. Adapter Auth, Next UI, database policies, browser runtimes, durable workers, tutor provider và deployment vẫn là các issue phải nghiệm thu. Những boundary ở trên là thiết kế bắt buộc, không phải lời khẳng định đã implement.
