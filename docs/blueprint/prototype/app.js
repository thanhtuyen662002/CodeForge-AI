'use strict';
// Disconnected design prototype. All records below are invented fixtures.
// No fetch, external service, payment, upload, code execution or persistence.
const screens = {
  offer: 'Giới thiệu gói', demo: 'Bài thử trên giấy', order: 'Xem đơn hàng',
  library: 'Gói của bạn', lab: 'Hướng dẫn bài thực hành', results: 'Kết quả tự kiểm tra',
  debrief: 'Đối chiếu cách nghĩ', help: 'Trợ giúp & dữ liệu', operations: 'Vận hành của chủ dự án'
};
let screen = 'offer';
let scenario = 'ready';
let noticeTimer;
const content = document.getElementById('content');
const picker = document.getElementById('screen-picker');
const scenarioPicker = document.getElementById('scenario-picker');
const notice = document.getElementById('notice');
for (const [value, label] of Object.entries(screens)) {
  const option = document.createElement('option'); option.value = value; option.textContent = label; picker.append(option);
}
const button = (label, view, cls = 'primary') => `<button class="${cls}" data-view="${view}">${label}</button>`;
const crumb = label => `<div class="breadcrumbs"><button data-view="library">Gói của bạn</button><span>/</span><span>${label}</span></div>`;
const readiness = () => scenario === 'withdrawn' ? '<div class="banner danger"><strong>Bài này đang được sửa.</strong><br>Chúng tôi tạm dừng cung cấp bản hiện tại. Bạn có thể yêu cầu cập nhật hoặc hoàn tiền.</div>' : scenario === 'pending' ? '<div class="banner warn"><strong>Đang đối soát đơn hàng.</strong><br>Nếu bạn đã thanh toán, hãy giữ biên nhận. Bạn không cần thanh toán lại.</div>' : '';

