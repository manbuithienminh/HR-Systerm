/* ═══════════════════════════════════════════════════
   HRM PRO – LEAVE MANAGEMENT
═══════════════════════════════════════════════════ */

const Leave = {
  filter: 'all',
  page: 1,

  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Quản lý nghỉ phép</h1>
          <p>Theo dõi và duyệt đơn xin nghỉ phép</p>
        </div>
        <button class="btn btn-primary" onclick="Leave.openCreate()">
          <i class="fa-solid fa-plus"></i> Tạo đơn nghỉ phép
        </button>
      </div>

      <div class="stat-grid mb-24">
        ${['all','pending','approved','rejected'].map(s=>{
          const count = s==='all' ? DB.leaves.length : DB.leaves.filter(l=>l.status===s).length;
          const labels = {all:'Tất cả đơn',pending:'Chờ duyệt',approved:'Đã duyệt',rejected:'Từ chối'};
          const grads  = {all:'gradient-indigo',pending:'gradient-orange',approved:'gradient-green',rejected:'gradient-red'};
          const icons  = {all:'fa-calendar',pending:'fa-clock',approved:'fa-check-circle',rejected:'fa-times-circle'};
          return `<div class="stat-card" style="cursor:pointer" onclick="Leave.setFilter('${s}')">
            <div class="stat-icon ${grads[s]}"><i class="fa-solid ${icons[s]}" style="color:#fff"></i></div>
            <div class="stat-info"><div class="stat-value">${count}</div><div class="stat-label">${labels[s]}</div></div>
          </div>`;
        }).join('')}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Danh sách đơn nghỉ phép</span>
          <div style="display:flex;gap:6px">
            ${['all','pending','approved','rejected'].map(s=>`
              <button class="btn btn-sm ${this.filter===s?'btn-primary':'btn-secondary'}" onclick="Leave.setFilter('${s}')">
                ${{all:'Tất cả',pending:'Chờ duyệt',approved:'Đã duyệt',rejected:'Từ chối'}[s]}
              </button>`).join('')}
          </div>
        </div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Nhân viên</th><th>Loại nghỉ</th><th>Từ ngày</th><th>Đến ngày</th><th>Số ngày</th><th>Lý do</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody id="leaveTbody"></tbody>
          </table>
        </div>
        <div id="leavePagination" class="pagination" style="border-top:1px solid var(--border-light)"></div>
      </div>
    `;
    this.renderTable();
  },

  getFiltered() {
    if (this.filter === 'all') return [...DB.leaves].reverse();
    return DB.leaves.filter(l=>l.status===this.filter).reverse();
  },

  renderTable() {
    const filtered = this.getFiltered();
    const paged = Utils.paginate(filtered, this.page, 8);
    document.getElementById('leaveTbody').innerHTML = paged.items.map(l=>{
      const emp = DB.getEmp(l.empId);
      return `<tr>
        <td><div class="emp-cell"><div class="emp-avatar-sm ${emp?.color||''}">${emp?.avatar||'?'}</div><div class="emp-name">${emp?.name||'—'}</div></div></td>
        <td>${l.type}</td>
        <td>${Utils.fmtDate(l.from)}</td>
        <td>${Utils.fmtDate(l.to)}</td>
        <td><span class="status-badge status-active">${l.days} ngày</span></td>
        <td style="max-width:180px;font-size:12px">${l.reason}</td>
        <td><span class="status-badge status-${l.status}">${{pending:'Chờ duyệt',approved:'Đã duyệt',rejected:'Từ chối'}[l.status]}</span></td>
        <td>
          <div style="display:flex;gap:4px">
            ${l.status==='pending'?`
              <button class="btn btn-sm btn-success" onclick="Leave.approve(${l.id})"><i class="fa-solid fa-check"></i></button>
              <button class="btn btn-sm btn-danger"  onclick="Leave.reject(${l.id})"><i class="fa-solid fa-xmark"></i></button>
            `:''}
            <button class="btn btn-sm btn-secondary btn-icon" onclick="Leave.delete(${l.id})" style="color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('') || '<tr><td colspan="8"><div class="empty-state"><i class="fa-solid fa-calendar-xmark"></i><h3>Không có đơn nghỉ phép</h3></div></td></tr>';
    Utils.renderPagination('leavePagination', paged, 'Leave.goPage');
  },

  setFilter(f) { this.filter = f; this.page = 1; this.render(); },
  goPage(p) { Leave.page = p; Leave.renderTable(); },

  approve(id) {
    const l = DB.leaves.find(x=>x.id===id);
    l.status = 'approved';
    Utils.toast('Đã duyệt đơn nghỉ phép', 'success');
    this.renderTable();
  },
  reject(id) {
    const l = DB.leaves.find(x=>x.id===id);
    l.status = 'rejected';
    Utils.toast('Đã từ chối đơn nghỉ phép', 'warning');
    this.renderTable();
  },
  delete(id) {
    Utils.confirm('Xóa đơn nghỉ phép này?', ()=>{
      DB.leaves = DB.leaves.filter(l=>l.id!==id);
      Utils.toast('Đã xóa đơn','success');
      this.renderTable();
    });
  },

  openCreate() {
    const types = ['Nghỉ phép năm','Nghỉ bệnh','Nghỉ việc riêng','Nghỉ thai sản','Nghỉ không lương'];
    Utils.openModal('Tạo đơn nghỉ phép', `
      <div class="form-group"><label class="form-label">Nhân viên</label>
        <select class="form-control" id="lEmp">
          ${DB.employees.filter(e=>e.status!=='inactive').map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}
        </select></div>
      <div class="form-group"><label class="form-label">Loại nghỉ</label>
        <select class="form-control" id="lType">${types.map(t=>`<option>${t}</option>`).join('')}</select></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Từ ngày</label>
          <input class="form-control" id="lFrom" type="date" value="${Utils.today()}" /></div>
        <div class="form-group"><label class="form-label">Đến ngày</label>
          <input class="form-control" id="lTo" type="date" value="${Utils.today()}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Lý do</label>
        <textarea class="form-control" id="lReason" rows="3" placeholder="Nhập lý do..."></textarea></div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Leave.saveCreate()"><i class="fa-solid fa-save"></i> Gửi đơn</button>
    `);
  },
  saveCreate() {
    const from = document.getElementById('lFrom').value;
    const to   = document.getElementById('lTo').value;
    if (!from||!to) { Utils.toast('Vui lòng chọn ngày','warning'); return; }
    const days = Math.ceil((new Date(to)-new Date(from))/(1000*60*60*24))+1;
    DB.leaves.push({
      id: DB.leaves.length+1,
      empId: parseInt(document.getElementById('lEmp').value),
      type: document.getElementById('lType').value,
      from, to, days,
      reason: document.getElementById('lReason').value,
      status: 'pending',
      approver: 12,
    });
    Utils.closeModal();
    Utils.toast('Đã gửi đơn nghỉ phép!','success');
    this.render();
  },
};
