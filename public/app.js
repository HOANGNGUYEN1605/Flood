// FloodSafe Đà Nẵng – Ultra-Modern Application Logic with Complete DFD Specification
(function () {
  'use strict';

  /* ── Color & Theme Maps ── */
  var MAU = {
    'Bình thường': '#16a34a',
    'Cảnh báo': '#eab308',
    'Nguy hiểm': '#ea580c',
    'Khẩn cấp': '#dc2626',
    'Mất kết nối – dữ liệu cũ': '#94a3b8',
  };

  var LOP = {
    'Bình thường': 'binhthuong',
    'Cảnh báo': 'canhbao',
    'Nguy hiểm': 'nguyhiem',
    'Khẩn cấp': 'khancap',
    'Mất kết nối – dữ liệu cũ': 'matketnoi',
  };

  var ICON_MARKER = {
    'binhthuong': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    'canhbao': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'nguyhiem': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'khancap': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'matketnoi': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/></svg>',
    'chuachon': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  };

  var BADGE_ICON = {
    'binhthuong': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
    'canhbao': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
    'nguyhiem': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'khancap': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'matketnoi': '⚠',
    'chuachon': '?',
  };

  var VEHICLE_ICON = {
    'XM': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h4"/></svg>',
    'OT_THAP': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="8" width="22" height="8" rx="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg>',
    'OT_CAO': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="10" rx="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M2 12h20"/></svg>',
  };

  var ONBOARD_ICON = {
    'XM': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h4"/></svg>',
    'OT_THAP': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8" width="22" height="8" rx="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg>',
    'OT_CAO': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="10" rx="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M2 12h20"/></svg>',
  };

  var ONBOARD_DESC = {
    'XM': 'Nhạy cảm nhất với nước ngập và dòng chảy.',
    'OT_THAP': 'Phù hợp sedan và hatchback phổ biến.',
    'OT_CAO': 'Dành cho SUV và bán tải có gầm cao.',
  };

  var ALERT_MSG = {
    'Bình thường': 'Có thể lưu thông, vẫn chú ý quan sát.',
    'Cảnh báo': 'Đi chậm, cân nhắc chọn tuyến khác.',
    'Nguy hiểm': 'Không nên đi qua đoạn đường ngập.',
    'Khẩn cấp': 'Tuyệt đối không đi qua, hãy quay đầu.',
    'Mất kết nối – dữ liệu cũ': 'Chưa nhận được dữ liệu mới từ trạm.',
  };

  var MUC_SORT = { 'Khẩn cấp': 0, 'Nguy hiểm': 1, 'Cảnh báo': 2, 'Bình thường': 3, 'Mất kết nối – dữ liệu cũ': 4 };

  /* ── State ── */
  var loaiXe = docLuu(); // FR-13: lưu loại xe trên thiết bị
  var khuVuc = '';       // F03: lọc theo khu vực
  var cauHinh = null;
  var map, markers = {}, daFit = false, timer = null, lanCuoi = null;
  var activeStationId = null;

  /* ── Helpers ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function docLuu() { try { return localStorage.getItem('loai_xe') || null; } catch (e) { return null; } }
  function ghiLuu(v) { try { localStorage.setItem('loai_xe', v); } catch (e) {} }

  function gio(iso) {
    var d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }

  function tuoi(serverTime, iso) {
    var s = Math.max(0, Math.round((new Date(serverTime) - new Date(iso)) / 1000));
    if (s < 10) return 'Vừa xong';
    if (s < 60) return s + ' giây trước';
    if (s < 3600) return Math.floor(s / 60) + ' phút trước';
    return Math.floor(s / 3600) + ' giờ trước';
  }

  function parseStationName(t) {
    var raw = t.ten_vi_tri || '';
    if (raw.indexOf('–') !== -1) {
      var parts = raw.split('–');
      return {
        title: parts[0].trim(),
        sub: parts[1] ? parts[1].trim() : (t.khu_vuc || '')
      };
    }
    return {
      title: raw || t.ma_tram,
      sub: t.khu_vuc || ''
    };
  }

  function getShortLocationLabel(t) {
    if (t.khu_vuc) return t.khu_vuc.toUpperCase();
    var p = parseStationName(t);
    return p.title.replace(/^Trạm\s+/i, '').toUpperCase();
  }

  /* ═══════════════════════════════════════════════
     ONBOARDING SCREEN
     ═══════════════════════════════════════════════ */
  function dungOnboarding() {
    var box = document.getElementById('onboarding-options');
    var btn = document.getElementById('onboarding-btn');
    var selected = loaiXe;
    box.innerHTML = '';

    cauHinh.loai_xe.forEach(function (x) {
      var opt = document.createElement('div');
      opt.className = 'onboarding-opt' + (x.loai_xe === selected ? ' selected' : '');
      opt.innerHTML =
        '<div class="onboarding-opt-icon">' + (ONBOARD_ICON[x.loai_xe] || '') + '</div>' +
        '<div class="onboarding-opt-name">' + esc(x.ten_loai_xe) + '</div>' +
        '<div class="onboarding-opt-desc">' + (ONBOARD_DESC[x.loai_xe] || '') + '</div>';
      opt.addEventListener('click', function () {
        selected = x.loai_xe;
        Array.from(box.children).forEach(function (c) { c.classList.remove('selected'); });
        opt.classList.add('selected');
        btn.disabled = false;
      });
      box.appendChild(opt);
    });

    if (selected) btn.disabled = false;

    btn.onclick = function () {
      if (!selected) return;
      loaiXe = selected;
      ghiLuu(loaiXe);
      document.getElementById('onboarding').style.display = 'none';
      document.getElementById('app').style.display = 'flex';
      dungVehiclePills();
      dungThresholdTable();
      capNhatTagXeTrenBangTimDuong();
      if (map) {
        setTimeout(function () { map.invalidateSize(); }, 150);
      }
      tai();
    };

    var helpBtn = document.getElementById('btn-onboarding-help');
    if (helpBtn) {
      helpBtn.onclick = function () {
        document.getElementById('about-modal').style.display = 'flex';
      };
    }
  }

  /* ═══════════════════════════════════════════════
     VEHICLE PILLS
     ═══════════════════════════════════════════════ */
  function dungVehiclePills() {
    var box = document.getElementById('vehicle-pills');
    box.innerHTML = '';
    cauHinh.loai_xe.forEach(function (x) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'v-pill' + (x.loai_xe === loaiXe ? ' active' : '');
      b.innerHTML = (VEHICLE_ICON[x.loai_xe] || '') + ' ' + esc(x.ten_loai_xe);
      b.addEventListener('click', function () {
        if (x.loai_xe === loaiXe) return;
        moXacNhanDoiXe(x);
      });
      box.appendChild(b);
    });
  }

  /* ═══════════════════════════════════════════════
     AREA FILTER PILLS (F03, DE-04)
     ═══════════════════════════════════════════════ */
  function dungAreaPills() {
    var box = document.getElementById('area-pills');
    if (!box || !cauHinh || !cauHinh.danh_sach_khu_vuc) return;

    box.innerHTML = '';
    // Nút Tất cả
    var btnAll = document.createElement('button');
    btnAll.type = 'button';
    btnAll.className = 'area-pill' + (khuVuc === '' ? ' active' : '');
    btnAll.textContent = 'Tất cả';
    btnAll.addEventListener('click', function () {
      khuVuc = '';
      dungAreaPills();
      tai();
    });
    box.appendChild(btnAll);

    // Từng khu vực
    cauHinh.danh_sach_khu_vuc.forEach(function (kv) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'area-pill' + (khuVuc === kv ? ' active' : '');
      b.textContent = kv;
      b.addEventListener('click', function () {
        khuVuc = kv;
        dungAreaPills();
        tai();
      });
      box.appendChild(b);
    });
  }

  /* ═══════════════════════════════════════════════
     CONFIRM VEHICLE CHANGE
     ═══════════════════════════════════════════════ */
  function moXacNhanDoiXe(xeMoi) {
    var overlay = document.getElementById('vehicle-confirm');
    var desc = document.getElementById('confirm-desc');
    var btnOk = document.getElementById('confirm-ok');
    var btnCancel = document.getElementById('confirm-cancel');
    var backdrop = overlay.querySelector('.confirm-backdrop');

    var tenCu = '';
    if (loaiXe && cauHinh) {
      var xeCu = cauHinh.loai_xe.find(function (x) { return x.loai_xe === loaiXe; });
      if (xeCu) tenCu = xeCu.ten_loai_xe;
    }

    desc.innerHTML = 'Đổi từ <strong>' + esc(tenCu) + '</strong> sang <strong>' + esc(xeMoi.ten_loai_xe) +
      '</strong>. Mức cảnh báo ở tất cả các trạm sẽ được tính lại theo phương tiện mới.';

    overlay.style.display = 'flex';

    var newOk = btnOk.cloneNode(true);
    var newCancel = btnCancel.cloneNode(true);
    btnOk.parentNode.replaceChild(newOk, btnOk);
    btnCancel.parentNode.replaceChild(newCancel, btnCancel);

    newOk.addEventListener('click', function () {
      loaiXe = xeMoi.loai_xe;
      ghiLuu(loaiXe);
      overlay.style.display = 'none';
      dungVehiclePills();
      dungThresholdTable();
      capNhatTagXeTrenBangTimDuong();
      tai();
      if (routeActive && destPos) {
        setTimeout(tinhDuongDi, 400);
      }
    });

    newCancel.addEventListener('click', function () {
      overlay.style.display = 'none';
    });

    backdrop.onclick = function () {
      overlay.style.display = 'none';
    };
  }

  /* ═══════════════════════════════════════════════
     RENDER STATIONS IN SIDEBAR
     ═══════════════════════════════════════════════ */
  function ve(du) {
    var ds = document.getElementById('station-list');
    var info = document.getElementById('update-info');
    info.textContent = 'Cập nhật lúc ' + gio(du.server_time) + ' · ' + du.tram.length + ' trạm' +
      (khuVuc ? ' (' + khuVuc + ')' : '');

    // Sắp xếp: trạm có cờ dâng nhanh lên đầu (FR-17), sau đó theo mức nguy hiểm
    du.tram.sort(function (a, b) {
      if (a.co_dang_nhanh !== b.co_dang_nhanh) return b.co_dang_nhanh ? 1 : -1;
      var ma = a.muc_canh_bao || 'Bình thường';
      var mb = b.muc_canh_bao || 'Bình thường';
      var sa = MUC_SORT[ma] != null ? MUC_SORT[ma] : 5;
      var sb = MUC_SORT[mb] != null ? MUC_SORT[mb] : 5;
      if (sa !== sb) return sa - sb;
      return a.ma_tram.localeCompare(b.ma_tram);
    });

    var countOnline = 0;

    var html = du.tram.map(function (t) {
      var mat = t.trang_thai_ket_noi === 'Mất kết nối';
      if (!mat) countOnline++;

      var lop, nhan, lopBadge;
      if (mat) { lop = 'matketnoi'; nhan = 'Mất kết nối'; lopBadge = 'matketnoi'; }
      else if (t.muc_canh_bao) { lop = LOP[t.muc_canh_bao]; nhan = t.muc_canh_bao; lopBadge = lop; }
      else { lop = 'chuachon'; nhan = 'Chưa chọn xe'; lopBadge = 'chuachon'; }

      var names = parseStationName(t);
      var h = t.muc_nuoc == null ? '—' : Math.round(t.muc_nuoc);

      // FR-12: Xu hướng nước so với 5 phút trước
      var trendHtml = '';
      var trendText = t.xu_huong || 'Ổn định';
      if (trendText === 'Đang lên' || trendText === 'Đang dâng') {
        trendHtml = '<span class="card-trend trend-up">↗ Đang lên</span>';
      } else if (trendText === 'Đang rút') {
        trendHtml = '<span class="card-trend trend-down">↘ Đang rút</span>';
      } else {
        trendHtml = '<span class="card-trend trend-stable">→ Ổn định</span>';
      }

      var tg = t.thoi_diem_do
        ? '<span>⏱ ' + tuoi(du.server_time, t.thoi_diem_do) + '</span>'
        : '<span>Chưa có dữ liệu</span>';

      var conn = mat
        ? '<span><span class="dot dot-red"></span> Mất kết nối</span>'
        : '<span><span class="dot dot-green"></span> Trực tuyến</span>';

      var isSimulation = t.ma_tram !== 'TR01';
      var tagHtml = isSimulation
        ? '<span class="card-tag">Mô phỏng</span>'
        : '<span class="card-tag" style="background:#ecfdf5;color:#059669">Trạm thật</span>';

      var rapidHtml = t.co_dang_nhanh
        ? '<div class="card-rapid">⚠ Nước dâng nhanh</div>'
        : '';

      var isSelected = (activeStationId === t.ma_tram) ? ' active-selected' : '';

      return '<div class="station-card bd-' + lop + isSelected + '" data-ma="' + esc(t.ma_tram) + '">' +
        '<div class="card-top">' +
          '<div>' +
            '<div class="card-name">' + esc(names.title) + '</div>' +
            '<div class="card-location">' + esc(names.sub) + '</div>' +
          '</div>' +
          '<span class="card-badge badge-' + lopBadge + '">' + (BADGE_ICON[lopBadge] || '') + ' ' + esc(nhan) + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<span class="card-value">' + h + '</span>' +
          '<span class="card-unit">cm</span>' +
          trendHtml +
        '</div>' +
        rapidHtml +
        '<div class="card-footer">' +
          tg + ' · ' + conn + tagHtml +
        '</div>' +
      '</div>';
    }).join('');

    ds.innerHTML = html;

    // Status bar count
    document.getElementById('station-count').textContent = du.tram.length + ' trạm · ' + countOnline + ' trực tuyến';

    // Click handler to open detail drawer & pan map
    Array.from(ds.querySelectorAll('.station-card')).forEach(function (card) {
      card.addEventListener('click', function () {
        var ma = card.getAttribute('data-ma');
        var t = du.tram.find(function (x) { return x.ma_tram === ma; });
        if (t) {
          chonTram(t, du);
        }
      });
    });

    ve_ban_do(du);

    // Refresh drawer if it's currently open for a station
    if (activeStationId) {
      var currentStation = du.tram.find(function (x) { return x.ma_tram === activeStationId; });
      if (currentStation) {
        renderDrawerContent(currentStation, du);
      }
    }
  }

  function chonTram(t, du) {
    activeStationId = t.ma_tram;

    // Highlight card
    Array.from(document.querySelectorAll('.station-card')).forEach(function (c) {
      c.classList.toggle('active-selected', c.getAttribute('data-ma') === t.ma_tram);
    });

    // Fly map
    if (typeof t.vi_do === 'number' && typeof t.kinh_do === 'number' && map) {
      map.flyTo([t.vi_do, t.kinh_do], 15, { duration: 0.6 });
    }

    // Open detail drawer
    renderDrawerContent(t, du);
    document.getElementById('detail-drawer').style.display = 'flex';
  }

  /* ═══════════════════════════════════════════════
     DETAIL DRAWER RENDERING (FR-12, FR-15, BRULE-03)
     ═══════════════════════════════════════════════ */
  function renderDrawerContent(t, du) {
    var drawer = document.getElementById('drawer-content');
    var mat = t.trang_thai_ket_noi === 'Mất kết nối';

    var lop, nhan;
    if (mat) { lop = 'matketnoi'; nhan = 'Mất kết nối – dữ liệu cũ'; }
    else if (t.muc_canh_bao) { lop = LOP[t.muc_canh_bao]; nhan = t.muc_canh_bao; }
    else { lop = 'chuachon'; nhan = 'Chưa chọn loại xe'; }

    var names = parseStationName(t);
    var h = t.muc_nuoc == null ? '—' : t.muc_nuoc.toFixed(1);
    var msg = ALERT_MSG[nhan] || '';

    // Vehicle details & Thresholds
    var xeInfo = null;
    var xeLabel = 'xe của bạn';
    var T = 20;
    if (loaiXe && cauHinh) {
      xeInfo = cauHinh.loai_xe.find(function (x) { return x.loai_xe === loaiXe; });
      if (xeInfo) {
        xeLabel = xeInfo.ten_loai_xe.toLowerCase();
        T = xeInfo.nguong_T;
      }
    }

    // Dynamic threshold callout message (BRULE-03 & C-08: không dùng chữ an toàn đứng riêng)
    var calloutMsg = '';
    if (mat) {
      calloutMsg = 'Chưa nhận được dữ liệu mới từ trạm đo. Không thể đánh giá mức rủi ro hiện tại.';
    } else if (t.muc_nuoc == null) {
      calloutMsg = 'Trạm chưa có dữ liệu quan trắc mực nước.';
    } else if (t.muc_nuoc >= T + 10) {
      var vuot = Math.round(t.muc_nuoc - (T + 10));
      calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Đã vượt ngưỡng khẩn cấp của ' + xeLabel + ' ' + (vuot > 0 ? vuot + ' cm' : '') + '. Tuyệt đối không đi qua.';
    } else if (t.muc_nuoc >= T) {
      var vuotNguyHiem = Math.round(t.muc_nuoc - T);
      calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Đã vượt ngưỡng nguy hiểm của ' + xeLabel + ' ' + (vuotNguyHiem > 0 ? vuotNguyHiem + ' cm' : '') + '. Không nên đi qua.';
    } else if (t.muc_nuoc >= T - 10) {
      calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Đang ở mức cảnh báo đối với ' + xeLabel + '. Đi chậm, chú ý quan sát.';
    } else {
      calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Nằm trong mức bình thường đối với ' + xeLabel + '. Vẫn chú ý quan sát khi lưu thông.';
    }

    // Gauge pin position on 0 - 55+ scale
    var maxScale = 55;
    var gaugePercent = 0;
    if (t.muc_nuoc != null) {
      gaugePercent = Math.min(100, Math.max(0, (t.muc_nuoc / maxScale) * 100));
    }
    var pinColor = MAU[nhan] || '#94a3b8';

    // FR-12: Xu hướng 5 phút
    var trendText = t.xu_huong || 'Ổn định';
    var trendSub = (typeof t.chenh_lech_5p === 'number' && t.chenh_lech_5p !== 0)
      ? ' (' + (t.chenh_lech_5p > 0 ? '+' : '') + t.chenh_lech_5p + ' cm so với 5p trước)'
      : ' (so với 5p trước)';

    var trendBadgeClass = 'trend-stable';
    if (trendText === 'Đang lên' || trendText === 'Đang dâng') trendBadgeClass = 'trend-up';
    else if (trendText === 'Đang rút') trendBadgeClass = 'trend-down';

    var isSimulation = t.ma_tram !== 'TR01';
    var tagHtml = isSimulation
      ? '<span class="pill-sensor-type" style="background:#f1f5f9;color:#475569">Trạm mô phỏng</span>'
      : '<span class="pill-sensor-type">Trạm thật</span>';

    var html = '<div class="drawer-body">' +
      '<div class="drawer-header">' +
        '<span class="badge-tag">' + esc(t.ma_tram) + '</span>' +
        '<h2 class="drawer-title">' + esc(names.title) + '</h2>' +
        '<div class="drawer-location">' + esc(names.sub) + '</div>' +
        tagHtml +
      '</div>' +

      // Top Alert Card
      '<div class="drawer-alert-card alert-' + lop + '">' +
        '<div class="alert-card-top">' +
          '<span class="alert-badge-capsule">' + (BADGE_ICON[lop] || '') + ' ' + esc(nhan) + '</span>' +
          '<span>Đối với ' + esc(xeLabel) + '</span>' +
        '</div>' +
        '<div class="alert-card-headline">' + esc(msg) + '</div>' +
      '</div>' +

      '<p class="drawer-caption-text">Mức bình thường không có nghĩa là an toàn tuyệt đối. Hạn chế đi qua đường ngập và làm theo hướng dẫn của lực lượng chức năng.</p>' +

      // Water Level & Gauge Card
      '<div class="drawer-gauge-card">' +
        '<div class="gauge-header-row">' +
          '<div>' +
            '<div class="gauge-label">Mực nước hiện tại</div>' +
            '<span class="gauge-trend-badge ' + trendBadgeClass + '">' + (trendText === 'Đang lên' ? '↗ ' : (trendText === 'Đang rút' ? '↘ ' : '→ ')) + esc(trendText) + '</span>' +
            '<div class="gauge-time-sub">' + esc(trendSub) + '</div>' +
          '</div>' +
          '<div class="gauge-big-num">' + h + '<small> cm</small></div>' +
        '</div>' +

        '<div class="gauge-track-container">' +
          '<div class="gauge-track">' +
            '<div class="gauge-pin" style="left:' + gaugePercent + '%;background:' + pinColor + '"></div>' +
          '</div>' +
          '<div class="gauge-scale-numbers">' +
            '<span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>55+</span>' +
          '</div>' +
          '<div class="gauge-scale-labels">' +
            '<span></span><span>cảnh báo</span><span>nguy hiểm</span><span>khẩn cấp</span><span></span><span></span>' +
          '</div>' +
        '</div>' +

        '<div class="gauge-callout-box">' + esc(calloutMsg) + '</div>' +
      '</div>' +

      // FR-15: Biểu đồ lịch sử mực nước
      '<div class="drawer-chart-card">' +
        '<div class="chart-header">' +
          '<div class="chart-title">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' +
            'Biến thiên mực nước' +
          '</div>' +
          '<div class="chart-legend">' +
            '<span><span class="chart-legend-dot" style="background:#2563eb"></span> Mực nước</span>' +
            '<span><span class="chart-legend-dot" style="background:#dc2626"></span> Khẩn cấp (' + (T + 10) + 'cm)</span>' +
          '</div>' +
        '</div>' +
        '<div id="chart-mount" class="chart-container">' +
          '<div class="chart-empty">Đang tải lịch sử đo…</div>' +
        '</div>' +
        '<div class="chart-axis-labels">' +
          '<span id="chart-t-start">Gần đây</span>' +
          '<span id="chart-t-end">Hiện tại</span>' +
        '</div>' +
      '</div>' +

      // Station Device Status
      '<div class="drawer-status-card">' +
        '<div class="status-card-header">' +
          '<span class="status-card-title">TRẠNG THÁI TRẠM</span>' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>' +
        '</div>' +
        '<div class="status-card-sub">Thiết bị tại hiện trường</div>' +

        '<div class="status-row">' +
          '<span>Cảm biến</span>' +
          '<span class="status-row-val ' + (mat ? 'dot-red' : '') + '" style="color:' + (mat ? '#dc2626' : '#16a34a') + '">' +
            (mat ? 'Mất kết nối' : 'Đang hoạt động') +
          '</span>' +
        '</div>' +
        '<div class="status-row">' +
          '<span>Đèn cảnh báo tại trạm</span>' +
          '<span class="status-row-val">' +
            (t.muc_nuoc != null && t.muc_nuoc >= 15 ? '<span style="color:#dc2626">● Đang sáng</span>' : '<span style="color:#94a3b8">○ Tắt</span>') +
          '</span>' +
        '</div>' +
        '<div class="status-row">' +
          '<span>Tần suất gửi dữ liệu</span>' +
          '<span class="status-row-val">mỗi 10 giây</span>' +
        '</div>' +
      '</div>' +

    '</div>';

    drawer.innerHTML = html;

    // Load & draw historical SVG chart (FR-15)
    taiVaVeBieuDo(t.ma_tram, T);
  }

  /* ═══════════════════════════════════════════════
     HISTORICAL CHART (FR-15)
     ═══════════════════════════════════════════════ */
  function taiVaVeBieuDo(maTram, nguongT) {
    var mount = document.getElementById('chart-mount');
    if (!mount) return;

    fetch('/api/tram/' + encodeURIComponent(maTram) + '/lich-su', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        return r.json();
      })
      .then(function (res) {
        var data = res.lich_su || [];
        if (!data.length) {
          mount.innerHTML = '<div class="chart-empty">Chưa có lịch sử đo cho trạm này.</div>';
          return;
        }

        // Cập nhật nhãn thời gian trục X
        var tStartEl = document.getElementById('chart-t-start');
        var tEndEl = document.getElementById('chart-t-end');
        if (tStartEl && data[0] && data[0].thoi_diem_do) {
          tStartEl.textContent = gio(data[0].thoi_diem_do);
        }
        if (tEndEl && data[data.length - 1] && data[data.length - 1].thoi_diem_do) {
          tEndEl.textContent = gio(data[data.length - 1].thoi_diem_do);
        }

        // Kích thước SVG
        var W = 360;
        var H = 140;
        var padT = 15;
        var padB = 20;
        var padL = 25;
        var padR = 15;

        // Tìm Max Y để tính tỉ lệ (ít nhất là 35 hoặc ngưỡng khẩn cấp + 5)
        var maxVal = Math.max(35, nguongT + 12);
        data.forEach(function (d) {
          if (typeof d.muc_nuoc === 'number') maxVal = Math.max(maxVal, d.muc_nuoc + 5);
        });

        function getY(val) {
          var ratio = (val || 0) / maxVal;
          return H - padB - ratio * (H - padT - padB);
        }

        function getX(i) {
          if (data.length <= 1) return (padL + W - padR) / 2;
          return padL + (i / (data.length - 1)) * (W - padL - padR);
        }

        // Tọa độ đường ngưỡng
        var yKhancap = getY(nguongT + 10);
        var yCanhbao = getY(nguongT - 10);

        // Tạo path line & area
        var points = data.map(function (d, i) {
          return getX(i).toFixed(1) + ',' + getY(d.muc_nuoc).toFixed(1);
        });

        var pathLine = 'M ' + points.join(' L ');
        var pathArea = 'M ' + points[0] + ' L ' + points.join(' L ') +
          ' L ' + getX(data.length - 1).toFixed(1) + ',' + (H - padB) +
          ' L ' + getX(0).toFixed(1) + ',' + (H - padB) + ' Z';

        var svgHtml = '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '">' +
          '<defs>' +
            '<linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0%" stop-color="#2563eb" stop-opacity="0.25"/>' +
              '<stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>' +
            '</linearGradient>' +
          '</defs>' +

          // Đường trục cơ sở (0 cm)
          '<line x1="' + padL + '" y1="' + (H - padB) + '" x2="' + (W - padR) + '" y2="' + (H - padB) + '" stroke="#e2e8f0" stroke-width="1"/>' +
          '<text x="' + (padL - 4) + '" y="' + (H - padB + 3) + '" font-size="9" fill="#94a3b8" text-anchor="end">0</text>' +

          // Đường ngưỡng cảnh báo
          '<line x1="' + padL + '" y1="' + yCanhbao + '" x2="' + (W - padR) + '" y2="' + yCanhbao + '" stroke="#eab308" stroke-dasharray="3,3" stroke-width="1" opacity="0.6"/>' +

          // Đường ngưỡng khẩn cấp
          '<line x1="' + padL + '" y1="' + yKhancap + '" x2="' + (W - padR) + '" y2="' + yKhancap + '" stroke="#dc2626" stroke-dasharray="3,3" stroke-width="1.2" opacity="0.8"/>' +
          '<text x="' + (padL - 4) + '" y="' + (yKhancap + 3) + '" font-size="9" fill="#dc2626" font-weight="700" text-anchor="end">' + (nguongT + 10) + '</text>' +

          // Vùng fill & đường line mực nước
          '<path d="' + pathArea + '" fill="url(#chartGrad)"/>' +
          '<path d="' + pathLine + '" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';

        // Điểm chấm tròn tại các mốc
        data.forEach(function (d, i) {
          var cx = getX(i).toFixed(1);
          var cy = getY(d.muc_nuoc).toFixed(1);
          var tooltip = esc(gio(d.thoi_diem_do)) + ': ' + (d.muc_nuoc != null ? d.muc_nuoc + ' cm' : '—');
          svgHtml += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="#ffffff" stroke="#2563eb" stroke-width="2">' +
            '<title>' + tooltip + '</title>' +
          '</circle>';
        });

        svgHtml += '</svg>';
        mount.innerHTML = svgHtml;
      })
      .catch(function () {
        mount.innerHTML = '<div class="chart-empty">Không tải được biểu đồ lịch sử.</div>';
      });
  }

  /* ═══════════════════════════════════════════════
     MAP & REAL TILES
     ═══════════════════════════════════════════════ */
  function veBanDoInit() {
    map = L.map('map', { zoomControl: true }).setView([16.0678, 108.2208], 14);

    // Chuẩn bản đồ Google Maps tiếng Việt đầy đủ Biển Đông, quần đảo Hoàng Sa, quần đảo Trường Sa
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps · Chủ quyền Biển Đảo Việt Nam',
    }).addTo(map);

    themNhanChuQuyenBienDao();

    map.on('click', function (e) {
      if (isPickingOrigin) {
        apDungOrigin(e.latlng.lat, e.latlng.lng, 'Vị trí chọn: ' + e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4));
        batTatChonOrigin();
        if (destPos) tinhDuongDi();
      } else if (routeActive || isPickingDest) {
        chonDiemDen(e.latlng.lat, e.latlng.lng, 'Tọa độ: ' + e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4));
        if (isPickingDest) batTatChonDest();
      }
    });
  }

  function themNhanChuQuyenBienDao() {
    var nhanList = [
      {
        lat: 16.5000,
        lng: 112.0000,
        text: 'Quần đảo Hoàng Sa',
        sub: '(TP. Đà Nẵng, Việt Nam)'
      },
      {
        lat: 10.0000,
        lng: 114.0000,
        text: 'Quần đảo Trường Sa',
        sub: '(Tỉnh Khánh Hòa, Việt Nam)'
      },
      {
        lat: 14.5000,
        lng: 113.2000,
        text: 'Biển Đông',
        sub: '(Việt Nam)'
      }
    ];

    nhanList.forEach(function (item) {
      var icon = L.divIcon({
        className: 'sea-sovereignty-label',
        html: '<div class="sovereignty-badge">' +
                '<span class="badge-flag">🇻🇳</span>' +
                '<div class="badge-content">' +
                  '<div class="badge-name">' + esc(item.text) + '</div>' +
                  '<div class="badge-sub">' + esc(item.sub) + '</div>' +
                '</div>' +
              '</div>',
        iconSize: [170, 42],
        iconAnchor: [85, 21]
      });
      L.marker([item.lat, item.lng], { icon: icon, interactive: false }).addTo(map);
    });
  }

  function ve_ban_do(du) {
    var diem = [];
    du.tram.forEach(function (t) {
      if (typeof t.vi_do !== 'number' || typeof t.kinh_do !== 'number') return;
      var mat = t.trang_thai_ket_noi === 'Mất kết nối';
      var lop = mat ? 'matketnoi' : (t.muc_canh_bao ? LOP[t.muc_canh_bao] : 'chuachon');
      var nhan = mat ? 'Mất kết nối' : (t.muc_canh_bao || 'Chưa chọn xe');

      var label = getShortLocationLabel(t);
      var rapidClass = t.co_dang_nhanh ? ' pin-rapid' : '';

      var icon = L.divIcon({
        className: '',
        html: '<div class="custom-map-pin">' +
                '<div class="pin-circle pin-' + lop + rapidClass + '">' +
                  (ICON_MARKER[lop] || '') +
                '</div>' +
                '<div class="pin-label">' + esc(label) + '</div>' +
              '</div>',
        iconSize: [60, 60],
        iconAnchor: [30, 20],
      });

      var names = parseStationName(t);
      var tooltipContent = '<div class="map-tooltip"><strong>' + esc(names.title) + '</strong><span>' +
        (t.muc_nuoc == null ? '—' : Math.round(t.muc_nuoc) + ' cm') + ' · ' + esc(nhan) + '</span></div>';

      var m = markers[t.ma_tram];
      if (!m) {
        m = markers[t.ma_tram] = L.marker([t.vi_do, t.kinh_do], { icon: icon }).addTo(map);
        m.bindTooltip(tooltipContent, { direction: 'top', offset: [0, -20], className: 'custom-leaflet-tooltip' });
      } else {
        m.setIcon(icon);
        m.setTooltipContent(tooltipContent);
      }

      // Click pin opens detail drawer
      (function (tram) {
        m.off('click').on('click', function () {
          chonTram(tram, du);
        });
      })(t);

      diem.push([t.vi_do, t.kinh_do]);
    });

    if (!daFit && diem.length) {
      map.fitBounds(diem, { padding: [60, 60], maxZoom: 15 });
      daFit = true;
    }
  }

  /* ═══════════════════════════════════════════════
     THRESHOLD TABLE
     ═══════════════════════════════════════════════ */
  function dungThresholdTable() {
    var body = document.getElementById('threshold-body');
    var header = document.getElementById('threshold-title');
    if (!body || !cauHinh) return;

    if (loaiXe) {
      var currentXe = cauHinh.loai_xe.find(function (x) { return x.loai_xe === loaiXe; });
      if (currentXe && header) {
        header.textContent = 'Ngưỡng của ' + currentXe.ten_loai_xe.toLowerCase() + ' (cm)';
      }
    }

    body.innerHTML = cauHinh.loai_xe.map(function (x) {
      var T = x.nguong_T;
      var isCurrent = (x.loai_xe === loaiXe);
      return '<tr style="' + (isCurrent ? 'font-weight:700;background:#eff6ff' : '') + '">' +
        '<td style="text-align:left;padding-left:16px;">' + esc(x.ten_loai_xe) + (isCurrent ? ' (đang chọn)' : '') + '</td>' +
        '<td>' + (T - 10) + '</td>' +
        '<td>' + T + '</td>' +
        '<td>' + (T + 10) + '</td>' +
      '</tr>';
    }).join('');
  }

  /* ═══════════════════════════════════════════════
     NETWORK / REFRESH POLLING (EV-11, F03, F04)
     ═══════════════════════════════════════════════ */
  function banner(hien, text) {
    var b = document.getElementById('banner');
    b.hidden = !hien;
    if (text) b.textContent = text;
    var st = document.getElementById('sys-status');
    if (hien) st.innerHTML = '<span class="dot dot-red"></span> Mất kết nối máy chủ';
    else st.innerHTML = '<span class="dot dot-green"></span> Hệ thống hoạt động';
  }

  function hen() {
    clearTimeout(timer);
    timer = setTimeout(tai, ((cauHinh && cauHinh.chu_ky_lam_moi) || 3) * 1000);
  }

  function tai() {
    clearTimeout(timer);
    var url = '/api/tram?' +
      (loaiXe ? 'loai_xe=' + encodeURIComponent(loaiXe) : '') +
      (khuVuc ? '&khu_vuc=' + encodeURIComponent(khuVuc) : '');

    fetch(url, { cache: 'no-store' })
      .then(function (r) {
        if (r.status === 400 && loaiXe) { loaiXe = null; dungVehiclePills(); throw new Error('loai_xe'); }
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      })
      .then(function (du) {
        lanCuoi = du;
        banner(false);
        ve(du);
        hen();
      })
      .catch(function () {
        banner(true, 'Không kết nối được máy chủ – dữ liệu đang hiển thị có thể đã cũ.');
        hen();
      });
  }

  /* ═══════════════════════════════════════════════
     SMART FLOOD-AVOIDING ROUTE PLANNER
     ═══════════════════════════════════════════════ */
  var routeActive = false;
  var isPickingOrigin = false;
  var isPickingDest = false;
  var userPos = { lat: 16.0678, lng: 108.2208, name: 'Vị trí của bạn' };
  var originPos = null;
  var destPos = null;
  var originMarker = null;
  var destMarker = null;
  var gpsAccuracyCircle = null;
  var routePolylines = [];
  var hazardCircles = [];

  function haversineDistance(lat1, lon1, lat2, lon2) {
    var R = 6371000;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function distancePointToSegment(plat, plon, lat1, lon1, lat2, lon2) {
    var d12 = haversineDistance(lat1, lon1, lat2, lon2);
    if (d12 === 0) return haversineDistance(plat, plon, lat1, lon1);
    var dx = lon2 - lon1;
    var dy = lat2 - lat1;
    var t = ((plon - lon1) * dx + (plat - lat1) * dy) / (dx * dx + dy * dy);
    t = Math.max(0, Math.min(1, t));
    var projLat = lat1 + t * dy;
    var projLon = lon1 + t * dx;
    return haversineDistance(plat, plon, projLat, projLon);
  }

  function layDiemNgapNguyHiem() {
    if (!lanCuoi || !lanCuoi.tram) return [];
    var hazards = [];
    lanCuoi.tram.forEach(function (t) {
      if (typeof t.vi_do !== 'number' || typeof t.kinh_do !== 'number') return;
      if (t.trang_thai_ket_noi === 'Mất kết nối') return; // BRULE-04

      var muc = t.muc_canh_bao || 'Bình thường';
      var isHazard = false;
      var radius = 220; // 220m

      if (muc === 'Khẩn cấp') {
        isHazard = true;
        radius = 280;
      } else if (muc === 'Nguy hiểm') {
        isHazard = true;
        radius = 240;
      } else if (t.co_dang_nhanh) {
        isHazard = true;
        radius = 240;
      } else if (muc === 'Cảnh báo' && loaiXe === 'XM') {
        isHazard = true;
        radius = 180;
      }

      if (isHazard) {
        var names = parseStationName(t);
        hazards.push({
          ma_tram: t.ma_tram,
          ten: names.title,
          khu_vuc: t.khu_vuc || names.sub,
          lat: t.vi_do,
          lng: t.kinh_do,
          muc_canh_bao: muc,
          muc_nuoc: t.muc_nuoc,
          co_dang_nhanh: t.co_dang_nhanh,
          radius: radius
        });
      }
    });
    return hazards;
  }

  function kiemTraVaNgap(coords, hazards) {
    var vaCham = [];
    hazards.forEach(function (h) {
      var minD = Infinity;
      for (var i = 0; i < coords.length - 1; i++) {
        var lon1 = coords[i][0], lat1 = coords[i][1];
        var lon2 = coords[i + 1][0], lat2 = coords[i + 1][1];
        var d = distancePointToSegment(h.lat, h.lng, lat1, lon1, lat2, lon2);
        if (d < minD) minD = d;
        if (minD < h.radius) break;
      }
      if (minD < h.radius) {
        vaCham.push({ hazard: h, minDistance: minD });
      }
    });
    return vaCham;
  }

  function tinhDetourWaypoints(hazard, origin, dest) {
    var dLat = dest.lat - origin.lat;
    var dLng = dest.lng - origin.lng;
    var len = Math.sqrt(dLat * dLat + dLng * dLng) || 0.001;
    var pLat = -dLng / len;
    var pLng = dLat / len;
    var offsetDeg = 0.007;
    return [
      { lat: hazard.lat + pLat * offsetDeg, lng: hazard.lng + pLng * offsetDeg },
      { lat: hazard.lat - pLat * offsetDeg, lng: hazard.lng - pLng * offsetDeg }
    ];
  }

  function capNhatTagXeTrenBangTimDuong() {
    var tag = document.getElementById('route-vehicle-tag');
    if (!tag || !cauHinh) return;
    var cur = cauHinh.loai_xe.find(function (x) { return x.loai_xe === loaiXe; });
    var ten = cur ? cur.ten_loai_xe : 'Phương tiện';
    tag.textContent = 'Tự động né điểm ngập cho ' + ten;
  }

  function layViTriGPS(showNotification) {
    var input = document.getElementById('route-origin-input');
    if (input) input.value = 'Đang dò vị trí GPS thực tế...';
    if (showNotification) banner(true, 'Đang xác định tọa độ GPS thực tế của bạn...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var lat = pos.coords.latitude;
          var lng = pos.coords.longitude;
          var acc = Math.round(pos.coords.accuracy || 0);

          userPos = { lat: lat, lng: lng, name: 'Vị trí GPS của bạn' };
          apDungOrigin(lat, lng, 'Vị trí GPS của bạn (±' + acc + 'm)');

          if (gpsAccuracyCircle) map.removeLayer(gpsAccuracyCircle);
          if (acc > 0 && acc < 5000) {
            gpsAccuracyCircle = L.circle([lat, lng], {
              radius: acc,
              color: '#2563eb',
              weight: 1.5,
              fillColor: '#93c5fd',
              fillOpacity: 0.18
            }).addTo(map);
          }

          map.flyTo([lat, lng], 15, { duration: 0.8 });
          banner(true, '✓ Đã nhận diện đúng vị trí GPS thực tế của bạn.');
          setTimeout(function () { banner(false); }, 3500);

          if (destPos) tinhDuongDi();
        },
        function (err) {
          // Fallback to IP geolocation when browser GPS is blocked/unavailable on PC
          thuDinhViQuaIP(showNotification);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    } else {
      thuDinhViQuaIP(showNotification);
    }
  }

  function thuDinhViQuaIP(showNotification) {
    fetch('https://ipwho.is/')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          var lat = data.latitude;
          var lng = data.longitude;
          var tenCho = data.city || data.region || 'Vị trí của bạn';

          userPos = { lat: lat, lng: lng, name: tenCho };
          apDungOrigin(lat, lng, 'Vị trí mạng: ' + tenCho);
          map.flyTo([lat, lng], 13, { duration: 0.8 });

          banner(true, 'Đã xác định vị trí thực tế của bạn tại ' + tenCho + '. Bạn có thể kéo thả pin hoặc bấm nút chọn trên bản đồ nếu muốn đổi.');
          setTimeout(function () { banner(false); }, 5000);

          if (destPos) tinhDuongDi();
        } else {
          datViTriMacDinh(showNotification);
        }
      })
      .catch(function () {
        datViTriMacDinh(showNotification);
      });
  }

  function datViTriMacDinh(showNotification) {
    apDungOrigin(userPos.lat, userPos.lng, userPos.name);
    if (showNotification) {
      banner(true, 'Chưa nhận được GPS tự động. Vui lòng bấm vào bản đồ hoặc kéo pin "Xuất phát" để đặt vị trí chính xác của bạn.');
      setTimeout(function () { banner(false); }, 5000);
    }
  }

  function apDungOrigin(lat, lng, name) {
    originPos = { lat: lat, lng: lng, name: name };
    var input = document.getElementById('route-origin-input');
    if (input) input.value = name || (lat.toFixed(4) + ', ' + lng.toFixed(4));

    if (!originMarker) {
      var icon = L.divIcon({
        className: '',
        html: '<div class="route-pin-origin">' +
                '<div class="route-pin-bubble bubble-origin">' +
                  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>' +
                '</div>' +
                '<div class="route-pin-label">Xuất phát</div>' +
              '</div>',
        iconSize: [60, 60],
        iconAnchor: [30, 20]
      });
      originMarker = L.marker([lat, lng], { icon: icon, draggable: true }).addTo(map);
      originMarker.on('dragend', function (e) {
        var p = e.target.getLatLng();
        originPos = { lat: p.lat, lng: p.lng, name: 'Tọa độ: ' + p.lat.toFixed(4) + ', ' + p.lng.toFixed(4) };
        if (input) input.value = originPos.name;
        if (destPos) tinhDuongDi();
      });
    } else {
      originMarker.setLatLng([lat, lng]);
    }
  }

  function chonDiemDen(lat, lng, name) {
    destPos = { lat: lat, lng: lng, name: name };
    var input = document.getElementById('route-dest-input');
    if (input) input.value = name;

    if (!destMarker) {
      var icon = L.divIcon({
        className: '',
        html: '<div class="route-pin-dest">' +
                '<div class="route-pin-bubble bubble-dest">' +
                  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>' +
                '</div>' +
                '<div class="route-pin-label">' + esc(name ? name.substring(0, 16) : 'Điểm đến') + '</div>' +
              '</div>',
        iconSize: [60, 60],
        iconAnchor: [30, 20]
      });
      destMarker = L.marker([lat, lng], { icon: icon, draggable: true }).addTo(map);
      destMarker.on('dragend', function (e) {
        var p = e.target.getLatLng();
        destPos = { lat: p.lat, lng: p.lng, name: 'Điểm đến: ' + p.lat.toFixed(4) + ', ' + p.lng.toFixed(4) };
        if (input) input.value = destPos.name;
        tinhDuongDi();
      });
    } else {
      destMarker.setLatLng([lat, lng]);
      var labelEl = destMarker.getElement();
      if (labelEl) {
        var lbl = labelEl.querySelector('.route-pin-label');
        if (lbl) lbl.textContent = name ? name.substring(0, 16) : 'Điểm đến';
      }
    }

    tinhDuongDi();
  }

  function daoChieuDiem() {
    if (!originPos || !destPos) return;
    var tmp = originPos;
    originPos = destPos;
    destPos = tmp;

    document.getElementById('route-origin-input').value = originPos.name;
    document.getElementById('route-dest-input').value = destPos.name;

    if (originMarker) originMarker.setLatLng([originPos.lat, originPos.lng]);
    if (destMarker) destMarker.setLatLng([destPos.lat, destPos.lng]);

    tinhDuongDi();
  }

  function batTatChonOrigin() {
    isPickingOrigin = !isPickingOrigin;
    if (isPickingOrigin) isPickingDest = false;
    var btnO = document.getElementById('btn-pick-origin');
    var btnD = document.getElementById('btn-pick-map');
    if (btnO) btnO.classList.toggle('active', isPickingOrigin);
    if (btnD) btnD.classList.remove('active');
    if (isPickingOrigin) {
      banner(true, 'Nhấp vào bất kỳ điểm nào trên bản đồ để đặt ĐIỂM XUẤT PHÁT.');
      setTimeout(function () { banner(false); }, 4000);
    }
  }

  function batTatChonDest() {
    isPickingDest = !isPickingDest;
    if (isPickingDest) isPickingOrigin = false;
    var btnO = document.getElementById('btn-pick-origin');
    var btnD = document.getElementById('btn-pick-map');
    if (btnD) btnD.classList.toggle('active', isPickingDest);
    if (btnO) btnO.classList.remove('active');
    if (isPickingDest) {
      banner(true, 'Nhấp vào bất kỳ điểm nào trên bản đồ để chọn ĐIỂM ĐẾN.');
      setTimeout(function () { banner(false); }, 4000);
    }
  }

  function batTatBangTimDuong() {
    routeActive = !routeActive;
    var panel = document.getElementById('route-panel');
    var btn = document.getElementById('btn-toggle-route');
    var navLink = document.getElementById('nav-btn-route');

    if (routeActive) {
      panel.style.display = 'block';
      if (btn) btn.classList.add('active');
      if (navLink) navLink.classList.add('active');
      capNhatTagXeTrenBangTimDuong();
      if (!originPos) {
        layViTriGPS(false);
      }
    } else {
      dongBangTimDuong();
    }
  }

  function dongBangTimDuong() {
    routeActive = false;
    isPickingOrigin = false;
    isPickingDest = false;
    var panel = document.getElementById('route-panel');
    var btn = document.getElementById('btn-toggle-route');
    var navLink = document.getElementById('nav-btn-route');
    if (panel) panel.style.display = 'none';
    if (btn) btn.classList.remove('active');
    if (navLink) navLink.classList.remove('active');
    var btnO = document.getElementById('btn-pick-origin');
    if (btnO) btnO.classList.remove('active');
    var btnD = document.getElementById('btn-pick-map');
    if (btnD) btnD.classList.remove('active');
  }

  function xoaDuongDi() {
    routePolylines.forEach(function (p) { map.removeLayer(p); });
    routePolylines = [];
    hazardCircles.forEach(function (c) { map.removeLayer(c); });
    hazardCircles = [];
    if (destMarker) { map.removeLayer(destMarker); destMarker = null; }
    destPos = null;
    document.getElementById('route-dest-input').value = '';
    document.getElementById('route-result').style.display = 'none';
    document.getElementById('route-loading').style.display = 'none';
    Array.from(document.querySelectorAll('.quick-chip')).forEach(function (c) { c.classList.remove('selected'); });
  }

  function tinhDuongDi() {
    if (!originPos) {
      layViTriGPS(true);
      return;
    }
    if (!destPos) {
      banner(true, 'Vui lòng chọn điểm đến trên bản đồ hoặc từ danh sách gợi ý.');
      setTimeout(function () { banner(false); }, 3000);
      return;
    }

    var loading = document.getElementById('route-loading');
    var resultCard = document.getElementById('route-result');
    if (loading) loading.style.display = 'flex';
    if (resultCard) resultCard.style.display = 'none';

    routePolylines.forEach(function (p) { map.removeLayer(p); });
    routePolylines = [];
    hazardCircles.forEach(function (c) { map.removeLayer(c); });
    hazardCircles = [];

    var hazards = layDiemNgapNguyHiem();

    var urlDirect = 'https://router.project-osrm.org/route/v1/driving/' +
      originPos.lng + ',' + originPos.lat + ';' + destPos.lng + ',' + destPos.lat +
      '?overview=full&geometries=geojson&alternatives=true';

    fetch(urlDirect)
      .then(function (r) {
        if (!r.ok) throw new Error('OSRM error ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data.routes || !data.routes.length) {
          throw new Error('No route found');
        }

        var bestRoute = null;
        var bestHazards = null;

        for (var i = 0; i < data.routes.length; i++) {
          var r = data.routes[i];
          var vaCham = kiemTraVaNgap(r.geometry.coordinates, hazards);
          if (vaCham.length === 0) {
            bestRoute = r;
            bestHazards = [];
            break;
          }
          if (!bestRoute || vaCham.length < bestHazards.length) {
            bestRoute = r;
            bestHazards = vaCham;
          }
        }

        if (bestHazards.length > 0 && hazards.length > 0) {
          var primaryHazard = bestHazards[0].hazard;
          var waypoints = tinhDetourWaypoints(primaryHazard, originPos, destPos);

          var detourPromises = waypoints.map(function (wp) {
            var urlDetour = 'https://router.project-osrm.org/route/v1/driving/' +
              originPos.lng + ',' + originPos.lat + ';' +
              wp.lng + ',' + wp.lat + ';' +
              destPos.lng + ',' + destPos.lat +
              '?overview=full&geometries=geojson';
            return fetch(urlDetour)
              .then(function (res) { return res.ok ? res.json() : null; })
              .catch(function () { return null; });
          });

          return Promise.all(detourPromises).then(function (detourResults) {
            detourResults.forEach(function (dData) {
              if (dData && dData.routes && dData.routes.length) {
                var dRoute = dData.routes[0];
                var dVaCham = kiemTraVaNgap(dRoute.geometry.coordinates, hazards);
                if (dVaCham.length < bestHazards.length) {
                  bestRoute = dRoute;
                  bestHazards = dVaCham;
                }
              }
            });
            return { route: bestRoute, hazardsOnRoute: bestHazards, allHazards: hazards };
          });
        }

        return { route: bestRoute, hazardsOnRoute: bestHazards, allHazards: hazards };
      })
      .then(function (result) {
        if (loading) loading.style.display = 'none';
        hienThiKetQuaLoTrinh(result.route, result.hazardsOnRoute, result.allHazards);
      })
      .catch(function (err) {
        if (loading) loading.style.display = 'none';
        console.error('Route error:', err);
        xuLyLoTrinhFallback(hazards);
      });
  }

  function hienThiKetQuaLoTrinh(route, hazardsOnRoute, allHazards) {
    if (!route || !route.geometry || !route.geometry.coordinates) return;

    var coords = route.geometry.coordinates;
    var latlngs = coords.map(function (c) { return [c[1], c[0]]; });
    var hasDanger = hazardsOnRoute.length > 0;

    var casingColor = hasDanger ? '#dc2626' : '#1d4ed8';
    var lineColor = hasDanger ? '#ef4444' : '#2563eb';

    var casing = L.polyline(latlngs, {
      color: casingColor,
      weight: 9,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    var line = L.polyline(latlngs, {
      color: lineColor,
      weight: 5,
      opacity: 0.95,
      dashArray: hasDanger ? '6, 6' : null,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    routePolylines.push(casing, line);

    allHazards.forEach(function (h) {
      var isHit = hazardsOnRoute.some(function (vh) { return vh.hazard.ma_tram === h.ma_tram; });
      var color = isHit ? '#dc2626' : '#ea580c';

      var circle = L.circle([h.lat, h.lng], {
        radius: h.radius,
        color: color,
        weight: 2,
        dashArray: '4, 4',
        fillColor: color,
        fillOpacity: isHit ? 0.28 : 0.12
      }).addTo(map);

      var tip = '<strong>' + esc(h.ten) + '</strong> (' + esc(h.muc_canh_bao) + ' - ' + h.muc_nuoc + ' cm)' +
        (isHit
          ? '<br><span style="color:#ef4444;font-weight:700">⚠️ Lộ trình đi qua điểm ngập này</span>'
          : '<br><span style="color:#16a34a;font-weight:700">✓ Tuyến đường đã né tránh thành công</span>');

      circle.bindTooltip(tip, { className: 'custom-leaflet-tooltip' });
      hazardCircles.push(circle);
    });

    map.fitBounds(latlngs, { padding: [70, 70], maxZoom: 16 });

    var resultCard = document.getElementById('route-result');
    var statusCard = document.getElementById('route-status-card');
    var statusIcon = document.getElementById('route-status-icon');
    var statusTitle = document.getElementById('route-status-title');
    var statusDesc = document.getElementById('route-status-desc');
    var distEl = document.getElementById('route-dist');
    var durEl = document.getElementById('route-duration');
    var avoidEl = document.getElementById('route-avoid-count');
    var warningsBox = document.getElementById('route-flood-warnings');
    var btnGoogle = document.getElementById('btn-google-nav');

    var km = (route.distance / 1000).toFixed(1);
    var mins = Math.max(1, Math.round(route.duration / 60));
    var avoidedCount = Math.max(0, allHazards.length - hazardsOnRoute.length);

    distEl.textContent = km + ' km';
    durEl.textContent = '~' + mins + ' phút';
    avoidEl.textContent = avoidedCount + ' trạm';

    var curXe = cauHinh ? cauHinh.loai_xe.find(function (x) { return x.loai_xe === loaiXe; }) : null;
    var tenXe = curXe ? curXe.ten_loai_xe : 'phương tiện';

    if (!hasDanger) {
      statusCard.className = 'route-result-header status-safe';
      statusIcon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
      statusTitle.textContent = 'Lộ trình tối ưu · Tránh điểm ngập';
      statusDesc.textContent = allHazards.length > 0
        ? 'Đã tự động tính đường né tránh ' + allHazards.length + ' vị trí ngập rủi ro theo ' + tenXe + '.'
        : 'Không ghi nhận trạm ngập cản trở trên cung đường này theo ' + tenXe + '.';
      warningsBox.style.display = 'none';
    } else {
      statusCard.className = 'route-result-header status-danger';
      statusIcon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      statusTitle.textContent = 'Lưu ý: Có điểm ngập trên tuyến';
      statusDesc.textContent = 'Cung đường đi qua ' + hazardsOnRoute.length + ' điểm ngập nguy hiểm theo ' + tenXe + '. Hạn chế di chuyển!';

      var warnHtml = '<div class="flood-warning-title">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        'Điểm ngập cắt ngang lộ trình:</div><ul class="flood-warning-list">';

      hazardsOnRoute.forEach(function (vh) {
        warnHtml += '<li class="flood-warning-item">Trạm <strong>' + esc(vh.hazard.ten) + '</strong> (' + esc(vh.hazard.muc_canh_bao) +
          (vh.hazard.muc_nuoc != null ? ' - ' + Math.round(vh.hazard.muc_nuoc) + ' cm' : '') + ')</li>';
      });
      warnHtml += '</ul>';

      warningsBox.innerHTML = warnHtml;
      warningsBox.style.display = 'block';
    }

    if (btnGoogle && originPos && destPos) {
      btnGoogle.href = 'https://www.google.com/maps/dir/?api=1&origin=' +
        originPos.lat + ',' + originPos.lng + '&destination=' + destPos.lat + ',' + destPos.lng;
    }

    resultCard.style.display = 'block';
  }

  function xuLyLoTrinhFallback(hazards) {
    if (!originPos || !destPos) return;
    var latlngs = [[originPos.lat, originPos.lng], [destPos.lat, destPos.lng]];
    var line = L.polyline(latlngs, { color: '#2563eb', weight: 4, dashArray: '5, 8' }).addTo(map);
    routePolylines.push(line);
    map.fitBounds(latlngs, { padding: [60, 60] });

    var resultCard = document.getElementById('route-result');
    var statusCard = document.getElementById('route-status-card');
    var statusTitle = document.getElementById('route-status-title');
    var statusDesc = document.getElementById('route-status-desc');
    var distEl = document.getElementById('route-dist');
    var durEl = document.getElementById('route-duration');
    var avoidEl = document.getElementById('route-avoid-count');

    var d = haversineDistance(originPos.lat, originPos.lng, destPos.lat, destPos.lng);
    distEl.textContent = (d / 1000).toFixed(1) + ' km (đường thẳng)';
    durEl.textContent = '~' + Math.round((d / 1000) / 30 * 60) + ' phút';
    avoidEl.textContent = '0';

    statusCard.className = 'route-result-header status-warning';
    statusTitle.textContent = 'Dẫn đường trực tiếp';
    statusDesc.textContent = 'Không kết nối được dịch vụ chỉ đường OSRM. Hiển thị hướng tuyến trực tiếp.';
    resultCard.style.display = 'block';
  }

  /* ═══════════════════════════════════════════════
     INTERACTIONS & MODALS
     ═══════════════════════════════════════════════ */
  function setupModals() {
    // Drawer close button
    document.getElementById('drawer-close').addEventListener('click', function () {
      document.getElementById('detail-drawer').style.display = 'none';
      activeStationId = null;
      Array.from(document.querySelectorAll('.station-card')).forEach(function (c) {
        c.classList.remove('active-selected');
      });
    });

    // Close buttons for modals
    document.getElementById('levels-close').addEventListener('click', function () {
      document.getElementById('levels-modal').style.display = 'none';
    });
    document.getElementById('about-close').addEventListener('click', function () {
      document.getElementById('about-modal').style.display = 'none';
    });

    // Click outside to close overlays
    ['levels-modal', 'about-modal'].forEach(function (id) {
      document.getElementById(id).addEventListener('click', function (e) {
        if (e.target === this) this.style.display = 'none';
      });
    });

    // Nav navigation links
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var target = el.getAttribute('data-nav');
        if (target === 'levels') document.getElementById('levels-modal').style.display = 'flex';
        else if (target === 'about') document.getElementById('about-modal').style.display = 'flex';
        else if (target === 'route') batTatBangTimDuong();
        else if (target === 'main') {
          document.getElementById('levels-modal').style.display = 'none';
          document.getElementById('about-modal').style.display = 'none';
          document.querySelectorAll('.nav-link').forEach(function (nl) { nl.classList.remove('active'); });
          var mainLink = document.querySelector('.nav-link[data-nav="main"]');
          if (mainLink) mainLink.classList.add('active');
        }
      });
    });

    // Smart Routing event listeners
    var btnToggleRoute = document.getElementById('btn-toggle-route');
    if (btnToggleRoute) btnToggleRoute.addEventListener('click', batTatBangTimDuong);

    var btnCloseRoute = document.getElementById('btn-close-route');
    if (btnCloseRoute) btnCloseRoute.addEventListener('click', dongBangTimDuong);

    var btnGps = document.getElementById('btn-gps');
    if (btnGps) btnGps.addEventListener('click', function () { layViTriGPS(true); });

    var btnMyLoc = document.getElementById('btn-my-location');
    if (btnMyLoc) btnMyLoc.addEventListener('click', function () { layViTriGPS(true); });

    var btnSwap = document.getElementById('btn-swap-locations');
    if (btnSwap) btnSwap.addEventListener('click', daoChieuDiem);

    var btnPickOrigin = document.getElementById('btn-pick-origin');
    if (btnPickOrigin) btnPickOrigin.addEventListener('click', batTatChonOrigin);

    var btnPickDest = document.getElementById('btn-pick-map');
    if (btnPickDest) btnPickDest.addEventListener('click', batTatChonDest);

    var originInput = document.getElementById('route-origin-input');
    if (originInput) {
      originInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var val = originInput.value.trim();
          if (val) {
            var match = val.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
            if (match) {
              apDungOrigin(parseFloat(match[1]), parseFloat(match[3]), 'Tọa độ: ' + val);
              if (destPos) tinhDuongDi();
            }
          }
        }
      });
    }

    var chips = document.querySelectorAll('.quick-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('selected'); });
        chip.classList.add('selected');
        var lat = parseFloat(chip.getAttribute('data-lat'));
        var lng = parseFloat(chip.getAttribute('data-lng'));
        var name = chip.getAttribute('data-name');
        chonDiemDen(lat, lng, name);
      });
    });

    var btnCalc = document.getElementById('btn-calc-route');
    if (btnCalc) btnCalc.addEventListener('click', tinhDuongDi);

    var btnClear = document.getElementById('btn-clear-route');
    if (btnClear) btnClear.addEventListener('click', xoaDuongDi);

    var destInput = document.getElementById('route-dest-input');
    if (destInput) {
      destInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var val = destInput.value.trim();
          if (val) {
            var match = val.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
            if (match) {
              chonDiemDen(parseFloat(match[1]), parseFloat(match[3]), 'Tọa độ: ' + val);
            } else {
              tinhDuongDi();
            }
          }
        }
      });
    }

    // Refresh button
    document.getElementById('btn-refresh').addEventListener('click', tai);

    // Recenter map button
    document.getElementById('btn-recenter').addEventListener('click', function () {
      if (map && lanCuoi) {
        daFit = false;
        ve_ban_do(lanCuoi);
      }
    });

    // Settings icon in navbar: opens onboarding to reselect vehicle
    document.getElementById('btn-settings').addEventListener('click', function () {
      document.getElementById('onboarding').style.display = 'flex';
      document.getElementById('app').style.display = 'none';
      dungOnboarding();
    });

    // Legend accordion
    var legendBody = document.querySelector('.legend-body');
    document.getElementById('legend-toggle').addEventListener('click', function () {
      legendBody.style.display = legendBody.style.display === 'none' ? 'block' : 'none';
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (routeActive) dongBangTimDuong();
        document.getElementById('detail-drawer').style.display = 'none';
        document.getElementById('levels-modal').style.display = 'none';
        document.getElementById('about-modal').style.display = 'none';
        document.getElementById('vehicle-confirm').style.display = 'none';
        activeStationId = null;
        Array.from(document.querySelectorAll('.station-card')).forEach(function (c) {
          c.classList.remove('active-selected');
        });
      }
    });

    // Sidebar resizer
    setupResize();
  }

  function setupResize() {
    var handle = document.getElementById('resize-handle');
    var sidebar = document.querySelector('.sidebar');
    if (!handle || !sidebar) return;

    var dragging = false, startX = 0, startW = 0;

    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      dragging = true;
      startX = e.clientX;
      startW = sidebar.getBoundingClientRect().width;
      handle.classList.add('active');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var newW = startW + (e.clientX - startX);
      var minW = 280;
      var maxW = window.innerWidth * 0.6;
      newW = Math.max(minW, Math.min(maxW, newW));
      sidebar.style.width = newW + 'px';
      if (map) map.invalidateSize();
    });

    document.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      handle.classList.remove('active');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (map) map.invalidateSize();
    });

    // Double click resets to default width
    handle.addEventListener('dblclick', function () {
      sidebar.style.width = '440px';
      if (map) map.invalidateSize();
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  function khoiTao() {
    veBanDoInit();
    setupModals();

    fetch('/api/cau-hinh', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (c) {
        cauHinh = c;
        if (!c.loai_xe.some(function (x) { return x.loai_xe === loaiXe; })) loaiXe = null;
        dungThresholdTable();
        dungAreaPills(); // F03: Khu vực

        // Always show onboarding first so user can choose or confirm vehicle
        document.getElementById('onboarding').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
        dungOnboarding();
      })
      .catch(function () {
        banner(true, 'Không tải được cấu hình từ máy chủ. Đang thử lại…');
        setTimeout(khoiTao_lai, 3000);
      });
  }

  function khoiTao_lai() {
    fetch('/api/cau-hinh', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (c) {
        cauHinh = c;
        dungVehiclePills();
        dungAreaPills();
        dungThresholdTable();
        banner(false);
        tai();
      })
      .catch(function () { setTimeout(khoiTao_lai, 3000); });
  }

  khoiTao();
})();
