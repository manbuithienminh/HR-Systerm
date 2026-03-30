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

  /* ── PERSISTENCE ── */
  _dbKey: 'hrm_db',
  _tables: ['employees','departments','attendance','leaves','payroll','documents','assets','roles','recruitment'],

  save(table) {
    try {
      const all = JSON.parse(localStorage.getItem(this._dbKey) || '{}');
      all[table] = this[table];
      localStorage.setItem(this._dbKey, JSON.stringify(all));
    } catch(e) { console.warn('DB.save error', e); }
  },

  loadAll() {
    try {
      const all = JSON.parse(localStorage.getItem(this._dbKey) || '{}');
      this._tables.forEach(t => { if (Array.isArray(all[t])) this[t] = all[t]; });
    } catch(e) { console.warn('DB.loadAll error', e); }
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
  set(section, data) {
    try {
      const all = JSON.parse(localStorage.getItem(this._key) || '{}');
      all[section] = Object.assign(all[section] || {}, data);
      localStorage.setItem(this._key, JSON.stringify(all));
    } catch {}
  },
  val(section, key, def) {
    const v = this.get(section)[key];
    return (v !== undefined && v !== null) ? v : def;
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
