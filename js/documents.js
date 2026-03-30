/* ═══════════════════════════════════════════════════
   HRM PRO – DOCUMENT MANAGEMENT
═══════════════════════════════════════════════════ */

const Documents = {
  page: 1,
  perPage: 8,
  filter: { type: '', status: '', q: '' },

  render() {
    const types   = [...new Set(DB.documents.map(d=>d.type))];
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <h1>Quản lý văn bản</h1>
          <p>Tạo lập, lưu trữ và quản lý toàn bộ văn bản nội bộ</p>
        </div>
        <button class="btn btn-primary" onclick="Documents.openCreate()">
          <i class="fa-solid fa-file-circle-plus"></i> Tạo văn bản mới
        </button>
      </div>

      <!-- STAT CARDS -->
      <div class="stat-grid mb-20">
        ${this.renderStats()}
      </div>

      <!-- FILTERS -->
      <div class="card mb-20">
        <div class="card-body" style="padding:14px 20px">
          <div class="toolbar">
            <div class="toolbar-left">
              <div class="search-input">
                <i class="fa-solid fa-search"></i>
                <input type="text" placeholder="Tìm mã, tiêu đề văn bản..." id="docSearch"
                  oninput="Documents.onSearch(this.value)" />
              </div>
              <select class="filter-select" id="docTypeFilter" onchange="Documents.onFilter()">
                <option value="">Tất cả loại văn bản</option>
                ${types.map(t=>`<option value="${t}">${t}</option>`).join('')}
              </select>
              <select class="filter-select" id="docStatusFilter" onchange="Documents.onFilter()">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hiệu lực</option>
                <option value="draft">Nháp</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- DOCUMENT LIST -->
      <div class="card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Mã VB</th><th>Tiêu đề</th><th>Loại</th><th>Người tạo</th>
                <th>Ngày tạo</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody id="docTbody"></tbody>
          </table>
        </div>
        <div id="docPagination" class="pagination" style="border-top:1px solid var(--border-light)"></div>
      </div>
    `;
    this.renderTable();
  },

  renderStats() {
    const docs = DB.documents;
    return `
      <div class="stat-card">
        <div class="stat-icon gradient-blue"><i class="fa-solid fa-file-lines" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${docs.length}</div><div class="stat-label">Tổng văn bản</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-green"><i class="fa-solid fa-circle-check" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${docs.filter(d=>d.status==='active').length}</div><div class="stat-label">Đang hiệu lực</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-orange"><i class="fa-solid fa-pen-to-square" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${docs.filter(d=>d.status==='draft').length}</div><div class="stat-label">Bản nháp</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gradient-purple"><i class="fa-solid fa-clock" style="color:#fff"></i></div>
        <div class="stat-info"><div class="stat-value">${docs.filter(d=>d.status==='pending').length}</div><div class="stat-label">Chờ duyệt</div></div>
      </div>`;
  },

  getFiltered() {
    let list = [...DB.documents];
    const { type, status, q } = this.filter;
    if (type)   list = list.filter(d=>d.type===type);
    if (status) list = list.filter(d=>d.status===status);
    if (q)      list = list.filter(d=>
      d.title.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
    return list.sort((a,b)=>b.date.localeCompare(a.date));
  },

  renderTable() {
    const filtered = this.getFiltered();
    const paged = Utils.paginate(filtered, this.page, this.perPage);

    const typeIcons = {
      'Quyết định':'fa-gavel','Thông báo':'fa-bullhorn','Quy chế':'fa-book',
      'Hợp đồng':'fa-file-contract','Biên bản':'fa-clipboard',
      'Thư nhắc nhở':'fa-envelope','Kế hoạch':'fa-calendar-days',
      'Báo cáo':'fa-chart-bar','Đề xuất':'fa-lightbulb','Hướng dẫn':'fa-circle-info',
    };
    const typeColors = {
      'Quyết định':'gradient-red','Thông báo':'gradient-orange','Quy chế':'gradient-purple',
      'Hợp đồng':'gradient-blue','Biên bản':'gradient-teal',
      'Thư nhắc nhở':'gradient-pink','Kế hoạch':'gradient-indigo',
      'Báo cáo':'gradient-green','Đề xuất':'gradient-orange','Hướng dẫn':'gradient-blue',
    };

    document.getElementById('docTbody').innerHTML = paged.items.map(d => {
      const author = DB.getEmp(d.author);
      const icon   = typeIcons[d.type] || 'fa-file';
      const color  = typeColors[d.type] || 'gradient-indigo';
      return `
        <tr>
          <td><span style="font-family:monospace;font-size:12px;color:var(--text-muted)">${d.code}</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="stat-icon ${color}" style="width:32px;height:32px;border-radius:8px;font-size:13px">
                <i class="fa-solid ${icon}" style="color:#fff"></i>
              </div>
              <div>
                <div style="font-weight:600;color:var(--text-dark);font-size:13px">${d.title}</div>
                <div style="font-size:11px;margin-top:2px">
                  ${d.tags.map(t=>`<span class="perm-tag">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          </td>
          <td><span style="font-size:12px;font-weight:600">${d.type}</span></td>
          <td>
            <div class="emp-cell">
              <div class="emp-avatar-sm ${author?.color||''}" style="width:24px;height:24px;font-size:9px">${author?.avatar||'?'}</div>
              <span style="font-size:12px">${author?.name||'—'}</span>
            </div>
          </td>
          <td style="font-size:12px;color:var(--text-muted)">${Utils.fmtDate(d.date)}</td>
          <td>
            <span class="status-badge status-${d.status==='active'?'active':d.status==='pending'?'pending':'draft'}">
              ${d.status==='active'?'Hiệu lực':d.status==='pending'?'Chờ duyệt':'Nháp'}
            </span>
          </td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn btn-sm btn-secondary btn-icon" title="Xem" onclick="Documents.view(${d.id})"><i class="fa-solid fa-eye"></i></button>
              <button class="btn btn-sm btn-secondary btn-icon" title="Chỉnh sửa" onclick="Documents.openEdit(${d.id})"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-sm btn-secondary btn-icon" title="In" onclick="Documents._printById(${d.id})"><i class="fa-solid fa-print"></i></button>
              <button class="btn btn-sm btn-secondary btn-icon" title="Xóa" onclick="Documents.delete(${d.id})" style="color:var(--danger)"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
    }).join('') || `<tr><td colspan="7"><div class="empty-state"><i class="fa-solid fa-folder-open"></i><h3>Không có văn bản</h3></div></td></tr>`;

    Utils.renderPagination('docPagination', paged, 'Documents.goPage');
  },

  onSearch: Utils.debounce(function(q) { Documents.filter.q=q.toLowerCase(); Documents.page=1; Documents.renderTable(); }, 300),
  onFilter() {
    this.filter.type   = document.getElementById('docTypeFilter').value;
    this.filter.status = document.getElementById('docStatusFilter').value;
    this.page = 1; this.renderTable();
  },
  goPage(p) { Documents.page = p; Documents.renderTable(); },

  view(id) {
    const d = DB.documents.find(doc=>doc.id===id);
    if (!d) return;
    const signer = DB.getEmp(d.signer);
    const statusLabel = d.status==='active'?'Hiệu lực':d.status==='pending'?'Chờ duyệt':'Nháp';
    const statusCls   = d.status==='active'?'active':d.status==='pending'?'pending':'draft';
    Utils.openModal(`${d.code} – ${d.title}`, `
      <div style="background:var(--bg);border-radius:10px;padding:14px 16px;margin-bottom:16px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${[
          {label:'Mã văn bản',  val: d.code},
          {label:'Ngày ban hành', val: Utils.fmtDate(d.date)},
          {label:'Loại văn bản', val: d.type},
          {label:'Người ký',    val: signer?.name||'—'},
          {label:'Bộ phận',     val: d.dept?DB.getDeptName(d.dept):'Toàn công ty'},
          {label:'Trạng thái',  val: `<span class="status-badge status-${statusCls}">${statusLabel}</span>`},
        ].map(r=>`<div><div style="font-size:11px;color:var(--text-muted)">${r.label}</div><div style="font-size:13px;font-weight:600;margin-top:2px">${r.val}</div></div>`).join('')}
      </div>
      ${d.summary?`<div style="font-size:12px;color:var(--text-muted);font-style:italic;margin-bottom:12px;padding:8px 12px;background:var(--bg);border-radius:6px"><i class="fa-solid fa-quote-left"></i> ${d.summary}</div>`:''}
      <div style="border:1px solid var(--border);border-radius:8px;background:#fff;padding:32px 40px;font-family:'Times New Roman',serif;font-size:13pt;line-height:1.6;max-height:60vh;overflow-y:auto">
        ${d.body || '<p style="color:#999;font-style:italic">Chưa có nội dung</p>'}
      </div>
    `, `
      <button class="btn btn-secondary" onclick="Utils.closeModal()">Đóng</button>
      <button class="btn btn-secondary" onclick="Utils.closeModal();Documents.openEdit(${d.id})"><i class="fa-solid fa-pen"></i> Chỉnh sửa</button>
      <button class="btn btn-primary" onclick="Documents._printById(${d.id})"><i class="fa-solid fa-print"></i> In</button>
    `, true);
  },

  _printById(id) {
    const d = DB.documents.find(doc=>doc.id===id);
    if (!d) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`<!DOCTYPE html><html><head><title>${d.title}</title>
      <style>
        body{font-family:'Times New Roman',serif;font-size:13pt;line-height:1.6;color:#222;padding:72px 80px}
        h1{font-size:20pt}h2{font-size:16pt}h3{font-size:13pt}
        table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:6px 10px}
        @media print{body{padding:0}}
      </style></head><body>${d.body||''}</body></html>`);
    win.document.close(); win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  },

  openCreate() { this.renderEditor(null); },
  openEdit(id)  { this.renderEditor(DB.documents.find(d=>d.id===id)); },

  renderEditor(doc) {
    const isEdit = !!doc;
    const types  = ['Quyết định','Thông báo','Quy chế','Hợp đồng','Biên bản','Thư nhắc nhở','Kế hoạch','Báo cáo','Đề xuất','Hướng dẫn'];
    const autoCode = `VB${String(DB.documents.length+1).padStart(3,'0')}`;
    const empOpts  = DB.employees.filter(e=>e.status==='active')
      .map(e=>`<option value="${e.id}" ${doc?.signer===e.id?'selected':''}>${e.name}${e.pos?' – '+e.pos:''}</option>`).join('');
    const deptOpts = DB.departments
      .map(d=>`<option value="${d.id}" ${doc?.dept===d.id?'selected':''}>${d.name}</option>`).join('');
    const fontFamilies = ['Times New Roman','Arial','Calibri','Tahoma','Georgia','Verdana','Courier New'];
    const fontSizes    = [8,9,10,11,12,14,16,18,20,24,28,32,36,48,72];
    const content = document.getElementById('pageContent');
    content.innerHTML = `
    <div class="doc-editor-wrap">
      <!-- TOP BAR -->
      <div class="doc-editor-topbar">
        <button class="btn btn-secondary btn-sm" onclick="Documents.render()" title="Quay lại">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <input class="doc-title-input" id="deTitle" placeholder="Nhập tiêu đề văn bản…"
          value="${doc?.title||''}"
          oninput="document.getElementById('deSummary').value=this.value" />
        <div style="display:flex;gap:8px;flex-shrink:0">
          <button class="btn btn-secondary btn-sm" onclick="Documents._saveDoc('draft')">
            <i class="fa-solid fa-floppy-disk"></i> Lưu nháp
          </button>
          <button class="btn btn-warning btn-sm" style="color:#fff" onclick="Documents._saveDoc('pending')">
            <i class="fa-solid fa-paper-plane"></i> Gửi duyệt
          </button>
          <button class="btn btn-primary btn-sm" onclick="Documents._saveDoc('active')">
            <i class="fa-solid fa-circle-check"></i> Phát hành
          </button>
        </div>
      </div>

      <!-- BODY -->
      <div class="doc-editor-body">

        <!-- LEFT: METADATA -->
        <div class="doc-meta-panel">
          <div style="font-size:12px;font-weight:700;color:var(--primary);margin-bottom:14px;display:flex;align-items:center;gap:6px">
            <i class="fa-solid fa-circle-info"></i> Thông số văn bản
          </div>
          <input type="hidden" id="deDocId" value="${doc?.id||''}">

          <div class="form-group">
            <label class="form-label">Số hiệu văn bản</label>
            <input class="form-input" id="deCode" value="${doc?.code||autoCode}" placeholder="VB001/2026/HCNS" />
          </div>
          <div class="form-group">
            <label class="form-label">Ngày ban hành</label>
            <input class="form-input" id="deDate" type="date" value="${doc?.date||Utils.today()}" />
          </div>
          <div class="form-group">
            <label class="form-label">Nội dung trích yếu</label>
            <textarea class="form-input" id="deSummary" rows="3"
              placeholder="Tự động lấy từ tiêu đề…">${doc?.summary||doc?.title||''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Loại văn bản</label>
            <select class="form-input" id="deType">
              ${types.map(t=>`<option value="${t}" ${doc?.type===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Người ký</label>
            <select class="form-input" id="deSigner">
              <option value="">— Chưa chọn —</option>
              ${empOpts}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Bộ phận / Đơn vị liên quan</label>
            <select class="form-input" id="deDept">
              <option value="0" ${!doc?.dept?'selected':''}>Toàn công ty</option>
              ${deptOpts}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tags</label>
            <input class="form-input" id="deTags" value="${(doc?.tags||[]).join(', ')}" placeholder="nội quy, HR, 2026…" />
          </div>
          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <select class="form-input" id="deStatus">
              <option value="draft"   ${doc?.status==='draft'  ?'selected':''}>Nháp</option>
              <option value="pending" ${doc?.status==='pending'?'selected':''}>Chờ duyệt</option>
              <option value="active"  ${doc?.status==='active' ?'selected':''}>Hiệu lực</option>
            </select>
          </div>
        </div>

        <!-- RIGHT: RICH TEXT EDITOR -->
        <div class="doc-canvas-panel">

          <!-- TOOLBAR -->
          <div class="doc-toolbar" id="docToolbar">
            <!-- Undo / Redo -->
            <button class="doc-toolbar-btn" title="Hoàn tác (Ctrl+Z)" onclick="document.execCommand('undo')"><i class="fa-solid fa-rotate-left"></i></button>
            <button class="doc-toolbar-btn" title="Làm lại (Ctrl+Y)"  onclick="document.execCommand('redo')"><i class="fa-solid fa-rotate-right"></i></button>
            <div class="doc-toolbar-sep"></div>

            <!-- Font family -->
            <select id="deFontFamily" title="Phông chữ" onchange="Documents._execFont(this.value)"
              style="width:130px">
              ${fontFamilies.map(f=>`<option value="${f}">${f}</option>`).join('')}
            </select>

            <!-- Font size -->
            <select id="deFontSize" title="Cỡ chữ" onchange="Documents._execSize(this.value)"
              style="width:60px">
              ${fontSizes.map(s=>`<option value="${s}" ${s===12?'selected':''}>${s}</option>`).join('')}
            </select>
            <div class="doc-toolbar-sep"></div>

            <!-- Heading -->
            <select id="deHeading" title="Kiểu đoạn" onchange="document.execCommand('formatBlock',false,this.value)" style="width:90px">
              <option value="p">Thường</option>
              <option value="h1">Tiêu đề 1</option>
              <option value="h2">Tiêu đề 2</option>
              <option value="h3">Tiêu đề 3</option>
            </select>
            <div class="doc-toolbar-sep"></div>

            <!-- Bold / Italic / Underline / Strike -->
            <button class="doc-toolbar-btn" title="In đậm (Ctrl+B)"    onclick="document.execCommand('bold')"><b>B</b></button>
            <button class="doc-toolbar-btn" title="In nghiêng (Ctrl+I)" onclick="document.execCommand('italic')"><i>I</i></button>
            <button class="doc-toolbar-btn" title="Gạch chân (Ctrl+U)" onclick="document.execCommand('underline')"><u>U</u></button>
            <button class="doc-toolbar-btn" title="Gạch ngang"          onclick="document.execCommand('strikeThrough')"><s>S</s></button>
            <div class="doc-toolbar-sep"></div>

            <!-- Color -->
            <span title="Màu chữ" style="display:flex;align-items:center;gap:2px;font-size:11px;color:var(--text-muted)">
              A <input type="color" id="deForeColor" value="#000000" title="Màu chữ"
                onchange="document.execCommand('foreColor',false,this.value)">
            </span>
            <span title="Màu nền" style="display:flex;align-items:center;gap:2px;font-size:11px;color:var(--text-muted)">
              <i class="fa-solid fa-highlighter" style="font-size:11px"></i>
              <input type="color" id="deHighlight" value="#ffff00" title="Màu nền chữ"
                onchange="document.execCommand('hiliteColor',false,this.value)">
            </span>
            <div class="doc-toolbar-sep"></div>

            <!-- Align -->
            <button class="doc-toolbar-btn" title="Căn trái"  onclick="document.execCommand('justifyLeft')"><i class="fa-solid fa-align-left"></i></button>
            <button class="doc-toolbar-btn" title="Căn giữa"  onclick="document.execCommand('justifyCenter')"><i class="fa-solid fa-align-center"></i></button>
            <button class="doc-toolbar-btn" title="Căn phải"  onclick="document.execCommand('justifyRight')"><i class="fa-solid fa-align-right"></i></button>
            <button class="doc-toolbar-btn" title="Căn đều"   onclick="document.execCommand('justifyFull')"><i class="fa-solid fa-align-justify"></i></button>
            <div class="doc-toolbar-sep"></div>

            <!-- Lists -->
            <button class="doc-toolbar-btn" title="Danh sách có số"   onclick="document.execCommand('insertOrderedList')"><i class="fa-solid fa-list-ol"></i></button>
            <button class="doc-toolbar-btn" title="Danh sách chấm"    onclick="document.execCommand('insertUnorderedList')"><i class="fa-solid fa-list-ul"></i></button>
            <button class="doc-toolbar-btn" title="Thụt vào"          onclick="document.execCommand('indent')"><i class="fa-solid fa-indent"></i></button>
            <button class="doc-toolbar-btn" title="Thụt ra"           onclick="document.execCommand('outdent')"><i class="fa-solid fa-outdent"></i></button>
            <div class="doc-toolbar-sep"></div>

            <!-- Insert -->
            <button class="doc-toolbar-btn" title="Chèn liên kết"  onclick="Documents._insertLink()"><i class="fa-solid fa-link"></i></button>
            <button class="doc-toolbar-btn" title="Chèn bảng"      onclick="Documents._insertTable()"><i class="fa-solid fa-table"></i></button>
            <button class="doc-toolbar-btn" title="Đường kẻ ngang" onclick="document.execCommand('insertHorizontalRule')"><i class="fa-solid fa-minus"></i></button>
            <div class="doc-toolbar-sep"></div>

            <!-- Clear / Print -->
            <button class="doc-toolbar-btn" title="Xóa định dạng" onclick="document.execCommand('removeFormat')"><i class="fa-solid fa-eraser"></i></button>
            <button class="doc-toolbar-btn" title="In văn bản"    onclick="Documents._printDoc()"><i class="fa-solid fa-print"></i></button>
          </div>

          <!-- PAPER -->
          <div class="doc-paper-scroll">
            <div class="doc-paper" id="docPaper" contenteditable="true"
              spellcheck="false"
              onkeydown="Documents._onEditorKey(event)">${doc?.body||'<p>Nhập nội dung văn bản tại đây…</p>'}</div>
          </div>
        </div>
      </div>
    </div>`;

    // Focus editor
    setTimeout(() => {
      const paper = document.getElementById('docPaper');
      if (paper) { paper.focus(); document.execCommand('defaultParagraphSeparator', false, 'p'); }
    }, 100);
  },

  _execFont(font) {
    document.getElementById('docPaper').focus();
    document.execCommand('fontName', false, font);
  },

  _execSize(size) {
    // execCommand fontSize only takes 1-7; use workaround via span
    document.getElementById('docPaper').focus();
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) return;
    document.execCommand('fontSize', false, '7');
    document.querySelectorAll('#docPaper font[size="7"]').forEach(el => {
      el.removeAttribute('size');
      el.style.fontSize = size + 'pt';
    });
  },

  _insertLink() {
    const url = prompt('Nhập URL liên kết:');
    if (url) document.execCommand('createLink', false, url);
  },

  _insertTable() {
    const rows = parseInt(prompt('Số hàng:', '3')) || 3;
    const cols = parseInt(prompt('Số cột:', '3')) || 3;
    let html = '<table><thead><tr>' + Array(cols).fill('<th>Tiêu đề</th>').join('') + '</tr></thead><tbody>';
    for (let r=0; r<rows-1; r++) html += '<tr>' + Array(cols).fill('<td></td>').join('') + '</tr>';
    html += '</tbody></table><p></p>';
    document.getElementById('docPaper').focus();
    document.execCommand('insertHTML', false, html);
  },

  _printDoc() {
    const title = document.getElementById('deTitle')?.value || 'Văn bản';
    const body  = document.getElementById('docPaper')?.innerHTML || '';
    const win   = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
      <style>
        body { font-family:'Times New Roman',serif; font-size:13pt; line-height:1.6; color:#222; padding:72px 80px; }
        h1{font-size:20pt} h2{font-size:16pt} h3{font-size:13pt}
        table{border-collapse:collapse;width:100%} td,th{border:1px solid #999;padding:6px 10px}
        @media print { body { padding: 0; } }
      </style></head><body>${body}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  },

  _onEditorKey(e) {
    // Tab → indent
    if (e.key === 'Tab') { e.preventDefault(); document.execCommand(e.shiftKey ? 'outdent' : 'indent'); }
  },

  _saveDoc(statusOverride) {
    const title = (document.getElementById('deTitle')?.value || '').trim();
    if (!title) { Utils.toast('Vui lòng nhập tiêu đề văn bản', 'warning'); document.getElementById('deTitle')?.focus(); return; }

    const id      = parseInt(document.getElementById('deDocId')?.value) || null;
    const status  = statusOverride || document.getElementById('deStatus')?.value || 'draft';
    const body    = document.getElementById('docPaper')?.innerHTML || '';
    const tags    = (document.getElementById('deTags')?.value||'').split(',').map(t=>t.trim()).filter(Boolean);

    const record = {
      id:      id || (DB.documents.length ? Math.max(...DB.documents.map(d=>d.id)) : 0) + 1,
      code:    (document.getElementById('deCode')?.value || '').trim(),
      title,
      summary: (document.getElementById('deSummary')?.value || title).trim(),
      type:    document.getElementById('deType')?.value || 'Thông báo',
      signer:  parseInt(document.getElementById('deSigner')?.value) || null,
      dept:    parseInt(document.getElementById('deDept')?.value) || 0,
      date:    document.getElementById('deDate')?.value || Utils.today(),
      status,
      tags,
      body,
      author:  null,
      updatedAt: new Date().toISOString(),
    };

    if (id) {
      const idx = DB.documents.findIndex(d=>d.id===id);
      if (idx>=0) DB.documents[idx] = record;
    } else {
      DB.documents.unshift(record);
    }

    DB.save('documents');
    const labels = { draft:'Đã lưu nháp', pending:'Đã gửi duyệt', active:'Đã phát hành' };
    Utils.toast(labels[status]||'Đã lưu', 'success');
    if (status !== 'draft') { setTimeout(() => Documents.render(), 800); }
  },

  saveCreate() { this._saveDoc(); },

  delete(id) {
    const d = DB.documents.find(doc=>doc.id===id);
    Utils.confirm(`Xóa văn bản <strong>${d.code}</strong>?`, () => {
      DB.documents = DB.documents.filter(doc=>doc.id!==id);
      Utils.toast('Đã xóa văn bản', 'success');
      this.renderTable();
    });
  },
};
