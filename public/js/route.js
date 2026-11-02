// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Smart Flood-Avoiding Route Planner
// ══════════════════════════════════════════════════════════════════════════

import { state } from './state.js';
import { esc, banner, haversineDistance, distancePointToSegment, parseStationName } from './utils.js';
import { fetchIPLocation } from './api.js';
import { selectStation } from './stations.js';
import { setupPlaceAutocomplete } from './search.js';

/**
 * Tìm các trạm ngập nguy hiểm để định tuyến né tránh
 */
export function layDiemNgapNguyHiem() {
  if (!state.lanCuoi || !state.lanCuoi.tram) return [];
  const hazards = [];

  state.lanCuoi.tram.forEach(t => {
    if (typeof t.vi_do !== 'number' || typeof t.kinh_do !== 'number') return;
    if (t.trang_thai_ket_noi === 'Mất kết nối') return; // BRULE-04

    const muc = t.muc_canh_bao || 'Bình thường';
    let isHazard = false;
    let radius = 220; // 220m

    if (muc === 'Khẩn cấp') {
      isHazard = true;
      radius = 280;
    } else if (muc === 'Nguy hiểm') {
      isHazard = true;
      radius = 240;
    } else if (t.co_dang_nhanh) {
      isHazard = true;
      radius = 240;
    } else if (muc === 'Cảnh báo' && state.loaiXe === 'XM') {
      isHazard = true;
      radius = 180;
    }

    if (isHazard) {
      const names = parseStationName(t);
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

/**
 * Kiểm tra xem tuyến đường có cắt qua vùng ngập nguy hiểm không
 */
export function kiemTraVaNgap(coords, hazards) {
  const vaCham = [];
  hazards.forEach(h => {
    let minD = Infinity;
    for (let i = 0; i < coords.length - 1; i++) {
      const lon1 = coords[i][0], lat1 = coords[i][1];
      const lon2 = coords[i + 1][0], lat2 = coords[i + 1][1];
      const d = distancePointToSegment(h.lat, h.lng, lat1, lon1, lat2, lon2);
      if (d < minD) minD = d;
      if (minD < h.radius) break;
    }
    if (minD < h.radius) {
      vaCham.push({ hazard: h, minDistance: minD });
    }
  });
  return vaCham;
}

/**
 * Tính các điểm lệch (detour waypoints) sang 2 bên để tránh vùng ngập
 */
export function tinhDetourWaypoints(hazard, origin, dest) {
  const dLat = dest.lat - origin.lat;
  const dLng = dest.lng - origin.lng;
  const len = Math.sqrt(dLat * dLat + dLng * dLng) || 0.001;
  const pLat = -dLng / len;
  const pLng = dLat / len;
  const offsetDeg = 0.007; // ~700m
  return [
    { lat: hazard.lat + pLat * offsetDeg, lng: hazard.lng + pLng * offsetDeg },
    { lat: hazard.lat - pLat * offsetDeg, lng: hazard.lng - pLng * offsetDeg }
  ];
}

/**
 * Cập nhật tên xe trên tiêu đề phụ của bảng tìm đường
 */
export function capNhatTagXeTrenBangTimDuong() {
  const tag = document.getElementById('route-vehicle-tag');
  if (!tag || !state.cauHinh || !state.cauHinh.loai_xe) return;
  const cur = state.cauHinh.loai_xe.find(x => x.loai_xe === state.loaiXe);
  const ten = cur ? cur.ten_loai_xe : 'Phương tiện';
  tag.textContent = 'Tự động né điểm ngập cho ' + ten;
}

/**
 * Lấy tọa độ GPS thực tế
 */
export function layViTriGPS(showNotification) {
  const input = document.getElementById('route-origin-input');
  if (input) input.value = 'Đang dò vị trí GPS thực tế...';
  if (showNotification) banner(true, 'Đang xác định tọa độ GPS thực tế của bạn...');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy || 0);

        state.route.userPos = { lat, lng, name: 'Vị trí GPS của bạn' };
        apDungOrigin(lat, lng, 'Vị trí GPS của bạn (±' + acc + 'm)');

        if (state.route.gpsAccuracyCircle && state.map) {
          state.map.removeLayer(state.route.gpsAccuracyCircle);
        }

        if (acc > 0 && acc < 5000 && state.map) {
          state.route.gpsAccuracyCircle = L.circle([lat, lng], {
            radius: acc,
            color: '#2563eb',
            weight: 1.5,
            fillColor: '#93c5fd',
            fillOpacity: 0.18
          }).addTo(state.map);
        }

        if (state.map) state.map.flyTo([lat, lng], 15, { duration: 0.8 });
        banner(true, '✓ Đã nhận diện đúng vị trí GPS thực tế của bạn.');
        setTimeout(() => banner(false), 3500);

        if (state.route.destPos) tinhDuongDi();
      },
      () => {
        thuDinhViQuaIP(showNotification);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  } else {
    thuDinhViQuaIP(showNotification);
  }
}

/**
 * Fallback định vị qua IP
 */
export async function thuDinhViQuaIP(showNotification) {
  const data = await fetchIPLocation();
  if (data) {
    const tenCho = data.city || 'Vị trí của bạn';
    state.route.userPos = { lat: data.lat, lng: data.lng, name: tenCho };
    apDungOrigin(data.lat, data.lng, 'Vị trí mạng: ' + tenCho);
    if (state.map) state.map.flyTo([data.lat, data.lng], 13, { duration: 0.8 });

    banner(true, 'Đã xác định vị trí thực tế của bạn tại ' + tenCho + '. Bạn có thể kéo thả pin hoặc bấm nút chọn trên bản đồ nếu muốn đổi.');
    setTimeout(() => banner(false), 5000);

    if (state.route.destPos) tinhDuongDi();
  } else {
    datViTriMacDinh(showNotification);
  }
}

/**
 * Đặt vị trí mặc định tại trung tâm Đà Nẵng
 */
export function datViTriMacDinh(showNotification) {
  apDungOrigin(state.route.userPos.lat, state.route.userPos.lng, state.route.userPos.name);
  if (showNotification) {
    banner(true, 'Chưa nhận được GPS tự động. Vui lòng bấm vào bản đồ hoặc kéo pin "Xuất phát" để đặt vị trí chính xác của bạn.');
    setTimeout(() => banner(false), 5000);
  }
}

/**
 * Gán và cập nhật marker điểm xuất phát
 */
export function apDungOrigin(lat, lng, name) {
  state.route.originPos = { lat, lng, name };
  const input = document.getElementById('route-origin-input');
  if (input) input.value = name || (lat.toFixed(4) + ', ' + lng.toFixed(4));
  const btnClearO = document.getElementById('btn-clear-origin');
  if (btnClearO) btnClearO.style.display = (input && input.value) ? 'flex' : 'none';

  if (!state.map) return;

  if (!state.route.originMarker) {
    const icon = L.divIcon({
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
    state.route.originMarker = L.marker([lat, lng], { icon, draggable: true }).addTo(state.map);
    state.route.originMarker.on('dragend', e => {
      const p = e.target.getLatLng();
      state.route.originPos = { lat: p.lat, lng: p.lng, name: 'Tọa độ: ' + p.lat.toFixed(4) + ', ' + p.lng.toFixed(4) };
      if (input) input.value = state.route.originPos.name;
      if (state.route.destPos) tinhDuongDi();
    });
  } else {
    state.route.originMarker.setLatLng([lat, lng]);
  }
}

/**
 * Gán và cập nhật marker điểm đến
 */
export function chonDiemDen(lat, lng, name) {
  state.route.destPos = { lat, lng, name };
  const input = document.getElementById('route-dest-input');
  if (input) input.value = name;
  const btnClearD = document.getElementById('btn-clear-dest');
  if (btnClearD) btnClearD.style.display = name ? 'flex' : 'none';

  if (!state.map) return;

  if (!state.route.destMarker) {
    const icon = L.divIcon({
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
    state.route.destMarker = L.marker([lat, lng], { icon, draggable: true }).addTo(state.map);
    state.route.destMarker.on('dragend', e => {
      const p = e.target.getLatLng();
      state.route.destPos = { lat: p.lat, lng: p.lng, name: 'Điểm đến: ' + p.lat.toFixed(4) + ', ' + p.lng.toFixed(4) };
      if (input) input.value = state.route.destPos.name;
      tinhDuongDi();
    });
  } else {
    state.route.destMarker.setLatLng([lat, lng]);
    const labelEl = state.route.destMarker.getElement();
    if (labelEl) {
      const lbl = labelEl.querySelector('.route-pin-label');
      if (lbl) lbl.textContent = name ? name.substring(0, 16) : 'Điểm đến';
    }
  }

  tinhDuongDi();
}

/**
 * Đổi chiều điểm xuất phát và điểm đến
 */
export function daoChieuDiem() {
  if (!state.route.originPos || !state.route.destPos) return;
  const tmp = state.route.originPos;
  state.route.originPos = state.route.destPos;
  state.route.destPos = tmp;

  const oInput = document.getElementById('route-origin-input');
  const dInput = document.getElementById('route-dest-input');
  if (oInput) oInput.value = state.route.originPos.name;
  if (dInput) dInput.value = state.route.destPos.name;

  if (state.route.originMarker) state.route.originMarker.setLatLng([state.route.originPos.lat, state.route.originPos.lng]);
  if (state.route.destMarker) state.route.destMarker.setLatLng([state.route.destPos.lat, state.route.destPos.lng]);

  tinhDuongDi();
}

export function batTatChonOrigin() {
  state.route.isPickingOrigin = !state.route.isPickingOrigin;
  if (state.route.isPickingOrigin) state.route.isPickingDest = false;
  const btnO = document.getElementById('btn-pick-origin');
  const btnD = document.getElementById('btn-pick-map');
  if (btnO) btnO.classList.toggle('active', state.route.isPickingOrigin);
  if (btnD) btnD.classList.remove('active');
  if (state.route.isPickingOrigin) {
    banner(true, 'Nhấp vào bất kỳ điểm nào trên bản đồ để đặt ĐIỂM XUẤT PHÁT.');
    setTimeout(() => banner(false), 4000);
  }
}

export function batTatChonDest() {
  state.route.isPickingDest = !state.route.isPickingDest;
  if (state.route.isPickingDest) state.route.isPickingOrigin = false;
  const btnO = document.getElementById('btn-pick-origin');
  const btnD = document.getElementById('btn-pick-map');
  if (btnD) btnD.classList.toggle('active', state.route.isPickingDest);
  if (btnO) btnO.classList.remove('active');
  if (state.route.isPickingDest) {
    banner(true, 'Nhấp vào bất kỳ điểm nào trên bản đồ để chọn ĐIỂM ĐẾN.');
    setTimeout(() => banner(false), 4000);
  }
}

export function batTatBangTimDuong(forceOpen = null) {
  if (typeof forceOpen === 'boolean') {
    state.route.active = forceOpen;
  } else {
    state.route.active = !state.route.active;
  }

  const panel = document.getElementById('route-panel');
  const btn = document.getElementById('btn-toggle-route');
  const navLink = document.getElementById('nav-btn-route');
  const mainLink = document.querySelector('.nav-link[data-nav="main"]');

  if (state.route.active) {
    if (panel) {
      panel.style.display = 'block';
      panel.scrollTop = 0;
    }
    if (btn) btn.classList.add('active');
    if (navLink) navLink.classList.add('active');
    if (mainLink) mainLink.classList.remove('active');
    capNhatTagXeTrenBangTimDuong();
    if (!state.route.originPos) {
      layViTriGPS(false);
    }
  } else {
    dongBangTimDuong();
  }
}

export function dongBangTimDuong() {
  state.route.active = false;
  state.route.isPickingOrigin = false;
  state.route.isPickingDest = false;
  const panel = document.getElementById('route-panel');
  const btn = document.getElementById('btn-toggle-route');
  const navLink = document.getElementById('nav-btn-route');
  const mainLink = document.querySelector('.nav-link[data-nav="main"]');
  if (panel) panel.style.display = 'none';
  if (btn) btn.classList.remove('active');
  if (navLink) navLink.classList.remove('active');
  if (mainLink) mainLink.classList.add('active');
  const btnO = document.getElementById('btn-pick-origin');
  if (btnO) btnO.classList.remove('active');
  const btnD = document.getElementById('btn-pick-map');
  if (btnD) btnD.classList.remove('active');
}

export function xoaDuongDi() {
  if (state.map) {
    state.route.routePolylines.forEach(p => state.map.removeLayer(p));
    state.route.routePolylines = [];
    state.route.hazardCircles.forEach(c => state.map.removeLayer(c));
    state.route.hazardCircles = [];
    if (state.route.hazardMarkers) {
      state.route.hazardMarkers.forEach(m => state.map.removeLayer(m));
      state.route.hazardMarkers = [];
    }
    if (state.route.destMarker) {
      state.map.removeLayer(state.route.destMarker);
      state.route.destMarker = null;
    }
  }
  state.route.destPos = null;
  const destInput = document.getElementById('route-dest-input');
  if (destInput) destInput.value = '';
  const btnClearD = document.getElementById('btn-clear-dest');
  if (btnClearD) btnClearD.style.display = 'none';
  const resultCard = document.getElementById('route-result');
  if (resultCard) resultCard.style.display = 'none';
  const loading = document.getElementById('route-loading');
  if (loading) loading.style.display = 'none';
  Array.from(document.querySelectorAll('.quick-chip')).forEach(c => c.classList.remove('selected'));
}

/**
 * Tính toán tuyến đường né tránh các điểm ngập nước
 */
export async function tinhDuongDi() {
  if (!state.route.originPos) {
    layViTriGPS(true);
    return;
  }
  if (!state.route.destPos) {
    banner(true, 'Vui lòng chọn điểm đến trên bản đồ hoặc từ danh sách gợi ý.');
    setTimeout(() => banner(false), 3000);
    return;
  }

  const loading = document.getElementById('route-loading');
  const resultCard = document.getElementById('route-result');
  if (loading) loading.style.display = 'flex';
  if (resultCard) resultCard.style.display = 'none';

  if (state.map) {
    state.route.routePolylines.forEach(p => state.map.removeLayer(p));
    state.route.routePolylines = [];
    state.route.hazardCircles.forEach(c => state.map.removeLayer(c));
    state.route.hazardCircles = [];
    if (state.route.hazardMarkers) {
      state.route.hazardMarkers.forEach(m => state.map.removeLayer(m));
      state.route.hazardMarkers = [];
    }
  }

  const hazards = layDiemNgapNguyHiem();

  try {
    const urlDirect = 'https://router.project-osrm.org/route/v1/driving/' +
      state.route.originPos.lng + ',' + state.route.originPos.lat + ';' +
      state.route.destPos.lng + ',' + state.route.destPos.lat +
      '?overview=full&geometries=geojson&alternatives=true';

    const r = await fetch(urlDirect);
    if (!r.ok) throw new Error('OSRM error ' + r.status);
    const data = await r.json();

    if (!data.routes || !data.routes.length) {
      throw new Error('No route found');
    }

    let bestRoute = null;
    let bestHazards = null;

    for (let i = 0; i < data.routes.length; i++) {
      const routeOption = data.routes[i];
      const vaCham = kiemTraVaNgap(routeOption.geometry.coordinates, hazards);
      if (vaCham.length === 0) {
        bestRoute = routeOption;
        bestHazards = [];
        break;
      }
      if (!bestRoute || vaCham.length < bestHazards.length) {
        bestRoute = routeOption;
        bestHazards = vaCham;
      }
    }

    // Nếu vẫn vướng trạm ngập, thử tìm đường vòng qua các waypoint né
    if (bestHazards.length > 0 && hazards.length > 0) {
      const primaryHazard = bestHazards[0].hazard;
      const waypoints = tinhDetourWaypoints(primaryHazard, state.route.originPos, state.route.destPos);

      const detourPromises = waypoints.map(async wp => {
        const urlDetour = 'https://router.project-osrm.org/route/v1/driving/' +
          state.route.originPos.lng + ',' + state.route.originPos.lat + ';' +
          wp.lng + ',' + wp.lat + ';' +
          state.route.destPos.lng + ',' + state.route.destPos.lat +
          '?overview=full&geometries=geojson';
        try {
          const res = await fetch(urlDetour);
          return res.ok ? await res.json() : null;
        } catch (e) {
          return null;
        }
      });

      const detourResults = await Promise.all(detourPromises);
      detourResults.forEach(dData => {
        if (dData && dData.routes && dData.routes.length) {
          const dRoute = dData.routes[0];
          const dVaCham = kiemTraVaNgap(dRoute.geometry.coordinates, hazards);
          if (dVaCham.length < bestHazards.length) {
            bestRoute = dRoute;
            bestHazards = dVaCham;
          }
        }
      });
    }

    if (loading) loading.style.display = 'none';
    hienThiKetQuaLoTrinh(bestRoute, bestHazards, hazards);
  } catch (err) {
    if (loading) loading.style.display = 'none';
    console.error('[route] Calculation error:', err);
    xuLyLoTrinhFallback(hazards);
  }
}

/**
 * Hiển thị polyline tuyến đường và kết quả tính toán
 */
export function hienThiKetQuaLoTrinh(route, hazardsOnRoute, allHazards) {
  if (!route || !route.geometry || !route.geometry.coordinates || !state.map) return;

  const coords = route.geometry.coordinates;
  const latlngs = coords.map(c => [c[1], c[0]]);
  const hasDanger = hazardsOnRoute.length > 0;

  const casingColor = hasDanger ? '#dc2626' : '#1d4ed8';
  const lineColor = hasDanger ? '#ef4444' : '#2563eb';

  const casing = L.polyline(latlngs, {
    color: casingColor,
    weight: 9,
    opacity: 0.35,
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(state.map);

  const line = L.polyline(latlngs, {
    color: lineColor,
    weight: 5,
    opacity: 0.95,
    dashArray: hasDanger ? '8, 8' : null,
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(state.map);

  state.route.routePolylines.push(casing, line);

  // Vẽ các vòng tròn bán kính ảnh hưởng ngập KÈM ICON TRẠM NGẬP Ở TÂM
  allHazards.forEach(h => {
    const isCollision = hazardsOnRoute.some(vh => vh.hazard.ma_tram === h.ma_tram);
    const circle = L.circle([h.lat, h.lng], {
      radius: h.radius,
      color: isCollision ? '#dc2626' : '#f59e0b',
      weight: isCollision ? 2.5 : 1.5,
      dashArray: '5, 5',
      fillColor: isCollision ? '#ef4444' : '#fef08a',
      fillOpacity: isCollision ? 0.28 : 0.14
    }).addTo(state.map);

    circle.bindTooltip('Khu vực trạm ' + esc(h.ten) + ' (' + esc(h.muc_canh_bao) + ')', {
      className: 'custom-leaflet-tooltip'
    });

    state.route.hazardCircles.push(circle);

    // Tạo Icon trạm ngập nổi bật tại tâm khung tròn
    let bubbleClass = 'hazard-bubble-canhbao';
    let iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M12 4v8M12 16v.01M2 19c2.5-2 5 2 7.5 0s5-2 7.5 0 5-2 5 0M2 22c2.5-2 5 2 7.5 0s5-2 7.5 0 5-2 5 0"/></svg>';

    if (h.muc_canh_bao === 'Khẩn cấp') {
      bubbleClass = 'hazard-bubble-khancap';
      iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else if (h.muc_canh_bao === 'Nguy hiểm') {
      bubbleClass = 'hazard-bubble-nguyhiem';
      iconSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    }

    const depthText = (h.muc_nuoc != null) ? Math.round(h.muc_nuoc) + 'cm' : '';

    const hazardIcon = L.divIcon({
      className: '',
      html: '<div class="hazard-station-pin">' +
              '<div class="hazard-pin-bubble ' + bubbleClass + '">' +
                iconSvg +
              '</div>' +
              '<div class="hazard-pin-badge">' +
                '<span>' + esc(h.ten) + '</span>' +
                (depthText ? '<span class="hazard-badge-depth">· ' + depthText + '</span>' : '') +
              '</div>' +
            '</div>',
      iconSize: [120, 64],
      iconAnchor: [60, 21]
    });

    const marker = L.marker([h.lat, h.lng], {
      icon: hazardIcon,
      zIndexOffset: 1000
    }).addTo(state.map);

    marker.on('click', () => {
      const t = state.lanCuoi && state.lanCuoi.tram ? state.lanCuoi.tram.find(x => x.ma_tram === h.ma_tram) : null;
      if (t) {
        selectStation(t, state.lanCuoi);
      }
    });

    if (!state.route.hazardMarkers) state.route.hazardMarkers = [];
    state.route.hazardMarkers.push(marker);
  });

  state.map.fitBounds(latlngs, { padding: [60, 60] });

  // Cập nhật card kết quả
  const resultCard = document.getElementById('route-result');
  const statusCard = document.getElementById('route-status-card');
  const statusIcon = document.getElementById('route-status-icon');
  const statusTitle = document.getElementById('route-status-title');
  const statusDesc = document.getElementById('route-status-desc');
  const distEl = document.getElementById('route-dist');
  const durEl = document.getElementById('route-duration');
  const avoidEl = document.getElementById('route-avoid-count');
  const warningsBox = document.getElementById('route-flood-warnings');
  const btnGoogle = document.getElementById('btn-google-nav');

  const km = (route.distance / 1000).toFixed(1);
  const mins = Math.max(1, Math.round(route.duration / 60));
  const avoidedCount = Math.max(0, allHazards.length - hazardsOnRoute.length);

  if (distEl) distEl.textContent = km + ' km';
  if (durEl) durEl.textContent = '~' + mins + ' phút';
  if (avoidEl) avoidEl.textContent = avoidedCount + ' trạm';

  const curXe = state.cauHinh ? state.cauHinh.loai_xe.find(x => x.loai_xe === state.loaiXe) : null;
  const tenXe = curXe ? curXe.ten_loai_xe : 'phương tiện';

  if (!hasDanger) {
    if (statusCard) statusCard.className = 'route-result-header status-safe';
    if (statusIcon) statusIcon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    if (statusTitle) statusTitle.textContent = 'Lộ trình tối ưu · Tránh điểm ngập';
    if (statusDesc) {
      statusDesc.textContent = allHazards.length > 0
        ? 'Đã tự động tính đường né tránh ' + allHazards.length + ' vị trí ngập rủi ro theo ' + tenXe + '.'
        : 'Không ghi nhận trạm ngập cản trở trên cung đường này theo ' + tenXe + '.';
    }
    if (warningsBox) warningsBox.style.display = 'none';
  } else {
    if (statusCard) statusCard.className = 'route-result-header status-danger';
    if (statusIcon) statusIcon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    if (statusTitle) statusTitle.textContent = 'Lưu ý: Có điểm ngập trên tuyến';
    if (statusDesc) statusDesc.textContent = 'Cung đường đi qua ' + hazardsOnRoute.length + ' điểm ngập nguy hiểm theo ' + tenXe + '. Hạn chế di chuyển!';

    let warnHtml = '<div class="flood-warning-title">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
      'Điểm ngập cắt ngang lộ trình:</div><ul class="flood-warning-list">';

    hazardsOnRoute.forEach(vh => {
      warnHtml += '<li class="flood-warning-item">Trạm <strong>' + esc(vh.hazard.ten) + '</strong> (' + esc(vh.hazard.muc_canh_bao) +
        (vh.hazard.muc_nuoc != null ? ' - ' + Math.round(vh.hazard.muc_nuoc) + ' cm' : '') + ')</li>';
    });
    warnHtml += '</ul>';

    if (warningsBox) {
      warningsBox.innerHTML = warnHtml;
      warningsBox.style.display = 'block';
    }
  }

  if (btnGoogle && state.route.originPos && state.route.destPos) {
    btnGoogle.href = 'https://www.google.com/maps/dir/?api=1&origin=' +
      state.route.originPos.lat + ',' + state.route.originPos.lng + '&destination=' +
      state.route.destPos.lat + ',' + state.route.destPos.lng;
  }

  if (resultCard) resultCard.style.display = 'block';
}

/**
 * Hiển thị đường chim bay khi dịch vụ OSRM không phản hồi
 */
export function xuLyLoTrinhFallback(hazards) {
  if (!state.route.originPos || !state.route.destPos || !state.map) return;
  const latlngs = [[state.route.originPos.lat, state.route.originPos.lng], [state.route.destPos.lat, state.route.destPos.lng]];
  const line = L.polyline(latlngs, { color: '#2563eb', weight: 4, dashArray: '5, 8' }).addTo(state.map);
  state.route.routePolylines.push(line);
  state.map.fitBounds(latlngs, { padding: [60, 60] });

  const resultCard = document.getElementById('route-result');
  const statusCard = document.getElementById('route-status-card');
  const statusTitle = document.getElementById('route-status-title');
  const statusDesc = document.getElementById('route-status-desc');
  const distEl = document.getElementById('route-dist');
  const durEl = document.getElementById('route-duration');
  const avoidEl = document.getElementById('route-avoid-count');

  const d = haversineDistance(state.route.originPos.lat, state.route.originPos.lng, state.route.destPos.lat, state.route.destPos.lng);
  if (distEl) distEl.textContent = (d / 1000).toFixed(1) + ' km (đường thẳng)';
  if (durEl) durEl.textContent = '~' + Math.round((d / 1000) / 30 * 60) + ' phút';
  if (avoidEl) avoidEl.textContent = '0';

  if (statusCard) statusCard.className = 'route-result-header status-warning';
  if (statusTitle) statusTitle.textContent = 'Dẫn đường trực tiếp';
  if (statusDesc) statusDesc.textContent = 'Không kết nối được dịch vụ chỉ đường OSRM. Hiển thị hướng tuyến trực tiếp.';
  if (resultCard) resultCard.style.display = 'block';
}

/**
 * Khởi tạo event listeners cho toàn bộ bảng tìm đường
 */
export function initRouteUI() {
  const btnToggle = document.getElementById('btn-toggle-route');
  if (btnToggle) btnToggle.addEventListener('click', () => batTatBangTimDuong());
  // Ghi chú: nav-btn-route đã được quản lý trong ui.js qua selector [data-nav="route"] để tránh double click

  const btnClose = document.getElementById('btn-close-route');
  if (btnClose) btnClose.addEventListener('click', dongBangTimDuong);

  const btnSwap = document.getElementById('btn-swap-locations');
  if (btnSwap) btnSwap.addEventListener('click', daoChieuDiem);

  const btnOriginPick = document.getElementById('btn-pick-origin');
  if (btnOriginPick) btnOriginPick.addEventListener('click', batTatChonOrigin);

  const btnDestPick = document.getElementById('btn-pick-map');
  if (btnDestPick) btnDestPick.addEventListener('click', batTatChonDest);

  const btnGps = document.getElementById('btn-my-location');
  if (btnGps) btnGps.addEventListener('click', () => layViTriGPS(true));

  const btnMapGps = document.getElementById('btn-gps');
  if (btnMapGps) btnMapGps.addEventListener('click', () => {
    if (!state.route.active) batTatBangTimDuong();
    layViTriGPS(true);
  });

  const btnCalc = document.getElementById('btn-calc-route');
  if (btnCalc) btnCalc.addEventListener('click', tinhDuongDi);

  const btnClear = document.getElementById('btn-clear-route');
  if (btnClear) btnClear.addEventListener('click', xoaDuongDi);

  // Gắn sự kiện các quick chips gợi ý điểm đến
  const chipContainer = document.getElementById('quick-dest-list');
  if (chipContainer) {
    chipContainer.addEventListener('click', e => {
      const chip = e.target.closest('.quick-chip');
      if (!chip) return;
      Array.from(chipContainer.querySelectorAll('.quick-chip')).forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');

      const lat = parseFloat(chip.getAttribute('data-lat'));
      const lng = parseFloat(chip.getAttribute('data-lng'));
      const name = chip.getAttribute('data-name');
      chonDiemDen(lat, lng, name);
    });
  }

  // Khởi tạo autocomplete gợi ý địa điểm chuẩn Google Maps cho ô Điểm đến
  const destInput = document.getElementById('route-dest-input');
  const destDropdown = document.getElementById('dest-suggestions');
  const btnClearDest = document.getElementById('btn-clear-dest');

  if (destInput && destDropdown) {
    setupPlaceAutocomplete(destInput, destDropdown, place => {
      chonDiemDen(place.lat, place.lng, place.name);
      if (btnClearDest) btnClearDest.style.display = 'flex';
    });

    destInput.addEventListener('input', () => {
      if (btnClearDest) btnClearDest.style.display = destInput.value.trim() ? 'flex' : 'none';
    });

    if (btnClearDest) {
      btnClearDest.addEventListener('click', () => {
        destInput.value = '';
        btnClearDest.style.display = 'none';
        xoaDuongDi();
        destInput.focus();
      });
    }
  }

  // Khởi tạo autocomplete gợi ý địa điểm cho ô Điểm xuất phát
  const originInput = document.getElementById('route-origin-input');
  const originDropdown = document.getElementById('origin-suggestions');
  const btnClearOrigin = document.getElementById('btn-clear-origin');

  if (originInput && originDropdown) {
    setupPlaceAutocomplete(originInput, originDropdown, place => {
      apDungOrigin(place.lat, place.lng, place.name);
      if (btnClearOrigin) btnClearOrigin.style.display = 'flex';
      if (state.route.destPos) tinhDuongDi();
    });

    originInput.addEventListener('input', () => {
      if (btnClearOrigin) btnClearOrigin.style.display = originInput.value.trim() ? 'flex' : 'none';
    });

    if (btnClearOrigin) {
      btnClearOrigin.addEventListener('click', () => {
        originInput.value = '';
        btnClearOrigin.style.display = 'none';
        state.route.originPos = null;
        if (state.route.originMarker && state.map) {
          state.map.removeLayer(state.route.originMarker);
          state.route.originMarker = null;
        }
        originInput.focus();
      });
    }
  }
}
