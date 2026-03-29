/* ═══════════════════════════════════════════════════
   HRM PRO – RECRUITMENT
═══════════════════════════════════════════════════ */

const Recruitment = {
  render() {
    const content = document.getElementById('pageContent');
    const open   = DB.recruitment.filter(r=>r.status==='open').length;
    const closed = DB.recruitment.filter(r=>r.status==='closed').length;
    const totalApplicants = DB.recruitment.reduce((s,r)=>s+r.applicants,0);

    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Tuyển dụng</h1>
          <p>Quản lý tin tuyển dụng và ứng viên</p>
        </div>
        <button class="btn btn-primary" onclick="Recruitment.openAdd()">
          <i class="fa-solid fa-plus"></i> Đăng tin tuyển dụng
        </button>
      </div>

      <div class="stat-grid mb-24">
        <div class="stat-card"><div class="stat-icon gradient-blue"><i class="fa-solid fa-briefcase" style="color:#fff"></i></div>
          <div class="stat-info"><div class="stat-value">${DB.recruitment.length}</div><div class="stat-label">Tổng vị trí</div></div></div>
        <div class="stat-card"><div class="stat-icon gradient-green"><i class="fa-solid fa-circle-dot" style="color:#fff"></i></div>
          <div class="stat-info"><div class="stat-value">${open}</div><div class="stat-label">Đang tuyển</div></div></div>
        <div class="stat-card"><div class="stat-icon gradient-orange"><i class="fa-solid fa-users" style="color:#fff"></i></div>
          <div class="stat-info"><div class="stat-value">${totalApplicants}</div><div class="stat-label">Tổng ứng viên</div></div></div>
        <div class="stat-card"><div class="stat-icon gradient-purple"><i class="fa-solid fa-check-double" style="color:#fff"></i></div>
          <div class="stat-info"><div class="stat-value">${closed}</div><div class="stat-label">Đã đóng</div></div></div>
      </div>

      <div class="grid-auto">
        ${DB.recruitment.map(r => {
          const dept = DB.getDept(r.dept);
          const daysLeft = Math.ceil((new Date(r.deadline)-new Date())/(1000*60*60*24));
          return `
            <div class="card" style="border-top:3px solid ${r.status==='open'?'var(--success)':'var(--text-muted)'}">
              <div style="padding:18px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                  <div>
                    <div style="font-size:15px;font-weight:700;color:var(--text-dark)">${r.title}</div>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${dept?.name||'—'} • ${r.count} vị trí</div>
                  </div>
                  <span class="status-badge status-${r.status==='open'?'active':'inactive'}">${r.status==='open'?'Đang tuyển':'Đã đóng'}</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:12px">
                  <div><i class="fa-solid fa-money-bill text-success"></i> ${r.salary}</div>
                  <div><i class="fa-solid fa-calendar text-warning"></i> Hạn: ${Utils.fmtDate(r.deadline)}</div>
                  <div><i class="fa-solid fa-users text-primary"></i> ${r.applicants} ứng viên</div>
                  <div><i class="fa-solid fa-clock ${daysLeft<7?'text-danger':'text-muted'}"></i> ${daysLeft>0?daysLeft+' ngày còn lại':'Đã hết hạn'}</div>
                </div>
                <div class="progress-bar mb-8">
                  <div class="progress-fill" style="width:${Math.min(100,r.applicants/5*10)}%;background:${r.status==='open'?'var(--success)':'var(--text-muted)'}"></div>
                </div>
                <div style="display:flex;gap:6px">
                  <button class="btn btn-sm btn-secondary" style="flex:1" onclick="Recruitment.viewApplicants(${r.id})">
                    <i class="fa-solid fa-eye"></i> Ứng viên
                  </button>
                  ${r.status==='open'?`<button class="btn btn-sm btn-warning" onclick="Recruitment.close(${r.id})"><i class="fa-solid fa-xmark"></i></button>`:''}
                  <button class="btn btn-sm btn-secondary btn-icon" onclick="Recruitment.delete(${r.id})" style="color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
  },

  viewApplicants(id) {
    const r = DB.recruitment.find(x=>x.id===id);
    const names = ['Nguyễn Anh Tuấn','Trần Thị Hoa','Lê Văn Bình','Phạm Minh Khoa','Đỗ Thị Linh'];
    const statuses = ['interview','applied','offer','rejected','applied'];
    Utils.openModal(`Ứng viên – ${r.title}`, `
      <p style="margin-bottom:12px;font-size:13px;color:var(--text-muted)">${r.applicants} ứng viên đã nộp hồ sơ</p>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Ứng viên</th><th>Email</th><th>Giai đoạn</th><th>Thao tác</th></tr></thead>
          <tbody>
            ${names.map((n,i)=>`<tr>
              <td><div class="emp-cell">
                <div class="emp-avatar-sm ${Utils.pickColor(i)}">${n.split(' ').slice(-2).map(w=>w[0]).join('')}</div>
                <div class="emp-name">${n}</div>
              </div></td>
              <td style="font-size:12px">${n.toLowerCase().replace(/ /g,'.')}@email.com</td>
              <td><span class="status-badge status-${statuses[i]==='offer'?'active':statuses[i]==='rejected'?'rejected':statuses[i]==='interview'?'pending':'leave'}">
                ${statuses[i]==='applied'?'Đã nộp':statuses[i]==='interview'?'Phỏng vấn':statuses[i]==='offer'?'Đề nghị':'Từ chối'}
              </span></td>
              <td><button class="btn btn-sm btn-primary" onclick="Utils.toast('Đã cập nhật','success')">Cập nhật</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    `, `<button class="btn btn-secondary" onclick="Utils.closeModal()">Đóng</button>`, true);
  },

  openAdd() {
    Utils.openModal('Đăng tin tuyển dụng', `
      <div class="form-group"><label class="form-label">Tên vị trí *</label>
        <input class="form-control" id="rTitle" placeholder="Ví dụ: Senior Developer" /></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Phòng ban</label>
          <select class="form-control" id="rDept">${DB.departments.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Số lượng tuyển</label>
          <input class="form-control" id="rCount" type="number" value="1" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Mức lương</label>
          <input class="form-control" id="rSalary" placeholder="15-20tr" /></div>
        <div class="form-group"><label class="form-label">Hạn nộp hồ sơ</label>
          <input class="form-control" id="rDeadline" type="date" /></div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Recruitment.saveAdd()"><i class="fa-solid fa-save"></i> Đăng tin</button>
    `);
  },
  saveAdd() {
    const title = document.getElementById('rTitle').value.trim();
    if (!title) { Utils.toast('Vui lòng nhập tên vị trí','warning'); return; }
    DB.recruitment.push({
      id: DB.recruitment.length+1,
      title,
      dept: parseInt(document.getElementById('rDept').value),
      count: parseInt(document.getElementById('rCount').value)||1,
      salary: document.getElementById('rSalary').value||'Thỏa thuận',
      deadline: document.getElementById('rDeadline').value||Utils.today(),
      status: 'open', applicants: 0,
    });
    Utils.closeModal();
    Utils.toast('Đã đăng tin tuyển dụng!','success');
    this.render();
  },
  close(id) {
    DB.recruitment.find(r=>r.id===id).status='closed';
    Utils.toast('Đã đóng tin tuyển dụng','success');
    this.render();
  },
  delete(id) {
    Utils.confirm('Xóa tin tuyển dụng này?', ()=>{
      DB.recruitment = DB.recruitment.filter(r=>r.id!==id);
      Utils.toast('Đã xóa','success'); this.render();
    });
  },
};
