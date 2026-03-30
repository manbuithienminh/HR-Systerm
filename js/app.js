/* ═══════════════════════════════════════════════════
   HRM PRO – APP ROUTER
═══════════════════════════════════════════════════ */

const pageTitles = {
  dashboard:   'Dashboard',
  employees:   'Quản lý nhân viên',
  intake:      'Tiếp nhận hồ sơ NLĐ',
  departments: 'Phòng ban',
  recruitment: 'Tuyển dụng',
  attendance:  'Chấm công',
  leave:       'Quản lý nghỉ phép',
  payroll:     'Tính lương',
  documents:   'Quản lý văn bản',
  records:     'Lưu trữ hồ sơ',
  assets:      'Tài sản & Thiết bị',
  permissions: 'Phân quyền',
  reports:     'Báo cáo',
  settings:    'Cài đặt',
};

const pageRenderers = {
  dashboard:   () => Dashboard.render(),
  employees:   () => Employees.render(),
  intake:      () => Intake.render(),
  departments: () => Departments.render(),
  recruitment: () => Recruitment.render(),
  attendance:  () => Attendance.render(),
  leave:       () => Leave.render(),
  payroll:     () => Payroll.render(),
  documents:   () => Documents.render(),
  records:     () => Records.render(),
  assets:      () => Assets.render(),
  permissions: () => Permissions.render(),
  reports:     () => Reports.render(),
  settings:    () => Settings.render(),
};

let currentPage = 'dashboard';

function navigate(page) {
  if (!pageRenderers[page]) return;
  currentPage = page;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Update title
  document.getElementById('pageTitle').textContent = pageTitles[page] || page;

  // Render content
  const content = document.getElementById('pageContent');
  content.innerHTML = `<div class="flex-center" style="height:200px"><div class="loading-spinner"></div></div>`;
  setTimeout(() => {
    try {
      pageRenderers[page]();
    } catch(e) {
      console.error('Page render error:', e);
      content.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-exclamation text-danger"></i><h3>Lỗi tải trang</h3><p>${e.message}</p></div>`;
    }
  }, 80);

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('mobile-open');
}

/* ── Sidebar collapse ── */
let sidebarCollapsed = false;
document.getElementById('sidebarToggle').onclick = () => {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
  document.getElementById('mainWrapper').classList.toggle('expanded', sidebarCollapsed);
};

/* ── Mobile toggle ── */
document.getElementById('mobileToggle').onclick = () => {
  document.getElementById('sidebar').classList.toggle('mobile-open');
};

/* ── Nav click ── */
document.querySelectorAll('.nav-item[data-page]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); navigate(el.dataset.page); });
});

/* ── Quick action helper ── */
function quickNav(page) { navigate(page); }

/* ── Global search ── */
document.getElementById('globalSearch').addEventListener('input', Utils.debounce(function() {
  const q = this.value.trim();
  if (!q) return;
  // Simple: find employees by name
  const found = DB.employees.filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  if (found.length) {
    navigate('employees');
  }
}, 400));

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  DB.loadAll();
  Settings.syncSidebar();
  navigate('dashboard');
});
