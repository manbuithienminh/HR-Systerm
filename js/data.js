/* ═══════════════════════════════════════════════════
   HRM PRO – MOCK DATA
═══════════════════════════════════════════════════ */

const DB = {

  /* ── DEPARTMENTS ── */
  departments: [
    { id: 1, name: 'Kỹ thuật', code: 'TECH', manager: 1, headcount: 18, budget: 2500000000, color: 'gradient-indigo' },
    { id: 2, name: 'Kinh doanh', code: 'SALE', manager: 5, headcount: 12, budget: 1800000000, color: 'gradient-green' },
    { id: 3, name: 'Marketing', code: 'MKT',  manager: 9, headcount: 8,  budget: 1200000000, color: 'gradient-pink' },
    { id: 4, name: 'Nhân sự',  code: 'HR',   manager: 12, headcount: 5, budget: 800000000,  color: 'gradient-orange' },
    { id: 5, name: 'Kế toán',  code: 'ACC',  manager: 15, headcount: 6, budget: 900000000,  color: 'gradient-teal' },
    { id: 6, name: 'Ban giám đốc', code: 'BOD', manager: 18, headcount: 3, budget: 500000000, color: 'gradient-purple' },
  ],

  /* ── EMPLOYEES ── */
  employees: [
    { id: 1,  code:'NV001', name:'Nguyễn Văn An',    dept:1, pos:'Trưởng phòng KT', email:'an.nv@hrm.vn',    phone:'0901234001', dob:'1988-03-15', join:'2019-01-10', status:'active',   salary:28000000, contract:'fulltime',  gender:'male',   address:'12 Lý Tự Trọng, Q1, TP.HCM',  avatar:'NA', color:'gradient-indigo' },
    { id: 2,  code:'NV002', name:'Trần Thị Bích',    dept:1, pos:'Lập trình viên Senior', email:'bich.tt@hrm.vn', phone:'0901234002', dob:'1993-07-22', join:'2020-03-15', status:'active',   salary:22000000, contract:'fulltime',  gender:'female', address:'45 Nguyễn Huệ, Q1, TP.HCM',   avatar:'TB', color:'gradient-purple' },
    { id: 3,  code:'NV003', name:'Lê Minh Cường',   dept:1, pos:'Lập trình viên',        email:'cuong.lm@hrm.vn',phone:'0901234003', dob:'1995-12-01', join:'2021-06-01', status:'active',   salary:18000000, contract:'fulltime',  gender:'male',   address:'78 Bùi Viện, Q1, TP.HCM',    avatar:'LC', color:'gradient-blue' },
    { id: 4,  code:'NV004', name:'Phạm Thu Hà',     dept:1, pos:'QA Engineer',           email:'ha.pt@hrm.vn',   phone:'0901234004', dob:'1996-04-18', join:'2021-09-01', status:'active',   salary:16000000, contract:'fulltime',  gender:'female', address:'23 Trần Hưng Đạo, Q5, TP.HCM',avatar:'PH', color:'gradient-teal' },
    { id: 5,  code:'NV005', name:'Đỗ Quang Hùng',   dept:2, pos:'Giám đốc Kinh doanh',  email:'hung.dq@hrm.vn', phone:'0901234005', dob:'1985-09-30', join:'2018-05-20', status:'active',   salary:35000000, contract:'fulltime',  gender:'male',   address:'56 Pasteur, Q3, TP.HCM',     avatar:'DH', color:'gradient-orange' },
    { id: 6,  code:'NV006', name:'Nguyễn Thị Lan',  dept:2, pos:'Chuyên viên Kinh doanh',email:'lan.nt@hrm.vn',  phone:'0901234006', dob:'1994-11-05', join:'2020-08-10', status:'active',   salary:14000000, contract:'fulltime',  gender:'female', address:'90 Hai Bà Trưng, Q3, TP.HCM', avatar:'NL', color:'gradient-green' },
    { id: 7,  code:'NV007', name:'Vũ Đức Thắng',    dept:2, pos:'Chuyên viên Kinh doanh',email:'thang.vd@hrm.vn',phone:'0901234007', dob:'1992-06-14', join:'2019-11-01', status:'active',   salary:15000000, contract:'fulltime',  gender:'male',   address:'34 Điện Biên Phủ, Q3, TP.HCM',avatar:'VT', color:'gradient-blue' },
    { id: 8,  code:'NV008', name:'Bùi Thị Mai',     dept:2, pos:'Nhân viên Kinh doanh',  email:'mai.bt@hrm.vn',  phone:'0901234008', dob:'1997-02-28', join:'2022-02-15', status:'inactive', salary:12000000, contract:'probation', gender:'female', address:'67 Nguyễn Trãi, Q5, TP.HCM',  avatar:'BM', color:'gradient-pink' },
    { id: 9,  code:'NV009', name:'Trần Hoàng Nam',  dept:3, pos:'Trưởng phòng Marketing',email:'nam.th@hrm.vn',  phone:'0901234009', dob:'1987-08-12', join:'2018-09-01', status:'active',   salary:26000000, contract:'fulltime',  gender:'male',   address:'12 Nguyễn Đình Chiểu, Q3',   avatar:'TN', color:'gradient-purple' },
    { id: 10, code:'NV010', name:'Lý Thị Oanh',     dept:3, pos:'Chuyên viên Marketing', email:'oanh.lt@hrm.vn', phone:'0901234010', dob:'1995-01-20', join:'2021-01-05', status:'active',   salary:15000000, contract:'fulltime',  gender:'female', address:'23 Cách Mạng T8, Q10, TP.HCM', avatar:'LO', color:'gradient-pink' },
    { id: 11, code:'NV011', name:'Đinh Văn Phúc',   dept:3, pos:'Designer',              email:'phuc.dv@hrm.vn', phone:'0901234011', dob:'1998-05-16', join:'2022-04-01', status:'active',   salary:14000000, contract:'fulltime',  gender:'male',   address:'89 Lê Đại Hành, Q11, TP.HCM', avatar:'DP', color:'gradient-orange' },
    { id: 12, code:'NV012', name:'Hoàng Thị Quỳnh', dept:4, pos:'Trưởng phòng Nhân sự', email:'quynh.ht@hrm.vn',phone:'0901234012', dob:'1986-10-07', join:'2017-03-01', status:'active',   salary:24000000, contract:'fulltime',  gender:'female', address:'45 Lý Thường Kiệt, Q10, TP.HCM',avatar:'HQ',color:'gradient-teal' },
    { id: 13, code:'NV013', name:'Ngô Văn Sơn',     dept:4, pos:'Chuyên viên Nhân sự',  email:'son.nv@hrm.vn',  phone:'0901234013', dob:'1993-03-25', join:'2019-07-15', status:'active',   salary:14000000, contract:'fulltime',  gender:'male',   address:'56 Bùi Hữu Nghĩa, BT, TP.HCM', avatar:'NS', color:'gradient-indigo' },
    { id: 14, code:'NV014', name:'Dương Thị Trang',  dept:4, pos:'Nhân viên Hành chính', email:'trang.dt@hrm.vn',phone:'0901234014', dob:'1996-09-11', join:'2021-10-01', status:'active',   salary:11000000, contract:'fulltime',  gender:'female', address:'78 Phan Đình Phùng, PN, TP.HCM', avatar:'DT', color:'gradient-green' },
    { id: 15, code:'NV015', name:'Trịnh Văn Tuấn',  dept:5, pos:'Kế toán trưởng',       email:'tuan.tv@hrm.vn', phone:'0901234015', dob:'1984-12-30', join:'2016-08-01', status:'active',   salary:27000000, contract:'fulltime',  gender:'male',   address:'90 Hoàng Văn Thụ, PN, TP.HCM', avatar:'TT', color:'gradient-blue' },
    { id: 16, code:'NV016', name:'Phan Thị Uyên',   dept:5, pos:'Kế toán viên',          email:'uyen.pt@hrm.vn', phone:'0901234016', dob:'1994-07-04', join:'2020-01-20', status:'active',   salary:14000000, contract:'fulltime',  gender:'female', address:'34 Nơ Trang Long, BT, TP.HCM', avatar:'PU', color:'gradient-purple' },
    { id: 17, code:'NV017', name:'Lê Xuân Việt',    dept:5, pos:'Kế toán viên',          email:'viet.lx@hrm.vn', phone:'0901234017', dob:'1997-04-22', join:'2022-06-01', status:'active',   salary:13000000, contract:'probation', gender:'male',   address:'12 Đinh Tiên Hoàng, BT, TP.HCM', avatar:'LV', color:'gradient-red' },
    { id: 18, code:'NV018', name:'Mai Văn Xuân',    dept:6, pos:'Tổng Giám đốc',         email:'xuan.mv@hrm.vn', phone:'0901234018', dob:'1975-11-15', join:'2010-01-01', status:'active',   salary:80000000, contract:'fulltime',  gender:'male',   address:'56 Võ Văn Tần, Q3, TP.HCM',  avatar:'MX', color:'gradient-orange' },
  ],

  /* ── ATTENDANCE (current month) ── */
  attendance: (() => {
    const records = [];
    const today = new Date();
    const y = today.getFullYear(), m = today.getMonth();
    const daysInMonth = new Date(y, m+1, 0).getDate();
    const statuses = ['present','present','present','present','late','absent','leave','present'];
    let id = 1;
    for (let empId = 1; empId <= 18; empId++) {
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(y, m, d);
        const dow = dt.getDay();
        if (dow === 0 || dow === 6) continue;
        if (dt > today) continue;
        const st = statuses[Math.floor(Math.random() * statuses.length)];
        const inH = st === 'present' ? 8 : st === 'late' ? 9 : null;
        records.push({
          id: id++,
          empId,
          date: `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,
          checkIn:  inH  ? `${inH}:${String(Math.floor(Math.random()*30)).padStart(2,'0')}` : null,
          checkOut: inH  ? `${17 + Math.floor(Math.random()*2)}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}` : null,
          status: (dow===0||dow===6) ? 'weekend' : st,
        });
      }
    }
    return records;
  })(),

  /* ── LEAVE REQUESTS ── */
  leaves: [
    { id:1,  empId:3,  type:'Nghỉ phép năm',   from:'2024-03-10', to:'2024-03-12', days:3, reason:'Du lịch gia đình',  status:'approved', approver:12 },
    { id:2,  empId:8,  type:'Nghỉ bệnh',       from:'2024-03-18', to:'2024-03-19', days:2, reason:'Ốm sốt',           status:'approved', approver:5  },
    { id:3,  empId:11, type:'Nghỉ việc riêng',  from:'2024-03-25', to:'2024-03-25', days:1, reason:'Công việc cá nhân',status:'pending',  approver:9  },
    { id:4,  empId:14, type:'Nghỉ phép năm',   from:'2024-04-01', to:'2024-04-03', days:3, reason:'Nghỉ lễ',          status:'pending',  approver:12 },
    { id:5,  empId:6,  type:'Nghỉ bệnh',       from:'2024-03-05', to:'2024-03-05', days:1, reason:'Khám sức khỏe',    status:'approved', approver:5  },
    { id:6,  empId:16, type:'Nghỉ thai sản',   from:'2024-04-15', to:'2024-10-15', days:182,'reason':'Thai sản',      status:'approved', approver:12 },
    { id:7,  empId:4,  type:'Nghỉ việc riêng',  from:'2024-03-28', to:'2024-03-28', days:1, reason:'Công việc cá nhân',status:'rejected', approver:1  },
    { id:8,  empId:17, type:'Nghỉ phép năm',   from:'2024-04-05', to:'2024-04-07', days:3, reason:'Nghỉ hè',          status:'pending',  approver:15 },
  ],

  /* ── PAYROLL ── */
  payroll: (() => {
    const months = ['2024-01','2024-02','2024-03'];
    const result = [];
    let id = 1;
    DB_EMPLOYEES_REF.forEach(emp => {
      months.forEach(mon => {
        const base = emp.salary;
        const allowances = Math.round(base * 0.15);
        const overtime   = Math.round(base * (Math.random() > 0.6 ? 0.1 : 0));
        const insurance  = Math.round(base * 0.105);
        const tax        = Math.round((base + allowances + overtime - insurance) * 0.1);
        const net        = base + allowances + overtime - insurance - tax;
        result.push({
          id: id++,
          empId: emp.id,
          month: mon,
          baseSalary: base,
          allowances,
          overtime,
          insurance,
          tax,
          netSalary: net,
          status: mon === '2024-03' ? 'pending' : 'paid',
          paidDate: mon !== '2024-03' ? `${mon}-28` : null,
        });
      });
    });
    return result;
  }),

  /* ── DOCUMENTS ── */
  documents: [
    { id:1,  code:'VB001', title:'Quyết định bổ nhiệm Trưởng phòng KT', type:'Quyết định',    author:18, date:'2024-01-05', dept:1,  status:'active',  tags:['bổ nhiệm','kỹ thuật'] },
    { id:2,  code:'VB002', title:'Thông báo nghỉ Tết Nguyên Đán 2024',   type:'Thông báo',     author:12, date:'2024-01-20', dept:0,  status:'active',  tags:['nghỉ lễ','thông báo'] },
    { id:3,  code:'VB003', title:'Quy chế lương thưởng năm 2024',         type:'Quy chế',       author:18, date:'2024-02-01', dept:0,  status:'active',  tags:['lương','thưởng'] },
    { id:4,  code:'VB004', title:'Hợp đồng lao động NV017 – Lê Xuân Việt',type:'Hợp đồng',     author:12, date:'2024-02-15', dept:5,  status:'active',  tags:['hợp đồng','kế toán'] },
    { id:5,  code:'VB005', title:'Biên bản họp Q1/2024 phòng Kinh doanh', type:'Biên bản',      author:5,  date:'2024-03-02', dept:2,  status:'active',  tags:['họp','kinh doanh'] },
    { id:6,  code:'VB006', title:'Thư nhắc nhở – NV008 Bùi Thị Mai',     type:'Thư nhắc nhở', author:12, date:'2024-03-10', dept:2,  status:'active',  tags:['nhắc nhở','kỷ luật'] },
    { id:7,  code:'VB007', title:'Kế hoạch tuyển dụng Q2/2024',           type:'Kế hoạch',      author:12, date:'2024-03-15', dept:4,  status:'draft',   tags:['tuyển dụng','kế hoạch'] },
    { id:8,  code:'VB008', title:'Báo cáo kết quả kinh doanh T2/2024',    type:'Báo cáo',       author:5,  date:'2024-03-18', dept:2,  status:'active',  tags:['báo cáo','kinh doanh'] },
    { id:9,  code:'VB009', title:'Đề xuất tăng lương NV002 Trần Thị Bích',type:'Đề xuất',       author:1,  date:'2024-03-20', dept:1,  status:'pending', tags:['tăng lương','đề xuất'] },
    { id:10, code:'VB010', title:'Hướng dẫn onboarding nhân viên mới',    type:'Hướng dẫn',    author:12, date:'2024-03-22', dept:4,  status:'active',  tags:['onboarding','hướng dẫn'] },
  ],

  /* ── ASSETS ── */
  assets: [
    { id:1,  code:'TS001', name:'MacBook Pro 14"',      category:'Máy tính',   assignedTo:1,  purchase:'2023-01-10', value:45000000, status:'in_use',    sn:'MBP-2023-001', warranty:'2026-01-10' },
    { id:2,  code:'TS002', name:'MacBook Pro 14"',      category:'Máy tính',   assignedTo:2,  purchase:'2023-03-15', value:45000000, status:'in_use',    sn:'MBP-2023-002', warranty:'2026-03-15' },
    { id:3,  code:'TS003', name:'Dell XPS 15',          category:'Máy tính',   assignedTo:5,  purchase:'2022-06-01', value:38000000, status:'in_use',    sn:'DELL-2022-001', warranty:'2025-06-01' },
    { id:4,  code:'TS004', name:'iPhone 15 Pro',        category:'Điện thoại', assignedTo:5,  purchase:'2023-10-01', value:28000000, status:'in_use',    sn:'IP15-2023-001', warranty:'2025-10-01' },
    { id:5,  code:'TS005', name:'Màn hình LG 27"',      category:'Thiết bị',   assignedTo:3,  purchase:'2022-04-10', value:8500000,  status:'in_use',    sn:'LG27-2022-001', warranty:'2025-04-10' },
    { id:6,  code:'TS006', name:'Màn hình LG 27"',      category:'Thiết bị',   assignedTo:4,  purchase:'2022-04-10', value:8500000,  status:'in_use',    sn:'LG27-2022-002', warranty:'2025-04-10' },
    { id:7,  code:'TS007', name:'Máy in HP LaserJet',   category:'Văn phòng',  assignedTo:null,purchase:'2021-08-01',value:12000000, status:'available',  sn:'HP-LJ-2021-001',warranty:'2024-08-01' },
    { id:8,  code:'TS008', name:'iPad Pro 12.9"',       category:'Máy tính',   assignedTo:9,  purchase:'2023-05-15', value:22000000, status:'in_use',    sn:'IPAD-2023-001', warranty:'2025-05-15' },
    { id:9,  code:'TS009', name:'ThinkPad E15',         category:'Máy tính',   assignedTo:null,purchase:'2023-07-01',value:20000000, status:'available',  sn:'TP-E15-2023-001',warranty:'2026-07-01' },
    { id:10, code:'TS010', name:'Bàn làm việc đứng',    category:'Nội thất',   assignedTo:1,  purchase:'2022-11-01', value:5500000,  status:'in_use',    sn:'DESK-2022-001', warranty:'2027-11-01' },
    { id:11, code:'TS011', name:'Camera Sony A7 IV',    category:'Thiết bị',   assignedTo:10, purchase:'2023-02-20', value:65000000, status:'in_use',    sn:'SONY-A7-2023-001',warranty:'2026-02-20' },
    { id:12, code:'TS012', name:'Surface Pro 9',        category:'Máy tính',   assignedTo:null,purchase:'2022-09-15',value:32000000, status:'maintenance',sn:'SP9-2022-001',   warranty:'2025-09-15' },
  ],

  /* ── ROLES & PERMISSIONS ── */
  roles: [
    {
      id:1, name:'Super Admin', icon:'fa-crown', color:'gradient-orange',
      desc:'Toàn quyền hệ thống',
      users: [18],
      permissions: {
        'Quản lý nhân viên':['Xem','Thêm','Sửa','Xóa'],
        'Chấm công':['Xem','Sửa','Duyệt'],
        'Tính lương':['Xem','Sửa','Xuất phiếu'],
        'Văn bản':['Xem','Tạo','Sửa','Xóa'],
        'Tài sản':['Xem','Thêm','Sửa','Xóa'],
        'Báo cáo':['Xem','Xuất'],
        'Cài đặt':['Xem','Sửa'],
        'Phân quyền':['Xem','Sửa'],
      }
    },
    {
      id:2, name:'HR Manager', icon:'fa-user-tie', color:'gradient-purple',
      desc:'Quản lý nhân sự & hành chính',
      users: [12],
      permissions: {
        'Quản lý nhân viên':['Xem','Thêm','Sửa'],
        'Chấm công':['Xem','Sửa','Duyệt'],
        'Tính lương':['Xem'],
        'Văn bản':['Xem','Tạo','Sửa'],
        'Tài sản':['Xem','Thêm','Sửa'],
        'Báo cáo':['Xem','Xuất'],
        'Cài đặt':['Xem'],
        'Phân quyền':['Xem'],
      }
    },
    {
      id:3, name:'Department Manager', icon:'fa-briefcase', color:'gradient-blue',
      desc:'Quản lý phòng ban',
      users: [1,5,9,15],
      permissions: {
        'Quản lý nhân viên':['Xem'],
        'Chấm công':['Xem','Duyệt'],
        'Tính lương':['Xem'],
        'Văn bản':['Xem','Tạo'],
        'Tài sản':['Xem'],
        'Báo cáo':['Xem'],
        'Cài đặt':[],
        'Phân quyền':[],
      }
    },
    {
      id:4, name:'Employee', icon:'fa-user', color:'gradient-green',
      desc:'Nhân viên thông thường',
      users: [2,3,4,6,7,8,10,11,13,14,16,17],
      permissions: {
        'Quản lý nhân viên':['Xem'],
        'Chấm công':['Xem'],
        'Tính lương':['Xem phiếu lương cá nhân'],
        'Văn bản':['Xem'],
        'Tài sản':['Xem tài sản cá nhân'],
        'Báo cáo':[],
        'Cài đặt':[],
        'Phân quyền':[],
      }
    },
    {
      id:5, name:'Accountant', icon:'fa-calculator', color:'gradient-teal',
      desc:'Kế toán – tính lương, tài chính',
      users: [15,16,17],
      permissions: {
        'Quản lý nhân viên':['Xem'],
        'Chấm công':['Xem'],
        'Tính lương':['Xem','Sửa','Xuất phiếu'],
        'Văn bản':['Xem'],
        'Tài sản':['Xem'],
        'Báo cáo':['Xem','Xuất'],
        'Cài đặt':[],
        'Phân quyền':[],
      }
    },
  ],

  /* ── RECRUITMENT ── */
  recruitment: [
    { id:1, title:'Senior Backend Developer', dept:1, count:2, deadline:'2024-04-30', status:'open',   applicants:24, salary:'25-35tr' },
    { id:2, title:'Sales Executive',          dept:2, count:3, deadline:'2024-04-15', status:'open',   applicants:31, salary:'12-18tr' },
    { id:3, title:'UI/UX Designer',           dept:3, count:1, deadline:'2024-04-20', status:'open',   applicants:15, salary:'15-22tr' },
    { id:4, title:'HR Specialist',            dept:4, count:1, deadline:'2024-03-31', status:'closed', applicants:18, salary:'12-16tr' },
    { id:5, title:'Junior Frontend Developer',dept:1, count:2, deadline:'2024-05-15', status:'open',   applicants:42, salary:'15-20tr' },
    { id:6, title:'Marketing Executive',      dept:3, count:2, deadline:'2024-04-25', status:'open',   applicants:27, salary:'12-17tr' },
  ],
};

// Fix forward reference for payroll
const DB_EMPLOYEES_REF = [
  { id:1, salary:28000000 }, { id:2, salary:22000000 }, { id:3, salary:18000000 },
  { id:4, salary:16000000 }, { id:5, salary:35000000 }, { id:6, salary:14000000 },
  { id:7, salary:15000000 }, { id:8, salary:12000000 }, { id:9, salary:26000000 },
  { id:10,salary:15000000 }, { id:11,salary:14000000 }, { id:12,salary:24000000 },
  { id:13,salary:14000000 }, { id:14,salary:11000000 }, { id:15,salary:27000000 },
  { id:16,salary:14000000 }, { id:17,salary:13000000 }, { id:18,salary:80000000 },
];

// Resolve payroll lazy evaluation
DB.payroll = DB.payroll();

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
