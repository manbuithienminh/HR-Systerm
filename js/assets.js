/* ═══════════════════════════════════════════════════
   HRM PRO – ASSET & EQUIPMENT MANAGEMENT
═══════════════════════════════════════════════════ */

const Assets = {
  page: 1,
  perPage: 9,
  view: 'grid',
  filter: { category: '', status: '', q: '' },

  render() {
    const categories = [...new Set(DB.assets.map(a=>a.category))];
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Tài sản & Thiết bị</h1>
          <p>Quản lý tài sản, thiết bị và phân công sử dụng</p>
        </div>
        <button class="btn btn-primary" onclick="Assets.openAdd()">
          <i class="fa-solid fa-plus"></i> Thêm tài sản
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
                <input type="text" placeholder="Tìm mã, tên tài sản..." oninput="Assets.onSearch(this.value)" />
              </div>
              <select class="filter-select" id="assCatFilter" onchange="Assets.onFilter()">
                <option value="">Tất cả danh mục</option>
                ${categories.map(c=>`<option value="${c}">${c}</option>`).join('')}
              </select>
              <select class="filter-select" id="assStatusFilter" onchange="Assets.onFilter()">
                <option value="">Tất cả trạng thái</option>
                <option value="in_use">Đang dùng</option>
                <option value="available">Khả dụng</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
            <div class="toolbar-right">
              <button class="btn btn-sm btn-secondary btn-icon ${this.view==='grid'?'btn-primary':''}" onclick="Assets.setView('grid')">
                <i class="fa-solid fa-grip"></i>
              </button>
              <button class="btn btn-sm btn-secondary btn-icon ${this.view==='table'?'btn-primary':''}" onclick="Assets.setView('table')">
                <i class="fa-solid fa-table-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div id="assContent"></div>
      <div id="assPagination" class="pagination" style="background:var(--bg-card);border-radius:var(--radius);margin-top:4px;border:1px solid var(--border-light)"></div>
    `;
    this.renderContent();
  },

  renderStats() {
    const assets = DB.assets;
    const totalValue = assets.reduce((s,a)=>s+a.value,0);
    return `
      <div class="stat-card">
        <div class="stat-icon gradient-indigo"><i class="fa-solid fa-boxes-stacked" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${assets.length}</div><div class="stat-label">Tổng tài sản</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-green"><i class="fa-solid fa-circle-check" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${assets.filter(a=>a.status==='in_use').length}</div><div class="stat-label">Đang sử dụng</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-blue"><i class="fa-solid fa-warehouse" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${assets.filter(a=>a.status==='available').length}</div><div class="stat-label">Khả dụng</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-orange"><i class="fa-solid fa-screwdriver-wrench" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${assets.filter(a=>a.status==='maintenance').length}</div><div class="stat-label">Đang bảo trì</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-purple"><i class="fa-solid fa-dollar-sign" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value" style="font-size:16px">${Utils.money(totalValue)}</div><div class="stat-label">Tổng giá trị</div></div>
      </div>`;
  },

  getFiltered() {
    let list = [...DB.assets];
    const { category, status, q } = this.filter;
    if (category) list = list.filter(a=>a.category===category);
    if (status)   list = list.filter(a=>a.status===status);
    if (q) list = list.filter(a=>a.name.toLowerCase().includes(q)||a.code.toLowerCase().includes(q));
    return list;
  },

  renderContent() {
    const filtered = this.getFiltered();
    const paged = Utils.paginate(filtered, this.page, this.perPage);

    const catIcons = {
      'Máy tính':'fa-laptop','Điện thoại':'fa-mobile-screen','Thiết bị':'fa-camera',
      'Văn phòng':'fa-print','Nội thất':'fa-chair',
    };
    const catColors = {
      'Máy tính':'gradient-indigo','Điện thoại':'gradient-blue','Thiết bị':'gradient-purple',
      'Văn phòng':'gradient-teal','Nội thất':'gradient-orange',
    };
    const statusInfo = {
      'in_use':      {badge:'status-present', label:'Đang dùng'},
      'available':   {badge:'status-leave',   label:'Khả dụng'},
      'maintenance': {badge:'status-late',    label:'Bảo trì'},
    };

    if (this.view === 'grid') {
      document.getElementById('assContent').innerHTML = `
        <div class="grid-auto">
          ${paged.items.map(a => {
            const emp = a.assignedTo ? DB.getEmp(a.assignedTo) : null;
            const icon  = catIcons[a.category]  || 'fa-box';
            const color = catColors[a.category] || 'gradient-indigo';
            const si    = statusInfo[a.status]  || {badge:'status-draft',label:a.status};
            return `
              <div class="asset-card">
                <div class="asset-icon-wrap ${color}" style="color:#fff">
                  <i class="fa-solid ${icon}"></i>
                </div>
                <div class="asset-name">${a.name}</div>
                <div class="asset-id">${a.code} • ${a.sn}</div>
                <span class="status-badge ${si.badge} mb-8">${si.label}</span>
                <div class="asset-meta"><i class="fa-solid fa-tag"></i> ${a.category}</div>
                <div class="asset-meta"><i class="fa-solid fa-money-bill"></i> ${Utils.money(a.value)}</div>
                ${emp ? `<div class="asset-meta"><i class="fa-solid fa-user"></i> ${emp.name}</div>` : '<div class="asset-meta" style="color:var(--text-light)"><i class="fa-solid fa-user-slash"></i> Chưa phân công</div>'}
                <div class="asset-meta"><i class="fa-solid fa-calendar"></i> Mua: ${Utils.fmtDate(a.purchase)}</div>
                <hr class="divider" />
                <div style="display:flex;gap:6px;margin-top:8px">
                  <button class="btn btn-sm btn-secondary" onclick="Assets.view(${a.id})" style="flex:1"><i class="fa-solid fa-eye"></i></button>
                  <button class="btn btn-sm btn-secondary" onclick="Assets.assign(${a.id})" style="flex:1"><i class="fa-solid fa-user-plus"></i></button>
                  <button class="btn btn-sm btn-secondary" onclick="Assets.delete(${a.id})" style="color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>`;
          }).join('')}
        </div>`;
    } else {
      document.getElementById('assContent').innerHTML = `
        <div class="card">
          <div class="table-wrapper">
            <table>
              <thead><tr><th>Mã</th><th>Tên tài sản</th><th>Danh mục</th><th>Giá trị</th><th>Phân công</th><th>Trạng thái</th><th>Bảo hành</th><th>Thao tác</th></tr></thead>
              <tbody>
                ${paged.items.map(a=>{
                  const emp = a.assignedTo ? DB.getEmp(a.assignedTo) : null;
                  const si  = statusInfo[a.status] || {badge:'status-draft',label:a.status};
                  return `<tr>
                    <td style="font-family:monospace;font-size:12px">${a.code}</td>
                    <td><strong>${a.name}</strong><br/><span style="font-size:11px;color:var(--text-muted)">${a.sn}</span></td>
                    <td>${a.category}</td>
                    <td>${Utils.money(a.value)}</td>
                    <td>${emp?`<div class="emp-cell"><div class="emp-avatar-sm ${emp.color}" style="width:24px;height:24px;font-size:9px">${emp.avatar}</div><span style="font-size:12px">${emp.name}</span></div>`:'<span style="color:var(--text-light)">—</span>'}</td>
                    <td><span class="status-badge ${si.badge}">${si.label}</span></td>
                    <td style="font-size:12px">${Utils.fmtDate(a.warranty)}</td>
                    <td>
                      <div style="display:flex;gap:4px">
                        <button class="btn btn-sm btn-secondary btn-icon" onclick="Assets.view(${a.id})"><i class="fa-solid fa-eye"></i></button>
                        <button class="btn btn-sm btn-secondary btn-icon" onclick="Assets.assign(${a.id})"><i class="fa-solid fa-user-plus"></i></button>
                        <button class="btn btn-sm btn-secondary btn-icon" onclick="Assets.delete(${a.id})" style="color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>`;
    }
    Utils.renderPagination('assPagination', paged, 'Assets.goPage');
  },

  setView(v) { this.view = v; this.renderContent(); },
  onSearch: Utils.debounce(function(q) { Assets.filter.q=q.toLowerCase(); Assets.page=1; Assets.renderContent(); }, 300),
  onFilter() {
    this.filter.category = document.getElementById('assCatFilter').value;
    this.filter.status   = document.getElementById('assStatusFilter').value;
    this.page = 1; this.renderContent();
  },
  goPage(p) { Assets.page = p; Assets.renderContent(); },

  view(id) {
    const a = DB.assets.find(x=>x.id===id);
    if (!a) return;
    const emp = a.assignedTo ? DB.getEmp(a.assignedTo) : null;
    const si  = { in_use:{label:'Đang dùng',cls:'status-present'}, available:{label:'Khả dụng',cls:'status-leave'}, maintenance:{label:'Bảo trì',cls:'status-late'} };
    Utils.openModal(`Chi tiết tài sản – ${a.name}`, `
      <div style="background:var(--bg);border-radius:10px;padding:16px;margin-bottom:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${[
          {label:'Mã tài sản',val:a.code},{label:'Danh mục',val:a.category},
          {label:'Serial Number',val:a.sn},{label:'Ngày mua',val:Utils.fmtDate(a.purchase)},
          {label:'Giá trị',val:Utils.money(a.value)},{label:'Bảo hành đến',val:Utils.fmtDate(a.warranty)},
          {label:'Trạng thái',val:`<span class="status-badge ${si[a.status]?.cls||''}">${si[a.status]?.label||a.status}</span>`},
          {label:'Người sử dụng',val:emp?emp.name:'Chưa phân công'},
        ].map(r=>`<div><div style="font-size:11px;color:var(--text-muted)">${r.label}</div><div style="font-size:13px;font-weight:600;margin-top:2px">${r.val}</div></div>`).join('')}
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Đóng</button>
      <button class="btn btn-primary" onclick="Utils.closeModal();Assets.assign(${id})">Phân công</button>
    `);
  },

  assign(id) {
    const a = DB.assets.find(x=>x.id===id);
    if (!a) return;
    Utils.openModal(`Phân công – ${a.name}`, `
      <p style="margin-bottom:12px;font-size:13px;color:var(--text-muted)">Chọn nhân viên sử dụng tài sản này</p>
      <div class="form-group">
        <label class="form-label">Nhân viên</label>
        <select class="form-control" id="assignEmp">
          <option value="">— Không phân công —</option>
          ${DB.employees.filter(e=>e.status!=='inactive').map(e=>`<option value="${e.id}" ${a.assignedTo===e.id?'selected':''}>${e.name} (${DB.getDeptName(e.dept)})</option>`).join('')}
        </select>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Assets.saveAssign(${id})">Lưu</button>
    `);
  },
  saveAssign(id) {
    const a = DB.assets.find(x=>x.id===id);
    const empId = parseInt(document.getElementById('assignEmp').value)||null;
    a.assignedTo = empId;
    a.status = empId ? 'in_use' : 'available';
    Utils.closeModal();
    Utils.toast('Cập nhật phân công thành công!', 'success');
    this.renderContent();
  },

  openAdd() {
    const cats = ['Máy tính','Điện thoại','Thiết bị','Văn phòng','Nội thất'];
    Utils.openModal('Thêm tài sản mới', `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Tên tài sản *</label>
          <input class="form-control" id="aName" placeholder="Tên tài sản..." />
        </div>
        <div class="form-group">
          <label class="form-label">Mã tài sản</label>
          <input class="form-control" id="aCode" value="TS${String(DB.assets.length+1).padStart(3,'0')}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Danh mục</label>
          <select class="form-control" id="aCat">${cats.map(c=>`<option>${c}</option>`).join('')}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Giá trị (đ)</label>
          <input class="form-control" id="aValue" type="number" placeholder="0" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Serial Number</label>
          <input class="form-control" id="aSn" placeholder="SN-XXXX" />
        </div>
        <div class="form-group">
          <label class="form-label">Ngày mua</label>
          <input class="form-control" id="aPurchase" type="date" value="${Utils.today()}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Bảo hành đến</label>
          <input class="form-control" id="aWarranty" type="date" />
        </div>
        <div class="form-group">
          <label class="form-label">Phân công cho</label>
          <select class="form-control" id="aAssign">
            <option value="">Chưa phân công</option>
            ${DB.employees.filter(e=>e.status!=='inactive').map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}
          </select>
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Assets.saveAdd()"><i class="fa-solid fa-save"></i> Thêm</button>
    `, true);
  },
  saveAdd() {
    const name = document.getElementById('aName').value.trim();
    if (!name) { Utils.toast('Vui lòng nhập tên tài sản','warning'); return; }
    const assignTo = parseInt(document.getElementById('aAssign').value)||null;
    DB.assets.push({
      id: DB.assets.length+1,
      code: document.getElementById('aCode').value,
      name,
      category: document.getElementById('aCat').value,
      value: parseInt(document.getElementById('aValue').value)||0,
      sn: document.getElementById('aSn').value,
      purchase: document.getElementById('aPurchase').value,
      warranty: document.getElementById('aWarranty').value,
      assignedTo: assignTo,
      status: assignTo ? 'in_use' : 'available',
    });
    Utils.closeModal();
    Utils.toast('Thêm tài sản thành công!', 'success');
    this.render();
  },

  delete(id) {
    const a = DB.assets.find(x=>x.id===id);
    Utils.confirm(`Xóa tài sản <strong>${a.name}</strong>?`, () => {
      DB.assets = DB.assets.filter(x=>x.id!==id);
      Utils.toast('Đã xóa tài sản', 'success');
      this.renderContent();
    });
  },
};
