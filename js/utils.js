/* ═══════════════════════════════════════════════════
   HRM PRO – UTILITIES
═══════════════════════════════════════════════════ */

const Utils = {
  /* ── Toast notifications ── */
  toast(msg, type = 'success') {
    const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-circle', info:'fa-info-circle' };
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 350); }, 3000);
  },

  /* ── Modal ── */
  openModal(title, bodyHtml, footerHtml = '', lg = false) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML   = bodyHtml;
    document.getElementById('modalFooter').innerHTML = footerHtml;
    const box = document.getElementById('modalBox');
    box.classList.toggle('modal-lg', lg);
    document.getElementById('modalOverlay').style.display = 'flex';
  },
  closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
  },

  /* ── Number formatting ── */
  money(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ'; },
  num(n)   { return new Intl.NumberFormat('vi-VN').format(n); },

  /* ── Date ── */
  fmtDate(s) {
    if (!s) return '—';
    const [y,m,d] = s.split('-');
    return `${d}/${m}/${y}`;
  },
  fmtMonth(s) {
    if (!s) return '—';
    const [y,m] = s.split('-');
    return `Tháng ${parseInt(m)}/${y}`;
  },
  today() {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
  },

  /* ── Initials from name ── */
  initials(name) {
    return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
  },

  /* ── Gradient cycling ── */
  avatarColors: ['gradient-indigo','gradient-purple','gradient-blue','gradient-green','gradient-orange','gradient-pink','gradient-teal','gradient-red'],
  pickColor(id) { return this.avatarColors[id % this.avatarColors.length]; },

  /* ── Status label ── */
  statusLabel(s) {
    const map = {
      active:'Đang làm việc', inactive:'Đã nghỉ việc', probation:'Thử việc',
      present:'Có mặt', absent:'Vắng mặt', late:'Đi trễ', leave:'Nghỉ phép',
      approved:'Đã duyệt', rejected:'Từ chối', pending:'Chờ duyệt',
      paid:'Đã trả', unpaid:'Chưa trả', draft:'Nháp',
      open:'Đang tuyển', closed:'Đã đóng',
      active_doc:'Hiệu lực', in_use:'Đang dùng', available:'Khả dụng', maintenance:'Bảo trì',
    };
    return map[s] || s;
  },

  /* ── Debounce ── */
  debounce(fn, ms = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },

  /* ── Simple table search ── */
  filterTable(tbodyId, query) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    const q = query.toLowerCase();
    rows.forEach(r => {
      r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  },

  /* ── Confirm dialog (using modal) ── */
  confirm(msg, onYes) {
    this.openModal('Xác nhận',
      `<div class="flex-center" style="gap:16px;flex-direction:column;padding:8px 0">
         <div style="width:60px;height:60px;border-radius:50%;background:var(--danger-light);display:flex;align-items:center;justify-content:center;font-size:28px;color:var(--danger)">
           <i class="fa-solid fa-triangle-exclamation"></i>
         </div>
         <p style="font-size:14px;text-align:center;color:var(--text-base)">${msg}</p>
       </div>`,
      `<button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
       <button class="btn btn-danger" id="confirmYes">Xác nhận</button>`
    );
    document.getElementById('confirmYes').onclick = () => { this.closeModal(); onYes(); };
  },

  /* ── Employee avatar HTML ── */
  empAvatar(emp, size = 'sm') {
    const cls = size === 'sm' ? 'emp-avatar-sm' : 'user-avatar';
    return `<div class="${cls} ${emp.color}">${emp.avatar}</div>`;
  },

  /* ── Pagination helper ── */
  paginate(items, page, perPage = 10) {
    const start = (page - 1) * perPage;
    return {
      items: items.slice(start, start + perPage),
      total: items.length,
      pages: Math.ceil(items.length / perPage),
      page,
      perPage,
    };
  },

  renderPagination(containerId, data, onPage) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const { total, pages, page, perPage } = data;
    const from = (page-1)*perPage + 1;
    const to   = Math.min(page*perPage, total);
    let btns = '';
    for (let i = 1; i <= pages; i++) {
      btns += `<button class="pg-btn${i===page?' active':''}" onclick="${onPage}(${i})">${i}</button>`;
    }
    el.innerHTML = `
      <span>Hiển thị ${from}–${to} trong ${total} bản ghi</span>
      <div class="pagination-btns">
        <button class="pg-btn" onclick="${onPage}(${Math.max(1,page-1)})" ${page===1?'disabled':''}><i class="fa-solid fa-chevron-left"></i></button>
        ${btns}
        <button class="pg-btn" onclick="${onPage}(${Math.min(pages,page+1)})" ${page===pages?'disabled':''}><i class="fa-solid fa-chevron-right"></i></button>
      </div>`;
  },
};

/* ── Close modal on overlay click ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modalClose').onclick  = () => Utils.closeModal();
  document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') Utils.closeModal(); };
});
