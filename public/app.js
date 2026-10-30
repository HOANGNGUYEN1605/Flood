// FloodSafe Đà Nẵng – Ultra-Modern Application Logic
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
  var loaiXe = docLuu();
  var cauHinh = null;
  var map, markers = {}, daFit = false, timer = null, lanCuoi = null;
  var prevValues = {};
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

  /* Extract friendly station title & subtitle */
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
      tai();
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
    info.textContent = 'Cập nhật lúc ' + gio(du.server_time) + ' · ' + du.tram.length + ' trạm';

    // Sort by danger level
    du.tram.sort(function (a, b) {
      var ma = a.muc_canh_bao || 'Bình thường';
      var mb = b.muc_canh_bao || 'Bình thường';
      var sa = MUC_SORT[ma] != null ? MUC_SORT[ma] : 5;
      var sb = MUC_SORT[mb] != null ? MUC_SORT[mb] : 5;
      if (a.co_dang_nhanh !== b.co_dang_nhanh) return b.co_dang_nhanh ? 1 : -1;
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

      // Trend
      var trendHtml = '';
      var prev = prevValues[t.ma_tram];
      if (prev != null && t.muc_nuoc != null) {
        var diff = t.muc_nuoc - prev;
        if (diff > 0.4) trendHtml = '<span class="card-trend trend-up">↗ Đang dâng</span>';
        else if (diff < -0.4) trendHtml = '<span class="card-trend trend-down">↘ Đang rút</span>';
        else trendHtml = '<span class="card-trend trend-stable">→ Ổn định</span>';
      }
      if (t.muc_nuoc != null) prevValues[t.ma_tram] = t.muc_nuoc;

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
     DETAIL DRAWER RENDERING
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

    // Dynamic threshold callout message
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
      calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Nằm trong ngưỡng an toàn đối với ' + xeLabel + '. Lưu thông bình thường.';
    }

    // Gauge pin position on 0 - 55+ scale
    var maxScale = 55;
    var gaugePercent = 0;
    if (t.muc_nuoc != null) {
      gaugePercent = Math.min(100, Math.max(0, (t.muc_nuoc / maxScale) * 100));
    }
    var pinColor = MAU[nhan] || '#94a3b8';

    // Trend
    var trendHtml = '';
    var prev = prevValues[t.ma_tram];
    if (prev != null && t.muc_nuoc != null) {
      var diff = t.muc_nuoc - prev;
      if (diff > 0.4) trendHtml = '<span class="gauge-trend-badge trend-up">↗ Đang dâng</span>';
      else if (diff < -0.4) trendHtml = '<span class="gauge-trend-badge trend-down">↘ Đang rút</span>';
      else trendHtml = '<span class="gauge-trend-badge trend-stable">→ Ổn định</span>';
    }

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
            trendHtml +
            '<div class="gauge-time-sub">Cập nhật ' + (t.thoi_diem_do ? tuoi(du.server_time, t.thoi_diem_do) : 'Chưa có') + '</div>' +
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
  }

  /* ═══════════════════════════════════════════════
     MAP & REAL TILES
     ═══════════════════════════════════════════════ */
  function veBanDoInit() {
    map = L.map('map', { zoomControl: true }).setView([16.0678, 108.2208], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> · Dữ liệu mô hình hoá',
    }).addTo(map);
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
     NETWORK / REFRESH POLLING
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
    var url = '/api/tram' + (loaiXe ? '?loai_xe=' + encodeURIComponent(loaiXe) : '');
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
        else if (target === 'main') {
          document.getElementById('levels-modal').style.display = 'none';
          document.getElementById('about-modal').style.display = 'none';
          document.querySelectorAll('.nav-link').forEach(function (nl) { nl.classList.remove('active'); });
          var mainLink = document.querySelector('.nav-link[data-nav="main"]');
          if (mainLink) mainLink.classList.add('active');
        }
      });
    });

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
        dungThresholdTable();
        banner(false);
        tai();
      })
      .catch(function () { setTimeout(khoiTao_lai, 3000); });
  }

  khoiTao();
})();
