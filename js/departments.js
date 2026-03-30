/* ═══════════════════════════════════════════════════
   HRM PRO – DEPARTMENTS
═══════════════════════════════════════════════════ */

const Departments = {
  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Quản lý phòng ban</h1>
          <p>Sơ đồ tổ chức và quản lý cơ cấu phòng ban</p>
        </div>
        <button class="btn btn-primary" onclick="Departments.openAdd()">
          <i class="fa-solid fa-plus"></i> Thêm phòng ban
        </button>
      </div>

      <!-- DEPT CARDS -->
      <div class="grid-auto mb-24">
        ${DB.departments.map(dept => {
          const emps = DB.employees.filter(e=>e.dept===dept.id);
          const manager = DB.getEmp(dept.manager);
          const active  = emps.filter(e=>e.status==='active').length;
          const avgSal  = emps.length ? Math.round(emps.reduce((s,e)=>s+e.salary,0)/emps.length) : 0;
          return `
            <div class="card" style="overflow:visible">
              <div style="padding:20px;border-bottom:1px solid var(--border-light)">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                  <div class="stat-icon ${dept.color}" style="width:48px;height:48px;border-radius:12px">
                    <i class="fa-solid fa-building" style="color:#fff;font-size:20px"></i>
                  </div>
                  <div>
                    <div style="font-size:16px;font-weight:700;color:var(--text-dark)">${dept.name}</div>
                    <div style="font-size:12px;color:var(--text-muted)">Mã: ${dept.code}</div>
                  </div>
                </div>
                ${manager ? `
                  <div style="display:flex;align-items:center;gap:8px;padding:8px;background:var(--bg);border-radius:8px">
                    <div class="emp-avatar-sm ${manager.color}" style="width:28px;height:28px;font-size:10px">${manager.avatar}</div>
                    <div>
                      <div style="font-size:11px;color:var(--text-muted)">Trưởng phòng</div>
                      <div style="font-size:13px;font-weight:600">${manager.name}</div>
                    </div>
                  </div>` : ''}
              </div>
              <div style="padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
                <div style="text-align:center">
                  <div style="font-size:22px;font-weight:800;color:var(--primary)">${emps.length}</div>
                  <div style="font-size:11px;color:var(--text-muted)">Nhân viên</div>
                </div>
                <div style="text-align:center">
                  <div style="font-size:22px;font-weight:800;color:var(--success)">${active}</div>
                  <div style="font-size:11px;color:var(--text-muted)">Đang làm</div>
                </div>
                <div style="text-align:center;grid-column:span 2">
                  <div style="font-size:13px;font-weight:700;color:var(--text-dark)">${Utils.money(avgSal)}</div>
                  <div style="font-size:11px;color:var(--text-muted)">Lương trung bình</div>
                </div>
              </div>
              <div style="padding:0 16px 16px;display:flex;gap:6px">
                <button class="btn btn-sm btn-secondary" style="flex:1" onclick="Departments.viewMembers(${dept.id})">
                  <i class="fa-solid fa-users"></i> Nhân viên
                </button>
                <button class="btn btn-sm btn-secondary btn-icon" onclick="Departments.openEdit(${dept.id})">
                  <i class="fa-solid fa-pen"></i>
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- ORG CHART (simplified) -->
      <div class="card">
        <div class="card-header"><span class="card-title"><i class="fa-solid fa-sitemap text-primary"></i> Sơ đồ tổ chức</span></div>
        <div class="card-body" style="overflow-x:auto">
          ${this.renderOrgChart()}
        </div>
      </div>
    `;
  },

  renderOrgChart() {
    if (!DB.departments.length) {
      return `<div style="text-align:center;padding:48px;color:var(--text-muted)"><i class="fa-solid fa-sitemap" style="font-size:40px;margin-bottom:12px;display:block;opacity:.3"></i>Chưa có dữ liệu phòng ban</div>`;
    }
    // Tìm nhân viên cấp cao nhất (lương cao nhất hoặc phòng ban đầu tiên có manager)
    const topMgr = DB.employees.find(e => e.pos && e.pos.toLowerCase().includes('giám đốc')) || DB.employees[0];
    return `
      <div style="text-align:center;min-width:600px">
        <!-- Top manager -->
        ${topMgr ? `
        <div style="display:inline-flex;flex-direction:column;align-items:center;margin-bottom:8px">
          <div style="background:var(--bg-card);border:2px solid var(--primary);border-radius:12px;padding:12px 20px;display:flex;align-items:center;gap:10px">
            <div class="user-avatar ${topMgr.color||'gradient-orange'}">${topMgr.avatar||topMgr.name.charAt(0)}</div>
            <div>
              <div style="font-weight:700">${topMgr.name}</div>
              <div style="font-size:11px;color:var(--text-muted)">${topMgr.pos}</div>
            </div>
          </div>
          <div style="width:2px;height:24px;background:var(--border)"></div>
        </div>` : ''}
        <!-- Departments row -->
        <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap">
          ${DB.departments.slice(0,5).map(dept => {
            const mgr = DB.getEmp(dept.manager);
            return `
              <div style="display:flex;flex-direction:column;align-items:center">
                <div style="background:var(--bg-card);border:1px solid var(--border);border-top:3px solid;border-top-color:var(--primary);border-radius:10px;padding:10px 16px;min-width:130px;text-align:center">
                  <div style="font-size:13px;font-weight:700;color:var(--text-dark)">${dept.name}</div>
                  ${mgr?`<div style="font-size:11px;color:var(--text-muted);margin-top:2px">${mgr.name}</div>`:''}
                  <div style="font-size:11px;color:var(--primary);margin-top:4px">${DB.employees.filter(e=>e.dept===dept.id).length} NV</div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  },

  viewMembers(deptId) {
    const dept = DB.getDept(deptId);
    const emps = DB.employees.filter(e=>e.dept===deptId);
    Utils.openModal(`Nhân viên – ${dept.name}`, `
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Nhân viên</th><th>Chức vụ</th><th>Lương</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${emps.map(e=>`<tr>
              <td><div class="emp-cell"><div class="emp-avatar-sm ${e.color}">${e.avatar}</div><div class="emp-name">${e.name}</div></div></td>
              <td>${e.pos}</td>
              <td>${Utils.money(e.salary)}</td>
              <td><span class="status-badge status-${e.status==='active'?'active':e.status==='probation'?'pending':'inactive'}">${Utils.statusLabel(e.status)}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    `, `<button class="btn btn-secondary" onclick="Utils.closeModal()">Đóng</button>`, true);
  },

  openAdd() { Utils.toast('Chức năng thêm phòng ban sẽ sớm ra mắt', 'info'); },
  openEdit(id) { Utils.toast('Chức năng sửa phòng ban sẽ sớm ra mắt', 'info'); },
};
