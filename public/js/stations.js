// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Stations List, Sidebar & Detail Drawer
// ══════════════════════════════════════════════════════════════════════════

import { state } from './state.js';
import { LOP, BADGE_ICON, VEHICLE_ICON, MUC_SORT, ALERT_MSG, MAU } from './constants.js';
import { esc, gio, tuoi, parseStationName } from './utils.js';
import { renderStationMarkers } from './map.js';
import { taiVaVeBieuDo } from './chart.js';

/**
 * Render danh sách trạm trên sidebar (sắp xếp cờ dâng nhanh FR-17 & mức nguy hiểm)
 */
export function renderStationsList(du) {
  const ds = document.getElementById('station-list');
  const info = document.getElementById('update-info');
  if (!ds || !info || !du || !du.tram) return;

  info.textContent = 'Cập nhật lúc ' + gio(du.server_time) + ' · ' + du.tram.length + ' trạm' +
    (state.khuVuc ? ' (' + state.khuVuc + ')' : '');

  // Sắp xếp: trạm có cờ dâng nhanh lên đầu (FR-17), sau đó theo mức nguy hiểm
  du.tram.sort((a, b) => {
    if (a.co_dang_nhanh !== b.co_dang_nhanh) return b.co_dang_nhanh ? 1 : -1;
    const ma = a.muc_canh_bao || 'Bình thường';
    const mb = b.muc_canh_bao || 'Bình thường';
    const sa = MUC_SORT[ma] != null ? MUC_SORT[ma] : 5;
    const sb = MUC_SORT[mb] != null ? MUC_SORT[mb] : 5;
    if (sa !== sb) return sa - sb;
    return a.ma_tram.localeCompare(b.ma_tram);
  });

  let countOnline = 0;

  const html = du.tram.map(t => {
    const mat = t.trang_thai_ket_noi === 'Mất kết nối';
    if (!mat) countOnline++;

    let lop, nhan, lopBadge;
    if (mat) { lop = 'matketnoi'; nhan = 'Mất kết nối'; lopBadge = 'matketnoi'; }
    else if (t.muc_canh_bao) { lop = LOP[t.muc_canh_bao]; nhan = t.muc_canh_bao; lopBadge = lop; }
    else { lop = 'chuachon'; nhan = 'Chưa chọn xe'; lopBadge = 'chuachon'; }

    const names = parseStationName(t);
    const h = t.muc_nuoc == null ? '—' : Math.round(t.muc_nuoc);

    // FR-12: Xu hướng nước so với 5 phút trước
    let trendHtml = '';
    const trendText = t.xu_huong || 'Ổn định';
    if (trendText === 'Đang lên' || trendText === 'Đang dâng') {
      trendHtml = '<span class="card-trend trend-up">↗ Đang lên</span>';
    } else if (trendText === 'Đang rút') {
      trendHtml = '<span class="card-trend trend-down">↘ Đang rút</span>';
    } else {
      trendHtml = '<span class="card-trend trend-stable">→ Ổn định</span>';
    }

    const tg = t.thoi_diem_do
      ? '<span>⏱ ' + tuoi(du.server_time, t.thoi_diem_do) + '</span>'
      : '<span>Chưa có dữ liệu</span>';

    const conn = mat
      ? '<span><span class="dot dot-red"></span> Mất kết nối</span>'
      : '<span><span class="dot dot-green"></span> Trực tuyến</span>';

    const isSimulation = t.ma_tram !== 'TR01';
    const tagHtml = isSimulation
      ? '<span class="card-tag">Mô phỏng</span>'
      : '<span class="card-tag" style="background:#ecfdf5;color:#059669">Trạm thật</span>';

    const rapidHtml = t.co_dang_nhanh
      ? '<div class="card-rapid">⚠ Nước dâng nhanh</div>'
      : '';

    const isSelected = (state.activeStationId === t.ma_tram) ? ' active-selected' : '';

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

  // Cập nhật status bar
  const stationCountEl = document.getElementById('station-count');
  if (stationCountEl) {
    stationCountEl.textContent = du.tram.length + ' trạm · ' + countOnline + ' trực tuyến';
  }

  // Gắn sự kiện click mở detail drawer
  Array.from(ds.querySelectorAll('.station-card')).forEach(card => {
    card.addEventListener('click', () => {
      const ma = card.getAttribute('data-ma');
      const t = du.tram.find(x => x.ma_tram === ma);
      if (t) {
        selectStation(t, du);
      }
    });
  });

  // Cập nhật marker trên bản đồ
  renderStationMarkers(du.tram, du, selectStation);

  // Nếu đang mở drawer của một trạm thì cập nhật lại số liệu mới
  if (state.activeStationId) {
    const currentStation = du.tram.find(x => x.ma_tram === state.activeStationId);
    if (currentStation) {
      renderDrawerContent(currentStation, du);
    }
  }
}

/**
 * Chọn trạm: highlight thẻ, pan bản đồ và mở drawer chi tiết
 */
export function selectStation(t, du) {
  state.activeStationId = t.ma_tram;

  // Highlight card
  Array.from(document.querySelectorAll('.station-card')).forEach(c => {
    c.classList.toggle('active-selected', c.getAttribute('data-ma') === t.ma_tram);
  });

  // Pan map
  if (typeof t.vi_do === 'number' && typeof t.kinh_do === 'number' && state.map) {
    state.map.flyTo([t.vi_do, t.kinh_do], 15, { duration: 0.6 });
  }

  // Open detail drawer
  renderDrawerContent(t, du);
  const drawerEl = document.getElementById('detail-drawer');
  if (drawerEl) drawerEl.style.display = 'flex';
}

/**
 * Render nội dung drawer chi tiết trạm đo (FR-12, FR-15, BRULE-03)
 */
export function renderDrawerContent(t, du) {
  const drawer = document.getElementById('drawer-content');
  if (!drawer) return;

  const mat = t.trang_thai_ket_noi === 'Mất kết nối';

  let lop, nhan;
  if (mat) { lop = 'matketnoi'; nhan = 'Mất kết nối – dữ liệu cũ'; }
  else if (t.muc_canh_bao) { lop = LOP[t.muc_canh_bao]; nhan = t.muc_canh_bao; }
  else { lop = 'chuachon'; nhan = 'Chưa chọn loại xe'; }

  const names = parseStationName(t);
  const h = t.muc_nuoc == null ? '—' : t.muc_nuoc.toFixed(1);
  const msg = ALERT_MSG[nhan] || '';

  // Chi tiết loại xe & Ngưỡng
  let xeLabel = 'xe của bạn';
  let T = 20;
  if (state.loaiXe && state.cauHinh) {
    const xeInfo = state.cauHinh.loai_xe.find(x => x.loai_xe === state.loaiXe);
    if (xeInfo) {
      xeLabel = xeInfo.ten_loai_xe.toLowerCase();
      T = xeInfo.nguong_T;
    }
  }

  // Thông điệp ngưỡng động (BRULE-03 & C-08: không dùng chữ an toàn đứng riêng)
  let calloutMsg = '';
  if (mat) {
    calloutMsg = 'Chưa nhận được dữ liệu mới từ trạm đo. Không thể đánh giá mức rủi ro hiện tại.';
  } else if (t.muc_nuoc == null) {
    calloutMsg = 'Trạm chưa có dữ liệu quan trắc mực nước.';
  } else if (t.muc_nuoc >= T + 10) {
    const vuot = Math.round(t.muc_nuoc - (T + 10));
    calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Đã vượt ngưỡng khẩn cấp của ' + xeLabel + ' ' + (vuot > 0 ? vuot + ' cm' : '') + '. Tuyệt đối không đi qua.';
  } else if (t.muc_nuoc >= T) {
    const vuotNguyHiem = Math.round(t.muc_nuoc - T);
    calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Đã vượt ngưỡng nguy hiểm của ' + xeLabel + ' ' + (vuotNguyHiem > 0 ? vuotNguyHiem + ' cm' : '') + '. Không nên đi qua.';
  } else if (t.muc_nuoc >= T - 10) {
    calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Đang ở mức cảnh báo đối với ' + xeLabel + '. Đi chậm, chú ý quan sát.';
  } else {
    calloutMsg = 'Mực nước ' + Math.round(t.muc_nuoc) + ' cm. Nằm trong mức bình thường đối với ' + xeLabel + '. Vẫn chú ý quan sát khi lưu thông.';
  }

  // Vị trí con trỏ gauge trên thang đo 0 - 55+ cm
  const maxScale = 55;
  let gaugePercent = 0;
  if (t.muc_nuoc != null) {
    gaugePercent = Math.min(100, Math.max(0, (t.muc_nuoc / maxScale) * 100));
  }
  const pinColor = MAU[nhan] || '#94a3b8';

  // FR-12: Xu hướng 5 phút
  const trendText = t.xu_huong || 'Ổn định';
  const trendSub = (typeof t.chenh_lech_5p === 'number' && t.chenh_lech_5p !== 0)
    ? ' (' + (t.chenh_lech_5p > 0 ? '+' : '') + t.chenh_lech_5p + ' cm so với 5p trước)'
    : ' (so với 5p trước)';

  let trendBadgeClass = 'trend-stable';
  if (trendText === 'Đang lên' || trendText === 'Đang dâng') trendBadgeClass = 'trend-up';
  else if (trendText === 'Đang rút') trendBadgeClass = 'trend-down';

  const isSimulation = t.ma_tram !== 'TR01';
  const tagHtml = isSimulation
    ? '<span class="pill-sensor-type" style="background:#f1f5f9;color:#475569">Trạm mô phỏng</span>'
    : '<span class="pill-sensor-type">Trạm thật</span>';

  const html = '<div class="drawer-body">' +
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

  // Tải và vẽ biểu đồ SVG
  taiVaVeBieuDo(t.ma_tram, T);
}

/**
 * Render pills loại xe trên thanh điều khiển
 */
export function renderVehiclePills(onSelectVehicle) {
  const box = document.getElementById('vehicle-pills');
  if (!box || !state.cauHinh || !state.cauHinh.loai_xe) return;

  box.innerHTML = '';
  state.cauHinh.loai_xe.forEach(x => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'v-pill' + (x.loai_xe === state.loaiXe ? ' active' : '');
    b.innerHTML = (VEHICLE_ICON[x.loai_xe] || '') + ' ' + esc(x.ten_loai_xe);
    b.addEventListener('click', () => {
      if (typeof onSelectVehicle === 'function') {
        onSelectVehicle(x);
      }
    });
    box.appendChild(b);
  });
}

/**
 * Render pills lọc theo quận / khu vực (F03, DE-04)
 */
export function renderAreaPills(onFilterChange) {
  const box = document.getElementById('area-pills');
  if (!box || !state.cauHinh || !state.cauHinh.danh_sach_khu_vuc) return;

  box.innerHTML = '';

  // Nút Tất cả
  const btnAll = document.createElement('button');
  btnAll.type = 'button';
  btnAll.className = 'area-pill' + (state.khuVuc === '' ? ' active' : '');
  btnAll.textContent = 'Tất cả';
  btnAll.addEventListener('click', () => {
    state.khuVuc = '';
    renderAreaPills(onFilterChange);
    if (typeof onFilterChange === 'function') onFilterChange('');
  });
  box.appendChild(btnAll);

  // Từng khu vực
  state.cauHinh.danh_sach_khu_vuc.forEach(kv => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'area-pill' + (state.khuVuc === kv ? ' active' : '');
    b.textContent = kv;
    b.addEventListener('click', () => {
      state.khuVuc = kv;
      renderAreaPills(onFilterChange);
      if (typeof onFilterChange === 'function') onFilterChange(kv);
    });
    box.appendChild(b);
  });
}

/**
 * Render bảng ngưỡng cảnh báo trong modal M06
 */
export function renderThresholdTable() {
  const body = document.getElementById('threshold-body');
  const header = document.getElementById('threshold-title');
  if (!body || !state.cauHinh || !state.cauHinh.loai_xe) return;

  if (state.loaiXe) {
    const currentXe = state.cauHinh.loai_xe.find(x => x.loai_xe === state.loaiXe);
    if (currentXe && header) {
      header.textContent = 'Ngưỡng của ' + currentXe.ten_loai_xe.toLowerCase() + ' (cm)';
    }
  }

  body.innerHTML = state.cauHinh.loai_xe.map(x => {
    const T = x.nguong_T;
    const isCurrent = (x.loai_xe === state.loaiXe);
    return '<tr style="' + (isCurrent ? 'font-weight:700;background:#eff6ff' : '') + '">' +
      '<td style="text-align:left;padding-left:16px;">' + esc(x.ten_loai_xe) + (isCurrent ? ' (đang chọn)' : '') + '</td>' +
      '<td>' + (T - 10) + '</td>' +
      '<td>' + T + '</td>' +
      '<td>' + (T + 10) + '</td>' +
    '</tr>';
  }).join('');
}
