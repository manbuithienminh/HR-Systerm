/* ═══════════════════════════════════════════════════
   HRM PRO – PERMISSION MANAGEMENT
═══════════════════════════════════════════════════ */

const Permissions = {
  selectedRole: 1,

  render() {
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Phân quyền</h1>
          <p>Quản lý vai trò và quyền hạn người dùng trong hệ thống</p>
        </div>
        <button class="btn btn-primary" onclick="Permissions.openAddRole()">
          <i class="fa-solid fa-plus"></i> Thêm vai trò
        </button>
      </div>

      <div style="display:grid;grid-template-columns:300px 1fr;gap:20px;align-items:start">
        <!-- ROLE LIST -->
        <div>
          <div class="card mb-16">
            <div class="card-header"><span class="card-title">Vai trò</span></div>
            <div id="roleList" style="padding:8px"></div>
          </div>
          <!-- Role users -->
          <div class="card">
            <div class="card-header"><span class="card-title">Người dùng trong vai trò</span></div>
            <div id="roleUsers" style="padding:12px"></div>
          </div>
        </div>

        <!-- PERMISSION DETAIL -->
        <div class="card">
          <div class="card-header">
            <span class="card-title" id="permTitle">Chi tiết quyền hạn</span>
            <button class="btn btn-sm btn-primary" onclick="Permissions.savePerms()">
              <i class="fa-solid fa-save"></i> Lưu thay đổi
            </button>
          </div>
          <div class="card-body" id="permDetail"></div>
        </div>
      </div>
    `;
    this.renderRoleList();
    this.renderPermDetail(this.selectedRole);
  },

  renderRoleList() {
    document.getElementById('roleList').innerHTML = DB.roles.map(r => `
      <div class="settings-nav-item ${r.id===this.selectedRole?'active':''}" onclick="Permissions.selectRole(${r.id})">
        <div class="role-icon ${r.color}" style="width:30px;height:30px;border-radius:8px;font-size:13px;color:#fff;display:flex;align-items:center;justify-content:center">
          <i class="fa-solid ${r.icon}"></i>
        </div>
        <div>
          <div style="font-size:13px">${r.name}</div>
          <div style="font-size:11px;opacity:.7">${r.users.length} người dùng</div>
        </div>
      </div>`).join('');
  },

  selectRole(id) {
    this.selectedRole = id;
    this.renderRoleList();
    this.renderPermDetail(id);
  },

  renderPermDetail(roleId) {
    const role = DB.roles.find(r=>r.id===roleId);
    if (!role) return;

    // Users
    const users = role.users.map(uid=>DB.getEmp(uid)).filter(Boolean);
    document.getElementById('roleUsers').innerHTML = users.length
      ? users.map(u=>`
        <div style="display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid var(--border-light)">
          <div class="emp-avatar-sm ${u.color}" style="width:28px;height:28px;font-size:10px">${u.avatar}</div>
          <div>
            <div style="font-size:12px;font-weight:600">${u.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${DB.getDeptName(u.dept)}</div>
          </div>
        </div>`).join('')
      : '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:8px">Chưa có người dùng</p>';

    document.getElementById('permTitle').innerHTML = `
      <div style="display:flex;align-items:center;gap:10px">
        <div class="role-icon ${role.color}" style="width:36px;height:36px;border-radius:10px;font-size:16px;color:#fff;display:flex;align-items:center;justify-content:center">
          <i class="fa-solid ${role.icon}"></i>
        </div>
        <div>
          <div>${role.name}</div>
          <div style="font-size:12px;font-weight:400;color:var(--text-muted)">${role.desc}</div>
        </div>
      </div>`;

    const allPerms = ['Xem','Thêm','Sửa','Xóa','Duyệt','Xuất','Xuất phiếu','Tạo','Xem phiếu lương cá nhân','Xem tài sản cá nhân'];

    document.getElementById('permDetail').innerHTML = `
      <div style="display:grid;gap:16px">
        ${Object.entries(role.permissions).map(([module, perms]) => `
          <div style="background:var(--bg);border-radius:10px;padding:16px">
            <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">
              <i class="fa-solid fa-puzzle-piece" style="margin-right:4px"></i> ${module}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px">
              ${allPerms.filter(p=>p!=='Xem phiếu lương cá nhân'&&p!=='Xem tài sản cá nhân'||module==='Tính lương'||module==='Tài sản').map(perm => {
                const checked = perms.includes(perm);
                return `
                  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;padding:6px 10px;border-radius:6px;background:${checked?'var(--primary-light)':'var(--bg-card)'};border:1px solid ${checked?'var(--primary)':'var(--border)'}">
                    <input type="checkbox" ${checked?'checked':''} data-role="${roleId}" data-module="${module}" data-perm="${perm}" onchange="Permissions.togglePerm(this)" style="accent-color:var(--primary)" />
                    <span style="color:${checked?'var(--primary)':'var(--text-muted)'}">${perm}</span>
                  </label>`;
              }).join('')}
            </div>
          </div>`).join('')}
      </div>`;
  },

  togglePerm(el) {
    const roleId = parseInt(el.dataset.role);
    const module = el.dataset.module;
    const perm   = el.dataset.perm;
    const role = DB.roles.find(r=>r.id===roleId);
    if (!role) return;
    const perms = role.permissions[module];
    if (el.checked) { if (!perms.includes(perm)) perms.push(perm); }
    else { role.permissions[module] = perms.filter(p=>p!==perm); }
    // Re-style the label
    el.parentElement.style.background = el.checked ? 'var(--primary-light)' : 'var(--bg-card)';
    el.parentElement.style.borderColor = el.checked ? 'var(--primary)' : 'var(--border)';
    el.parentElement.querySelector('span').style.color = el.checked ? 'var(--primary)' : 'var(--text-muted)';
  },

  savePerms() {
    Utils.toast('Đã lưu cài đặt phân quyền!', 'success');
  },

  openAddRole() {
    Utils.openModal('Thêm vai trò mới', `
      <div class="form-group">
        <label class="form-label">Tên vai trò *</label>
        <input class="form-control" id="rName" placeholder="Ví dụ: Team Lead" />
      </div>
      <div class="form-group">
        <label class="form-label">Mô tả</label>
        <input class="form-control" id="rDesc" placeholder="Mô tả vai trò..." />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Màu sắc</label>
          <select class="form-control" id="rColor">
            <option value="gradient-indigo">Indigo</option>
            <option value="gradient-purple">Tím</option>
            <option value="gradient-blue">Xanh dương</option>
            <option value="gradient-green">Xanh lá</option>
            <option value="gradient-orange">Cam</option>
            <option value="gradient-teal">Teal</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Icon</label>
          <select class="form-control" id="rIcon">
            <option value="fa-user">Người dùng</option>
            <option value="fa-user-tie">Quản lý</option>
            <option value="fa-shield-halved">Bảo mật</option>
            <option value="fa-briefcase">Công việc</option>
            <option value="fa-star">Ngôi sao</option>
          </select>
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Hủy</button>
      <button class="btn btn-primary" onclick="Permissions.saveNewRole()"><i class="fa-solid fa-save"></i> Tạo vai trò</button>
    `);
  },

  saveNewRole() {
    const name = document.getElementById('rName').value.trim();
    if (!name) { Utils.toast('Vui lòng nhập tên vai trò','warning'); return; }
    const newRole = {
      id: DB.roles.length+1,
      name,
      desc: document.getElementById('rDesc').value.trim(),
      color: document.getElementById('rColor').value,
      icon: document.getElementById('rIcon').value,
      users: [],
      permissions: {
        'Quản lý nhân viên':['Xem'],
        'Chấm công':['Xem'],
        'Tính lương':[],
        'Văn bản':['Xem'],
        'Tài sản':['Xem'],
        'Báo cáo':[],
        'Cài đặt':[],
        'Phân quyền':[],
      },
    };
    DB.roles.push(newRole);
    Utils.closeModal();
    Utils.toast(`Đã tạo vai trò "${name}"`, 'success');
    this.render();
  },
};
