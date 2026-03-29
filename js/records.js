/* ═══════════════════════════════════════════════════
   HRM PRO – RECORDS (Employee File Storage)
═══════════════════════════════════════════════════ */

const Records = {
  selectedEmp: null,

  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Lưu trữ hồ sơ</h1>
          <p>Quản lý hồ sơ nhân viên và tài liệu cá nhân</p>
        </div>
        <button class="btn btn-primary" onclick="Records.uploadDoc()">
          <i class="fa-solid fa-upload"></i> Tải lên tài liệu
        </button>
      </div>

      <div style="display:grid;grid-template-columns:260px 1fr;gap:20px;align-items:start">
        <!-- Employee list -->
        <div class="card">
          <div class="card-header"><span class="card-title">Nhân viên</span></div>
          <div style="padding:10px">
            <div class="search-input" style="margin-bottom:10px">
              <i class="fa-solid fa-search"></i>
              <input type="text" placeholder="Tìm nhân viên..." oninput="Records.searchEmp(this.value)" />
            </div>
            <div id="recordEmpList" style="max-height:500px;overflow-y:auto"></div>
          </div>
        </div>

        <!-- File cabinet -->
        <div id="recordFileArea">
          <div class="empty-state card" style="padding:48px">
            <i class="fa-solid fa-folder-open"></i>
            <h3>Chọn nhân viên</h3>
            <p>Nhấn vào tên nhân viên để xem hồ sơ</p>
          </div>
        </div>
      </div>
    `;
    this.renderEmpList(DB.employees);
  },

  renderEmpList(emps) {
    document.getElementById('recordEmpList').innerHTML = emps.map(e=>`
      <div class="settings-nav-item ${this.selectedEmp===e.id?'active':''}" onclick="Records.selectEmp(${e.id})" style="margin-bottom:2px">
        <div class="emp-avatar-sm ${e.color}" style="width:28px;height:28px;font-size:10px">${e.avatar}</div>
        <div>
          <div style="font-size:13px">${e.name}</div>
          <div style="font-size:11px;opacity:.7">${DB.getDeptName(e.dept)}</div>
        </div>
      </div>`).join('');
  },

  searchEmp(q) {
    const filtered = DB.employees.filter(e=>e.name.toLowerCase().includes(q.toLowerCase()));
    this.renderEmpList(filtered);
  },

  selectEmp(id) {
    this.selectedEmp = id;
    this.renderEmpList(DB.employees);
    this.renderFiles(id);
  },

  renderFiles(id) {
    const emp  = DB.getEmp(id);
    const dept = DB.getDeptName(emp.dept);
    const fileTypes = [
      {cat:'Hợp đồng lao động', icon:'fa-file-contract', color:'gradient-blue',
       files:[{name:`HĐLĐ ${emp.code} – ${emp.name}`,date:emp.join,size:'245 KB',type:'PDF'}]},
      {cat:'Sơ yếu lý lịch', icon:'fa-id-card', color:'gradient-green',
       files:[{name:`SYLL – ${emp.name}`,date:emp.join,size:'180 KB',type:'PDF'}]},
      {cat:'Bằng cấp & Chứng chỉ', icon:'fa-graduation-cap', color:'gradient-purple',
       files:[{name:`Bằng đại học – ${emp.name}`,date:emp.dob,size:'1.2 MB',type:'PDF'},{name:'Chứng chỉ nghề nghiệp',date:'2022-06-01',size:'320 KB',type:'PDF'}]},
      {cat:'Quyết định & Thông báo', icon:'fa-gavel', color:'gradient-orange',
       files:[{name:`QĐ bổ nhiệm – ${emp.pos}`,date:emp.join,size:'128 KB',type:'PDF'}]},
      {cat:'Bảng lương', icon:'fa-money-bill', color:'gradient-teal',
       files:['T1/2024','T2/2024','T3/2024'].map(m=>({name:`Phiếu lương ${m} – ${emp.name}`,date:`${m.replace('T','')}`.split('/').reverse().join('-')+'-28',size:'95 KB',type:'PDF'}))},
    ];

    document.getElementById('recordFileArea').innerHTML = `
      <div>
        <!-- Profile header -->
        <div class="card mb-20">
          <div class="card-body" style="padding:20px">
            <div style="display:flex;align-items:center;gap:16px">
              <div class="user-avatar ${emp.color}" style="width:60px;height:60px;font-size:20px">${emp.avatar}</div>
              <div style="flex:1">
                <h2 style="font-size:18px;font-weight:700">${emp.name}</h2>
                <p style="font-size:13px;color:var(--text-muted)">${emp.pos} – ${dept}</p>
                <div style="display:flex;gap:8px;margin-top:6px">
                  <span class="perm-tag"><i class="fa-solid fa-id-badge"></i> ${emp.code}</span>
                  <span class="perm-tag"><i class="fa-solid fa-calendar"></i> ${Utils.fmtDate(emp.join)}</span>
                </div>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-secondary btn-sm" onclick="Employees.viewProfile(${id})">
                  <i class="fa-solid fa-user"></i> Hồ sơ
                </button>
                <button class="btn btn-primary btn-sm" onclick="Records.uploadDoc(${id})">
                  <i class="fa-solid fa-upload"></i> Thêm tài liệu
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- File categories -->
        ${fileTypes.map(cat=>`
          <div class="card mb-16">
            <div class="card-header">
              <div style="display:flex;align-items:center;gap:10px">
                <div class="stat-icon ${cat.color}" style="width:32px;height:32px;border-radius:8px;font-size:14px">
                  <i class="fa-solid ${cat.icon}" style="color:#fff"></i>
                </div>
                <span class="card-title">${cat.cat}</span>
              </div>
              <span style="font-size:12px;color:var(--text-muted)">${cat.files.length} file</span>
            </div>
            <div class="table-wrapper">
              <table>
                <thead><tr><th>Tên tài liệu</th><th>Ngày</th><th>Kích thước</th><th>Loại</th><th>Thao tác</th></tr></thead>
                <tbody>
                  ${cat.files.map(f=>`<tr>
                    <td><div style="display:flex;align-items:center;gap:8px">
                      <i class="fa-solid fa-file-pdf" style="color:var(--danger);font-size:16px"></i>
                      <span style="font-size:13px;font-weight:500">${f.name}</span>
                    </div></td>
                    <td style="font-size:12px;color:var(--text-muted)">${Utils.fmtDate(f.date)}</td>
                    <td style="font-size:12px">${f.size}</td>
                    <td><span class="perm-tag">${f.type}</span></td>
                    <td><div style="display:flex;gap:4px">
                      <button class="btn btn-sm btn-secondary btn-icon" title="Xem" onclick="Utils.toast('Đang mở tài liệu...','info')"><i class="fa-solid fa-eye"></i></button>
                      <button class="btn btn-sm btn-secondary btn-icon" title="Tải xuống" onclick="Utils.toast('Đang tải...','info')"><i class="fa-solid fa-download"></i></button>
                    </div></td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>`).join('')}
      </div>`;
  },

  uploadDoc(empId) {
    Utils.openModal('Tải lên tài liệu', `
      <div class="form-group">
        <label class="form-label">Nhân viên</label>
        <select class="form-control" id="recEmp">
          ${DB.employees.map(e=>`<option value="${e.id}" ${empId===e.id?'selected':''}>${e.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Danh mục</label>
        <select class="form-control">
          <option>Hợp đồng lao động</option>
          <option>Sơ yếu lý lịch</option>
          <option>Bằng cấp & Chứng chỉ</option>
          <option>Quyết định & Thông báo</option>
          <option>Bảng lương</option>
          <option>Khác</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Tên tài liệu</label>
        <input class="form-control" placeholder="Nhập tên tài liệu..." /></div>
      <div class="form-group">
        <label class="form-label">Chọn file</label>
        <div style="border:2px dashed var(--border);border-radius:10px;padding:24px;text-align:center;cursor:pointer" onclick="Utils.toast('Chức năng upload sẽ sớm có','info')">
          <i class="fa-solid fa-cloud-upload-alt" style="font-size:32px;color:var(--text-muted);margin-bottom:8px;display:block"></i>
          <div style="font-size:13px;color:var(--text-muted)">Kéo thả file vào đây hoặc <span style="color:var(--primary);font-weight:600">click để chọn</span></div>
          <div style="font-size:11px;color:var(--text-light);margin-top:4px">PDF, DOC, XLS, JPG – Tối đa 10MB</div>
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Utils.closeModal();Utils.toast('Tải lên thành công!','success')">
        <i class="fa-solid fa-upload"></i> Tải lên
      </button>
    `);
  },
};
