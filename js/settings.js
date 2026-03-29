/* ═══════════════════════════════════════════════════
   HRM PRO – SETTINGS
═══════════════════════════════════════════════════ */

const Settings = {
  activeSection: 'company',

  sections: [
    {id:'company',  label:'Thông tin công ty',  icon:'fa-building'},
    {id:'profile',  label:'Hồ sơ cá nhân',       icon:'fa-user-circle'},
    {id:'salary',   label:'Cấu hình lương',       icon:'fa-coins'},
    {id:'leave',    label:'Chính sách nghỉ phép', icon:'fa-calendar-check'},
    {id:'notif',    label:'Thông báo',             icon:'fa-bell'},
    {id:'security', label:'Bảo mật',               icon:'fa-shield-halved'},
    {id:'backup',   label:'Sao lưu & Khôi phục',  icon:'fa-database'},
  ],

  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Cài đặt hệ thống</h1>
          <p>Cấu hình và tùy chỉnh hệ thống HRM Pro</p>
        </div>
      </div>
      <div class="settings-grid">
        <div class="settings-sidebar">
          ${this.sections.map(s=>`
            <div class="settings-nav-item ${this.activeSection===s.id?'active':''}" onclick="Settings.switchSection('${s.id}')">
              <i class="fa-solid ${s.icon}"></i>
              <span>${s.label}</span>
            </div>`).join('')}
        </div>
        <div id="settingsContent"></div>
      </div>
    `;
    this.renderSection(this.activeSection);
  },

  switchSection(id) {
    this.activeSection = id;
    document.querySelectorAll('.settings-nav-item').forEach((el,i)=>{
      el.classList.toggle('active', this.sections[i]?.id===id);
    });
    this.renderSection(id);
  },

  renderSection(id) {
    const c = document.getElementById('settingsContent');
    switch(id) {
      case 'company':  c.innerHTML = this.sectionCompany();  break;
      case 'profile':  c.innerHTML = this.sectionProfile();  break;
      case 'salary':   c.innerHTML = this.sectionSalary();   break;
      case 'leave':    c.innerHTML = this.sectionLeave();    break;
      case 'notif':    c.innerHTML = this.sectionNotif();    break;
      case 'security': c.innerHTML = this.sectionSecurity(); break;
      case 'backup':   c.innerHTML = this.sectionBackup();   break;
    }
  },

  sectionCompany() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Thông tin công ty</span></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
          <div style="width:80px;height:80px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;font-weight:800">H</div>
          <div>
            <div style="font-size:16px;font-weight:700">HRM Pro Corp</div>
            <div style="font-size:12px;color:var(--text-muted)">MST: 0123456789</div>
            <button class="btn btn-sm btn-secondary mt-8">Đổi logo</button>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Tên công ty</label>
            <input class="form-control" value="HRM Pro Corp" /></div>
          <div class="form-group"><label class="form-label">Mã số thuế</label>
            <input class="form-control" value="0123456789" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Email</label>
            <input class="form-control" value="contact@hrmpro.vn" /></div>
          <div class="form-group"><label class="form-label">Điện thoại</label>
            <input class="form-control" value="028 3823 0000" /></div>
        </div>
        <div class="form-group"><label class="form-label">Địa chỉ</label>
          <input class="form-control" value="123 Nguyễn Huệ, Q1, TP. Hồ Chí Minh" /></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Ngày thành lập</label>
            <input class="form-control" type="date" value="2015-03-15" /></div>
          <div class="form-group"><label class="form-label">Quy mô</label>
            <select class="form-control"><option>10–50 nhân viên</option><option selected>50–200 nhân viên</option><option>200–500 nhân viên</option></select></div>
        </div>
        <div style="text-align:right;margin-top:4px">
          <button class="btn btn-primary" onclick="Utils.toast('Đã lưu thông tin công ty!','success')">
            <i class="fa-solid fa-save"></i> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>`; },

  sectionProfile() { const me = DB.getEmp(12); return `
    <div class="card">
      <div class="card-header"><span class="card-title">Hồ sơ cá nhân</span></div>
      <div class="card-body">
        <div style="text-align:center;margin-bottom:20px">
          <div class="user-avatar ${me.color}" style="width:80px;height:80px;font-size:26px;margin:0 auto 10px">${me.avatar}</div>
          <button class="btn btn-sm btn-secondary">Đổi ảnh đại diện</button>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Họ và tên</label>
            <input class="form-control" value="${me.name}" /></div>
          <div class="form-group"><label class="form-label">Email</label>
            <input class="form-control" value="${me.email}" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Điện thoại</label>
            <input class="form-control" value="${me.phone}" /></div>
          <div class="form-group"><label class="form-label">Ngày sinh</label>
            <input class="form-control" type="date" value="${me.dob}" /></div>
        </div>
        <div style="text-align:right">
          <button class="btn btn-primary" onclick="Utils.toast('Đã cập nhật hồ sơ!','success')">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

  sectionSalary() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Cấu hình lương & Phụ cấp</span></div>
      <div class="card-body">
        ${[
          {label:'Lương tối thiểu vùng 1',val:'4,680,000đ'},
          {label:'Tỷ lệ đóng BHXH nhân viên',val:'8%'},
          {label:'Tỷ lệ đóng BHYT nhân viên',val:'1.5%'},
          {label:'Tỷ lệ đóng BHTN nhân viên',val:'1%'},
          {label:'Tỷ lệ đóng BHXH công ty',val:'17%'},
          {label:'Ngưỡng chịu thuế TNCN',val:'11,000,000đ / tháng'},
          {label:'Giảm trừ gia cảnh bản thân',val:'11,000,000đ'},
          {label:'Giảm trừ người phụ thuộc',val:'4,400,000đ / người'},
        ].map(r=>`
          <div class="perm-toggle">
            <span style="font-size:13px">${r.label}</span>
            <div style="display:flex;align-items:center;gap:8px">
              <input class="form-control" style="width:160px;text-align:right" value="${r.val}" />
            </div>
          </div>`).join('')}
        <div style="text-align:right;margin-top:16px">
          <button class="btn btn-primary" onclick="Utils.toast('Đã lưu cấu hình lương!','success')">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

  sectionLeave() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Chính sách nghỉ phép</span></div>
      <div class="card-body">
        ${[
          {label:'Nghỉ phép năm (toàn thời gian)',val:'12 ngày'},
          {label:'Nghỉ bệnh có lương',val:'30 ngày'},
          {label:'Nghỉ thai sản',val:'6 tháng'},
          {label:'Nghỉ hôn lễ',val:'3 ngày'},
          {label:'Nghỉ tang gia (thân nhân cấp 1)',val:'3 ngày'},
          {label:'Thử việc – nghỉ phép năm',val:'0 ngày (không tính)'},
        ].map(r=>`
          <div class="perm-toggle">
            <span>${r.label}</span>
            <input class="form-control" style="width:200px" value="${r.val}" />
          </div>`).join('')}
        <div style="text-align:right;margin-top:16px">
          <button class="btn btn-primary" onclick="Utils.toast('Đã lưu chính sách nghỉ phép!','success')">
            <i class="fa-solid fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>`; },

  sectionNotif() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Cài đặt thông báo</span></div>
      <div class="card-body">
        ${[
          {label:'Thông báo khi có đơn nghỉ phép mới',on:true},
          {label:'Thông báo nhắc nhở chấm công',on:true},
          {label:'Thông báo ngày phát lương',on:true},
          {label:'Thông báo sinh nhật nhân viên',on:false},
          {label:'Thông báo hết hạn bảo hành tài sản',on:true},
          {label:'Thông báo hợp đồng sắp hết hạn',on:true},
          {label:'Thông báo qua email',on:false},
        ].map(n=>`
          <div class="perm-toggle">
            <span>${n.label}</span>
            <label class="switch">
              <input type="checkbox" ${n.on?'checked':''} onchange="Utils.toast(this.checked?'Đã bật thông báo':'Đã tắt thông báo','info')" />
              <span class="slider"></span>
            </label>
          </div>`).join('')}
      </div>
    </div>`; },

  sectionSecurity() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Bảo mật tài khoản</span></div>
      <div class="card-body">
        <div class="form-group"><label class="form-label">Mật khẩu hiện tại</label>
          <input class="form-control" type="password" placeholder="••••••••" /></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Mật khẩu mới</label>
            <input class="form-control" type="password" placeholder="Tối thiểu 8 ký tự" /></div>
          <div class="form-group"><label class="form-label">Xác nhận mật khẩu</label>
            <input class="form-control" type="password" placeholder="Nhập lại mật khẩu" /></div>
        </div>
        <button class="btn btn-primary" onclick="Utils.toast('Đã đổi mật khẩu thành công!','success')">
          <i class="fa-solid fa-key"></i> Đổi mật khẩu
        </button>
        <hr class="divider" />
        <div style="font-size:14px;font-weight:600;margin-bottom:12px">Xác thực hai yếu tố (2FA)</div>
        <div class="perm-toggle">
          <span>Bật xác thực 2FA</span>
          <label class="switch"><input type="checkbox" onchange="Utils.toast('Cấu hình 2FA','info')" /><span class="slider"></span></label>
        </div>
        <hr class="divider" />
        <div style="font-size:14px;font-weight:600;margin-bottom:12px">Phiên đăng nhập</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">Các phiên đang hoạt động</div>
        ${[
          {device:'Chrome – Windows 11',ip:'203.162.xxx.xxx',time:'Hiện tại'},
          {device:'Safari – iPhone 15',ip:'203.162.xxx.yyy',time:'2 giờ trước'},
        ].map(s=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--bg);border-radius:8px;margin-bottom:6px">
            <div>
              <div style="font-size:13px;font-weight:600">${s.device}</div>
              <div style="font-size:11px;color:var(--text-muted)">${s.ip} • ${s.time}</div>
            </div>
            ${s.time!=='Hiện tại'?`<button class="btn btn-sm btn-danger" onclick="Utils.toast('Đã đăng xuất phiên','success')">Đăng xuất</button>`:'<span class="status-badge status-active">Đang dùng</span>'}
          </div>`).join('')}
      </div>
    </div>`; },

  sectionBackup() { return `
    <div class="card">
      <div class="card-header"><span class="card-title">Sao lưu & Khôi phục dữ liệu</span></div>
      <div class="card-body">
        <div style="background:var(--success-light);border-radius:10px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px">
          <i class="fa-solid fa-circle-check" style="color:var(--success);font-size:18px"></i>
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--success)">Sao lưu tự động đang hoạt động</div>
            <div style="font-size:12px;color:var(--success)">Lần sao lưu cuối: Hôm nay 03:00 AM</div>
          </div>
        </div>
        <div style="font-size:13px;font-weight:600;margin-bottom:12px">Lịch sử sao lưu</div>
        ${['Hôm nay 03:00','Hôm qua 03:00','26/03/2024 03:00','25/03/2024 03:00'].map((d,i)=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--bg);border-radius:8px;margin-bottom:6px">
            <div>
              <div style="font-size:13px;font-weight:600">Backup_${Utils.today()}_${i}.zip</div>
              <div style="font-size:11px;color:var(--text-muted)">${d} • ${(45+i*2).toFixed(1)} MB</div>
            </div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm btn-secondary" onclick="Utils.toast('Đang tải...','info')"><i class="fa-solid fa-download"></i></button>
              <button class="btn btn-sm btn-secondary" onclick="Utils.toast('Đang khôi phục...','warning')"><i class="fa-solid fa-rotate-left"></i></button>
            </div>
          </div>`).join('')}
        <hr class="divider" />
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" onclick="Utils.toast('Đang tạo bản sao lưu...','info');setTimeout(()=>Utils.toast('Sao lưu thành công!','success'),2000)">
            <i class="fa-solid fa-floppy-disk"></i> Sao lưu ngay
          </button>
          <button class="btn btn-secondary" onclick="Utils.toast('Chọn file để khôi phục','info')">
            <i class="fa-solid fa-upload"></i> Khôi phục từ file
          </button>
        </div>
      </div>
    </div>`; },
};
