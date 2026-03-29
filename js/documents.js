/* ═══════════════════════════════════════════════════
   HRM PRO – DOCUMENT MANAGEMENT
═══════════════════════════════════════════════════ */

const Documents = {
  page: 1,
  perPage: 8,
  filter: { type: '', status: '', q: '' },

  render() {
    const types   = [...new Set(DB.documents.map(d=>d.type))];
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Quản lý văn bản</h1>
          <p>Tạo lập, lưu trữ và quản lý toàn bộ văn bản nội bộ</p>
        </div>
        <button class="btn btn-primary" onclick="Documents.openCreate()">
          <i class="fa-solid fa-file-circle-plus"></i> Tạo văn bản mới
        </button>
      </div>

      <!-- STAT CARDS -->
      <div class="stat-grid mb-20">
        ${this.renderStats()}
      </div>

      <!-- FILTERS -->
      <div class="card mb-20">
        <div class="card-body" style="padding:14px 20px">
          <div class="toolbar">
            <div class="toolbar-left">
              <div class="search-input">
                <i class="fa-solid fa-search"></i>
                <input type="text" placeholder="Tìm mã, tiêu đề văn bản..." id="docSearch"
                  oninput="Documents.onSearch(this.value)" />
              </div>
              <select class="filter-select" id="docTypeFilter" onchange="Documents.onFilter()">
                <option value="">Tất cả loại văn bản</option>
                ${types.map(t=>`<option value="${t}">${t}</option>`).join('')}
              </select>
              <select class="filter-select" id="docStatusFilter" onchange="Documents.onFilter()">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hiệu lực</option>
                <option value="draft">Nháp</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- DOCUMENT LIST -->
      <div class="card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Mã VB</th><th>Tiêu đề</th><th>Loại</th><th>Người tạo</th>
                <th>Ngày tạo</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody id="docTbody"></tbody>
          </table>
        </div>
        <div id="docPagination" class="pagination" style="border-top:1px solid var(--border-light)"></div>
      </div>
    `;
    this.renderTable();
  },

  renderStats() {
    const docs = DB.documents;
    return `
      <div class="stat-card">
        <div class="stat-icon gradient-blue"><i class="fa-solid fa-file-lines" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${docs.length}</div><div class="stat-label">Tổng văn bản</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-green"><i class="fa-solid fa-circle-check" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${docs.filter(d=>d.status==='active').length}</div><div class="stat-label">Đang hiệu lực</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-orange"><i class="fa-solid fa-pen-to-square" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${docs.filter(d=>d.status==='draft').length}</div><div class="stat-label">Bản nháp</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-purple"><i class="fa-solid fa-clock" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${docs.filter(d=>d.status==='pending').length}</div><div class="stat-label">Chờ duyệt</div></div>
      </div>`;
  },

  getFiltered() {
    let list = [...DB.documents];
    const { type, status, q } = this.filter;
    if (type)   list = list.filter(d=>d.type===type);
    if (status) list = list.filter(d=>d.status===status);
    if (q)      list = list.filter(d=>
      d.title.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
    return list.sort((a,b)=>b.date.localeCompare(a.date));
  },

  renderTable() {
    const filtered = this.getFiltered();
    const paged = Utils.paginate(filtered, this.page, this.perPage);

    const typeIcons = {
      'Quyết định':'fa-gavel','Thông báo':'fa-bullhorn','Quy chế':'fa-book',
      'Hợp đồng':'fa-file-contract','Biên bản':'fa-clipboard',
      'Thư nhắc nhở':'fa-envelope','Kế hoạch':'fa-calendar-days',
      'Báo cáo':'fa-chart-bar','Đề xuất':'fa-lightbulb','Hướng dẫn':'fa-circle-info',
    };
    const typeColors = {
      'Quyết định':'gradient-red','Thông báo':'gradient-orange','Quy chế':'gradient-purple',
      'Hợp đồng':'gradient-blue','Biên bản':'gradient-teal',
      'Thư nhắc nhở':'gradient-pink','Kế hoạch':'gradient-indigo',
      'Báo cáo':'gradient-green','Đề xuất':'gradient-orange','Hướng dẫn':'gradient-blue',
    };

    document.getElementById('docTbody').innerHTML = paged.items.map(d => {
      const author = DB.getEmp(d.author);
      const icon   = typeIcons[d.type] || 'fa-file';
      const color  = typeColors[d.type] || 'gradient-indigo';
      return `
        <tr>
          <td><span style="font-family:monospace;font-size:12px;color:var(--text-muted)">${d.code}</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="stat-icon ${color}" style="width:32px;height:32px;border-radius:8px;font-size:13px">
                <i class="fa-solid ${icon}" style="color:#fff"></i>
              </div>
              <div>
                <div style="font-weight:600;color:var(--text-dark);font-size:13px">${d.title}</div>
                <div style="font-size:11px;margin-top:2px">
                  ${d.tags.map(t=>`<span class="perm-tag">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          </td>
          <td><span style="font-size:12px;font-weight:600">${d.type}</span></td>
          <td>
            <div class="emp-cell">
              <div class="emp-avatar-sm ${author?.color||''}" style="width:24px;height:24px;font-size:9px">${author?.avatar||'?'}</div>
              <span style="font-size:12px">${author?.name||'—'}</span>
            </div>
          </td>
          <td style="font-size:12px;color:var(--text-muted)">${Utils.fmtDate(d.date)}</td>
          <td>
            <span class="status-badge status-${d.status==='active'?'active':d.status==='pending'?'pending':'draft'}">
              ${d.status==='active'?'Hiệu lực':d.status==='pending'?'Chờ duyệt':'Nháp'}
            </span>
          </td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn btn-sm btn-secondary btn-icon" title="Xem" onclick="Documents.view(${d.id})"><i class="fa-solid fa-eye"></i></button>
              <button class="btn btn-sm btn-secondary btn-icon" title="Tải xuống" onclick="Utils.toast('Đang tải văn bản...','info')"><i class="fa-solid fa-download"></i></button>
              <button class="btn btn-sm btn-secondary btn-icon" title="Xóa" onclick="Documents.delete(${d.id})" style="color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
    }).join('') || `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-folder-open"></i><h3>Không có văn bản</h3></div></td></tr>`;

    Utils.renderPagination('docPagination', paged, 'Documents.goPage');
  },

  onSearch: Utils.debounce(function(q) { Documents.filter.q=q.toLowerCase(); Documents.page=1; Documents.renderTable(); }, 300),
  onFilter() {
    this.filter.type   = document.getElementById('docTypeFilter').value;
    this.filter.status = document.getElementById('docStatusFilter').value;
    this.page = 1; this.renderTable();
  },
  goPage(p) { Documents.page = p; Documents.renderTable(); },

  view(id) {
    const d = DB.documents.find(doc=>doc.id===id);
    if (!d) return;
    const author = DB.getEmp(d.author);
    Utils.openModal(`${d.code} – ${d.title}`, `
      <div style="background:var(--bg);border-radius:10px;padding:16px;margin-bottom:16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${[
            {label:'Mã văn bản',val:d.code},
            {label:'Loại văn bản',val:d.type},
            {label:'Người tạo',val:author?.name||'—'},
            {label:'Ngày tạo',val:Utils.fmtDate(d.date)},
            {label:'Phòng ban',val:d.dept?DB.getDeptName(d.dept):'Toàn công ty'},
            {label:'Trạng thái',val:`<span class="status-badge status-${d.status==='active'?'active':'pending'}">${d.status==='active'?'Hiệu lực':'Chờ duyệt'}</span>`},
          ].map(r=>`<div><div style="font-size:11px;color:var(--text-muted)">${r.label}</div><div style="font-size:13px;font-weight:600;margin-top:2px">${r.val}</div></div>`).join('')}
        </div>
      </div>
      <div style="font-size:13px;line-height:1.8;color:var(--text-base);padding:16px;border:1px solid var(--border);border-radius:8px;background:#fff">
        <p>Kính gửi: Toàn thể nhân viên Công ty</p><br/>
        <p>Theo đề xuất của Trưởng phòng ${DB.getDeptName(d.dept)} và căn cứ vào quy định của Công ty, Ban Giám Đốc thông báo về <em>${d.title.toLowerCase()}</em>.</p><br/>
        <p>Văn bản này có hiệu lực kể từ ngày ký. Các phòng ban liên quan có trách nhiệm thực hiện đúng theo nội dung văn bản này.</p><br/>
        <p style="text-align:right">TP.HCM, ngày ${Utils.fmtDate(d.date)}</p>
        <p style="text-align:right">Thay mặt Ban Giám Đốc</p>
        <p style="text-align:right;margin-top:40px;font-weight:700">Mai Văn Xuân</p>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Đóng</button>
      <button class="btn btn-primary" onclick="Utils.toast('Đang in...','info')"><i class="fa-solid fa-print"></i> In</button>
    `, true);
  },

  openCreate() {
    const types = ['Quyết định','Thông báo','Quy chế','Hợp đồng','Biên bản','Thư nhắc nhở','Kế hoạch','Báo cáo','Đề xuất','Hướng dẫn'];
    Utils.openModal('Tạo văn bản mới', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Mã văn bản</label>
          <input class="form-control" id="dCode" value="VB${String(DB.documents.length+1).padStart(3,'0')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Loại văn bản</label>
          <select class="form-control" id="dType">
            ${types.map(t=>`<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Tiêu đề <span style="color:var(--danger)">*</span></label>
        <input class="form-control" id="dTitle" placeholder="Nhập tiêu đề văn bản..." />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Phòng ban</label>
          <select class="form-control" id="dDept">
            <option value="0">Toàn công ty</option>
            ${DB.departments.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Trạng thái</label>
          <select class="form-control" id="dStatus">
            <option value="draft">Nháp</option>
            <option value="active">Hiệu lực ngay</option>
            <option value="pending">Gửi duyệt</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Nội dung tóm tắt</label>
        <textarea class="form-control" id="dContent" rows="4" placeholder="Nhập nội dung..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Tags (cách nhau bằng dấu phẩy)</label>
        <input class="form-control" id="dTags" placeholder="tag1, tag2, ..." />
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Documents.saveCreate()">
        <i class="fa-solid fa-save"></i> Lưu văn bản
      </button>
    `, true);
  },

  saveCreate() {
    const title = document.getElementById('dTitle').value.trim();
    if (!title) { Utils.toast('Vui lòng nhập tiêu đề','warning'); return; }
    const tags = document.getElementById('dTags').value.split(',').map(t=>t.trim()).filter(Boolean);
    DB.documents.unshift({
      id: DB.documents.length+1,
      code: document.getElementById('dCode').value,
      title,
      type: document.getElementById('dType').value,
      author: 12,
      date: Utils.today(),
      dept: parseInt(document.getElementById('dDept').value),
      status: document.getElementById('dStatus').value,
      tags,
    });
    Utils.closeModal();
    Utils.toast('Tạo văn bản thành công!', 'success');
    this.render();
  },

  delete(id) {
    const d = DB.documents.find(doc=>doc.id===id);
    Utils.confirm(`Xóa văn bản <strong>${d.code}</strong>?`, () => {
      DB.documents = DB.documents.filter(doc=>doc.id!==id);
      Utils.toast('Đã xóa văn bản', 'success');
      this.renderTable();
    });
  },
};
