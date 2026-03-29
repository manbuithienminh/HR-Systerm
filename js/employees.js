/* ═══════════════════════════════════════════════════
   HRM PRO – EMPLOYEE MANAGEMENT
═══════════════════════════════════════════════════ */

const Employees = {
  page: 1,
  perPage: 8,
  view: 'table', // 'table' | 'grid'
  filter: { dept: '', status: '', q: '' },

  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Quản lý nhân viên</h1>
          <p>Danh sách ${DB.employees.length} nhân viên trong hệ thống</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" onclick="Employees.exportExcel()">
            <i class="fa-solid fa-file-export"></i> Xuất Excel
          </button>
          <button class="btn btn-primary" onclick="Employees.openAdd()">
            <i class="fa-solid fa-plus"></i> Thêm nhân viên
          </button>
        </div>
      </div>

      <!-- FILTERS -->
      <div class="card mb-20">
        <div class="card-body" style="padding:14px 20px">
          <div class="toolbar">
            <div class="toolbar-left">
              <div class="search-input">
                <i class="fa-solid fa-search"></i>
                <input type="text" placeholder="Tìm tên, mã NV, email..." id="empSearch" oninput="Employees.onSearch(this.value)" />
              </div>
              <select class="filter-select" id="deptFilter" onchange="Employees.onFilter()">
                <option value="">Tất cả phòng ban</option>
                ${DB.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
              </select>
              <select class="filter-select" id="statusFilter" onchange="Employees.onFilter()">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang làm việc</option>
                <option value="inactive">Đã nghỉ việc</option>
                <option value="probation">Thử việc</option>
              </select>
            </div>
            <div class="toolbar-right">
              <button class="btn btn-secondary btn-icon ${this.view==='table'?'btn-primary':''}" onclick="Employees.setView('table')" title="Dạng bảng">
                <i class="fa-solid fa-table-list"></i>
              </button>
              <button class="btn btn-secondary btn-icon ${this.view==='grid'?'btn-primary':''}" onclick="Employees.setView('grid')" title="Dạng lưới">
                <i class="fa-solid fa-grip"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div id="empContent"></div>
      <div id="empPagination" class="pagination" style="background:var(--bg-card);border-radius:var(--radius);margin-top:4px;border:1px solid var(--border-light)"></div>
    `;
    this.renderContent();
  },

  getFiltered() {
    let list = [...DB.employees];
    const { dept, status, q } = this.filter;
    if (dept)   list = list.filter(e => e.dept == dept);
    if (status) list = list.filter(e => e.status === status);
    if (q)      list = list.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
    );
    return list;
  },

  renderContent() {
    const filtered = this.getFiltered();
    const paged = Utils.paginate(filtered, this.page, this.perPage);

    if (this.view === 'table') {
      document.getElementById('empContent').innerHTML = `
        <div class="card">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nhân viên</th><th>Mã NV</th><th>Phòng ban</th>
                  <th>Chức vụ</th><th>Lương cơ bản</th><th>Trạng thái</th><th>Thao tác</th>
                </tr>
              </thead>
              <tbody id="empTbody">
                ${paged.items.map(e => this.tableRow(e)).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    } else {
      document.getElementById('empContent').innerHTML = `
        <div class="grid-auto">
          ${paged.items.map(e => this.gridCard(e)).join('')}
        </div>`;
    }

    Utils.renderPagination('empPagination', paged, 'Employees.goPage');
  },

  tableRow(e) {
    const dept = DB.getDept(e.dept);
    return `
      <tr>
        <td>
          <div class="emp-cell">
            <div class="emp-avatar-sm ${e.color}">${e.avatar}</div>
            <div>
              <div class="emp-name">${e.name}</div>
              <div class="emp-email">${e.email}</div>
            </div>
          </div>
        </td>
        <td><span style="font-family:monospace;font-size:12px;color:var(--text-muted)">${e.code}</span></td>
        <td><span class="status-badge" style="background:var(--primary-light);color:var(--primary)">${dept?.name||'—'}</span></td>
        <td>${e.pos}</td>
        <td><strong>${Utils.money(e.salary)}</strong></td>
        <td><span class="status-badge status-${e.status==='active'?'active':e.status==='probation'?'pending':'inactive'}">${Utils.statusLabel(e.status)}</span></td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-secondary btn-icon" title="Xem hồ sơ" onclick="Employees.viewProfile(${e.id})"><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-sm btn-secondary btn-icon" title="Chỉnh sửa" onclick="Employees.openEdit(${e.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-secondary btn-icon" title="Xóa" onclick="Employees.delete(${e.id})" style="color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
  },

  gridCard(e) {
    const dept = DB.getDept(e.dept);
    return `
      <div class="emp-card">
        <div class="emp-card-avatar ${e.color}">${e.avatar}</div>
        <div class="emp-card-name">${e.name}</div>
        <div class="emp-card-pos">${e.pos}</div>
        <div class="emp-card-dept"><i class="fa-solid fa-building"></i> ${dept?.name||'—'}</div>
        <div style="margin-bottom:12px">
          <span class="status-badge status-${e.status==='active'?'active':e.status==='probation'?'pending':'inactive'}">${Utils.statusLabel(e.status)}</span>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">
          <i class="fa-solid fa-envelope"></i> ${e.email}
        </div>
        <div class="emp-card-actions">
          <button class="btn btn-sm btn-secondary" onclick="Employees.viewProfile(${e.id})"><i class="fa-solid fa-eye"></i></button>
          <button class="btn btn-sm btn-primary"   onclick="Employees.openEdit(${e.id})"><i class="fa-solid fa-pen"></i></button>
        </div>
      </div>`;
  },

  setView(v) {
    this.view = v;
    this.render();
  },

  onSearch: Utils.debounce(function(q) {
    Employees.filter.q = q.toLowerCase();
    Employees.page = 1;
    Employees.renderContent();
  }, 300),

  onFilter() {
    this.filter.dept   = document.getElementById('deptFilter').value;
    this.filter.status = document.getElementById('statusFilter').value;
    this.page = 1;
    this.renderContent();
  },

  goPage(p) { Employees.page = p; Employees.renderContent(); },

  /* ── View Profile Modal ── */
  viewProfile(id) {
    const e = DB.getEmp(id);
    if (!e) return;
    const dept = DB.getDept(e.dept);
    const att  = DB.attendance.filter(a => a.empId === id);
    const presentDays = att.filter(a=>a.status==='present'||a.status==='late').length;
    const assets = DB.assets.filter(a=>a.assignedTo===id);

    Utils.openModal(`Hồ sơ nhân viên – ${e.name}`, `
      <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap">
        <div class="user-avatar ${e.color}" style="width:72px;height:72px;font-size:24px;flex-shrink:0">${e.avatar}</div>
        <div style="flex:1">
          <h2 style="font-size:18px;font-weight:800;color:var(--text-dark)">${e.name}</h2>
          <p style="color:var(--text-muted);font-size:13px">${e.pos} • ${dept?.name||'—'}</p>
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
            <span class="status-badge status-${e.status==='active'?'active':e.status==='probation'?'pending':'inactive'}">${Utils.statusLabel(e.status)}</span>
            <span style="font-size:12px;color:var(--text-muted)">${e.code}</span>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
        ${[
          {icon:'fa-envelope',label:'Email',val:e.email},
          {icon:'fa-phone',label:'Điện thoại',val:e.phone},
          {icon:'fa-cake-candles',label:'Ngày sinh',val:Utils.fmtDate(e.dob)},
          {icon:'fa-calendar-plus',label:'Ngày vào làm',val:Utils.fmtDate(e.join)},
          {icon:'fa-location-dot',label:'Địa chỉ',val:e.address},
          {icon:'fa-money-bill',label:'Lương cơ bản',val:Utils.money(e.salary)},
        ].map(r=>`
          <div style="background:var(--bg);border-radius:8px;padding:10px 12px">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:2px"><i class="fa-solid ${r.icon}"></i> ${r.label}</div>
            <div style="font-size:13px;font-weight:600;color:var(--text-dark)">${r.val}</div>
          </div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
        <div style="background:var(--success-light);border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--success)">${presentDays}</div>
          <div style="font-size:11px;color:var(--success)">Ngày đi làm</div>
        </div>
        <div style="background:var(--warning-light);border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--warning)">${att.filter(a=>a.status==='late').length}</div>
          <div style="font-size:11px;color:var(--warning)">Lần trễ</div>
        </div>
        <div style="background:var(--info-light);border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--info)">${assets.length}</div>
          <div style="font-size:11px;color:var(--info)">Tài sản</div>
        </div>
      </div>
      ${assets.length ? `
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:8px">TÀI SẢN ĐANG DÙNG</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${assets.map(a=>`<span class="perm-tag"><i class="fa-solid fa-laptop"></i> ${a.name}</span>`).join('')}
        </div>` : ''}
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Đóng</button>
      <button class="btn btn-primary" onclick="Utils.closeModal();Employees.openEdit(${id})">
        <i class="fa-solid fa-pen"></i> Chỉnh sửa
      </button>
    `, true);
  },

  /* ── Add / Edit Modal ── */
  openAdd() { this._openForm(null); },
  openEdit(id) { this._openForm(DB.getEmp(id)); },

  _openForm(e) {
    const isEdit = !!e;
    Utils.openModal(isEdit ? `Chỉnh sửa – ${e.name}` : 'Thêm nhân viên mới', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Họ và tên <span style="color:var(--danger)">*</span></label>
          <input class="form-control" id="fName" value="${e?.name||''}" placeholder="Nhập họ tên..." />
        </div>
        <div class="form-group">
          <label class="form-label">Mã nhân viên</label>
          <input class="form-control" id="fCode" value="${e?.code||this._nextCode()}" placeholder="NV0XX" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Email <span style="color:var(--danger)">*</span></label>
          <input class="form-control" id="fEmail" type="email" value="${e?.email||''}" placeholder="email@hrm.vn" />
        </div>
        <div class="form-group">
          <label class="form-label">Số điện thoại</label>
          <input class="form-control" id="fPhone" value="${e?.phone||''}" placeholder="09xxxxxxxx" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Phòng ban</label>
          <select class="form-control" id="fDept">
            ${DB.departments.map(d=>`<option value="${d.id}" ${e?.dept==d.id?'selected':''}>${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Chức vụ</label>
          <input class="form-control" id="fPos" value="${e?.pos||''}" placeholder="Nhập chức vụ..." />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Ngày sinh</label>
          <input class="form-control" id="fDob" type="date" value="${e?.dob||''}" />
        </div>
        <div class="form-group">
          <label class="form-label">Ngày vào làm</label>
          <input class="form-control" id="fJoin" type="date" value="${e?.join||''}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Lương cơ bản (đ)</label>
          <input class="form-control" id="fSalary" type="number" value="${e?.salary||''}" placeholder="15000000" />
        </div>
        <div class="form-group">
          <label class="form-label">Loại hợp đồng</label>
          <select class="form-control" id="fContract">
            <option value="fulltime"  ${e?.contract==='fulltime'?'selected':''}>Toàn thời gian</option>
            <option value="parttime"  ${e?.contract==='parttime'?'selected':''}>Bán thời gian</option>
            <option value="probation" ${e?.contract==='probation'?'selected':''}>Thử việc</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Giới tính</label>
          <select class="form-control" id="fGender">
            <option value="male"   ${e?.gender==='male'?'selected':''}>Nam</option>
            <option value="female" ${e?.gender==='female'?'selected':''}>Nữ</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Trạng thái</label>
          <select class="form-control" id="fStatus">
            <option value="active"   ${e?.status==='active'?'selected':''}>Đang làm việc</option>
            <option value="inactive" ${e?.status==='inactive'?'selected':''}>Đã nghỉ việc</option>
            <option value="probation"${e?.status==='probation'?'selected':''}>Thử việc</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Địa chỉ</label>
        <input class="form-control" id="fAddr" value="${e?.address||''}" placeholder="Địa chỉ thường trú..." />
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Employees._saveForm(${isEdit?e.id:'null'})">
        <i class="fa-solid fa-save"></i> ${isEdit ? 'Lưu thay đổi' : 'Thêm nhân viên'}
      </button>
    `, true);
  },

  _nextCode() {
    const max = Math.max(...DB.employees.map(e=>parseInt(e.code.replace('NV',''))));
    return 'NV' + String(max+1).padStart(3,'0');
  },

  _saveForm(id) {
    const name = document.getElementById('fName').value.trim();
    const email= document.getElementById('fEmail').value.trim();
    if (!name || !email) { Utils.toast('Vui lòng nhập đầy đủ họ tên và email', 'warning'); return; }

    const data = {
      name,
      code:     document.getElementById('fCode').value.trim(),
      email,
      phone:    document.getElementById('fPhone').value.trim(),
      dept:     parseInt(document.getElementById('fDept').value),
      pos:      document.getElementById('fPos').value.trim(),
      dob:      document.getElementById('fDob').value,
      join:     document.getElementById('fJoin').value,
      salary:   parseInt(document.getElementById('fSalary').value)||0,
      contract: document.getElementById('fContract').value,
      gender:   document.getElementById('fGender').value,
      status:   document.getElementById('fStatus').value,
      address:  document.getElementById('fAddr').value.trim(),
      avatar:   name.split(' ').slice(-2).map(w=>w[0]).join('').toUpperCase(),
      color:    Utils.pickColor(DB.employees.length),
    };

    if (id) {
      const idx = DB.employees.findIndex(e=>e.id===id);
      DB.employees[idx] = { ...DB.employees[idx], ...data };
      Utils.toast('Cập nhật nhân viên thành công!', 'success');
    } else {
      data.id = Math.max(...DB.employees.map(e=>e.id)) + 1;
      DB.employees.push(data);
      Utils.toast('Thêm nhân viên thành công!', 'success');
    }
    Utils.closeModal();
    this.render();
  },

  delete(id) {
    const e = DB.getEmp(id);
    Utils.confirm(`Bạn có chắc muốn xóa nhân viên <strong>${e.name}</strong>?`, () => {
      DB.employees = DB.employees.filter(e=>e.id!==id);
      Utils.toast('Đã xóa nhân viên', 'success');
      this.render();
    });
  },

  exportExcel() {
    Utils.toast('Đang xuất file Excel...', 'info');
    setTimeout(() => Utils.toast('Xuất Excel thành công!', 'success'), 1200);
  },
};
