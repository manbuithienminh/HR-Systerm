/* ═══════════════════════════════════════════════════
   HRM PRO – ATTENDANCE
═══════════════════════════════════════════════════ */

const Attendance = {
  currentMonth: new Date().getMonth(),
  currentYear:  new Date().getFullYear(),
  selectedEmp:  null,

  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Quản lý chấm công</h1>
          <p>Theo dõi thời gian làm việc và tổng hợp chấm công</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" onclick="Attendance.exportReport()">
            <i class="fa-solid fa-file-export"></i> Xuất báo cáo
          </button>
          <button class="btn btn-primary" onclick="Attendance.openCheckin()">
            <i class="fa-solid fa-clock"></i> Chấm công thủ công
          </button>
        </div>
      </div>

      <!-- SUMMARY CARDS -->
      <div class="stat-grid mb-24">
        ${this.renderSummaryCards()}
      </div>

      <!-- MAIN PANEL -->
      <div style="display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start">
        <!-- Attendance table -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-table text-primary"></i> Bảng chấm công tháng</span>
            <div style="display:flex;gap:8px;align-items:center">
              <button class="btn btn-sm btn-secondary" onclick="Attendance.prevMonth()"><i class="fa-solid fa-chevron-left"></i></button>
              <span style="font-size:13px;font-weight:700;min-width:100px;text-align:center" id="attMonthLabel"></span>
              <button class="btn btn-sm btn-secondary" onclick="Attendance.nextMonth()"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div class="card-body" style="padding:0">
            <div style="padding:12px 16px;border-bottom:1px solid var(--border-light)">
              <div class="search-input" style="max-width:260px">
                <i class="fa-solid fa-search"></i>
                <input type="text" placeholder="Tìm nhân viên..." oninput="Attendance.searchEmp(this.value)" />
              </div>
            </div>
            <div class="table-wrapper" id="attTable"></div>
          </div>
        </div>

        <!-- Calendar for selected employee -->
        <div class="card" id="attCalendarCard">
          <div class="card-header">
            <span class="card-title"><i class="fa-solid fa-calendar text-orange"></i> Lịch chấm công</span>
          </div>
          <div class="card-body">
            <div id="attCalendar"></div>
          </div>
        </div>
      </div>
    `;

    this.renderTable();
    this.renderCalendar();
    document.getElementById('attMonthLabel').textContent =
      `Tháng ${this.currentMonth+1}/${this.currentYear}`;
  },

  renderSummaryCards() {
    const today  = Utils.today();
    const mm     = String(this.currentMonth+1).padStart(2,'0');
    const prefix = `${this.currentYear}-${mm}-`;
    const monthAtt = DB.attendance.filter(a => a.date.startsWith(prefix));

    const present = monthAtt.filter(a=>a.status==='present').length;
    const late    = monthAtt.filter(a=>a.status==='late').length;
    const absent  = monthAtt.filter(a=>a.status==='absent').length;
    const leave   = monthAtt.filter(a=>a.status==='leave').length;

    return `
      <div class="stat-card">
        <div class="stat-icon gradient-green"><i class="fa-solid fa-check" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${present}</div><div class="stat-label">Lượt có mặt</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-orange"><i class="fa-solid fa-clock" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${late}</div><div class="stat-label">Lượt đi trễ</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-red"><i class="fa-solid fa-xmark" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${absent}</div><div class="stat-label">Lượt vắng</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-blue"><i class="fa-solid fa-umbrella-beach" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${leave}</div><div class="stat-label">Lượt nghỉ phép</div></div>
      </div>`;
  },

  renderTable(filter = '') {
    const mm = String(this.currentMonth+1).padStart(2,'0');
    const prefix = `${this.currentYear}-${mm}-`;
    const daysInMonth = new Date(this.currentYear, this.currentMonth+1, 0).getDate();

    let employees = DB.employees.filter(e => e.status !== 'inactive');
    if (filter) employees = employees.filter(e => e.name.toLowerCase().includes(filter));

    // Build columns: last 10 working days of the month
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(this.currentYear, this.currentMonth, d);
      if (dt.getDay() !== 0 && dt.getDay() !== 6) days.push(d);
    }
    const showDays = days.slice(-10);

    const icons = { present:'✓', late:'⏰', absent:'✗', leave:'🏖' };
    const cls   = { present:'status-present', late:'status-late', absent:'status-absent', leave:'status-leave' };

    document.getElementById('attTable').innerHTML = `
      <table>
        <thead>
          <tr>
            <th style="min-width:160px">Nhân viên</th>
            ${showDays.map(d=>`<th style="text-align:center;min-width:36px">${d}</th>`).join('')}
            <th>Ngày làm</th><th>Trễ</th><th>Vắng</th>
          </tr>
        </thead>
        <tbody>
          ${employees.map(emp => {
            const empAtt = DB.attendance.filter(a=>a.empId===emp.id && a.date.startsWith(prefix));
            const getStatus = (d) => {
              const a = empAtt.find(a=>a.date===`${this.currentYear}-${mm}-${String(d).padStart(2,'0')}`);
              return a?.status || 'absent';
            };
            const presentDays = empAtt.filter(a=>a.status==='present'||a.status==='late').length;
            const lateDays    = empAtt.filter(a=>a.status==='late').length;
            const absentDays  = empAtt.filter(a=>a.status==='absent').length;
            return `
              <tr style="cursor:pointer" onclick="Attendance.selectEmp(${emp.id})" class="${this.selectedEmp===emp.id?'':''}">
                <td>
                  <div class="emp-cell">
                    <div class="emp-avatar-sm ${emp.color}">${emp.avatar}</div>
                    <div class="emp-name" style="font-size:12px">${emp.name}</div>
                  </div>
                </td>
                ${showDays.map(d=>{
                  const st = getStatus(d);
                  return `<td style="text-align:center">
                    <span class="status-badge ${cls[st]||''}" style="padding:1px 4px;font-size:10px;min-width:24px;justify-content:center">
                      ${icons[st]||'—'}
                    </span>
                  </td>`;
                }).join('')}
                <td><strong style="color:var(--success)">${presentDays}</strong></td>
                <td><strong style="color:var(--warning)">${lateDays}</strong></td>
                <td><strong style="color:var(--danger)">${absentDays}</strong></td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>`;
  },

  renderCalendar() {
    const emp = this.selectedEmp ? DB.getEmp(this.selectedEmp) : null;
    const mm  = String(this.currentMonth+1).padStart(2,'0');
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth+1, 0).getDate();
    const today = new Date().getDate();
    const todayFull = Utils.today();

    const attMap = {};
    if (emp) {
      DB.attendance.filter(a=>a.empId===emp.id&&a.date.startsWith(`${this.currentYear}-${mm}-`))
        .forEach(a=>{ attMap[parseInt(a.date.split('-')[2])] = a; });
    }

    const dayNames = ['CN','T2','T3','T4','T5','T6','T7'];
    let html = `
      <div style="margin-bottom:12px">
        ${emp ? `
          <div class="emp-cell" style="gap:10px">
            <div class="user-avatar ${emp.color}">${emp.avatar}</div>
            <div>
              <div class="emp-name">${emp.name}</div>
              <div class="emp-email">${emp.pos}</div>
            </div>
          </div>` : '<p style="font-size:12px;color:var(--text-muted)">Nhấn vào nhân viên để xem lịch</p>'}
      </div>
      <div class="att-calendar">
        ${dayNames.map(d=>`<div class="att-day-header">${d}</div>`).join('')}
        ${Array(firstDay===0?6:firstDay-1).fill('<div class="att-day empty"></div>').join('')}
        ${Array.from({length:daysInMonth},(_,i)=>{
          const d = i+1;
          const dt = new Date(this.currentYear, this.currentMonth, d);
          const isWeekend = dt.getDay()===0||dt.getDay()===6;
          const isToday   = `${this.currentYear}-${mm}-${String(d).padStart(2,'0')}` === todayFull;
          const a = attMap[d];
          let cls = isWeekend ? 'weekend' : '';
          if (a) cls += ' ' + a.status;
          if (isToday) cls += ' today';
          const tip = a ? `${Utils.fmtDate(a.date)}: ${a.checkIn||''} – ${a.checkOut||''}` : '';
          return `<div class="att-day ${cls}" title="${tip}">${d}</div>`;
        }).join('')}
      </div>
      <!-- Legend -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
        ${[
          {cls:'present',label:'Có mặt'},
          {cls:'late',   label:'Trễ'},
          {cls:'absent', label:'Vắng'},
          {cls:'leave',  label:'Nghỉ phép'},
        ].map(l=>`
          <div style="display:flex;align-items:center;gap:4px;font-size:11px">
            <div class="att-day ${l.cls}" style="width:16px;height:16px;border-radius:4px;aspect-ratio:unset;display:inline-block"></div>
            ${l.label}
          </div>`).join('')}
      </div>`;

    document.getElementById('attCalendar').innerHTML = html;
  },

  selectEmp(id) {
    this.selectedEmp = id;
    this.renderCalendar();
  },

  searchEmp(q) { this.renderTable(q.toLowerCase()); },

  prevMonth() {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else this.currentMonth--;
    document.getElementById('attMonthLabel').textContent = `Tháng ${this.currentMonth+1}/${this.currentYear}`;
    this.renderTable();
  },
  nextMonth() {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else this.currentMonth++;
    document.getElementById('attMonthLabel').textContent = `Tháng ${this.currentMonth+1}/${this.currentYear}`;
    this.renderTable();
  },

  openCheckin() {
    Utils.openModal('Chấm công thủ công', `
      <div class="form-group">
        <label class="form-label">Nhân viên</label>
        <select class="form-control" id="attEmpSel">
          ${DB.employees.filter(e=>e.status!=='inactive').map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Ngày</label>
        <input class="form-control" type="date" id="attDate" value="${Utils.today()}" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Giờ vào</label>
          <input class="form-control" type="time" id="attIn" value="08:00" />
        </div>
        <div class="form-group">
          <label class="form-label">Giờ ra</label>
          <input class="form-control" type="time" id="attOut" value="17:00" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Trạng thái</label>
        <select class="form-control" id="attStatus">
          <option value="present">Có mặt</option>
          <option value="late">Đi trễ</option>
          <option value="absent">Vắng</option>
          <option value="leave">Nghỉ phép</option>
        </select>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Attendance.saveCheckin()">
        <i class="fa-solid fa-save"></i> Lưu
      </button>
    `);
  },

  saveCheckin() {
    const empId  = parseInt(document.getElementById('attEmpSel').value);
    const date   = document.getElementById('attDate').value;
    const checkIn= document.getElementById('attIn').value;
    const checkOut=document.getElementById('attOut').value;
    const status = document.getElementById('attStatus').value;
    const existing = DB.attendance.findIndex(a=>a.empId===empId&&a.date===date);
    const rec = { id: DB.attendance.length+1, empId, date, checkIn, checkOut, status };
    if (existing >= 0) DB.attendance[existing] = rec;
    else DB.attendance.push(rec);
    Utils.closeModal();
    Utils.toast('Chấm công thành công!', 'success');
    this.renderTable();
    if (this.selectedEmp === empId) this.renderCalendar();
  },

  exportReport() {
    Utils.toast('Đang xuất báo cáo chấm công...', 'info');
    setTimeout(()=>Utils.toast('Xuất báo cáo thành công!','success'), 1200);
  },
};
