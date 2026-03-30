/* ═══════════════════════════════════════════════════
   HRM PRO – TIẾP NHẬN HỒ SƠ NLĐ (Google Forms)
═══════════════════════════════════════════════════ */

const Intake = {
  _submissions: [],
  _loading: false,

  /* Ánh xạ tên cột form → field hệ thống */
  _fieldMap: {
    name:     ['họ và tên','ho va ten','họ tên','ho ten','tên nhân viên','full name','name'],
    email:    ['email','e-mail','địa chỉ email'],
    phone:    ['điện thoại','dien thoai','số điện thoại','so dien thoai','phone','mobile'],
    dob:      ['ngày sinh','ngay sinh','date of birth','dob','sinh ngày'],
    dept:     ['phòng ban','phong ban','department','dept','bộ phận','bo phan'],
    pos:      ['chức vụ','chuc vu','vị trí','vi tri','position','chức danh'],
    address:  ['địa chỉ','dia chi','address','nơi ở'],
    gender:   ['giới tính','gioi tinh','gender'],
    join:     ['ngày vào làm','ngay vao lam','ngày ký hợp đồng','joining date','join date'],
    salary:   ['lương','luong','mức lương','muc luong','salary'],
    contract: ['loại hợp đồng','loai hop dong','contract type'],
    code:     ['mã nhân viên','ma nhan vien','employee code','mã nv'],
  },

  _autoMap(headers) {
    const result = {};
    headers.forEach(h => {
      const norm = h.toLowerCase().trim();
      for (const [field, variants] of Object.entries(this._fieldMap)) {
        if (variants.some(v => norm.includes(v) || v.includes(norm))) {
          result[h] = field;
          break;
        }
      }
    });
    return result;
  },

  _getConfig() {
    return SettingsStore.get('forms_integration');
  },

  render() {
    const cfg = this._getConfig();
    const content = document.getElementById('pageContent');

    if (!cfg.webAppUrl) {
      content.innerHTML = `
        <div class="page-header">
          <div class="page-header-left">
            <h1>Tiếp nhận hồ sơ NLĐ</h1>
            <p>Dữ liệu từ Google Forms → hệ thống</p>
          </div>
        </div>
        <div class="empty-state">
          <i class="fa-brands fa-google" style="font-size:48px;color:var(--primary);margin-bottom:16px"></i>
          <h3>Chưa cấu hình kết nối Google Forms</h3>
          <p>Vào <strong>Cài đặt → Tích hợp Google Forms</strong> để thiết lập kết nối.</p>
          <button class="btn btn-primary mt-16" onclick="navigate('settings');setTimeout(()=>Settings.switchSection('forms'),200)">
            <i class="fa-solid fa-gear"></i> Đến cài đặt
          </button>
        </div>`;
      return;
    }

    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Tiếp nhận hồ sơ NLĐ</h1>
          <p>Dữ liệu từ Google Forms – xem xét và tiếp nhận vào hệ thống</p>
        </div>
        <div class="page-header-right">
          <button class="btn btn-secondary" onclick="Intake._refresh()">
            <i class="fa-solid fa-rotate-right"></i> Làm mới
          </button>
        </div>
      </div>

      <div id="intakeBody">
        <div class="flex-center" style="height:200px"><div class="loading-spinner"></div></div>
      </div>`;

    this._refresh();
  },

  _refresh() {
    const cfg = this._getConfig();
    if (!cfg.webAppUrl) return;

    this._loading = true;
    const body = document.getElementById('intakeBody');
    if (body) body.innerHTML = `<div class="flex-center" style="height:200px"><div class="loading-spinner"></div></div>`;

    const url = `${cfg.webAppUrl}?action=list&token=${encodeURIComponent(cfg.token || '')}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (!data.ok) throw new Error(data.error || 'Lỗi API');
        this._submissions = data.data || [];
        this._renderList();
      })
      .catch(err => {
        const body = document.getElementById('intakeBody');
        if (body) body.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-triangle-exclamation text-danger" style="font-size:36px;margin-bottom:12px"></i>
            <h3>Không thể kết nối</h3>
            <p style="color:var(--danger)">${err.message}</p>
            <p style="font-size:12px;color:var(--text-muted);margin-top:8px">Kiểm tra lại URL Apps Script và token trong Cài đặt</p>
          </div>`;
      })
      .finally(() => { this._loading = false; });
  },

  _renderList() {
    const body = document.getElementById('intakeBody');
    if (!body) return;
    const subs = this._submissions;

    if (!subs.length) {
      body.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-inbox" style="font-size:40px;color:var(--text-muted);margin-bottom:12px"></i>
          <h3>Không có hồ sơ chờ xử lý</h3>
          <p>Khi nhân viên điền Google Form, hồ sơ sẽ xuất hiện tại đây.</p>
        </div>`;
      return;
    }

    // Lấy headers (bỏ các cột nội bộ)
    const skip = ['_row','_status','__hrm_status','__hrm_id','Dấu thời gian','Timestamp'];
    const sample = subs[0];
    const headers = Object.keys(sample).filter(k => !skip.includes(k));
    const autoMap = this._autoMap(headers);

    body.innerHTML = `
      <div style="margin-bottom:12px;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:13px;color:var(--text-muted)">
          <strong style="color:var(--warning)">${subs.length}</strong> hồ sơ đang chờ xem xét
        </span>
      </div>

      ${subs.map((sub, idx) => {
        const name = this._findFieldValue(sub, headers, autoMap, 'name') || `Hồ sơ #${sub._row}`;
        const email = this._findFieldValue(sub, headers, autoMap, 'email') || '';
        const phone = this._findFieldValue(sub, headers, autoMap, 'phone') || '';
        const dept  = this._findFieldValue(sub, headers, autoMap, 'dept') || '';
        const pos   = this._findFieldValue(sub, headers, autoMap, 'pos') || '';
        const initials = name.split(' ').slice(-2).map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'NV';
        const colors = ['gradient-indigo','gradient-purple','gradient-teal','gradient-green','gradient-orange','gradient-pink','gradient-blue'];
        const color = colors[idx % colors.length];

        return `
        <div class="card" style="margin-bottom:16px" id="intake_${sub._row}">
          <div class="card-header" style="cursor:pointer" onclick="Intake._toggle(${sub._row})">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="user-avatar ${color}" style="width:44px;height:44px;font-size:16px;flex-shrink:0">${initials}</div>
              <div>
                <div style="font-weight:700;font-size:15px">${name}</div>
                <div style="font-size:12px;color:var(--text-muted)">${[email,phone,dept,pos].filter(Boolean).join(' · ')}</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
              <span class="status-badge status-pending">Chờ xem xét</span>
              <i class="fa-solid fa-chevron-down" id="chevron_${sub._row}" style="color:var(--text-muted);transition:.2s"></i>
            </div>
          </div>
          <div id="detail_${sub._row}" style="display:none;border-top:1px solid var(--border)">
            <div style="padding:16px 20px">
              <!-- Toàn bộ các trường -->
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:20px">
                ${headers.filter(h => sub[h] !== undefined && sub[h] !== '').map(h => `
                  <div style="background:var(--bg);border-radius:8px;padding:10px 14px">
                    <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">
                      ${h}${autoMap[h] ? ' <span style="color:var(--primary)">→ '+autoMap[h]+'</span>' : ''}
                    </div>
                    <div style="font-size:13px;font-weight:500;color:var(--text-dark)">${sub[h] || '—'}</div>
                  </div>
                `).join('')}
              </div>
              <!-- Hành động -->
              <div style="display:flex;gap:10px;padding-top:12px;border-top:1px solid var(--border-light)">
                <button class="btn btn-success" onclick="Intake._accept(${sub._row})">
                  <i class="fa-solid fa-circle-check"></i> Tiếp nhận vào hệ thống
                </button>
                <button class="btn btn-danger" onclick="Intake._reject(${sub._row})">
                  <i class="fa-solid fa-circle-xmark"></i> Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('')}`;
  },

  _toggle(row) {
    const detail  = document.getElementById(`detail_${row}`);
    const chevron = document.getElementById(`chevron_${row}`);
    const open = detail.style.display === 'none';
    detail.style.display = open ? 'block' : 'none';
    if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : '';
  },

  _findFieldValue(sub, headers, autoMap, field) {
    const col = headers.find(h => autoMap[h] === field);
    return col ? (sub[col] || '') : '';
  },

  _buildEmployee(sub, headers, autoMap) {
    const get = (f) => this._findFieldValue(sub, headers, autoMap, f);

    // Avatar từ 2 chữ cuối tên
    const name = get('name') || '';
    const avatar = name.split(' ').slice(-2).map(w=>w[0]).join('').toUpperCase().slice(0,2) || 'NV';
    const colors = ['gradient-indigo','gradient-purple','gradient-teal','gradient-green','gradient-orange','gradient-pink','gradient-blue','gradient-orange'];

    // Tìm phòng ban theo tên
    const deptName = get('dept');
    const dept = deptName ? (DB.departments.find(d => d.name.toLowerCase().includes(deptName.toLowerCase()))?.id || null) : null;

    const nextId = (DB.employees.length ? Math.max(...DB.employees.map(e=>e.id)) : 0) + 1;
    const nextCode = 'NV' + String(nextId).padStart(3,'0');

    return {
      id:       nextId,
      code:     get('code') || nextCode,
      name:     name,
      dept:     dept,
      pos:      get('pos') || '',
      email:    get('email') || '',
      phone:    get('phone') || '',
      dob:      get('dob') || '',
      join:     get('join') || Utils.today(),
      status:   'active',
      salary:   parseFloat((get('salary') || '0').replace(/[^\d]/g,'')) || 0,
      contract: get('contract') || 'fulltime',
      gender:   this._normalizeGender(get('gender')),
      address:  get('address') || '',
      avatar:   avatar,
      color:    colors[nextId % colors.length],
    };
  },

  _normalizeGender(val) {
    if (!val) return '';
    const v = val.toLowerCase();
    if (v.includes('nam') || v.includes('male') || v === 'm') return 'male';
    if (v.includes('nữ') || v.includes('nu') || v.includes('female') || v === 'f') return 'female';
    return '';
  },

  _accept(row) {
    const sub = this._submissions.find(s => s._row === row);
    if (!sub) return;

    const skip = ['_row','_status','__hrm_status','__hrm_id','Dấu thời gian','Timestamp'];
    const headers = Object.keys(sub).filter(k => !skip.includes(k));
    const autoMap = this._autoMap(headers);
    const emp = this._buildEmployee(sub, headers, autoMap);

    Utils.openModal('Xác nhận tiếp nhận hồ sơ', `
      <div style="margin-bottom:16px">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">Thông tin nhân viên sẽ được tạo:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
          ${[
            ['Họ tên', emp.name],
            ['Mã NV',  emp.code],
            ['Email',  emp.email],
            ['ĐT',     emp.phone],
            ['Phòng ban', emp.dept ? DB.getDeptName(emp.dept) : (this._findFieldValue(sub,headers,autoMap,'dept')||'—')],
            ['Chức vụ', emp.pos],
            ['Ngày sinh', emp.dob || '—'],
            ['Ngày vào', emp.join],
          ].map(([l,v]) => `
            <div style="background:var(--bg);padding:8px 12px;border-radius:6px">
              <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase">${l}</div>
              <div style="font-weight:600">${v||'—'}</div>
            </div>`).join('')}
        </div>
        ${!emp.dept && this._findFieldValue(sub,headers,autoMap,'dept') ? `
          <div style="margin-top:10px;padding:8px 12px;background:#fff3cd;border-radius:6px;font-size:12px;color:#856404">
            <i class="fa-solid fa-triangle-exclamation"></i>
            Phòng ban "<strong>${this._findFieldValue(sub,headers,autoMap,'dept')}</strong>" chưa có trong hệ thống – sẽ để trống, bạn có thể cập nhật sau.
          </div>` : ''}
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Kiểm tra lại</button>
      <button class="btn btn-success" onclick="Intake._confirmAccept(${row})">
        <i class="fa-solid fa-circle-check"></i> Xác nhận tiếp nhận
      </button>
    `);
  },

  _confirmAccept(row) {
    const sub = this._submissions.find(s => s._row === row);
    if (!sub) return;

    const skip = ['_row','_status','__hrm_status','__hrm_id','Dấu thời gian','Timestamp'];
    const headers = Object.keys(sub).filter(k => !skip.includes(k));
    const autoMap = this._autoMap(headers);
    const emp = this._buildEmployee(sub, headers, autoMap);

    // Thêm vào DB
    DB.employees.push(emp);

    // Gọi Apps Script để đánh dấu đã tiếp nhận
    this._callApi({ action: 'accept', row });

    // Đóng modal, cập nhật giao diện
    Utils.closeModal();
    this._submissions = this._submissions.filter(s => s._row !== row);
    this._renderList();

    const body = document.getElementById('intakeBody');
    Utils.toast(`Đã tiếp nhận hồ sơ ${emp.name} vào hệ thống!`, 'success');
  },

  _reject(row) {
    Utils.confirm('Từ chối hồ sơ này?', () => {
      this._callApi({ action: 'reject', row });
      this._submissions = this._submissions.filter(s => s._row !== row);
      this._renderList();
      Utils.toast('Đã từ chối hồ sơ', 'success');
    });
  },

  _callApi(params) {
    const cfg = this._getConfig();
    if (!cfg.webAppUrl) return;
    const qs = Object.entries({...params, token: cfg.token || ''})
      .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    // Dùng GET để tránh CORS preflight
    fetch(`${cfg.webAppUrl}?${qs}`).catch(() => {});
  },
};
