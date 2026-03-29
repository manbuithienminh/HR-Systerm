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
          <button class="btn btn-secondary" onclick="Employees.openBulkImport()" style="color:var(--success);border-color:var(--success)">
            <i class="fa-solid fa-file-arrow-up"></i> Nhập hàng loạt
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

  /* ════════════════════════════════════════
     NHẬP HÀNG LOẠT
  ════════════════════════════════════════ */
  _importRows: [],   // hàng đã parse
  _validRows:  [],   // hàng hợp lệ để xác nhận
  _importStep: 1,    // 1 = upload, 2 = preview

  openBulkImport() {
    this._importRows = [];
    this._importStep = 1;
    this._renderImportStep1();
  },

  /* ── Bước 1: Tải mẫu / Chọn file ── */
  _renderImportStep1() {
    const fields = ImportConfig.enabledFields();
    const cols   = fields.map(f => ImportConfig.colHeader(f));
    const reqCols= fields.filter(f=>f.required).map(f=>ImportConfig.colHeader(f));

    Utils.openModal('Nhập nhân viên hàng loạt', `
      <!-- Steps indicator -->
      <div style="display:flex;align-items:center;gap:0;margin-bottom:24px">
        ${['Tải & chọn file','Xem trước dữ liệu','Hoàn thành'].map((s,i)=>`
          <div style="display:flex;align-items:center;flex:1">
            <div style="display:flex;align-items:center;gap:8px;flex:1">
              <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;
                background:${i===0?'var(--primary)':i<1?'var(--success)':'var(--border)'};
                color:${i<=0?'#fff':'var(--text-muted)'}">
                ${i<1?`<i class="fa-solid fa-check"></i>`:(i+1)}
              </div>
              <span style="font-size:12px;font-weight:${i===0?'700':'400'};color:${i===0?'var(--primary)':'var(--text-muted)'}">${s}</span>
            </div>
            ${i<2?`<div style="height:2px;flex:1;background:${i<0?'var(--primary)':'var(--border)'};margin:0 8px"></div>`:''}
          </div>`).join('')}
      </div>

      <!-- Info box -->
      <div style="background:var(--info-light);border-radius:10px;padding:14px 16px;margin-bottom:16px;display:flex;gap:12px;align-items:flex-start">
        <i class="fa-solid fa-circle-info" style="color:var(--info);font-size:18px;margin-top:1px;flex-shrink:0"></i>
        <div>
          <div style="font-size:13px;font-weight:600;color:var(--info);margin-bottom:4px">Hướng dẫn nhập hàng loạt</div>
          <div style="font-size:12px;color:var(--info);line-height:1.7">
            1. Tải file mẫu CSV → điền dữ liệu → lưu lại<br/>
            2. Tải file đã điền lên hệ thống<br/>
            3. Kiểm tra xem trước và xác nhận nhập
          </div>
        </div>
      </div>

      <!-- Template info -->
      <div style="background:var(--bg);border-radius:10px;padding:14px 16px;margin-bottom:16px">
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:10px;text-transform:uppercase;letter-spacing:.06em">
          MẪU HIỆN TẠI (${fields.length} cột)
          <a onclick="navigate('settings');Settings.switchSection('template')" style="margin-left:8px;color:var(--primary);cursor:pointer;font-weight:600;text-transform:none;font-size:11px">
            <i class="fa-solid fa-gear"></i> Chỉnh sửa mẫu
          </a>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
          ${fields.map(f=>`
            <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600;
              background:${f.required?'var(--danger-light)':'var(--primary-light)'};
              color:${f.required?'var(--danger)':'var(--primary)'}">
              ${ImportConfig.colHeader(f)}${f.required?' *':''}
            </span>`).join('')}
        </div>
        <div style="font-size:11px;color:var(--text-muted)">
          <span style="color:var(--danger);font-weight:600">* Bắt buộc:</span>
          ${reqCols.join(', ')}
        </div>
      </div>

      <!-- Download template -->
      <button class="btn btn-secondary w-full mb-12" onclick="Employees._downloadTemplate()" style="justify-content:center;gap:10px;padding:12px">
        <i class="fa-solid fa-download" style="color:var(--success)"></i>
        <span>Tải file mẫu CSV</span>
        <span style="font-size:11px;color:var(--text-muted)">(${cols.join(', ')})</span>
      </button>

      <!-- Upload zone -->
      <div id="importDropZone" style="border:2px dashed var(--border);border-radius:12px;padding:28px;text-align:center;cursor:pointer;transition:all .2s;position:relative"
        onclick="document.getElementById('importFileInput').click()"
        ondragover="event.preventDefault();this.style.borderColor='var(--primary)';this.style.background='var(--primary-light)'"
        ondragleave="this.style.borderColor='var(--border)';this.style.background=''"
        ondrop="event.preventDefault();this.style.borderColor='var(--border)';this.style.background='';Employees._handleFileDrop(event)">
        <input type="file" id="importFileInput" accept=".csv,.txt" style="display:none"
          onchange="Employees._handleFileSelect(this)" />
        <div id="importDropText">
          <i class="fa-solid fa-cloud-arrow-up" style="font-size:36px;color:var(--text-muted);margin-bottom:10px;display:block"></i>
          <div style="font-size:14px;font-weight:600;color:var(--text-base);margin-bottom:4px">Kéo thả file vào đây</div>
          <div style="font-size:12px;color:var(--text-muted)">hoặc <span style="color:var(--primary);font-weight:600">click để chọn file</span></div>
          <div style="font-size:11px;color:var(--text-light);margin-top:6px">Định dạng hỗ trợ: CSV, TXT • Tối đa 5MB</div>
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" id="importNextBtn" disabled onclick="Employees._goPreview()" style="opacity:.4">
        <i class="fa-solid fa-arrow-right"></i> Xem trước dữ liệu
      </button>
    `, true);
  },

  _downloadTemplate() {
    const csv  = ImportConfig.buildCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'mau_nhap_nhan_vien.csv';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    Utils.toast('Đã tải file mẫu CSV!', 'success');
  },

  _handleFileSelect(input) {
    if (input.files?.[0]) this._readFile(input.files[0]);
  },

  _handleFileDrop(event) {
    const file = event.dataTransfer.files?.[0];
    if (file) this._readFile(file);
  },

  _readFile(file) {
    if (file.size > 5 * 1024 * 1024) { Utils.toast('File quá lớn (tối đa 5MB)', 'warning'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = this._parseCsv(text);
      if (!rows || rows.length < 2) {
        Utils.toast('File không hợp lệ hoặc không có dữ liệu', 'error');
        return;
      }
      this._importRows = rows;
      // Update drop zone UI
      const zone = document.getElementById('importDropText');
      if (zone) zone.innerHTML = `
        <i class="fa-solid fa-file-csv" style="font-size:36px;color:var(--success);margin-bottom:10px;display:block"></i>
        <div style="font-size:14px;font-weight:700;color:var(--success)">${file.name}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:4px">${rows.length - 1} hàng dữ liệu</div>`;
      document.getElementById('importDropZone').style.borderColor = 'var(--success)';
      document.getElementById('importDropZone').style.background  = 'var(--success-light)';
      const btn = document.getElementById('importNextBtn');
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
    };
    reader.onerror = () => Utils.toast('Lỗi đọc file', 'error');
    reader.readAsText(file, 'UTF-8');
  },

  /* ── Parse CSV text → array of arrays ── */
  _parseCsv(text) {
    // Remove BOM if present
    const clean = text.replace(/^\uFEFF/, '').trim();
    const lines = clean.split(/\r?\n/).filter(l => l.trim());
    return lines.map(line => {
      const result = []; let cur = ''; let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { result.push(cur.trim()); cur = ''; }
        else { cur += ch; }
      }
      result.push(cur.trim());
      return result;
    });
  },

  /* ── Bước 2: Preview ── */
  _goPreview() {
    if (!this._importRows.length) return;
    const rawHeader = this._importRows[0];
    const dataRows  = this._importRows.slice(1).filter(r => r.some(c => c));
    const colMap    = ImportConfig.buildColMap(rawHeader);
    const fields    = ImportConfig.enabledFields();
    const reqFields = fields.filter(f => f.required).map(f => f.id);

    // Map each row → object + validation
    const parsed = dataRows.map((row, rowIdx) => {
      const obj = {};
      Object.entries(colMap).forEach(([idx, fid]) => {
        obj[fid] = (row[idx] || '').trim();
      });
      const errors = reqFields.filter(fid => !obj[fid]);
      return { obj, errors, rowIdx: rowIdx + 2 };
    });

    const valid   = parsed.filter(p => p.errors.length === 0);
    const invalid = parsed.filter(p => p.errors.length > 0);
    const displayFields = fields.slice(0, 6);

    // Lưu vào biến module thay vì truyền qua HTML attribute
    this._validRows = valid.map(p => p.obj);

    Utils.openModal('Xem trước dữ liệu nhập', `
      <!-- Steps -->
      <div style="display:flex;align-items:center;gap:0;margin-bottom:20px">
        ${['Tải & chọn file','Xem trước dữ liệu','Hoàn thành'].map((s,i)=>`
          <div style="display:flex;align-items:center;flex:1">
            <div style="display:flex;align-items:center;gap:8px;flex:1">
              <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;
                background:${i<=1?(i<1?'var(--success)':'var(--primary)'):'var(--border)'};
                color:${i<=1?'#fff':'var(--text-muted)'}">
                ${i<1?`<i class="fa-solid fa-check"></i>`:(i+1)}
              </div>
              <span style="font-size:12px;font-weight:${i===1?'700':'400'};color:${i===1?'var(--primary)':i<1?'var(--success)':'var(--text-muted)'}">${s}</span>
            </div>
            ${i<2?`<div style="height:2px;flex:1;background:${i<1?'var(--success)':'var(--border)'};margin:0 8px"></div>`:''}
          </div>`).join('')}
      </div>

      <!-- Summary -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">
        <div style="background:var(--info-light);border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--info)">${parsed.length}</div>
          <div style="font-size:11px;color:var(--info)">Tổng hàng</div>
        </div>
        <div style="background:var(--success-light);border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:var(--success)">${valid.length}</div>
          <div style="font-size:11px;color:var(--success)">Hợp lệ ✓</div>
        </div>
        <div style="background:${invalid.length?'var(--danger-light)':'var(--border-light)'};border-radius:10px;padding:12px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:${invalid.length?'var(--danger)':'var(--text-muted)'}">
            ${invalid.length}
          </div>
          <div style="font-size:11px;color:${invalid.length?'var(--danger)':'var(--text-muted)'}">Lỗi ✗</div>
        </div>
      </div>

      ${invalid.length ? `
        <div style="background:var(--warning-light);border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:var(--warning)">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <strong>${invalid.length} hàng lỗi</strong> sẽ bị bỏ qua khi nhập.
          Lỗi thường gặp: thiếu trường bắt buộc (${reqFields.join(', ')}).
        </div>` : ''}

      <!-- Preview table -->
      <div style="overflow-x:auto;max-height:280px;border:1px solid var(--border);border-radius:8px">
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:var(--bg);position:sticky;top:0">
              <th style="padding:8px 10px;text-align:left;border-bottom:1px solid var(--border);font-size:10px;color:var(--text-muted)">#</th>
              ${displayFields.map(f=>`<th style="padding:8px 10px;text-align:left;border-bottom:1px solid var(--border);font-size:10px;color:var(--text-muted)">
                ${ImportConfig.colHeader(f).toUpperCase()}${f.required?' *':''}
              </th>`).join('')}
              <th style="padding:8px 10px;text-align:left;border-bottom:1px solid var(--border);font-size:10px;color:var(--text-muted)">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            ${parsed.slice(0, 50).map(p => `
              <tr style="background:${p.errors.length?'rgba(239,68,68,.05)':''}">
                <td style="padding:7px 10px;border-bottom:1px solid var(--border-light);color:var(--text-muted)">${p.rowIdx}</td>
                ${displayFields.map(f=>`<td style="padding:7px 10px;border-bottom:1px solid var(--border-light);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                  color:${p.errors.includes(f.id)?'var(--danger)':'var(--text-base)'};
                  font-weight:${p.errors.includes(f.id)?'600':'400'}">
                  ${p.obj[f.id] || (p.errors.includes(f.id)?'<span style="color:var(--danger)">⚠ Trống</span>':'—')}
                </td>`).join('')}
                <td style="padding:7px 10px;border-bottom:1px solid var(--border-light)">
                  ${p.errors.length
                    ? `<span class="status-badge status-rejected" style="font-size:10px">Lỗi</span>`
                    : `<span class="status-badge status-active" style="font-size:10px">Hợp lệ</span>`}
                </td>
              </tr>`).join('')}
            ${parsed.length > 50 ? `<tr><td colspan="${displayFields.length+2}" style="padding:8px 10px;text-align:center;color:var(--text-muted);font-size:11px">... và ${parsed.length-50} hàng khác</td></tr>` : ''}
          </tbody>
        </table>
      </div>
      ${valid.length === 0 ? `<div style="margin-top:12px;font-size:13px;color:var(--danger);text-align:center;font-weight:600">
        <i class="fa-solid fa-circle-exclamation"></i> Không có hàng hợp lệ để nhập
      </div>` : ''}
    `, `
      <button class="btn btn-secondary" onclick="Employees._importRows=[];Employees.openBulkImport()">
        <i class="fa-solid fa-arrow-left"></i> Quay lại
      </button>
      <button class="btn btn-primary" ${valid.length===0?'disabled style="opacity:.4"':''} onclick="Employees._confirmImport()">
        <i class="fa-solid fa-file-import"></i> Nhập ${valid.length} nhân viên hợp lệ
      </button>
    `, true);
  },

  /* ── Bước 3: Thực hiện nhập ── */
  _confirmImport() {
    const list = this._validRows;
    if (!list?.length) return;

    let nextId = Math.max(...DB.employees.map(e => e.id)) + 1;
    const deptMap = {};
    DB.departments.forEach(d => { deptMap[d.name.toLowerCase()] = d.id; });

    list.forEach(obj => {
      const name = (obj.name || '').trim();
      if (!name) return;
      const deptId = obj.dept
        ? (deptMap[obj.dept.toLowerCase()] || DB.departments[0]?.id || 1)
        : (DB.departments[0]?.id || 1);
      DB.employees.push({
        id:       nextId++,
        code:     obj.code || `NV${String(nextId).padStart(3,'0')}`,
        name,
        email:    obj.email    || `${name.split(' ').pop().toLowerCase()}@hrm.vn`,
        phone:    obj.phone    || '',
        dept:     deptId,
        pos:      obj.pos      || 'Nhân viên',
        dob:      obj.dob      || '',
        join:     obj.join     || Utils.today(),
        salary:   parseInt(obj.salary) || 0,
        contract: obj.contract || 'fulltime',
        gender:   obj.gender   || 'male',
        status:   obj.status   || 'active',
        address:  obj.address  || '',
        avatar:   name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase(),
        color:    Utils.pickColor(nextId),
      });
    });

    Utils.closeModal();

    // Step 3 success
    const content = document.getElementById('pageContent');
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:300;backdrop-filter:blur(2px)';
    banner.innerHTML = `
      <div style="background:#fff;border-radius:20px;padding:40px 48px;text-align:center;animation:slideUp .3s ease;max-width:380px">
        <div style="width:70px;height:70px;border-radius:50%;background:var(--success-light);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px;color:var(--success)">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2 style="font-size:20px;font-weight:800;margin-bottom:8px;color:var(--text-dark)">Nhập thành công!</h2>
        <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px">
          Đã thêm <strong style="color:var(--success)">${list.length} nhân viên</strong> vào hệ thống.
        </p>
        <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="this.closest('[style*=fixed]').remove();Employees.render()">
          <i class="fa-solid fa-check"></i> Xem danh sách nhân viên
        </button>
      </div>`;
    document.body.appendChild(banner);
    Utils.toast(`Đã nhập ${list.length} nhân viên thành công!`, 'success');
  },
};
