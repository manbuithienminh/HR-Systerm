/* ═══════════════════════════════════════════════════
   HRM PRO – REPORTS
═══════════════════════════════════════════════════ */

const Reports = {
  activeTab: 'overview',

  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Báo cáo & Thống kê</h1>
          <p>Phân tích dữ liệu nhân sự, chấm công và lương thưởng</p>
        </div>
        <button class="btn btn-secondary" onclick="Reports.exportAll()">
          <i class="fa-solid fa-file-export"></i> Xuất tất cả báo cáo
        </button>
      </div>

      <div class="tabs mb-0">
        ${[
          {id:'overview', label:'Tổng quan', icon:'fa-chart-pie'},
          {id:'headcount',label:'Nhân sự',   icon:'fa-users'},
          {id:'attendance',label:'Chấm công',icon:'fa-clock'},
          {id:'payroll',  label:'Lương',     icon:'fa-money-bill'},
        ].map(t=>`
          <button class="tab-btn ${this.activeTab===t.id?'active':''}" onclick="Reports.switchTab('${t.id}')">
            <i class="fa-solid ${t.icon}"></i> ${t.label}
          </button>`).join('')}
      </div>

      <div id="reportContent" style="margin-top:20px"></div>
    `;
    this.renderTab(this.activeTab);
  },

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b=>{ if(b.textContent.includes(tab==='overview'?'Tổng quan':tab==='headcount'?'Nhân sự':tab==='attendance'?'Chấm công':'Lương')) b.classList.add('active'); });
    this.renderTab(tab);
  },

  renderTab(tab) {
    const c = document.getElementById('reportContent');
    switch(tab) {
      case 'overview':  this.renderOverview(c); break;
      case 'headcount': this.renderHeadcount(c); break;
      case 'attendance':this.renderAttendanceReport(c); break;
      case 'payroll':   this.renderPayrollReport(c); break;
    }
  },

  renderOverview(c) {
    const totalEmp = DB.employees.length;
    const activeEmp= DB.employees.filter(e=>e.status==='active').length;
    const totalPayroll = DB.payroll.reduce((s,p)=>s+p.netSalary,0);
    const totalAssets  = DB.assets.reduce((s,a)=>s+a.value,0);
    const avgSalary    = Math.round(DB.employees.reduce((s,e)=>s+e.salary,0)/totalEmp);

    c.innerHTML = `
      <!-- KPI GRID -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:24px">
        ${[
          {label:'Tổng nhân viên', val:totalEmp, icon:'fa-users', grad:'gradient-indigo', sub:`${activeEmp} đang làm`},
          {label:'Tỷ lệ nghỉ việc', val:'5.6%',  icon:'fa-door-open',grad:'gradient-red',  sub:'YTD 2024'},
          {label:'Lương trung bình', val:Utils.money(avgSalary), icon:'fa-coins',grad:'gradient-green', sub:'Tất cả nhân viên'},
          {label:'Tổng giá trị tài sản', val:Utils.money(totalAssets), icon:'fa-building',grad:'gradient-purple', sub:`${DB.assets.length} tài sản`},
          {label:'Tổng quỹ lương 2024', val:Utils.money(totalPayroll), icon:'fa-money-bill-trend-up', grad:'gradient-orange', sub:'Tháng 1–3'},
          {label:'Ứng viên đang xét', val:DB.recruitment.reduce((s,r)=>s+r.applicants,0), icon:'fa-user-tie',grad:'gradient-teal', sub:`${DB.recruitment.filter(r=>r.status==='open').length} vị trí mở`},
        ].map(k=>`
          <div class="stat-card">
            <div class="stat-icon ${k.grad}"><i class="fa-solid ${k.icon}" style="color:#fff"></i></div>
            <div class="stat-info">
              <div class="stat-value" style="font-size:${k.val.toString().length>10?'14':'22'}px">${k.val}</div>
              <div class="stat-label">${k.label}</div>
              <div class="stat-change up"><i class="fa-solid fa-info-circle"></i> ${k.sub}</div>
            </div>
          </div>`).join('')}
      </div>

      <!-- CHARTS -->
      <div class="grid-3 mb-24">
        <div class="card" style="grid-column:span 2">
          <div class="card-header"><span class="card-title">Biến động nhân sự theo tháng</span></div>
          <div class="card-body"><div style="height:220px"><canvas id="rStaff"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Cơ cấu giới tính</span></div>
          <div class="card-body"><div style="height:220px"><canvas id="rGender"></canvas></div></div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><span class="card-title">Phân bổ nhân sự theo phòng ban</span></div>
          <div class="card-body"><div style="height:200px"><canvas id="rDept"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Phân bổ lương theo phòng ban</span></div>
          <div class="card-body"><div style="height:200px"><canvas id="rSalaryDept"></canvas></div></div>
        </div>
      </div>`;

    setTimeout(() => {
      // Staff chart
      new Chart(document.getElementById('rStaff').getContext('2d'), {
        type:'line',
        data:{
          labels:['T10/23','T11/23','T12/23','T1/24','T2/24','T3/24'],
          datasets:[
            {label:'Vào làm',data:[2,1,1,1,2,1],borderColor:'#10b981',backgroundColor:'rgba(16,185,129,.1)',tension:.4,fill:true},
            {label:'Nghỉ việc',data:[1,0,1,0,1,0],borderColor:'#ef4444',backgroundColor:'rgba(239,68,68,.1)',tension:.4,fill:true},
          ]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11}}}},scales:{y:{beginAtZero:true}}}
      });

      // Gender pie
      const male   = DB.employees.filter(e=>e.gender==='male').length;
      const female = DB.employees.filter(e=>e.gender==='female').length;
      new Chart(document.getElementById('rGender').getContext('2d'), {
        type:'pie',
        data:{ labels:['Nam','Nữ'], datasets:[{data:[male,female], backgroundColor:['#3b82f6','#ec4899'], borderWidth:2, borderColor:'#fff'}]},
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}
      });

      // Dept bar
      new Chart(document.getElementById('rDept').getContext('2d'), {
        type:'bar',
        data:{
          labels:DB.departments.map(d=>d.name),
          datasets:[{label:'Nhân viên',data:DB.departments.map(d=>d.headcount),
            backgroundColor:['#6366f1','#10b981','#ec4899','#f97316','#14b8a6','#8b5cf6'],borderRadius:6}]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
      });

      // Salary by dept
      const deptSalaries = DB.departments.map(dept => {
        const emps = DB.employees.filter(e=>e.dept===dept.id);
        return Math.round(emps.reduce((s,e)=>s+e.salary,0)/emps.length)||0;
      });
      new Chart(document.getElementById('rSalaryDept').getContext('2d'), {
        type:'bar',
        data:{
          labels:DB.departments.map(d=>d.name),
          datasets:[{label:'Lương TB (đ)',data:deptSalaries,
            backgroundColor:['rgba(99,102,241,.8)','rgba(16,185,129,.8)','rgba(236,72,153,.8)','rgba(249,115,22,.8)','rgba(20,184,166,.8)','rgba(139,92,246,.8)'],
            borderRadius:6}]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
          scales:{y:{beginAtZero:true,ticks:{callback:v=>(v/1e6).toFixed(0)+'M'}}}}
      });
    }, 50);
  },

  renderHeadcount(c) {
    c.innerHTML = `
      <div class="card mb-20">
        <div class="card-header"><span class="card-title">Thống kê nhân sự theo phòng ban</span></div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Phòng ban</th><th>Tổng NV</th><th>Đang làm</th><th>Thử việc</th><th>Đã nghỉ</th><th>Lương TB</th><th>Quỹ lương</th></tr></thead>
            <tbody>
              ${DB.departments.map(dept => {
                const emps     = DB.employees.filter(e=>e.dept===dept.id);
                const active   = emps.filter(e=>e.status==='active').length;
                const prob     = emps.filter(e=>e.status==='probation').length;
                const inactive = emps.filter(e=>e.status==='inactive').length;
                const avgSal   = emps.length ? Math.round(emps.reduce((s,e)=>s+e.salary,0)/emps.length) : 0;
                const totalSal = emps.reduce((s,e)=>s+e.salary,0);
                return `<tr>
                  <td><strong>${dept.name}</strong></td>
                  <td>${emps.length}</td>
                  <td><span class="status-badge status-active">${active}</span></td>
                  <td><span class="status-badge status-pending">${prob}</span></td>
                  <td><span class="status-badge status-inactive">${inactive}</span></td>
                  <td>${Utils.money(avgSal)}</td>
                  <td><strong>${Utils.money(totalSal)}</strong></td>
                </tr>`;
              }).join('')}
              <tr style="background:var(--bg);font-weight:700">
                <td>TỔNG CỘNG</td>
                <td>${DB.employees.length}</td>
                <td>${DB.employees.filter(e=>e.status==='active').length}</td>
                <td>${DB.employees.filter(e=>e.status==='probation').length}</td>
                <td>${DB.employees.filter(e=>e.status==='inactive').length}</td>
                <td>${Utils.money(Math.round(DB.employees.reduce((s,e)=>s+e.salary,0)/DB.employees.length))}</td>
                <td style="color:var(--primary)">${Utils.money(DB.employees.reduce((s,e)=>s+e.salary,0))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Danh sách nhân viên theo độ tuổi</span></div>
        <div class="card-body"><div style="height:200px"><canvas id="rAge"></canvas></div></div>
      </div>`;

    setTimeout(() => {
      const ages = DB.employees.map(e => {
        const dob = new Date(e.dob);
        return 2024 - dob.getFullYear();
      });
      const brackets = {'20-25':0,'26-30':0,'31-35':0,'36-40':0,'41+':0};
      ages.forEach(a => {
        if (a<=25) brackets['20-25']++;
        else if (a<=30) brackets['26-30']++;
        else if (a<=35) brackets['31-35']++;
        else if (a<=40) brackets['36-40']++;
        else brackets['41+']++;
      });
      new Chart(document.getElementById('rAge').getContext('2d'), {
        type:'bar',
        data:{
          labels:Object.keys(brackets),
          datasets:[{label:'Nhân viên',data:Object.values(brackets),
            backgroundColor:['#6366f1','#10b981','#f97316','#ec4899','#8b5cf6'],borderRadius:8}]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{stepSize:1}}}}
      });
    }, 50);
  },

  renderAttendanceReport(c) {
    const months = ['2024-01','2024-02','2024-03'];
    c.innerHTML = `
      <div class="grid-2 mb-20">
        <div class="card">
          <div class="card-header"><span class="card-title">Tỷ lệ chấm công theo tháng</span></div>
          <div class="card-body"><div style="height:220px"><canvas id="rAtt"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Phân tích đi trễ theo phòng ban</span></div>
          <div class="card-body"><div style="height:220px"><canvas id="rLate"></canvas></div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Tổng hợp chấm công theo phòng ban</span></div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Phòng ban</th><th>Nhân viên</th><th>Tổng ngày công</th><th>Có mặt</th><th>Đi trễ</th><th>Vắng</th><th>Nghỉ phép</th><th>Tỷ lệ có mặt</th></tr></thead>
            <tbody>
              ${DB.departments.map(dept => {
                const empIds = DB.employees.filter(e=>e.dept===dept.id).map(e=>e.id);
                const attList= DB.attendance.filter(a=>empIds.includes(a.empId));
                const present= attList.filter(a=>a.status==='present').length;
                const late   = attList.filter(a=>a.status==='late').length;
                const absent = attList.filter(a=>a.status==='absent').length;
                const leave  = attList.filter(a=>a.status==='leave').length;
                const total  = present+late+absent+leave;
                const rate   = total ? Math.round((present+late)/total*100) : 0;
                return `<tr>
                  <td><strong>${dept.name}</strong></td>
                  <td>${empIds.length}</td>
                  <td>${total}</td>
                  <td style="color:var(--success)">${present}</td>
                  <td style="color:var(--warning)">${late}</td>
                  <td style="color:var(--danger)">${absent}</td>
                  <td style="color:var(--info)">${leave}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${rate}%;background:${rate>90?'var(--success)':rate>75?'var(--warning)':'var(--danger)'}"></div></div>
                      <span style="font-size:12px;font-weight:600">${rate}%</span>
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    setTimeout(() => {
      new Chart(document.getElementById('rAtt').getContext('2d'), {
        type:'line',
        data:{
          labels:['T1','T2','T3'],
          datasets:[
            {label:'Có mặt %',data:[94,92,88],borderColor:'#10b981',tension:.4,fill:false,pointRadius:5},
            {label:'Đi trễ %', data:[4,5,7], borderColor:'#f59e0b',tension:.4,fill:false,pointRadius:5},
            {label:'Vắng %',   data:[2,3,5], borderColor:'#ef4444',tension:.4,fill:false,pointRadius:5},
          ]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11}}}},scales:{y:{beginAtZero:true,max:100}}}
      });

      const deptLate = DB.departments.map(dept => {
        const empIds = DB.employees.filter(e=>e.dept===dept.id).map(e=>e.id);
        return DB.attendance.filter(a=>empIds.includes(a.empId)&&a.status==='late').length;
      });
      new Chart(document.getElementById('rLate').getContext('2d'), {
        type:'bar',
        data:{
          labels:DB.departments.map(d=>d.name),
          datasets:[{label:'Lượt trễ',data:deptLate,backgroundColor:'rgba(245,158,11,.8)',borderRadius:6}]
        },
        options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}
      });
    }, 50);
  },

  renderPayrollReport(c) {
    const months = ['2024-01','2024-02','2024-03'];
    c.innerHTML = `
      <div class="grid-3 mb-20">
        ${months.map(m=>{
          const list = DB.payroll.filter(p=>p.month===m);
          const net  = list.reduce((s,p)=>s+p.netSalary,0);
          const tax  = list.reduce((s,p)=>s+p.tax,0);
          const ins  = list.reduce((s,p)=>s+p.insurance,0);
          return `
            <div class="card">
              <div class="card-header"><span class="card-title">${Utils.fmtMonth(m)}</span></div>
              <div class="card-body">
                <div class="payslip-row"><span>Tổng lương net</span><span style="color:var(--primary);font-weight:700">${Utils.money(net)}</span></div>
                <div class="payslip-row"><span>Thuế TNCN</span><span style="color:var(--danger)">${Utils.money(tax)}</span></div>
                <div class="payslip-row"><span>BHXH</span><span style="color:var(--warning)">${Utils.money(ins)}</span></div>
                <div class="payslip-row" style="border:none"><span>Số người</span><span>${list.length}</span></div>
              </div>
            </div>`;
        }).join('')}
      </div>
      <div class="card mb-20">
        <div class="card-header"><span class="card-title">Biểu đồ lương theo tháng</span></div>
        <div class="card-body"><div style="height:220px"><canvas id="rPay"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">TOP 10 nhân viên lương cao nhất</span></div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Nhân viên</th><th>Phòng ban</th><th>Lương cơ bản</th><th>Thực nhận (T3)</th></tr></thead>
            <tbody>
              ${DB.employees.sort((a,b)=>b.salary-a.salary).slice(0,10).map((e,i)=>{
                const pay = DB.payroll.find(p=>p.empId===e.id&&p.month==='2024-03');
                return `<tr>
                  <td>
                    <div class="emp-cell">
                      <div style="width:24px;height:24px;border-radius:50%;background:${i===0?'#f59e0b':i===1?'#94a3b8':i===2?'#b45309':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:${i<3?'#fff':'var(--text-muted)'};flex-shrink:0">${i+1}</div>
                      <div class="emp-avatar-sm ${e.color}" style="width:28px;height:28px;font-size:10px">${e.avatar}</div>
                      <div class="emp-name">${e.name}</div>
                    </div>
                  </td>
                  <td>${DB.getDeptName(e.dept)}</td>
                  <td>${Utils.money(e.salary)}</td>
                  <td><strong style="color:var(--primary)">${pay?Utils.money(pay.netSalary):'—'}</strong></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;

    setTimeout(() => {
      const data = months.map(m=>({
        net:DB.payroll.filter(p=>p.month===m).reduce((s,p)=>s+p.netSalary,0),
        tax:DB.payroll.filter(p=>p.month===m).reduce((s,p)=>s+p.tax,0),
        ins:DB.payroll.filter(p=>p.month===m).reduce((s,p)=>s+p.insurance,0),
      }));
      new Chart(document.getElementById('rPay').getContext('2d'), {
        type:'bar',
        data:{
          labels:['Tháng 1','Tháng 2','Tháng 3'],
          datasets:[
            {label:'Lương net',data:data.map(d=>d.net),backgroundColor:'rgba(99,102,241,.8)',borderRadius:6,stack:'a'},
            {label:'Thuế TNCN',data:data.map(d=>d.tax),backgroundColor:'rgba(239,68,68,.6)',borderRadius:6,stack:'a'},
            {label:'BHXH',     data:data.map(d=>d.ins),backgroundColor:'rgba(245,158,11,.6)',borderRadius:6,stack:'a'},
          ]
        },
        options:{responsive:true,maintainAspectRatio:false,
          plugins:{legend:{position:'bottom',labels:{font:{size:11}}}},
          scales:{x:{stacked:true},y:{stacked:true,ticks:{callback:v=>(v/1e9).toFixed(1)+'B'}}}}
      });
    }, 50);
  },

  exportAll() {
    Utils.toast('Đang xuất tất cả báo cáo...', 'info');
    setTimeout(()=>Utils.toast('Xuất báo cáo thành công!','success'), 1500);
  },
};
