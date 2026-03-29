/* ═══════════════════════════════════════════════════
   HRM PRO – PAYROLL
═══════════════════════════════════════════════════ */

const Payroll = {
  selectedMonth: '2024-03',
  page: 1,
  perPage: 10,

  render() {
    const content = document.getElementById('pageContent');
    const months = [...new Set(DB.payroll.map(p=>p.month))].sort().reverse();

    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Tính lương</h1>
          <p>Quản lý và tính toán lương cho nhân viên</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" onclick="Payroll.exportPayroll()">
            <i class="fa-solid fa-file-export"></i> Xuất bảng lương
          </button>
          <button class="btn btn-success" onclick="Payroll.payAll()">
            <i class="fa-solid fa-money-bill-wave"></i> Phát lương tất cả
          </button>
        </div>
      </div>

      <!-- MONTH SELECTOR -->
      <div class="card mb-20">
        <div class="card-body" style="padding:14px 20px">
          <div class="toolbar">
            <div class="toolbar-left" style="gap:12px">
              <div style="font-size:13px;font-weight:600;color:var(--text-muted)">Chọn tháng:</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${months.map(m=>`
                  <button class="btn btn-sm ${this.selectedMonth===m?'btn-primary':'btn-secondary'}"
                    onclick="Payroll.selectMonth('${m}')">${Utils.fmtMonth(m)}</button>`).join('')}
              </div>
            </div>
            <div class="toolbar-right">
              <span style="font-size:13px;color:var(--text-muted)">
                Tổng quỹ lương: <strong style="color:var(--primary)">${this.getTotalForMonth()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- SUMMARY CARDS -->
      <div class="stat-grid mb-24" id="payrollSummary">
        ${this.renderSummaryCards()}
      </div>

      <!-- PAYROLL TABLE -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">
            <i class="fa-solid fa-table text-primary"></i>
            Bảng lương ${Utils.fmtMonth(this.selectedMonth)}
          </span>
          <div class="search-input">
            <i class="fa-solid fa-search"></i>
            <input type="text" placeholder="Tìm nhân viên..." oninput="Payroll.search(this.value)" />
          </div>
        </div>
        <div id="payrollTable"></div>
        <div id="payrollPagination" class="pagination" style="border-top:1px solid var(--border-light)"></div>
      </div>
    `;
    this.renderTable();
  },

  getTotalForMonth() {
    return Utils.money(DB.payroll.filter(p=>p.month===this.selectedMonth).reduce((s,p)=>s+p.netSalary,0));
  },

  renderSummaryCards() {
    const list = DB.payroll.filter(p=>p.month===this.selectedMonth);
    const totalBase = list.reduce((s,p)=>s+p.baseSalary,0);
    const totalNet  = list.reduce((s,p)=>s+p.netSalary,0);
    const totalTax  = list.reduce((s,p)=>s+p.tax,0);
    const paidCount = list.filter(p=>p.status==='paid').length;
    return `
      <div class="stat-card">
        <div class="stat-icon gradient-blue"><i class="fa-solid fa-coins" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value" style="font-size:18px">${Utils.money(totalBase)}</div><div class="stat-label">Tổng lương cơ bản</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-green"><i class="fa-solid fa-money-bill-wave" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value" style="font-size:18px">${Utils.money(totalNet)}</div><div class="stat-label">Tổng lương thực nhận</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-orange"><i class="fa-solid fa-receipt" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value" style="font-size:18px">${Utils.money(totalTax)}</div><div class="stat-label">Tổng thuế TNCN</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-purple"><i class="fa-solid fa-check-circle" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${paidCount}/${list.length}</div><div class="stat-label">Đã phát lương</div></div>
      </div>`;
  },

  _filtered: null,

  getFiltered(q = '') {
    let list = DB.payroll.filter(p=>p.month===this.selectedMonth);
    if (q) list = list.filter(p=>{
      const e=DB.getEmp(p.empId);
      return e?.name.toLowerCase().includes(q);
    });
    return list;
  },

  renderTable(q = '') {
    const filtered = this.getFiltered(q);
    const paged = Utils.paginate(filtered, this.page, this.perPage);

    document.getElementById('payrollTable').innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nhân viên</th><th>Phòng ban</th><th>Lương cơ bản</th>
              <th>Phụ cấp</th><th>OT</th><th>BHXH</th><th>Thuế</th>
              <th>Thực nhận</th><th>Trạng thái</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${paged.items.map(p => this.tableRow(p)).join('')}
          </tbody>
        </table>
      </div>`;
    Utils.renderPagination('payrollPagination', paged, 'Payroll.goPage');
  },

  tableRow(p) {
    const emp  = DB.getEmp(p.empId);
    const dept = DB.getDeptName(emp?.dept);
    return `
      <tr>
        <td>
          <div class="emp-cell">
            <div class="emp-avatar-sm ${emp?.color||''}">${emp?.avatar||'?'}</div>
            <div class="emp-name">${emp?.name||'—'}</div>
          </div>
        </td>
        <td><span style="font-size:12px;color:var(--text-muted)">${dept}</span></td>
        <td>${Utils.money(p.baseSalary)}</td>
        <td style="color:var(--success)">+${Utils.money(p.allowances)}</td>
        <td style="color:var(--success)">${p.overtime?'+'+Utils.money(p.overtime):'—'}</td>
        <td style="color:var(--danger)">-${Utils.money(p.insurance)}</td>
        <td style="color:var(--danger)">-${Utils.money(p.tax)}</td>
        <td><strong style="color:var(--primary);font-size:14px">${Utils.money(p.netSalary)}</strong></td>
        <td><span class="status-badge status-${p.status==='paid'?'paid':'unpaid'}">${p.status==='paid'?'Đã trả':'Chưa trả'}</span></td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-secondary btn-icon" title="Xem phiếu lương" onclick="Payroll.viewPayslip(${p.id})"><i class="fa-solid fa-eye"></i></button>
            ${p.status!=='paid'?`<button class="btn btn-sm btn-success" onclick="Payroll.pay(${p.id})"><i class="fa-solid fa-check"></i> Trả</button>`:''}
          </div>
        </td>
      </tr>`;
  },

  selectMonth(m) {
    this.selectedMonth = m;
    this.page = 1;
    document.getElementById('payrollSummary').innerHTML = this.renderSummaryCards();
    document.querySelector('.card-title i.fa-table').parentElement.innerHTML =
      `<i class="fa-solid fa-table text-primary"></i> Bảng lương ${Utils.fmtMonth(m)}`;
    this.renderTable();
  },

  goPage(p) { Payroll.page = p; Payroll.renderTable(); },

  search: Utils.debounce(function(q) { Payroll.renderTable(q.toLowerCase()); }, 300),

  pay(id) {
    const p = DB.payroll.find(p=>p.id===id);
    if (!p) return;
    const emp = DB.getEmp(p.empId);
    Utils.confirm(`Xác nhận trả lương ${Utils.fmtMonth(p.month)} cho <strong>${emp?.name}</strong>?`, () => {
      p.status = 'paid';
      p.paidDate = Utils.today();
      Utils.toast('Đã trả lương thành công!', 'success');
      this.renderTable();
      document.getElementById('payrollSummary').innerHTML = this.renderSummaryCards();
    });
  },

  payAll() {
    const unpaid = DB.payroll.filter(p=>p.month===this.selectedMonth&&p.status==='pending');
    if (!unpaid.length) { Utils.toast('Tất cả đã được trả lương!', 'info'); return; }
    Utils.confirm(`Xác nhận phát lương cho <strong>${unpaid.length}</strong> nhân viên tháng ${Utils.fmtMonth(this.selectedMonth)}?`, () => {
      unpaid.forEach(p=>{ p.status='paid'; p.paidDate=Utils.today(); });
      Utils.toast(`Đã phát lương thành công cho ${unpaid.length} nhân viên!`, 'success');
      this.renderTable();
      document.getElementById('payrollSummary').innerHTML = this.renderSummaryCards();
    });
  },

  viewPayslip(id) {
    const p = DB.payroll.find(p=>p.id===id);
    if (!p) return;
    const emp  = DB.getEmp(p.empId);
    const dept = DB.getDeptName(emp?.dept);

    Utils.openModal('Phiếu lương', `
      <div class="payslip">
        <div class="payslip-header">
          <div>
            <div class="payslip-logo">HRM Pro</div>
            <div style="font-size:11px;color:var(--text-muted)">Hệ thống Quản lý Nhân sự</div>
          </div>
          <div class="payslip-title">PHIẾU LƯƠNG<br/><span style="font-size:14px;font-weight:400">${Utils.fmtMonth(p.month)}</span></div>
          <div class="payslip-meta">
            <div>Mã phiếu: PL${String(p.id).padStart(4,'0')}</div>
            <div>Ngày in: ${Utils.fmtDate(Utils.today())}</div>
          </div>
        </div>
        <div class="payslip-emp">
          <span>Nhân viên</span>
          <strong>${emp?.name||'—'}</strong>
          <span style="margin-top:4px">Mã NV: ${emp?.code} | Phòng ban: ${dept} | Chức vụ: ${emp?.pos}</span>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px">THU NHẬP</div>
          <div class="payslip-row"><span>Lương cơ bản</span><span style="color:var(--success)">${Utils.money(p.baseSalary)}</span></div>
          <div class="payslip-row"><span>Phụ cấp</span><span style="color:var(--success)">${Utils.money(p.allowances)}</span></div>
          ${p.overtime?`<div class="payslip-row"><span>Tăng ca</span><span style="color:var(--success)">${Utils.money(p.overtime)}</span></div>`:''}
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin:12px 0 8px">KHẤU TRỪ</div>
          <div class="payslip-row"><span>BHXH (10.5%)</span><span style="color:var(--danger)">-${Utils.money(p.insurance)}</span></div>
          <div class="payslip-row"><span>Thuế TNCN (10%)</span><span style="color:var(--danger)">-${Utils.money(p.tax)}</span></div>
          <div class="payslip-total">
            <span>THỰC NHẬN</span>
            <span>${Utils.money(p.netSalary)}</span>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:24px;padding-top:16px;border-top:1px dashed var(--border)">
          <div style="text-align:center">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:40px">Người nhận</div>
            <div style="font-size:12px;font-weight:600">${emp?.name}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:40px">Phụ trách HR</div>
            <div style="font-size:12px;font-weight:600">Hoàng Thị Quỳnh</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:40px">Giám đốc</div>
            <div style="font-size:12px;font-weight:600">Mai Văn Xuân</div>
          </div>
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Đóng</button>
      <button class="btn btn-primary" onclick="Utils.toast('Đang in phiếu lương...','info');window.print()">
        <i class="fa-solid fa-print"></i> In phiếu
      </button>
    `, true);
  },

  exportPayroll() {
    Utils.toast('Đang xuất bảng lương...', 'info');
    setTimeout(()=>Utils.toast('Xuất thành công!','success'), 1200);
  },
};
