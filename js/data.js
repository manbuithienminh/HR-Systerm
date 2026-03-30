/* ═══════════════════════════════════════════════════
   HRM PRO – DATA (trống – nhập dữ liệu thực tế)
═══════════════════════════════════════════════════ */

const DB = {

  /* ── DEPARTMENTS ── */
  departments: [],

  /* ── EMPLOYEES ── */
  employees: [],

  /* ── ATTENDANCE ── */
  attendance: [],

  /* ── LEAVE REQUESTS ── */
  leaves: [],

  /* ── PAYROLL ── */
  payroll: [],

  /* ── DOCUMENTS ── */
  documents: [],

  /* ── ASSETS ── */
  assets: [],

  /* ── ROLES & PERMISSIONS ── */
  roles: [],

  /* ── RECRUITMENT ── */
  recruitment: [],

  /* ── DOCUMENT TEMPLATES ── */
  docTemplates: [],

  /* ── PERSISTENCE ── */
  _dbKey: 'hrm_db',
  _tables: ['employees','departments','attendance','leaves','payroll','documents','assets','roles','recruitment','docTemplates'],

  /* Lưu 1 bảng vào localStorage + đồng bộ Drive */
  save(table) {
    // 1. localStorage (tức thì)
    try {
      const all = JSON.parse(localStorage.getItem(this._dbKey) || '{}');
      all[table] = this[table];
      localStorage.setItem(this._dbKey, JSON.stringify(all));
    } catch(e) { console.warn('DB.save localStorage error', e); }
    // 2. Drive (nền, fire-and-forget)
    const cfg = SettingsStore.get('forms_integration');
    if (cfg.webAppUrl) {
      if (typeof SyncUI !== 'undefined') SyncUI.show('syncing', 'Đang lưu Drive…');
      this._postToDrive({ action: 'saveTable', table, data: this[table] });
      // Optimistically show ok after 2s (fire-and-forget, no callback)
      setTimeout(() => { if (typeof SyncUI !== 'undefined') SyncUI.show('ok', 'Đã lưu Drive'); }, 2000);
    }
  },

  /* Tải tất cả từ localStorage khi khởi động */
  loadAll() {
    try {
      const all = JSON.parse(localStorage.getItem(this._dbKey) || '{}');
      this._tables.forEach(t => { if (Array.isArray(all[t])) this[t] = all[t]; });
    } catch(e) { console.warn('DB.loadAll error', e); }
  },

  /* Tải toàn bộ dữ liệu từ Drive (dùng khi đổi thiết bị / trình duyệt) */
  loadFromDrive(onDone) {
    const cfg = SettingsStore.get('forms_integration');
    if (!cfg.webAppUrl) { if (onDone) onDone(false, 'Chưa cấu hình Apps Script'); return; }
    const url = `${cfg.webAppUrl}?action=getAllTables&token=${encodeURIComponent(cfg.token || '')}`;
    fetch(url, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (!data.ok) throw new Error(data.error || 'Lỗi API');
        // Restore all DB tables
        this._tables.forEach(t => { if (Array.isArray(data[t])) this[t] = data[t]; });
        // Restore settings (company, profile, salary, leave, notif — NOT forms_integration)
        if (data.__settings__) SettingsStore.applyFromDrive(data.__settings__);
        // Update localStorage cache
        const all = {};
        this._tables.forEach(t => all[t] = this[t]);
        localStorage.setItem(this._dbKey, JSON.stringify(all));
        if (onDone) onDone(true);
      })
      .catch(e => { if (onDone) onDone(false, e.message); });
  },

  /* Gửi dữ liệu lên Drive qua hidden form (không bị CORS chặn) */
  _postToDrive(payload) {
    const cfg = SettingsStore.get('forms_integration');
    if (!cfg.webAppUrl || !cfg.token) return;
    try {
      // Tạo iframe ẩn để nhận response
      let iframe = document.getElementById('_hrm_drive_frame');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = iframe.name = '_hrm_drive_frame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }
      // Tạo form ẩn và submit
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = cfg.webAppUrl;
      form.target = '_hrm_drive_frame';
      form.style.display = 'none';
      const addField = (name, value) => {
        const inp = document.createElement('input');
        inp.type = 'hidden'; inp.name = name; inp.value = value;
        form.appendChild(inp);
      };
      addField('token', cfg.token);
      addField('payload', JSON.stringify(payload));
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch(e) { console.warn('DB._postToDrive error', e); }
  },
};