function offer() {
  return `<section class="hero"><div><p class="eyebrow">Thực hành kỹ năng kiểm chứng</p><h1>Code chạy được.<br>Nhưng đã đúng chưa?</h1><p class="lead">Luyện cách tìm lỗi trong một bản sửa có vẻ hợp lý — trước khi bạn nhấn merge.</p><div class="actions">${button('Xem bài thử miễn phí →', 'demo')}${button('Khám phá gói hai bài', 'order', 'secondary')}</div><div class="hero-proof"><span>Python backend</span><span>30–45 phút / bài</span><span>Dùng agent bạn đang có</span></div></div><div class="review-card"><div class="meta"><span>CHANGE REVIEW</span><span>case minh họa</span></div><h3>Retry không được tính tiền hai lần.</h3><div class="code"><span class="add">+ cập nhật số dư</span><br><span class="add">+ ghi nhận event đã xử lý</span><br><br><span class="del">? Nếu bước thứ hai thất bại?</span></div><div class="check-note">Happy path xanh chưa trả lời được câu hỏi này.</div></div></section><section><div class="section-heading"><h2>Hai bài. Một cách nghĩ.</h2><span class="small muted">Không cần học lại từ đầu</span></div><div class="lab-grid"><article class="panel lab-card"><div class="number">LAB A / CORRECTNESS</div><h3>Một sự kiện, một kết quả</h3><p>Tìm chuỗi retry làm một bản sửa sai, viết kiểm tra hồi quy và giải thích giới hạn của fix.</p><div class="bottom"><span class="chip">Idempotency · Python</span><span class="small">30–45 phút</span></div></article><article class="panel lab-card"><div class="number">LAB B / BOUNDARIES</div><h3>Đúng dữ liệu, đúng người</h3><p>Áp dụng cùng cách kiểm chứng vào một ranh giới truy cập khác. Không chỉ đổi đầu vào của bài cũ.</p><div class="bottom"><span class="chip">Tenant boundary · Python</span><span class="small">30–45 phút</span></div></article></div><p class="plan-note">Dành cho người đã biết Python và Git. Gói không bao gồm tài khoản agent, tư vấn dự án công ty hoặc chứng chỉ nghề nghiệp. Kết quả thực hành là tự kiểm tra.</p></section>`;
}
function demo() {
  return `<div class="slim"><p class="eyebrow">Bài thử / Không cài đặt</p><h1>Một khoảng trống giữa hai bước.</h1><p class="lead">Một handler nhận sự kiện và cập nhật số dư. Bên gửi có thể gửi lại cùng một sự kiện.</p><section class="panel"><h2>Điều cần giữ đúng</h2><ul class="list"><li>Một event hợp lệ chỉ được áp dụng một lần.</li><li>Cùng ID nhưng khác nội dung phải bị từ chối.</li><li>Nếu ghi ledger thất bại, số dư không được tăng.</li></ul><div class="banner">Bản sửa hiện tại cập nhật số dư trước, rồi mới đánh dấu event đã xử lý. Các kiểm tra happy path đều xanh.</div><h3>Bạn cần thấy bằng chứng nào trước khi merge?</h3><p class="muted">Hãy nghĩ về một chuỗi sự kiện có thể làm kết quả sai. Không cần viết code ở bước này.</p><details class="detail"><summary>Mở checklist miễn phí</summary><p>Viết invariant. Tìm failure giữa các side effect. Xét retry và payload mâu thuẫn. Yêu cầu kiểm tra fail trước fix, pass sau fix. Thử một cách giải đúng khác. Ghi rõ điều còn chưa kiểm chứng.</p></details></section><div class="actions">${button('Xem phạm vi gói hai bài', 'order')}${button('Quay về giới thiệu', 'offer', 'secondary')}</div><p class="small muted">Đây là câu hỏi minh họa, không phải bài thi hoặc phép đo năng lực đã được xác thực.</p></div>`;
}
function order() {
  return `<p class="eyebrow">Phạm vi rõ ràng, trước khi quyết định</p><h1>Gói luyện kiểm chứng Python</h1>${readiness()}<div class="split"><section class="panel"><h2>Bạn sẽ nhận được</h2><div class="spec-row"><span>Bài thực hành</span><strong>Hai tình huống khác nhau</strong></div><div class="spec-row"><span>Mỗi bài</span><strong>Spec · starter · kiểm tra · debrief</strong></div><div class="spec-row"><span>Công cụ</span><strong>Agent riêng hoặc tự giải</strong></div><div class="spec-row"><span>Hỗ trợ</span><strong>Lỗi nội dung trong 30 ngày</strong></div><div class="spec-row"><span>Hoàn tiền của pilot</span><strong>14 ngày từ khi nhận bài</strong></div><p class="plan-note">Trước một đơn hàng thật, cần công bố merchant, tiền tệ, ngày giao cụ thể và môi trường đã kiểm thử. Không thu tiền khi thông tin này chưa sẵn sàng.</p></section><aside class="panel"><span class="chip">Giá đang cần kiểm chứng</span><div class="metric-price"><span data-price-usd>US$49</span> <span class="small muted">/ một lần</span></div><p class="small muted">Không subscription. Không bao gồm phí agent của bạn.</p><button class="primary" data-action="payment">Xem trạng thái đơn minh họa</button><p class="small muted detail">Bản thiết kế này không có checkout, không tạo đơn và không nhận thông tin thanh toán.</p></aside></div>`;
}
function library() {
  if (scenario === 'pending') return `<p class="eyebrow">Gói của bạn</p><h1>Chúng tôi đang xác nhận.</h1>${readiness()}<section class="panel empty"><h2>Đơn minh họa CF-DEMO</h2><p class="muted">Quyền truy cập xuất hiện sau khi giao dịch được đối soát. Mở lại trang không tạo một lần thanh toán mới.</p>${button('Xem hỗ trợ đơn hàng', 'help', 'secondary')}</section>`;
  return `<div class="section-heading"><div><p class="eyebrow">Gói của bạn / bản minh họa</p><h1>Tiếp tục một quyết định tốt hơn.</h1></div></div>${readiness()}<div class="lab-grid"><article class="panel lab-card"><div class="number">LAB A / 01</div><span class="chip ${scenario === 'withdrawn' ? 'red' : 'green'}">${scenario === 'withdrawn' ? 'Tạm dừng cung cấp' : 'Sẵn sàng bắt đầu'}</span><h2 class="detail">Một sự kiện, một kết quả</h2><p>Đọc spec, dự đoán failure, rồi kiểm tra trên máy của bạn.</p><div class="actions">${button(scenario === 'withdrawn' ? 'Xem phương án hỗ trợ' : 'Mở hướng dẫn bài', scenario === 'withdrawn' ? 'help' : 'lab')}</div></article><article class="panel lab-card"><div class="number">LAB B / 02</div><span class="chip">Tình huống tiếp theo</span><h2 class="detail">Đúng dữ liệu, đúng người</h2><p>Sau khi đối chiếu bài A, thử lại cách nghĩ trong một ranh giới khác.</p><button class="secondary" data-action="lab-b">Xem bước tiếp theo</button></article></div><p class="plan-note">Bạn không cần đạt điểm cao để học tiếp. Đây là luyện tập, không phải bảng xếp hạng.</p>`;
}
function lab() {
  if (scenario !== 'ready') return unavailable();
  return `${crumb('Lab A')}<span class="chip">Bài minh họa · Không có gói chạy kèm</span><h1 class="detail">Một sự kiện, một kết quả.</h1>${readiness()}<div class="steps"><div class="step active"><span>01</span>Đọc spec</div><div class="step"><span>02</span>Thử trên máy</div><div class="step"><span>03</span>Tự kiểm tra</div><div class="step"><span>04</span>Đối chiếu</div></div><div class="split"><section class="panel"><h2>Điều bạn cần tìm</h2><p class="muted">Một counterexample tái lập được, một kiểm tra phân biệt fix đúng với fix sai, và một quyết định merge có giới hạn rõ.</p><h3>Trước khi gọi agent</h3><ol class="list"><li>Đọc invariant và ghi dự đoán của bạn.</li><li>Tìm điểm failure giữa hai thay đổi trạng thái.</li><li>Chọn bằng chứng có thể bác bỏ dự đoán đó.</li></ol><div class="banner">Chỉ dùng thư mục bài tập và dữ liệu giả lập. Đọc thay đổi trước khi chạy; không cấp quyền rộng hoặc dùng secrets của công ty.</div><div class="actions">${button('Xem kết quả mẫu', 'results', 'primary')}${button('Bài thử không cần cài đặt', 'demo', 'secondary')}</div></section><aside class="panel"><h3>Chuẩn bị môi trường</h3><p class="small muted">Bản phát hành thật sẽ ghi runtime, hệ điều hành đã kiểm thử và hash của gói.</p><ul class="list"><li>Dùng agent bạn đã có, nếu muốn.</li><li>Không gửi code hoặc API key cho CodeForge.</li><li>Local không có nghĩa là agent không gửi dữ liệu tới nhà cung cấp của bạn.</li></ul><button class="secondary" data-action="download">Về gói bài thực hành</button></aside></div>`;
}
function results() {
  if (scenario !== 'ready') return unavailable();
  return `${crumb('Tự kiểm tra')}<p class="eyebrow">Kết quả minh họa / không xác minh năng lực</p><h1>Hai kiểm tra xanh.<br>Một câu hỏi còn mở.</h1><span class="chip amber">Tự khai từ máy người học</span><div class="split detail"><section class="panel"><h2>Kiểm tra theo invariant</h2><div class="check-row"><span class="check-symbol">✓</span><div><strong>Sự kiện đầu tiên được áp dụng</strong><p>Kết quả mẫu: pass</p></div></div><div class="check-row"><span class="check-symbol">✓</span><div><strong>Retry thông thường giữ nguyên kết quả</strong><p>Kết quả mẫu: pass</p></div></div><div class="check-row"><span class="check-symbol fail">!</span><div><strong>Failure giữa hai bước không làm sai số dư</strong><p>Kết quả mẫu: fail — cần một kiểm tra bổ sung</p></div></div><div class="field"><label for="reflection">Bạn cần thêm bằng chứng gì?</label><textarea id="reflection" maxlength="1000" placeholder="Chỉ dùng ví dụ giả lập. Nội dung ở đây không được lưu hoặc gửi đi."></textarea></div><button class="primary" data-action="reflect">Giữ ý tưởng trong phiên xem này</button></section><aside class="panel"><h3>Checks không phải chứng chỉ.</h3><p class="muted small">Bạn kiểm soát code và kết quả local. Một report hợp lệ không chứng minh ai viết code, agent nào giúp hay bạn đã hiểu hết tình huống.</p><p class="small muted">Không có upload trong bản thiết kế. Dữ liệu hiển thị là mẫu đã viết sẵn.</p>${button('Mở phần đối chiếu →', 'debrief', 'secondary')}</aside></div>`;
}
function debrief() {
  if (scenario !== 'ready') return unavailable();
  return `${crumb('Đối chiếu')}<div class="slim"><p class="eyebrow">Ghi chú minh họa / không phải đáp án phát hành</p><h1>Kiểm chứng cả khoảng trống.</h1><section class="panel"><p class="quote">Một kiểm tra tốt giúp bạn phân biệt điều đã được chứng minh với điều bạn chỉ đang tin.</p><h3>Ba điều nên mang sang bài tiếp theo</h3><ol class="list"><li>Đặt invariant trước khi nhìn implementation.</li><li>Thử failure ở ranh giới của các side effect, không chỉ retry ở trạng thái bình thường.</li><li>Giữ lại điều chưa kiểm chứng trong quyết định merge của bạn.</li></ol><p class="muted">Debrief thật cần review độc lập cùng spec, reference và các cách giải đúng khác. Trang này chỉ minh họa cách trình bày.</p></section><div class="actions">${button('Về gói hai bài', 'library')}${button('Báo điểm chưa rõ', 'help', 'secondary')}</div></div>`;
}
function help() {
  return `<p class="eyebrow">Trợ giúp / chủ động giữ quyền kiểm soát</p><h1>Có điểm chưa đúng?<br>Hãy bắt đầu từ đó.</h1><div class="split"><section class="panel"><h2>Chọn điều bạn cần</h2><div class="field"><label for="request-kind">Loại yêu cầu</label><select id="request-kind"><option>Nội dung hoặc kiểm tra chưa rõ</option><option>Chưa nhận được bài</option><option>Yêu cầu hoàn tiền</option><option>Xuất hoặc xóa dữ liệu tùy chọn</option></select></div><div class="field"><label for="help-note">Mô tả ngắn</label><textarea id="help-note" maxlength="1000" placeholder="Không gửi code công ty, secrets, transcript hoặc thông tin thẻ."></textarea></div><button class="primary" data-action="support">Xem phản hồi minh họa</button><p class="small muted detail">Không có yêu cầu nào được gửi từ bản thiết kế này.</p></section><aside class="panel"><h3>Dữ liệu tối thiểu</h3><p class="small muted">Thực hành không cần cung cấp API key hoặc toàn bộ cuộc hội thoại với agent. Chia sẻ kết quả học tập là tùy chọn.</p><details class="detail"><summary>Về hoàn tiền và dữ liệu đơn hàng</summary><p>Yêu cầu được tiếp nhận không đồng nghĩa hoàn tiền đã xử lý. Một số thông tin thanh toán có thể cần giữ theo nghĩa vụ của merchant; phải giải thích rõ trước khi thu tiền thật.</p></details></aside></div>`;
}
function operations() {
  return `<p class="eyebrow">Chủ dự án / dữ liệu giả lập</p><h1>Chỉ những việc cần xử lý.</h1><p class="lead">Đối soát đơn, kiểm tra bản phát hành và hỗ trợ người mua. Không có điểm năng lực của nhân viên.</p><div class="ops-summary"><div><strong>1</strong><span>Đơn chờ đối soát · mẫu</span></div><div><strong>1</strong><span>Bản cần kiểm tra · mẫu</span></div><div><strong>0</strong><span>Dữ liệu thật trong thiết kế</span></div></div><section class="panel"><div class="section-heading"><h2>Hàng đợi công việc minh họa</h2><span class="chip">Chỉ dành cho chủ dự án</span></div><div class="table-wrap"><table><thead><tr><th>Đối tượng</th><th>Tình trạng</th><th>Việc tiếp theo</th></tr></thead><tbody><tr><td>CF-DEMO / đơn mẫu</td><td><span class="chip amber">Chờ đối soát</span></td><td><button class="secondary" data-action="reconcile">Xem hướng xử lý</button></td></tr><tr><td>LAB-A / bản minh họa</td><td><span class="chip ${scenario === 'withdrawn' ? 'red' : 'green'}">${scenario === 'withdrawn' ? 'Tạm dừng' : 'Chưa phát hành thật'}</span></td><td><button class="secondary" data-action="quarantine">Mô phỏng tạm dừng</button></td></tr></tbody></table></div></section><p class="plan-note">Giao diện vận hành chỉ được xây nếu đối soát thủ công thực sự tốn thời gian. Các con số trên là fixture giao diện, không phải doanh thu hay số người dùng.</p>`;
}
const renderers = { offer, demo, order, library, lab, results, debrief, help, operations };
function unavailable() {
  return `${crumb('Trạng thái truy cập')}<h1>${scenario === 'pending' ? 'Đang chờ xác nhận đơn.' : 'Bản bài này đang tạm dừng.'}</h1>${readiness()}<section class="panel"><p>Trong tình huống minh họa này, nội dung bài và nút tải được ẩn. Hãy xem trạng thái đơn hoặc liên hệ hỗ trợ.</p><div class="actions">${button('Về gói của bạn', 'library')}${button('Trợ giúp', 'help', 'secondary')}</div></section>`;
}
function render(moveFocus = true) {
  content.innerHTML = renderers[screen](); picker.value = screen; scenarioPicker.value = scenario;
  for (const item of document.querySelectorAll('.site-header nav [data-view]')) {
    if (item.dataset.view === screen) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
  }
  CodeForgeI18n.apply();
  document.title = `${CodeForgeI18n.text(screens[screen])} — CodeForge`;
  if (moveFocus) { content.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
}
function showNotice(message) {
  clearTimeout(noticeTimer); notice.textContent = message; notice.hidden = false; CodeForgeI18n.apply();
  noticeTimer = setTimeout(() => { notice.hidden = true; }, 8000);
}
document.addEventListener('click', event => {
  const target = event.target.closest('button'); if (!target) return;
  if (target.dataset.view && renderers[target.dataset.view]) { screen = target.dataset.view; render(); return; }
  switch (target.dataset.action) {
    case 'payment': scenario = 'pending'; screen = 'library'; render(); showNotice('Đơn mô phỏng đang chờ. Không có thanh toán hoặc đơn hàng thật.'); break;
    case 'download': showNotice('Chưa có bundle phát hành. Bản thiết kế không tải hoặc chạy code.'); break;
    case 'lab-b': showNotice('Bài B là bước tiếp theo trong gói; không có nội dung chạy thật trong prototype.'); break;
    case 'reflect': showNotice('Ý tưởng chỉ còn trong ô nhập hiện tại. Chuyển màn hình hoặc đóng trang sẽ xóa; không lưu hay gửi đi.'); break;
    case 'support': showNotice('Minh họa: đã tiếp nhận yêu cầu. Thực tế không gửi dữ liệu hoặc xử lý hoàn tiền.'); break;
    case 'reconcile': showNotice('Đối soát từ merchant; không dùng redirect hoặc ảnh chụp làm bằng chứng thanh toán.'); break;
    case 'quarantine': scenario = 'withdrawn'; render(); showNotice('Đã đổi trạng thái mẫu sang tạm dừng. Không có bản phát hành thật bị thay đổi.'); break;
  }
});
picker.addEventListener('change', () => { screen = picker.value; render(); });
scenarioPicker.addEventListener('change', () => { scenario = scenarioPicker.value; render(); });
document.addEventListener('codeforge:language', () => { document.title = `${CodeForgeI18n.text(screens[screen])} — CodeForge`; });
render(false);
