/* ═══════════════════════════════════════════════════
   HRM PRO – SETTINGS
═══════════════════════════════════════════════════ */

const Settings = {
  activeSection: 'company',

  sections: [
    {id:'company',  label:'Thông tin công ty',  icon:'fa-building'},
    {id:'profile',  label:'Hồ sơ cá nhân',       icon:'fa-user-circle'},
    {id:'salary',   label:'Cấu hình lương',       icon:'fa-coins'},
    {id:'leave',    label:'Chính sách nghỉ phép', icon:'fa-calendar-check'},
    {id:'template', label:'Mẫu nhập liệu',        icon:'fa-file-arrow-up'},
    {id:'forms',    label:'Tích hợp Google Forms', icon:'fa-brands fa-wpforms'},
    {id:'notif',    label:'Thông báo',             icon:'fa-bell'},
    {id:'security', label:'Bảo mật',               icon:'fa-shield-halved'},
    {id:'backup',   label:'Sao lưu & Khôi phục',  icon:'fa-database'},
  ],

  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Cài đặt hệ thống</h1>
          <p>Cấu hình và tùy chỉnh hệ thống HRM Pro</p>
        </div>
      </div>
      <div class="settings-grid">
        <div class="settings-sidebar">
          ${this.sections.map(s=>`
            <div class="settings-nav-item ${this.activeSection===s.id?'active':''}" onclick="Settings.switchSection('${s.id}')">
              <i class="fa-solid ${s.icon}"></i>
              <span>${s.label}</span>
            </div>`).join('')}
        </div>
        <div id="settingsContent"></div>
      </div>
    `;
    this.renderSection(this.activeSection);
  },

  switchSection(id) {
    this.activeSection = id;
    document.querySelectorAll('.settings-nav-item').forEach((el,i)=>{
      el.classList.toggle('active', this.sections[i]?.id===id);
    });
    this.renderSection(id);
  },

  renderSection(id) {
    const c = document.getElementById('settingsContent');
    switch(id) {
      case 'company':  c.innerHTML = this.sectionCompany();  break;
      case 'profile':  c.innerHTML = this.sectionProfile();  break;
      case 'salary':   c.innerHTML = this.sectionSalary();   break;
      case 'leave':    c.innerHTML = this.sectionLeave();    break;
      case 'template': c.innerHTML = this.sectionTemplate();  break;
      case 'forms':    c.innerHTML = this.sectionForms();    break;
      case 'notif':    c.innerHTML = this.sectionNotif();    break;
      case 'security': c.innerHTML = this.sectionSecurity(); break;
      case 'backup':   c.innerHTML = this.sectionBackup();   break;
    }
  },

  sectionCompany() {
    const s = SettingsStore.get('company');
    const v = (k,d) => s[k] !== undefined ? s[k] : d;
    const name    = v('name',    'HRM Pro Corp');
    const tax     = v('tax',     '0123456789');
    const email   = v('email',   'contact@hrmpro.vn');
    const phone   = v('phone',   '028 3823 0000');
    const address = v('address', '123 Nguyễn Huệ, Q1, TP. Hồ Chí Minh');
    const founded = v('founded', '2015-03-15');
    const size    = v('size',    '50-200');
    const initial = name.charAt(0).toUpperCase();
    return `
    <div class="card">
      <div class="card-header"><span class="card-title">Thông tin công ty</span></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
          <div style="width:80px;height:80px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;font-weight:800">${initial}</div>
          <div>
            <div style="font-size:16px;font-weight:700">${name}</div>
            <div style="font-size:12px;color:var(--text-muted)">MST: ${tax}</div>
            <button class="btn btn-sm btn-secondary mt-8">Đổi logo</button>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Tên công ty</label>
            <input class="form-control" id="sc_name" value="${name}" /></div>
          <div class="form-group"><label class="form-label">Mã số thuế</label>
            <input class="form-control" id="sc_tax" value="${tax}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Email</label>
            <input class="form-control" id="sc_email" value="${email}" /></div>
          <div class="form-group"><label class="form-label">Điện thoại</label>
            <input class="form-control" id="sc_phone" value="${phone}" /></div>
        </div>
        <div class="form-group"><label class="form-label">Địa chỉ</label>
          <input class="form-control" id="sc_address" value="${address}" /></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Ngày thành lập</label>
            <input class="form-control" type="date" id="sc_founded" value="${founded}" /></div>
          <div class="form-group"><label class="form-label">Quy mô</label>
            <select class="form-control" id="sc_size">
              <option value="10-50" ${size==='10-50'?'selected':''}>10–50 nhân viên</option>
              <option value="50-200" ${size==='50-200'?'selected':''}>50–200 nhân viên</option>
              <option value="200-500" ${size==='200-500'?'selected':''}>200–500 nhân viên</option>
              <option value="500+" ${size==='500+'?'selected':''}>Trên 500 nhân viên</option>
            </select></div>
        </div>
        <div style="text-align:right;margin-top:4px">
          <button class="btn btn-primary" onclick="Settings._saveCompany()">
            <i class="fa-solid fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>`; },

  _saveCompany() {
    const d = {
      name:    document.getElementById('sc_name')?.value.trim()    || '',
      tax:     document.getElementById('sc_tax')?.value.trim()     || '',
      email:   document.getElementById('sc_email')?.value.trim()   || '',
      phone:   document.getElementById('sc_phone')?.value.trim()   || '',
      address: document.getElementById('sc_address')?.value.trim() || '',
      founded: document.getElementById('sc_founded')?.value        || '',
      size:    document.getElementById('sc_size')?.value           || '50-200',
    };
    SettingsStore.set('company', d);
    Utils.toast('Đã lưu thông tin công ty!', 'success');
    // Refresh header block
    Settings.switchSection('company');
  },

  sectionProfile() {
    const me = DB.getEmp(12) || { color:'gradient-indigo', avatar:'HR', name:'', email:'', phone:'', dob:'' };
    const s  = SettingsStore.get('profile');
    const name  = s.name  !== undefined ? s.name  : me.name;
    const email = s.email !== undefined ? s.email : me.email;
    const phone = s.phone !== undefined ? s.phone : me.phone;
    const dob   = s.dob   !== undefined ? s.dob   : me.dob;
    return `
    <div class="card">
      <div class="card-header"><span class="card-title">Hồ sơ cá nhân</span></div>
      <div class="card-body">
        <div style="text-align:center;margin-bottom:20px">
          <div class="user-avatar ${me.color}" style="width:80px;height:80px;font-size:26px;margin:0 auto 10px">${me.avatar}</div>
          <button class="btn btn-sm btn-secondary">Đổi ảnh đại diện</button>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Họ và tên</label>
            <input class="form-control" id="sp_name" value="${name}" /></div>
          <div class="form-group"><label class="form-label">Email</label>
            <input class="form-control" id="sp_email" value="${email}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Điện thoại</label>
            <input class="form-control" id="sp_phone" value="${phone}" /></div>
          <div class="form-group"><label class="form-label">Ngày sinh</label>
            <input class="form-control" type="date" id="sp_dob" value="${dob}" /></div>
        </div>
        <div style="text-align:right">
          <button class="btn btn-primary" onclick="Settings._saveProfile()">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

  _saveProfile() {
    const d = {
      name:  document.getElementById('sp_name')?.value.trim()  || '',
      email: document.getElementById('sp_email')?.value.trim() || '',
      phone: document.getElementById('sp_phone')?.value.trim() || '',
      dob:   document.getElementById('sp_dob')?.value          || '',
    };
    SettingsStore.set('profile', d);
    Settings.syncSidebar();
    Utils.toast('Đã cập nhật hồ sơ cá nhân!', 'success');
  },

  syncSidebar() {
    const p = SettingsStore.get('profile');
    const name = p.name || 'Quản trị viên';
    const initials = name.trim().split(' ').filter(Boolean).slice(-2).map(w => w[0].toUpperCase()).join('');
    const nameEl   = document.getElementById('sidebarName');
    const avatarEl = document.getElementById('sidebarAvatar');
    const topbarEl = document.querySelector('.topbar-avatar');
    if (nameEl)   nameEl.textContent   = name;
    if (avatarEl) avatarEl.textContent = initials || 'NT';
    if (topbarEl) topbarEl.textContent = initials || 'NT';
  },

  sectionSalary() {
    const s = SettingsStore.get('salary');
    const rows = [
      {id:'min_wage',    label:'Lương tối thiểu vùng 1',       def:'4,680,000đ'},
      {id:'bhxh_emp',    label:'Tỷ lệ đóng BHXH nhân viên',    def:'8%'},
      {id:'bhyt_emp',    label:'Tỷ lệ đóng BHYT nhân viên',    def:'1.5%'},
      {id:'bhtn_emp',    label:'Tỷ lệ đóng BHTN nhân viên',    def:'1%'},
      {id:'bhxh_co',     label:'Tỷ lệ đóng BHXH công ty',      def:'17%'},
      {id:'tncn_thresh', label:'Ngưỡng chịu thuế TNCN',        def:'11,000,000đ / tháng'},
      {id:'ded_self',    label:'Giảm trừ gia cảnh bản thân',   def:'11,000,000đ'},
      {id:'ded_dep',     label:'Giảm trừ người phụ thuộc',     def:'4,400,000đ / người'},
    ];
    return `
    <div class="card">
      <div class="card-header"><span class="card-title">Cấu hình lương & Phụ cấp</span></div>
      <div class="card-body">
        ${rows.map(r=>`
          <div class="perm-toggle">
            <span style="font-size:13px">${r.label}</span>
            <div style="display:flex;align-items:center;gap:8px">
              <input class="form-control" id="ss_${r.id}" style="width:180px;text-align:right"
                value="${s[r.id] !== undefined ? s[r.id] : r.def}" />
            </div>
          </div>`).join('')}
        <div style="text-align:right;margin-top:16px">
          <button class="btn btn-primary" onclick="Settings._saveSalary()">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

  _saveSalary() {
    const keys = ['min_wage','bhxh_emp','bhyt_emp','bhtn_emp','bhxh_co','tncn_thresh','ded_self','ded_dep'];
    const d = {};
    keys.forEach(k => { const el = document.getElementById(`ss_${k}`); if(el) d[k] = el.value.trim(); });
    SettingsStore.set('salary', d);
    Utils.toast('Đã lưu cấu hình lương!', 'success');
  },

  sectionLeave() {
    const s = SettingsStore.get('leave');
    const rows = [
      {id:'annual',     label:'Nghỉ phép năm (toàn thời gian)',    def:'12 ngày'},
      {id:'sick',       label:'Nghỉ bệnh có lương',                 def:'30 ngày'},
      {id:'maternity',  label:'Nghỉ thai sản',                      def:'6 tháng'},
      {id:'wedding',    label:'Nghỉ hôn lễ',                        def:'3 ngày'},
      {id:'funeral',    label:'Nghỉ tang gia (thân nhân cấp 1)',    def:'3 ngày'},
      {id:'probation',  label:'Thử việc – nghỉ phép năm',           def:'0 ngày (không tính)'},
    ];
    return `
    <div class="card">
      <div class="card-header"><span class="card-title">Chính sách nghỉ phép</span></div>
      <div class="card-body">
        ${rows.map(r=>`
          <div class="perm-toggle">
            <span>${r.label}</span>
            <input class="form-control" id="sl_${r.id}" style="width:200px"
              value="${s[r.id] !== undefined ? s[r.id] : r.def}" />
          </div>`).join('')}
        <div style="text-align:right;margin-top:16px">
          <button class="btn btn-primary" onclick="Settings._saveLeave()">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

  _saveLeave() {
    const keys = ['annual','sick','maternity','wedding','funeral','probation'];
    const d = {};
    keys.forEach(k => { const el = document.getElementById(`sl_${k}`); if(el) d[k] = el.value.trim(); });
    SettingsStore.set('leave', d);
    Utils.toast('Đã lưu chính sách nghỉ phép!', 'success');
  },

  sectionTemplate() {
    const fields = ImportConfig.fields;
    const enabled = fields.filter(f => f.enabled);

    return `
    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="fa-solid fa-file-arrow-up text-success"></i> Cấu hình mẫu nhập liệu hàng loạt</span>
        <div style="display:flex;gap:8px">
          <button class="btn btn-sm btn-secondary" onclick="Settings._templateReset()">
            <i class="fa-solid fa-rotate-left"></i> Mặc định
          </button>
          <button class="btn btn-sm btn-success" onclick="Settings._templateSave()">
            <i class="fa-solid fa-save"></i> Lưu mẫu
          </button>
        </div>
      </div>
      <div class="card-body">

        <!-- Info -->
        <div style="background:var(--info-light);border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:12px;color:var(--info);display:flex;gap:10px;align-items:flex-start">
          <i class="fa-solid fa-circle-info" style="font-size:16px;flex-shrink:0;margin-top:1px"></i>
          <div>
            Cấu hình các <strong>cột dữ liệu</strong> sẽ có trong file mẫu CSV.
            Bật/tắt từng cột, đánh dấu <strong>bắt buộc</strong>, và đặt tên cột tùy ý.
            Khi nhập hàng loạt, hệ thống sẽ nhận diện cột theo tên này.
          </div>
        </div>

        <!-- Field table -->
        <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:12px">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead>
              <tr style="background:var(--bg)">
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);border-bottom:1px solid var(--border)">Bật</th>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);border-bottom:1px solid var(--border)">TRƯỜNG DỮ LIỆU</th>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);border-bottom:1px solid var(--border)">TÊN CỘT TRONG FILE MẪU</th>
                <th style="padding:10px 14px;text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);border-bottom:1px solid var(--border)">BẮT BUỘC</th>
                <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:700;color:var(--text-muted);border-bottom:1px solid var(--border)">VÍ DỤ</th>
                <th style="padding:10px 14px;text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);border-bottom:1px solid var(--border)"></th>
              </tr>
            </thead>
            <tbody id="templateFieldTable">
              ${fields.map((f) => `
                <tr id="trow_${f.id}" style="border-bottom:1px solid var(--border-light);opacity:${f.enabled?'1':'.5'}">
                  <td style="padding:10px 14px">
                    <label class="switch" style="margin:0">
                      <input type="checkbox" ${f.enabled?'checked':''} id="ten_${f.id}"
                        onchange="Settings._templateToggle('${f.id}',this.checked)" />
                      <span class="slider"></span>
                    </label>
                  </td>
                  <td style="padding:10px 14px">
                    <div style="display:flex;align-items:center;gap:6px">
                      <div>
                        <div style="font-weight:600;color:var(--text-dark)">${f.label}</div>
                        <div style="font-size:11px;color:var(--text-muted);font-family:monospace">${f.id}</div>
                      </div>
                      ${f._custom ? '<span style="font-size:10px;background:var(--primary-light,#e0e7ff);color:var(--primary);padding:1px 6px;border-radius:10px;font-weight:600">Tùy chỉnh</span>' : ''}
                    </div>
                  </td>
                  <td style="padding:10px 14px;min-width:200px">
                    <input class="form-control" id="tlabel_${f.id}" value="${f.customLabel || f.label}"
                      placeholder="${f.label}" style="padding:6px 10px;font-size:13px"
                      ${f.enabled?'':'disabled'} />
                  </td>
                  <td style="padding:10px 14px;text-align:center">
                    <label class="switch" style="margin:0 auto">
                      <input type="checkbox" ${f.required?'checked':''} id="treq_${f.id}"
                        ${f.enabled?'':'disabled'}
                        onchange="Settings._templateSetRequired('${f.id}',this.checked)" />
                      <span class="slider"></span>
                    </label>
                  </td>
                  <td style="padding:10px 14px;font-size:12px;color:var(--text-muted);font-family:monospace">${f.example}</td>
                  <td style="padding:10px 14px;text-align:center">
                    ${f._custom ? `<button class="btn btn-sm btn-icon" style="color:var(--danger);background:transparent;border:none;cursor:pointer;padding:4px 8px" title="Xóa trường" onclick="Settings._deleteField('${f.id}')"><i class="fa-solid fa-trash"></i></button>` : ''}
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <!-- Add field button -->
        <div style="margin-bottom:20px">
          <button class="btn btn-secondary" onclick="Settings._addFieldModal()">
            <i class="fa-solid fa-plus"></i> Thêm trường thông tin
          </button>
        </div>

        <!-- Preview -->
        <div style="margin-bottom:20px">
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">
            XEM TRƯỚC FILE MẪU CSV
          </div>
          <div id="templatePreview" style="background:var(--bg);border-radius:8px;padding:14px 16px;font-family:monospace;font-size:12px;color:var(--text-base);overflow-x:auto;white-space:nowrap;border:1px solid var(--border)">
            ${this._buildPreviewRow(fields)}
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px">
            <span style="color:var(--danger);font-weight:600">* Cột bắt buộc</span> •
            Hàng 1: tiêu đề cột | Hàng 2: dữ liệu mẫu
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex;gap:10px">
          <button class="btn btn-success" onclick="Settings._downloadPreviewTemplate()">
            <i class="fa-solid fa-download"></i> Tải file mẫu ngay
          </button>
          <button class="btn btn-primary" onclick="navigate('employees');setTimeout(()=>Employees.openBulkImport(),200)">
            <i class="fa-solid fa-file-arrow-up"></i> Đi đến Nhập hàng loạt
          </button>
        </div>
      </div>
    </div>`;
  },

  _buildPreviewRow(fields) {
    const active = fields.filter(f => f.enabled);
    const header = active.map(f => `<span style="color:${f.required?'var(--danger)':'var(--primary)'};font-weight:600">"${f.customLabel||f.label}"${f.required?'*':''}</span>`).join('<span style="color:var(--text-muted)">,</span>');
    const example= active.map(f => `<span style="color:var(--success)">"${f.example}"</span>`).join('<span style="color:var(--text-muted)">,</span>');
    return header + '<br/>' + example;
  },

  _templateToggle(id, checked) {
    const row    = document.getElementById(`trow_${id}`);
    const lInput = document.getElementById(`tlabel_${id}`);
    const rInput = document.getElementById(`treq_${id}`);
    row.style.opacity   = checked ? '1' : '.5';
    lInput.disabled     = !checked;
    if (rInput) rInput.disabled = !checked;
    this._updateTemplatePreview();
  },

  _templateSetRequired(id, checked) { this._updateTemplatePreview(); },

  _updateTemplatePreview() {
    const fields = ImportConfig.fields;
    // Read current state from DOM
    fields.forEach(f => {
      const enEl = document.getElementById(`ten_${f.id}`);
      const lbEl = document.getElementById(`tlabel_${f.id}`);
      const rqEl = document.getElementById(`treq_${f.id}`);
      if (enEl) f.enabled      = enEl.checked;
      if (lbEl) f.customLabel  = lbEl.value;
      if (rqEl) f.required     = rqEl.checked;
    });
    const prev = document.getElementById('templatePreview');
    if (prev) prev.innerHTML = this._buildPreviewRow(fields);
  },

  _templateSave() {
    const fields = ImportConfig.fields;
    fields.forEach(f => {
      const enEl = document.getElementById(`ten_${f.id}`);
      const lbEl = document.getElementById(`tlabel_${f.id}`);
      const rqEl = document.getElementById(`treq_${f.id}`);
      if (enEl) f.enabled     = enEl.checked;
      if (lbEl) f.customLabel = lbEl.value.trim();
      if (rqEl) f.required    = rqEl.checked;
    });
    ImportConfig.save(fields);
    Utils.toast('Đã lưu cấu hình mẫu nhập liệu!', 'success');
    this._updateTemplatePreview();
  },

  _templateReset() {
    Utils.confirm('Đặt lại mẫu về mặc định?', () => {
      ImportConfig.reset();
      Settings.switchSection('template');
      Utils.toast('Đã đặt lại mẫu về mặc định', 'success');
    });
  },

  _addFieldModal() {
    Utils.openModal('Thêm trường thông tin tùy chỉnh', `
      <div class="form-group">
        <label class="form-label">Tên trường <span style="color:var(--danger)">*</span></label>
        <input class="form-control" id="nfLabel" placeholder="VD: Số CMND/CCCD" oninput="Settings._autoFieldId()" />
      </div>
      <div class="form-group">
        <label class="form-label">ID trường <span style="font-size:11px;color:var(--text-muted)">(tự động, không dấu)</span></label>
        <input class="form-control" id="nfId" placeholder="VD: cmnd" style="font-family:monospace" />
      </div>
      <div class="form-group">
        <label class="form-label">Tên cột trong file CSV <span style="font-size:11px;color:var(--text-muted)">(để trống = dùng tên trường)</span></label>
        <input class="form-control" id="nfCustomLabel" placeholder="VD: CMND/CCCD" />
      </div>
      <div class="form-group">
        <label class="form-label">Giá trị ví dụ</label>
        <input class="form-control" id="nfExample" placeholder="VD: 079201012345" />
      </div>
      <div class="perm-toggle" style="margin-top:4px">
        <span style="font-size:13px">Bắt buộc nhập</span>
        <label class="switch">
          <input type="checkbox" id="nfRequired" />
          <span class="slider"></span>
        </label>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Settings._addField()">
        <i class="fa-solid fa-plus"></i> Thêm trường
      </button>
    `);
  },

  _autoFieldId() {
    const label = document.getElementById('nfLabel')?.value || '';
    const id = label.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'_')
      .replace(/^_+|_+$/g,'');
    const el = document.getElementById('nfId');
    if (el) el.value = id;
  },

  _addField() {
    const label       = (document.getElementById('nfLabel')?.value || '').trim();
    const id          = (document.getElementById('nfId')?.value || '').trim();
    const customLabel = (document.getElementById('nfCustomLabel')?.value || '').trim();
    const example     = (document.getElementById('nfExample')?.value || '').trim();
    const required    = document.getElementById('nfRequired')?.checked || false;

    if (!label) { Utils.toast('Vui lòng nhập tên trường', 'error'); return; }
    if (!id)    { Utils.toast('ID trường không hợp lệ', 'error'); return; }

    const fields = ImportConfig.fields;
    if (fields.find(f => f.id === id)) {
      Utils.toast('ID trường đã tồn tại, vui lòng đổi tên khác', 'error'); return;
    }

    fields.push({ id, label, required, enabled: true, customLabel, example, _custom: true });
    ImportConfig.save(fields);
    Utils.closeModal();
    Settings.switchSection('template');
    Utils.toast(`Đã thêm trường "${label}"`, 'success');
  },

  _deleteField(id) {
    Utils.confirm('Xóa trường này khỏi mẫu nhập liệu?', () => {
      const fields = ImportConfig.fields.filter(f => f.id !== id);
      ImportConfig.save(fields);
      Settings.switchSection('template');
      Utils.toast('Đã xóa trường', 'success');
    });
  },

  _downloadPreviewTemplate() {
    const fields = ImportConfig.fields;
    // Save current DOM state first
    fields.forEach(f => {
      const enEl = document.getElementById(`ten_${f.id}`);
      const lbEl = document.getElementById(`tlabel_${f.id}`);
      if (enEl) f.enabled     = enEl.checked;
      if (lbEl) f.customLabel = lbEl.value.trim();
    });
    ImportConfig.save(fields);
    const csv  = ImportConfig.buildCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'mau_nhap_nhan_vien.csv';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    Utils.toast('Đã tải file mẫu CSV!', 'success');
  },

  sectionForms() {
    const s = SettingsStore.get('forms_integration');
    const url   = s.webAppUrl || '';
    const token = s.token || '';
    const connected = !!url;
    return `
    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="fa-brands fa-google" style="color:#EA4335"></i> Tích hợp Google Forms</span>
        ${connected ? '<span class="status-badge status-active">Đã kết nối</span>' : '<span class="status-badge status-inactive">Chưa kết nối</span>'}
      </div>
      <div class="card-body">

        <!-- Hướng dẫn -->
        <div style="background:var(--info-light);border-radius:10px;padding:14px 16px;margin-bottom:20px;font-size:13px;color:var(--info);display:flex;gap:10px">
          <i class="fa-solid fa-circle-info" style="font-size:18px;flex-shrink:0;margin-top:1px"></i>
          <div>
            <strong>Toàn bộ dữ liệu</strong> (nhân viên, phòng ban, tài sản...) tự động lưu vào Google Drive mỗi khi có thay đổi.<br/>
            Khi dùng trình duyệt/thiết bị mới, bấm <strong>"Tải từ Drive"</strong> để khôi phục.
          </div>
        </div>

        <!-- Cấu hình kết nối -->
        <div class="form-group">
          <label class="form-label">URL Google Apps Script Web App <span style="color:var(--danger)">*</span></label>
          <input class="form-control" id="sf_url" value="${url}"
            placeholder="https://script.google.com/macros/s/AKfy.../exec" />
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">URL bạn nhận được sau khi triển khai Apps Script dưới dạng Web App</div>
        </div>
        <div class="form-group">
          <label class="form-label">Token bảo mật <span style="color:var(--danger)">*</span></label>
          <div style="display:flex;gap:8px">
            <input class="form-control" id="sf_token" value="${token}" placeholder="Nhập token bí mật bạn đặt trong Apps Script" />
            <button class="btn btn-secondary" style="white-space:nowrap" onclick="Settings._genToken()">
              <i class="fa-solid fa-dice"></i> Tạo ngẫu nhiên
            </button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Token này phải giống hệt trong Apps Script của bạn</div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:24px">
          <button class="btn btn-primary" onclick="Settings._saveFormsConfig()">
            <i class="fa-solid fa-save"></i> Lưu cấu hình
          </button>
          ${connected ? `
          <button class="btn btn-secondary" onclick="Settings._testFormsConn()">
            <i class="fa-solid fa-plug"></i> Kiểm tra kết nối
          </button>
          <button class="btn btn-success" onclick="navigate('intake')">
            <i class="fa-solid fa-inbox"></i> Xem hồ sơ đang chờ
          </button>
          <button class="btn btn-secondary" onclick="Settings._loadFromDrive()">
            <i class="fa-solid fa-cloud-arrow-down"></i> Tải dữ liệu từ Drive
          </button>` : ''}
        </div>

        <hr class="divider" />

        <!-- Hướng dẫn Apps Script -->
        <div style="font-size:14px;font-weight:700;margin-bottom:14px">
          <i class="fa-solid fa-book-open" style="color:var(--primary)"></i> Hướng dẫn thiết lập Apps Script
        </div>
        ${[
          ['1', 'Liên kết Google Form với Google Sheet', 'Trong Google Form → <strong>Responses</strong> → icon Google Sheets → tạo spreadsheet mới.'],
          ['2', 'Mở Apps Script', 'Trong Google Sheet → <strong>Extensions → Apps Script</strong>.'],
          ['3', 'Dán code', 'Xóa nội dung cũ, dán đoạn code bên dưới vào. Thay <code>YOUR_SECRET_TOKEN</code> bằng token bạn đặt ở trên. Thay <code>FOLDER_ID</code> bằng <code>1myxvUd6Y_G9SJr-EzzfWKl1IL-_Dn3tm</code>.'],
          ['4', 'Thiết lập Trigger', 'Apps Script → <strong>Triggers</strong> (đồng hồ bên trái) → Add Trigger → chọn hàm <strong>onFormSubmit</strong> → Event source: <strong>From spreadsheet</strong> → Event type: <strong>On form submit</strong>.'],
          ['5', 'Triển khai Web App', 'Apps Script → <strong>Deploy → New deployment</strong> → Type: <strong>Web app</strong> → Execute as: <strong>Me</strong> → Who has access: <strong>Anyone</strong> → Deploy. Copy URL dán vào ô trên.'],
        ].map(([n,title,desc]) => `
          <div style="display:flex;gap:12px;margin-bottom:14px">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${n}</div>
            <div>
              <div style="font-weight:600;font-size:13px;margin-bottom:2px">${title}</div>
              <div style="font-size:12px;color:var(--text-muted)">${desc}</div>
            </div>
          </div>`).join('')}

        <!-- Code Apps Script -->
        <div style="font-size:13px;font-weight:600;margin-bottom:8px;margin-top:8px">Code dán vào Apps Script:</div>
        <div style="position:relative">
          <pre id="gasCode" style="background:#1e1e2e;color:#cdd6f4;border-radius:10px;padding:16px;font-size:11.5px;line-height:1.6;overflow-x:auto;max-height:320px;overflow-y:auto;margin:0">${this._gasCodeHtml()}</pre>
          <button class="btn btn-sm btn-secondary" style="position:absolute;top:8px;right:8px" onclick="Settings._copyGasCode()">
            <i class="fa-solid fa-copy"></i> Copy
          </button>
        </div>
      </div>
    </div>`;
  },

  _gasCodeHtml() {
    const token = (SettingsStore.get('forms_integration').token || 'YOUR_SECRET_TOKEN').replace(/&/g,'&amp;').replace(/</g,'&lt;');
    return `// ═══════════════════════════════════════════════════
// HRM Pro – Full Backend (Forms + Database)
// Xóa code cũ, dán toàn bộ đoạn này vào Apps Script
// Sau đó Deploy lại (New version)
// ═══════════════════════════════════════════════════

const HRM_TOKEN  = '${token}';
const FOLDER_ID  = '1myxvUd6Y_G9SJr-EzzfWKl1IL-_Dn3tm';
const STATUS_COL = '__hrm_status';
const DB_TABLES  = ['employees','departments','attendance','leaves',
                    'payroll','documents','assets','roles','recruitment'];

// Tên subfolder cho từng nghiệp vụ
const TABLE_FOLDERS = {
  employees:   '01. Nhân viên',
  departments: '02. Phòng ban',
  attendance:  '03. Chấm công',
  leaves:      '04. Nghỉ phép',
  payroll:     '05. Tính lương',
  documents:   '06. Văn bản',
  assets:      '07. Tài sản &amp; Thiết bị',
  roles:       '08. Phân quyền',
  recruitment: '09. Tuyển dụng',
};
const INTAKE_FOLDER = '10. Hồ sơ NLĐ';

// ── Lấy hoặc tạo subfolder ────────────────────────
function getOrCreateFolder(parentId, name) {
  const parent = DriveApp.getFolderById(parentId);
  const existing = parent.getFoldersByName(name);
  if (existing.hasNext()) return existing.next();
  return parent.createFolder(name);
}

// ── GET: đọc dữ liệu ──────────────────────────────
function doGet(e) {
  const p = e.parameter;
  if (p.token !== HRM_TOKEN) return resp({ok:false,error:'Unauthorized'});
  if (p.action === 'getAllTables') return resp(getAllTables());
  if (p.action === 'list')        return resp(listPending());
  if (p.action === 'accept')      return resp(setStatus(+p.row,'accepted'));
  if (p.action === 'reject')      return resp(setStatus(+p.row,'rejected'));
  return resp({ok:true});
}

// ── POST: ghi dữ liệu (từ HRM Pro) ───────────────
function doPost(e) {
  try {
    if (e.parameter.token !== HRM_TOKEN)
      return resp({ok:false,error:'Unauthorized'});
    const payload = JSON.parse(e.parameter.payload || '{}');
    if (payload.action === 'saveTable')
      return resp(saveTable(payload.table, payload.data));
  } catch(err) { return resp({ok:false,error:err.toString()}); }
  return resp({ok:true});
}

// ── Lấy tất cả bảng ──────────────────────────────
function getAllTables() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {ok:true};
  DB_TABLES.forEach(t => {
    const s = ss.getSheetByName('hrm_'+t);
    if (s &amp;&amp; s.getLastRow() &gt;= 2) {
      try { result[t] = JSON.parse(s.getRange(2,1).getValue()); }
      catch { result[t] = []; }
    } else { result[t] = []; }
  });
  return result;
}

// ── Lưu 1 bảng vào Sheet + Drive subfolder ────────
function saveTable(name, data) {
  if (!name || !DB_TABLES.includes(name)) return {ok:false,error:'Invalid table'};

  // Lưu vào Google Sheet (để đọc nhanh)
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('hrm_'+name);
  if (!sheet) { sheet = ss.insertSheet('hrm_'+name); sheet.getRange(1,1).setValue('json'); }
  sheet.getRange(2,1).setValue(JSON.stringify(data));

  // Backup JSON vào subfolder tương ứng trong Drive
  try {
    const folderName = TABLE_FOLDERS[name] || name;
    const subFolder  = getOrCreateFolder(FOLDER_ID, folderName);
    const fname      = 'hrm_'+name+'.json';
    const json       = JSON.stringify(data, null, 2);
    const files      = subFolder.getFilesByName(fname);
    if (files.hasNext()) files.next().setContent(json);
    else subFolder.createFile(fname, json, 'application/json');
  } catch(e) { console.log('Drive backup error', e); }

  return {ok:true};
}

// ── Danh sách form chờ xử lý ─────────────────────
function listPending() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() &lt; 2) return {ok:true,data:[]};
  const all = sheet.getDataRange().getValues();
  const headers = all[0];
  const stIdx = headers.indexOf(STATUS_COL);
  const data = [];
  for (let i = 1; i &lt; all.length; i++) {
    const row = all[i];
    const st  = stIdx &gt;= 0 ? row[stIdx] : '';
    if (st === 'accepted' || st === 'rejected') continue;
    const obj = {_row:i+1};
    headers.forEach((h,j) => { if(h !== STATUS_COL) obj[h] = row[j]; });
    data.push(obj);
  }
  return {ok:true,data};
}

// ── Cập nhật trạng thái form ──────────────────────
function setStatus(rowNum, status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  let col = headers.indexOf(STATUS_COL) + 1;
  if (!col) { col = headers.length+1; sheet.getRange(1,col).setValue(STATUS_COL); }
  sheet.getRange(rowNum,col).setValue(status);
  if (status === 'accepted') saveFormRowToDrive(rowNum, headers);
  return {ok:true};
}

// ── Lưu hồ sơ NLĐ vào subfolder riêng ───────────
function saveFormRowToDrive(rowNum, headers) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const row   = sheet.getRange(rowNum,1,1,headers.length).getValues()[0];
    const data  = {};
    headers.forEach((h,i) => { if(h !== STATUS_COL) data[h] = row[i]; });
    const name   = data['Họ và tên'] || ('HoSo_'+rowNum);
    const date   = new Date().toLocaleDateString('vi-VN').replace(/\\//g,'-');
    const folder = getOrCreateFolder(FOLDER_ID, INTAKE_FOLDER);
    folder.createFile(name+'_'+date+'.json',
      JSON.stringify(data,null,2), 'application/json');
  } catch(e) { console.log('Drive error',e); }
}

// ── Trigger form submit ───────────────────────────
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  let col = headers.indexOf(STATUS_COL) + 1;
  if (!col) { col = headers.length+1; sheet.getRange(1,col).setValue(STATUS_COL); }
  sheet.getRange(sheet.getLastRow(),col).setValue('pending');
}

function resp(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;
  },

  _copyGasCode() {
    const pre = document.getElementById('gasCode');
    if (!pre) return;
    const text = pre.innerText;
    navigator.clipboard.writeText(text).then(() => {
      Utils.toast('Đã copy code Apps Script!', 'success');
    }).catch(() => {
      Utils.toast('Copy thủ công: bôi đen đoạn code rồi Ctrl+C', 'info');
    });
  },

  _genToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const token = Array.from({length: 32}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const el = document.getElementById('sf_token');
    if (el) { el.value = token; Utils.toast('Đã tạo token ngẫu nhiên – nhớ cập nhật trong Apps Script!', 'warning'); }
  },

  _saveFormsConfig() {
    const url   = (document.getElementById('sf_url')?.value   || '').trim();
    const token = (document.getElementById('sf_token')?.value || '').trim();
    if (!url)   { Utils.toast('Vui lòng nhập URL Web App', 'error'); return; }
    if (!token) { Utils.toast('Vui lòng nhập token bảo mật', 'error'); return; }
    SettingsStore.set('forms_integration', { webAppUrl: url, token });
    Utils.toast('Đã lưu cấu hình kết nối Google Forms!', 'success');
    Settings.switchSection('forms');
  },

  _loadFromDrive() {
    Utils.toast('Đang tải dữ liệu từ Google Drive…', 'info');
    DB.loadFromDrive((ok, err) => {
      if (ok) {
        Utils.toast('Tải thành công! Dữ liệu đã được khôi phục từ Drive.', 'success');
        // Refresh trang hiện tại
        navigate(currentPage);
      } else {
        Utils.toast('Không tải được: ' + (err || 'Lỗi không xác định'), 'error');
      }
    });
  },

  _testFormsConn() {
    const cfg = SettingsStore.get('forms_integration');
    if (!cfg.webAppUrl) return;
    Utils.toast('Đang kiểm tra kết nối…', 'info');
    fetch(`${cfg.webAppUrl}?action=list&token=${encodeURIComponent(cfg.token||'')}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) Utils.toast(`Kết nối thành công! Có ${(d.data||[]).length} hồ sơ đang chờ.`, 'success');
        else Utils.toast('Lỗi: ' + d.error, 'error');
      })
      .catch(e => Utils.toast('Không kết nối được: ' + e.message, 'error'));
  },

  sectionNotif() {
    const s = SettingsStore.get('notif');
    const items = [
      {id:'leave',    label:'Thông báo khi có đơn nghỉ phép mới',   def:true},
      {id:'attend',   label:'Thông báo nhắc nhở chấm công',          def:true},
      {id:'payroll',  label:'Thông báo ngày phát lương',             def:true},
      {id:'birthday', label:'Thông báo sinh nhật nhân viên',         def:false},
      {id:'warranty', label:'Thông báo hết hạn bảo hành tài sản',   def:true},
      {id:'contract', label:'Thông báo hợp đồng sắp hết hạn',       def:true},
      {id:'email',    label:'Thông báo qua email',                   def:false},
    ];
    return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Cài đặt thông báo</span>
        <button class="btn btn-sm btn-primary" onclick="Settings._saveNotif()">
          <i class="fa-solid fa-save"></i> Lưu
        </button>
      </div>
      <div class="card-body">
        ${items.map(n=>{
          const checked = s[n.id] !== undefined ? s[n.id] : n.def;
          return `
          <div class="perm-toggle">
            <span>${n.label}</span>
            <label class="switch">
              <input type="checkbox" id="sn_${n.id}" ${checked?'checked':''} />
              <span class="slider"></span>
            </label>
          </div>`;
        }).join('')}
      </div>
    </div>`; },

  _saveNotif() {
    const keys = ['leave','attend','payroll','birthday','warranty','contract','email'];
    const d = {};
    keys.forEach(k => { const el = document.getElementById(`sn_${k}`); if(el) d[k] = el.checked; });
    SettingsStore.set('notif', d);
    Utils.toast('Đã lưu cài đặt thông báo!', 'success');
  },

  sectionSecurity() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Bảo mật tài khoản</span></div>
      <div class="card-body">
        <div class="form-group"><label class="form-label">Mật khẩu hiện tại</label>
          <input class="form-control" type="password" placeholder="••••••••" /></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Mật khẩu mới</label>
            <input class="form-control" type="password" placeholder="Tối thiểu 8 ký tự" /></div>
          <div class="form-group"><label class="form-label">Xác nhận mật khẩu</label>
            <input class="form-control" type="password" placeholder="Nhập lại mật khẩu" /></div>
        </div>
        <button class="btn btn-primary" onclick="Utils.toast('Đã đổi mật khẩu thành công!','success')">
          <i class="fa-solid fa-key"></i> Đổi mật khẩu
        </button>
        <hr class="divider" />
        <div style="font-size:14px;font-weight:600;margin-bottom:12px">Xác thực hai yếu tố (2FA)</div>
        <div class="perm-toggle">
          <span>Bật xác thực 2FA</span>
          <label class="switch"><input type="checkbox" onchange="Utils.toast('Cấu hình 2FA','info')" /><span class="slider"></span></label>
        </div>
        <hr class="divider" />
        <div style="font-size:14px;font-weight:600;margin-bottom:12px">Phiên đăng nhập</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">Các phiên đang hoạt động</div>
        ${[
          {device:'Chrome – Windows 11',ip:'203.162.xxx.xxx',time:'Hiện tại'},
          {device:'Safari – iPhone 15',ip:'203.162.xxx.yyy',time:'2 giờ trước'},
        ].map(s=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--bg);border-radius:8px;margin-bottom:6px">
            <div>
              <div style="font-size:13px;font-weight:600">${s.device}</div>
              <div style="font-size:11px;color:var(--text-muted)">${s.ip} • ${s.time}</div>
            </div>
            ${s.time!=='Hiện tại'?`<button class="btn btn-sm btn-danger" onclick="Utils.toast('Đã đăng xuất phiên','success')">Đăng xuất</button>`:'<span class="status-badge status-active">Đang dùng</span>'}
          </div>`).join('')}
      </div>
    </div>`; },

  sectionBackup() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Sao lưu & Khôi phục dữ liệu</span></div>
      <div class="card-body">
        <div style="background:var(--success-light);border-radius:10px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px">
          <i class="fa-solid fa-circle-check" style="color:var(--success);font-size:18px"></i>
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--success)">Sao lưu tự động đang hoạt động</div>
            <div style="font-size:12px;color:var(--success)">Lần sao lưu cuối: Hôm nay 03:00 AM</div>
          </div>
        </div>
        <div style="font-size:13px;font-weight:600;margin-bottom:12px">Lịch sử sao lưu</div>
        ${['Hôm nay 03:00','Hôm qua 03:00','26/03/2024 03:00','25/03/2024 03:00'].map((d,i)=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--bg);border-radius:8px;margin-bottom:6px">
            <div>
              <div style="font-size:13px;font-weight:600">Backup_${Utils.today()}_${i}.zip</div>
              <div style="font-size:11px;color:var(--text-muted)">${d} • ${(45+i*2).toFixed(1)} MB</div>
            </div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm btn-secondary" onclick="Utils.toast('Đang tải...','info')"><i class="fa-solid fa-download"></i></button>
              <button class="btn btn-sm btn-secondary" onclick="Utils.toast('Đang khôi phục...','warning')"><i class="fa-solid fa-rotate-left"></i></button>
            </div>
          </div>`).join('')}
        <hr class="divider" />
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" onclick="Utils.toast('Đang tạo bản sao lưu...','info');setTimeout(()=>Utils.toast('Sao lưu thành công!','success'),2000)">
            <i class="fa-solid fa-floppy-disk"></i> Sao lưu ngay
          </button>
          <button class="btn btn-secondary" onclick="Utils.toast('Chọn file để khôi phục','info')">
            <i class="fa-solid fa-upload"></i> Khôi phục từ file
          </button>
        </div>
      </div>
    </div>`; },
};
