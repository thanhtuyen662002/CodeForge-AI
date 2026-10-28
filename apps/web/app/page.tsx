import type { ReactNode } from "react";

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return <svg aria-hidden="true" className={className ?? "icon"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">{children}</svg>;
}

export default function Home() {
  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
    <header className="site-header">
      <div className="brand" aria-label="CodeForge AI"><span className="brand-mark" aria-hidden="true">CF</span><span className="brand-copy"><strong>CodeForge AI</strong><small>HỌC BẰNG BẰNG CHỨNG</small></span></div>
      <nav className="primary-nav" aria-label="Điều hướng chính"><a href="#overview">Tổng quan</a><a href="#pathway">Lộ trình</a><a href="#practice">Thực hành</a><a href="#progress">Tiến độ</a></nav>
      <span className="preview-pill">Bản khung</span>
    </header>

    <main id="main-content">
      <section className="service-notice" id="service-status" aria-labelledby="service-heading" role="status">
        <span className="notice-icon"><Icon><path d="M12 3 20 7v5c0 4.2-3 7.4-8 9-5-1.6-8-4.8-8-9V7l8-4Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></Icon></span>
        <div><p className="eyebrow">TRẠNG THÁI HỆ THỐNG</p><h2 id="service-heading">Dịch vụ chưa được cấu hình</h2><p>Đây mới là khung giao diện. Tài khoản, lưu tiến độ, chấm Python/SQL và trợ giảng chưa được kết nối. Không có tài khoản, bài nộp hoặc tiến độ nào được tạo hay lưu ở bản khung này.</p></div>
      </section>

      <section className="hero" id="overview" aria-labelledby="hero-heading">
        <div className="hero-copy"><p className="eyebrow">KHÔNG GIAN HỌC TẬP KỸ THUẬT</p><h1 id="hero-heading">Học để hiểu. Thử để tiến bộ.</h1><p className="hero-lead">Từng bước xác định điều đã biết, luyện đúng điểm còn vướng, hiểu lỗi và thử lại — không biến dữ liệu chưa có thành điểm số giả.</p>
          <div className="hero-actions"><a className="action-link action-primary" href="#pathway">Khám phá lộ trình<Icon className="action-icon"><path d="M5 12h14M13 6l6 6-6 6"/></Icon></a><a className="action-link action-secondary" href="#service-status">Xem trạng thái dịch vụ</a></div>
          <ul className="principles" aria-label="Nguyên tắc học tập"><li><Icon><path d="m5 12 4 4L19 6"/></Icon>Hiểu lỗi</li><li><Icon><path d="m5 12 4 4L19 6"/></Icon>Thử lại</li><li><Icon><path d="m5 12 4 4L19 6"/></Icon>Giải thích</li></ul>
        </div>
        <aside className="loop-panel" aria-labelledby="loop-heading"><div className="panel-heading"><span className="panel-icon"><Icon><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/></Icon></span><div><p className="eyebrow">VÒNG LẶP HỌC TẬP</p><h2 id="loop-heading">Một bước rõ ràng mỗi lần</h2></div></div>
          <ol className="learning-loop"><li><span className="loop-number">01</span><div><strong>Chẩn đoán</strong><p>Ghi nhận bằng chứng và điều chưa đủ dữ liệu.</p></div></li><li><span className="loop-number">02</span><div><strong>Luyện tập</strong><p>Thử một nhiệm vụ phù hợp với mục tiêu học.</p></div></li><li><span className="loop-number">03</span><div><strong>Giải thích và thử lại</strong><p>Hiểu nguyên nhân trước khi làm biến thể mới.</p></div></li></ol>
          <p className="panel-note">Chưa có bằng chứng thật thì chưa kết luận về mức độ thành thạo.</p>
        </aside>
      </section>

      <section className="content-section" id="pathway" aria-labelledby="pathway-heading"><div className="section-heading"><div><p className="eyebrow">BẮT ĐẦU TỪ ĐIỀU ĐÃ BIẾT</p><h2 id="pathway-heading">Lộ trình học</h2></div><p>Những khu vực dưới đây là vị trí dự kiến của tính năng, không phải dịch vụ đang hoạt động.</p></div>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-icon"><Icon><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4M8.5 11l1.7 1.7 3.5-3.8"/></Icon></span><p className="card-kicker">01 / KHÁM PHÁ</p><h3>Chẩn đoán kỹ năng</h3><p>Nhận diện điều đã quan sát được và phần cần thêm bằng chứng.</p><p className="availability"><span className="status-dot" aria-hidden="true"/>Chưa khả dụng — chưa có dịch vụ tài khoản.</p></article>
          <article className="feature-card"><span className="feature-icon"><Icon><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M8 7h8M8 11h7"/></Icon></span><p className="card-kicker">02 / HỌC CÓ MỤC TIÊU</p><h3>Bài học phù hợp</h3><p>Khái niệm ngắn, ví dụ dễ đọc và cơ hội tự sửa trước khi xem lời giải.</p><p className="availability"><span className="status-dot" aria-hidden="true"/>Chưa khả dụng — chưa có nội dung được duyệt.</p></article>
          <article className="feature-card"><span className="feature-icon"><Icon><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></Icon></span><p className="card-kicker">03 / THỰC HÀNH</p><h3>Python và SQL</h3><p>Chạy thử và nhận giải thích chỉ khi môi trường cách ly và bộ chấm đã được kiểm chứng.</p><p className="availability"><span className="status-dot" aria-hidden="true"/>Chưa khả dụng — chưa xác minh bộ chạy và bộ chấm.</p></article>
        </div>
      </section>

      <section className="content-section" id="practice" aria-labelledby="practice-heading"><div className="section-heading"><div><p className="eyebrow">RANH GIỚI AN TOÀN</p><h2 id="practice-heading">Thực hành có kiểm soát</h2></div><p>Không chạy mã người học trên máy chủ web hoặc cơ sở dữ liệu ứng dụng.</p></div>
        <div className="practice-panel"><span className="practice-icon"><Icon><path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M14 3h7v7M21 3l-10 10"/><path d="M7 8h4M7 12h3"/></Icon></span><div><h3>Môi trường chạy chưa được xác minh</h3><p>Khu vực này chưa gửi mã đi đâu và không chấm điểm. Trước khi bật thực hành, cần chứng minh cách ly, giới hạn tài nguyên, chặn mạng ngoài, thời gian chờ và dọn dẹp phiên chạy.</p><span className="inline-state">Chưa khả dụng trong bản khung</span></div></div>
      </section>

      <section className="content-section" id="progress" aria-labelledby="progress-heading"><div className="section-heading"><div><p className="eyebrow">BẰNG CHỨNG, KHÔNG PHỎNG ĐOÁN</p><h2 id="progress-heading">Tiến độ cá nhân</h2></div><p>Không có biểu đồ, điểm số hay phần trăm thành thạo khi chưa có dữ liệu thật.</p></div>
        <div className="empty-state"><span className="empty-icon"><Icon><path d="M4 19V5M4 19h16"/><path d="M8 15v-3M12 15V8M16 15v-5"/></Icon></span><div><h3>Chưa có dữ liệu học</h3><p>Bản khung không tạo hồ sơ, lưu bài làm, tính điểm hoặc suy đoán mức độ thành thạo.</p></div></div>
      </section>
    </main>

    <footer className="site-footer"><span>CodeForge AI</span><p>Bản khung giao diện · Chưa triển khai production · Không lưu dữ liệu người học</p></footer>
  </div>;
}