/* ══════════════════════════════════════════
   IMPORT TEMPLATE CONFIG
   Lưu cấu hình mẫu nhập liệu hàng loạt
══════════════════════════════════════════ */
const ImportConfig = {
  _key: 'hrm_import_template',

  defaults: [
    { id:'name',     label:'Họ và tên',      required:true,  enabled:true,  customLabel:'',  example:'Nguyễn Văn A'  },
    { id:'code',     label:'Mã nhân viên',   required:false, enabled:true,  customLabel:'',  example:'NV019'          },
    { id:'email',    label:'Email',           required:true,  enabled:true,  customLabel:'',  example:'nva@hrm.vn'    },
    { id:'phone',    label:'Điện thoại',      required:false, enabled:true,  customLabel:'',  example:'0901234567'    },
    { id:'dept',     label:'Phòng ban',       required:false, enabled:true,  customLabel:'',  example:'Kỹ thuật'      },
    { id:'pos',      label:'Chức vụ',         required:false, enabled:true,  customLabel:'',  example:'Lập trình viên'},
    { id:'dob',      label:'Ngày sinh',       required:false, enabled:true,  customLabel:'',  example:'1995-01-15'    },
    { id:'join',     label:'Ngày vào làm',    required:false, enabled:true,  customLabel:'',  example:'2024-04-01'    },
    { id:'salary',   label:'Lương cơ bản',    required:false, enabled:true,  customLabel:'',  example:'15000000'      },
    { id:'contract', label:'Loại hợp đồng',   required:false, enabled:false, customLabel:'',  example:'fulltime'      },
    { id:'gender',   label:'Giới tính',        required:false, enabled:false, customLabel:'',  example:'male'          },
    { id:'status',   label:'Trạng thái',       required:false, enabled:false, customLabel:'',  example:'active'        },
    { id:'address',  label:'Địa chỉ',          required:false, enabled:false, customLabel:'',  example:'TP.HCM'        },
  ],

  get fields() {
    try {
      const saved = localStorage.getItem(this._key);
      return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(this.defaults));
    } catch { return JSON.parse(JSON.stringify(this.defaults)); }
  },

  save(fields) {
    localStorage.setItem(this._key, JSON.stringify(fields));
  },

  reset() {
    localStorage.removeItem(this._key);
  },

  /* Trả về các cột đang bật */
  enabledFields() { return this.fields.filter(f => f.enabled); },

  /* Tiêu đề cột (ưu tiên customLabel) */
  colHeader(f) { return f.customLabel?.trim() || f.label; },

  /* Tạo nội dung CSV mẫu */
  buildCsv() {
    const fields = this.enabledFields();
    const header = fields.map(f => `"${this.colHeader(f)}"`).join(',');
    const example= fields.map(f => `"${f.example}"`).join(',');
    return '\uFEFF' + header + '\n' + example + '\n';
  },

  /* Map tên cột → field id (hỗ trợ cả label gốc và customLabel) */
  buildColMap(headerRow) {
    const map = {};
    const fields = this.fields;
    headerRow.forEach((col, idx) => {
      const clean = col.trim().replace(/^"|"$/g,'');
      const found = fields.find(f =>
        f.label === clean ||
        (f.customLabel && f.customLabel.trim() === clean)
      );
      if (found) map[idx] = found.id;
    });
    return map;
  },
};

/* ── Settings persistent store ── */
const SettingsStore = {
  _key: 'hrm_settings',
  get(section) {
    try { return JSON.parse(localStorage.getItem(this._key) || '{}')[section] || {}; }
    catch { return {}; }
  },
  getAll() {
    try { return JSON.parse(localStorage.getItem(this._key) || '{}'); }
    catch { return {}; }
  },
  set(section, data) {
    try {
      const all = JSON.parse(localStorage.getItem(this._key) || '{}');
      all[section] = Object.assign(all[section] || {}, data);
      localStorage.setItem(this._key, JSON.stringify(all));
      // Sync settings to Drive (except forms_integration itself to avoid circular)
      if (section !== 'forms_integration' && typeof DB !== 'undefined') {
        DB._postToDrive({ action: 'saveTable', table: '__settings__', data: all });
      }
    } catch {}
  },
  val(section, key, def) {
    const v = this.get(section)[key];
    return (v !== undefined && v !== null) ? v : def;
  },
  /* Apply settings fetched from Drive */
  applyFromDrive(obj) {
    try {
      if (!obj || typeof obj !== 'object') return;
      const cur = JSON.parse(localStorage.getItem(this._key) || '{}');
      // Merge: Drive wins for all sections except forms_integration (keep local)
      const localForms = cur.forms_integration;
      Object.assign(cur, obj);
      if (localForms && localForms.webAppUrl) cur.forms_integration = localForms;
      localStorage.setItem(this._key, JSON.stringify(cur));
    } catch {}
  },
};

/* ── Helper lookups ── */
DB.getEmp  = (id) => DB.employees.find(e => e.id === id);
DB.getDept = (id) => DB.departments.find(d => d.id === id);
DB.getDeptName = (id) => DB.departments.find(d => d.id === id)?.name || '—';
DB.formatMoney = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
DB.formatDate  = (s) => {
  if (!s) return '—';
  const [y,m,d] = s.split('-');
  return `${d}/${m}/${y}`;
};
