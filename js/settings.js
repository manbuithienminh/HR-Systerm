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
      case 'notif':    c.innerHTML = this.sectionNotif();    break;
      case 'security': c.innerHTML = this.sectionSecurity(); break;
      case 'backup':   c.innerHTML = this.sectionBackup();   break;
    }
  },

  sectionCompany() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Thông tin công ty</span></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
          <div style="width:80px;height:80px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;font-weight:800">H</div>
          <div>
            <div style="font-size:16px;font-weight:700">HRM Pro Corp</div>
            <div style="font-size:12px;color:var(--text-muted)">MST: 0123456789</div>
            <button class="btn btn-sm btn-secondary mt-8">Đổi logo</button>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Tên công ty</label>
            <input class="form-control" value="HRM Pro Corp" /></div>
          <div class="form-group"><label class="form-label">Mã số thuế</label>
            <input class="form-control" value="0123456789" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Email</label>
            <input class="form-control" value="contact@hrmpro.vn" /></div>
          <div class="form-group"><label class="form-label">Điện thoại</label>
            <input class="form-control" value="028 3823 0000" /></div>
        </div>
        <div class="form-group"><label class="form-label">Địa chỉ</label>
          <input class="form-control" value="123 Nguyễn Huệ, Q1, TP. Hồ Chí Minh" /></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Ngày thành lập</label>
            <input class="form-control" type="date" value="2015-03-15" /></div>
          <div class="form-group"><label class="form-label">Quy mô</label>
            <select class="form-control"><option>10–50 nhân viên</option><option selected>50–200 nhân viên</option><option>200–500 nhân viên</option></select></div>
        </div>
        <div style="text-align:right;margin-top:4px">
          <button class="btn btn-primary" onclick="Utils.toast('Đã lưu thông tin công ty!','success')">
            <i class="fa-solid fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>`; },

  sectionProfile() { const me = DB.getEmp(12); return `
    <div class="card">
      <div class="card-header"><span class="card-title">Hồ sơ cá nhân</span></div>
      <div class="card-body">
        <div style="text-align:center;margin-bottom:20px">
          <div class="user-avatar ${me.color}" style="width:80px;height:80px;font-size:26px;margin:0 auto 10px">${me.avatar}</div>
          <button class="btn btn-sm btn-secondary">Đổi ảnh đại diện</button>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Họ và tên</label>
            <input class="form-control" value="${me.name}" /></div>
          <div class="form-group"><label class="form-label">Email</label>
            <input class="form-control" value="${me.email}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Điện thoại</label>
            <input class="form-control" value="${me.phone}" /></div>
          <div class="form-group"><label class="form-label">Ngày sinh</label>
            <input class="form-control" type="date" value="${me.dob}" /></div>
        </div>
        <div style="text-align:right">
          <button class="btn btn-primary" onclick="Utils.toast('Đã cập nhật hồ sơ!','success')">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

  sectionSalary() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Cấu hình lương & Phụ cấp</span></div>
      <div class="card-body">
        ${[
          {label:'Lương tối thiểu vùng 1',val:'4,680,000đ'},
          {label:'Tỷ lệ đóng BHXH nhân viên',val:'8%'},
          {label:'Tỷ lệ đóng BHYT nhân viên',val:'1.5%'},
          {label:'Tỷ lệ đóng BHTN nhân viên',val:'1%'},
          {label:'Tỷ lệ đóng BHXH công ty',val:'17%'},
          {label:'Ngưỡng chịu thuế TNCN',val:'11,000,000đ / tháng'},
          {label:'Giảm trừ gia cảnh bản thân',val:'11,000,000đ'},
          {label:'Giảm trừ người phụ thuộc',val:'4,400,000đ / người'},
        ].map(r=>`
          <div class="perm-toggle">
            <span style="font-size:13px">${r.label}</span>
            <div style="display:flex;align-items:center;gap:8px">
              <input class="form-control" style="width:160px;text-align:right" value="${r.val}" />
            </div>
          </div>`).join('')}
        <div style="text-align:right;margin-top:16px">
          <button class="btn btn-primary" onclick="Utils.toast('Đã lưu cấu hình lương!','success')">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

  sectionLeave() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Chính sách nghỉ phép</span></div>
      <div class="card-body">
        ${[
          {label:'Nghỉ phép năm (toàn thời gian)',val:'12 ngày'},
          {label:'Nghỉ bệnh có lương',val:'30 ngày'},
          {label:'Nghỉ thai sản',val:'6 tháng'},
          {label:'Nghỉ hôn lễ',val:'3 ngày'},
          {label:'Nghỉ tang gia (thân nhân cấp 1)',val:'3 ngày'},
          {label:'Thử việc – nghỉ phép năm',val:'0 ngày (không tính)'},
        ].map(r=>`
          <div class="perm-toggle">
            <span>${r.label}</span>
            <input class="form-control" style="width:200px" value="${r.val}" />
          </div>`).join('')}
        <div style="text-align:right;margin-top:16px">
          <button class="btn btn-primary" onclick="Utils.toast('Đã lưu chính sách nghỉ phép!','success')">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

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

  sectionNotif() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Cài đặt thông báo</span></div>
      <div class="card-body">
        ${[
          {label:'Thông báo khi có đơn nghỉ phép mới',on:true},
          {label:'Thông báo nhắc nhở chấm công',on:true},
          {label:'Thông báo ngày phát lương',on:true},
          {label:'Thông báo sinh nhật nhân viên',on:false},
          {label:'Thông báo hết hạn bảo hành tài sản',on:true},
          {label:'Thông báo hợp đồng sắp hết hạn',on:true},
          {label:'Thông báo qua email',on:false},
        ].map(n=>`
          <div class="perm-toggle">
            <span>${n.label}</span>
            <label class="switch">
              <input type="checkbox" ${n.on?'checked':''} onchange="Utils.toast(this.checked?'Đã bật thông báo':'Đã tắt thông báo','info')" />
              <span class="slider"></span>
            </label>
          </div>`).join('')}
      </div>
    </div>`; },

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
