# CodeForge AI

**Học để tự làm được, không chỉ để có điểm đẹp.**

CodeForge AI là nền tảng học lập trình, dữ liệu và AI theo vòng lặp Diagnose → Learn → Practice → Fail → Explain → Retry → Master → Simulate → Review → Improve.

## Trạng thái thực tế

Giai đoạn: **engineering foundation, chưa phải MVP**. Repo có thiết kế sản phẩm, đánh giá đối kháng, kiến trúc, hợp đồng dữ liệu, quy trình phát triển và lõi domain có thể kiểm thử. Chưa có luồng đăng ký → học → chạy code → lưu tiến độ hoạt động trên production. Không có tuyên bố đã pentest sandbox hoặc đã kiểm chứng hiệu quả học tập.

Hạ tầng bắt buộc: **Supabase** (Postgres, Auth, Storage) và **Vercel** (web/BFF). Quyết định FE/BE: Next.js App Router + React + TypeScript; backend modular monolith bằng Route Handlers/server services; tách hẳn hệ thống chạy mã không tin cậy khỏi web/BFF. Chi tiết ở [Architecture](docs/ARCHITECTURE.md).

## Bắt đầu đọc

1. [Product vision](docs/PRODUCT_VISION.md), [UX](docs/UX_SPEC.md), [phạm vi và traceability](docs/REQUIREMENTS_TRACEABILITY.md).
2. [Roadmap](docs/ROADMAP.md), [backlog có tiêu chí nghiệm thu](docs/IMPLEMENTATION_BACKLOG.md), [quy tắc agent](AGENTS.md).
3. [Red-team](docs/RED_TEAM.md), [security](docs/SECURITY.md), [release gates](docs/RELEASE_GATES.md).
4. [Danh mục đầy đủ](docs/INDEX.md).

## Chạy nền tảng kỹ thuật

Dùng Node.js 22 và npm. `npm ci`, `npm run check` để chạy lint quy ước, typecheck, kiểm tra nội dung, build lõi TypeScript và unit tests. Đây **không** phải lệnh khởi động website. PR triển khai web phải bổ sung Next.js được pin phiên bản, lockfile, browser E2E và deployment preview trước khi bật tính năng cho người học.

## Những điều không được hiểu nhầm

- Fixture luyện tập trong repo không phải ngân hàng đề thi kín. Repo này public; đáp án đưa vào Git là công khai.
- Readiness là chỉ báo nội bộ có mức độ bao phủ, không phải xác suất trúng tuyển hay chứng chỉ năng lực nghề nghiệp.
- Không liên kết chính thức với VinUni/Vingroup; không sử dụng đề thi không công khai.
- File ruleset trong repo **không tự bật branch protection**. Xem [Governance](docs/GOVERNANCE.md) và kiểm chứng trạng thái trong GitHub Settings.
- Chưa cấp credential, chưa tạo dự án cloud, chưa triển khai production, chưa phát sinh dịch vụ trả phí theo gói này.
