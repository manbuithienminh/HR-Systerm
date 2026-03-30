/* ═══════════════════════════════════════════════════
   HRM PRO – DASHBOARD
═══════════════════════════════════════════════════ */

const Dashboard = {
  render() {
    const content = document.getElementById('pageContent');
    const totalEmp   = DB.employees.length;
    const activeEmp  = DB.employees.filter(e => e.status === 'active').length;
    const today      = Utils.today();
    const todayAtt   = DB.attendance.filter(a => a.date === today);
    const presentToday = todayAtt.filter(a => a.status === 'present' || a.status === 'late').length;
    const pendingLeave = DB.leaves.filter(l => l.status === 'pending').length;
    const thisMonth  = today.substring(0,7);
    const payThisMonth = DB.payroll.filter(p => p.month === thisMonth);
    const totalPayroll = payThisMonth.reduce((s, p) => s + p.netSalary, 0);
    const openJobs   = DB.recruitment.filter(r => r.status === 'open').length;

    content.innerHTML = `
      <!-- STAT CARDS -->
      <div class="stat-grid">
        ${this.statCard('Tổng nhân viên', totalEmp, 'fa-users', 'gradient-indigo', `${activeEmp} đang làm việc`, 'up', '+2 tháng này')}
        ${this.statCard('Có mặt hôm nay', presentToday, 'fa-clipboard-check', 'gradient-green', `/ ${activeEmp} nhân viên`, 'up', `${Math.round(presentToday/activeEmp*100)}% tỷ lệ`)}
        ${this.statCard('Xin nghỉ chờ duyệt', pendingLeave, 'fa-calendar-xmark', 'gradient-orange', 'đơn chờ xử lý', pendingLeave > 3 ? 'down' : 'up', 'cần xem xét')}
        ${this.statCard('Lương tháng này', Utils.money(totalPayroll), 'fa-money-bill-wave', 'gradient-purple', 'tổng chi phí lương', 'up', '+5.2% so tháng trước')}
        ${this.statCard('Vị trí tuyển dụng', openJobs, 'fa-user-plus', 'gradient-blue', 'đang mở tuyển', 'up', `${DB.recruitment.reduce((s,r)=>s+r.applicants,0)} ứng viên`)}
        ${this.statCard('Tài sản công ty', DB.assets.length, 'fa-laptop', 'gradient-teal', `${DB.assets.filter(a=>a.status==='available').length} khả dụng`, 'up', Utils.money(DB.assets.reduce((s,a)=>s+a.value,0)))}
      </div>

      <!-- CHARTS ROW -->
      <div class="grid-2 mb-24">
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-chart-line text-primary mr-2"></i> Biến động nhân sự 6 tháng</span>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height:220px"><canvas id="staffChart"></canvas></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-chart-pie text-purple mr-2"></i> Cơ cấu nhân sự theo phòng ban</span>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height:220px"><canvas id="deptChart"></canvas></div>
          </div>
        </div>
      </div>

      <!-- ATTENDANCE + ACTIVITY -->
      <div class="grid-2 mb-24">
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-clock text-warning mr-2"></i> Chấm công hôm nay</span>
            <button class="btn btn-sm btn-secondary" onclick="navigate('attendance')">Xem chi tiết</button>
          </div>
          <div class="card-body" style="padding:16px">
            ${this.renderAttendanceSummary()}
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-bolt text-orange mr-2"></i> Hoạt động gần đây</span>
          </div>
          <div class="card-body" style="padding:0 20px 12px">
            ${this.renderTimeline()}
          </div>
        </div>
      </div>

      <!-- QUICK ACTIONS + LEAVE PENDING -->
      <div class="grid-2 mb-24">
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-rocket text-success mr-2"></i> Truy cập nhanh</span>
          </div>
          <div class="card-body">
            <div class="quick-action-grid">
              ${[
                {icon:'fa-user-plus',label:'Thêm nhân viên',color:'text-primary',page:'employees'},
                {icon:'fa-clock',label:'Chấm công',color:'text-success',page:'attendance'},
                {icon:'fa-money-bill-wave',label:'Tính lương',color:'text-purple',page:'payroll'},
                {icon:'fa-file-lines',label:'Tạo văn bản',color:'text-orange',page:'documents'},
                {icon:'fa-calendar-xmark',label:'Nghỉ phép',color:'text-warning',page:'leave'},
                {icon:'fa-laptop',label:'Tài sản',color:'text-teal',page:'assets'},
                {icon:'fa-chart-bar',label:'Báo cáo',color:'text-info',page:'reports'},
                {icon:'fa-gear',label:'Cài đặt',color:'text-muted',page:'settings'},
              ].map(a => `
                <div class="quick-action" onclick="navigate('${a.page}')">
                  <i class="fa-solid ${a.icon} ${a.color}"></i>
                  <span>${a.label}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-calendar-check text-info mr-2"></i> Đơn nghỉ chờ duyệt</span>
            <button class="btn btn-sm btn-secondary" onclick="navigate('leave')">Tất cả</button>
          </div>
          <div class="card-body" style="padding:0">
            <div class="table-wrapper">
              <table>
                <thead><tr><th>Nhân viên</th><th>Loại nghỉ</th><th>Ngày</th><th>Thao tác</th></tr></thead>
                <tbody>
                  ${DB.leaves.filter(l=>l.status==='pending').slice(0,4).map(l => {
                    const emp = DB.getEmp(l.empId);
                    return `<tr>
                      <td><div class="emp-cell">${Utils.empAvatar(emp)}<div class="emp-name">${emp.name}</div></div></td>
                      <td>${l.type}</td>
                      <td>${Utils.fmtDate(l.from)}</td>
                      <td>
                        <button class="btn btn-sm btn-success" onclick="Leave.approve(${l.id})">Duyệt</button>
                        <button class="btn btn-sm btn-secondary" onclick="Leave.reject(${l.id})">Từ chối</button>
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- PAYROLL CHART + RECRUITMENT -->
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-chart-bar text-success mr-2"></i> Chi phí lương 3 tháng gần nhất</span>
          </div>
          <div class="card-body">
            <div class="chart-container" style="height:200px"><canvas id="payrollChart"></canvas></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-briefcase text-blue mr-2"></i> Tuyển dụng đang mở</span>
            <button class="btn btn-sm btn-secondary" onclick="navigate('recruitment')">Xem thêm</button>
          </div>
          <div class="card-body" style="padding:0">
            <div class="table-wrapper">
              <table>
                <thead><tr><th>Vị trí</th><th>Phòng ban</th><th>Ứng viên</th><th>Trạng thái</th></tr></thead>
                <tbody>
                  ${DB.recruitment.filter(r=>r.status==='open').slice(0,5).map(r => `
                    <tr>
                      <td><span class="font-semibold">${r.title}</span></td>
                      <td>${DB.getDeptName(r.dept)}</td>
                      <td><span class="status-badge status-active">${r.applicants}</span></td>
                      <td><span class="status-badge status-active">Đang tuyển</span></td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initCharts();
  },

  statCard(label, value, icon, grad, sub, changeDir, changeText) {
    return `
      <div class="stat-card">
        <div class="stat-icon ${grad}">
          <i class="fa-solid ${icon}" style="color:#fff"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">${value}</div>
          <div class="stat-label">${label}</div>
          <div class="stat-change ${changeDir}">
            <i class="fa-solid ${changeDir==='up'?'fa-arrow-trend-up':'fa-arrow-trend-down'}"></i>
            ${changeText}
          </div>
        </div>
      </div>`;
  },

  renderAttendanceSummary() {
    const today = Utils.today();
    const todayAtt = DB.attendance.filter(a => a.date === today);
    const counts = { present:0, late:0, absent:0, leave:0 };
    todayAtt.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
    const total = DB.employees.filter(e=>e.status==='active').length;

    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        ${[
          {k:'present',label:'Có mặt',color:'var(--success)',bg:'var(--success-light)'},
          {k:'late',   label:'Đi trễ', color:'var(--warning)',bg:'var(--warning-light)'},
          {k:'absent', label:'Vắng',   color:'var(--danger)', bg:'var(--danger-light)'},
          {k:'leave',  label:'Nghỉ phép',color:'var(--info)', bg:'var(--info-light)'},
        ].map(s => `
          <div style="background:${s.bg};border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:${s.color}">${counts[s.k]}</div>
            <div style="font-size:12px;color:${s.color};font-weight:600">${s.label}</div>
          </div>`).join('')}
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px">
          <span>Tỷ lệ đi làm</span>
          <span>${Math.round((counts.present+counts.late)/total*100)}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.round((counts.present+counts.late)/total*100)}%;background:var(--success)"></div>
        </div>
      </div>
      <div style="margin-top:12px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px">
          <span>Chưa điểm danh</span>
          <span>${total - todayAtt.length} người</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.round((total-todayAtt.length)/total*100)}%;background:var(--warning)"></div>
        </div>
      </div>`;
  },

  renderTimeline() {
    return `<div style="text-align:center;padding:24px 0;color:var(--text-muted);font-size:13px">
      <i class="fa-solid fa-clock" style="font-size:28px;opacity:.3;display:block;margin-bottom:8px"></i>
      Chưa có hoạt động nào
    </div>`;
  },

  initCharts() {
    // Staff trend chart
    const staffCtx = document.getElementById('staffChart')?.getContext('2d');
    if (staffCtx) {
      new Chart(staffCtx, {
        type: 'line',
        data: {
          labels: ['T10/23','T11/23','T12/23','T1/24','T2/24','T3/24'],
          datasets: [
            { label:'Tổng nhân viên', data:[14,15,16,16,17,18],
              borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,.1)', tension:.4, fill:true, pointRadius:4 },
            { label:'Nghỉ việc', data:[1,0,1,0,1,0],
              borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,.08)', tension:.4, fill:true, pointRadius:4 },
          ]
        },
        options: { responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{ position:'bottom', labels:{ boxWidth:12, font:{size:11} } } },
          scales:{ y:{ beginAtZero:true, ticks:{font:{size:11}} }, x:{ ticks:{font:{size:11}} } }
        }
      });
    }

    // Dept distribution pie
    const deptCtx = document.getElementById('deptChart')?.getContext('2d');
    if (deptCtx) {
      new Chart(deptCtx, {
        type: 'doughnut',
        data: {
          labels: DB.departments.map(d => d.name),
          datasets:[{ data: DB.departments.map(d => d.headcount),
            backgroundColor:['#6366f1','#10b981','#ec4899','#f97316','#14b8a6','#8b5cf6'],
            borderWidth:2, borderColor:'#fff' }]
        },
        options: { responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{ position:'bottom', labels:{ boxWidth:12, font:{size:11} } } }
        }
      });
    }

    // Payroll bar
    const payCtx = document.getElementById('payrollChart')?.getContext('2d');
    if (payCtx) {
      const months = ['2024-01','2024-02','2024-03'];
      const totals = months.map(m => DB.payroll.filter(p=>p.month===m).reduce((s,p)=>s+p.netSalary,0));
      new Chart(payCtx, {
        type: 'bar',
        data: {
          labels: ['Tháng 1','Tháng 2','Tháng 3'],
          datasets:[{ label:'Lương net (đ)',
            data: totals,
            backgroundColor:['rgba(99,102,241,.8)','rgba(16,185,129,.8)','rgba(245,158,11,.8)'],
            borderRadius: 8 }]
        },
        options: { responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{ display:false } },
          scales:{ y:{ beginAtZero:true, ticks:{ font:{size:11},
            callback: v => (v/1e9).toFixed(1)+'B' } }, x:{ ticks:{font:{size:11}} } }
        }
      });
    }
  },
};
