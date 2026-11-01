// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Map Engine (Leaflet & Google Maps Tile Standard)
// ══════════════════════════════════════════════════════════════════════════

import { state } from './state.js';
import { LOP, ICON_MARKER, DEFAULT_COORDS } from './constants.js';
import { esc, parseStationName, getShortLocationLabel } from './utils.js';

/**
 * Khởi tạo bản đồ với Google Maps tile tiếng Việt chuẩn
 */
export function initMap(onMapClick) {
  state.map = L.map('map', { zoomControl: true }).setView(DEFAULT_COORDS, 14);

  // Chuẩn bản đồ Google Maps tiếng Việt đầy đủ Biển Đông, quần đảo Hoàng Sa, quần đảo Trường Sa
  L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps · Chủ quyền Biển Đảo Việt Nam',
  }).addTo(state.map);

  renderSovereigntyBadges(state.map);

  if (typeof onMapClick === 'function') {
    state.map.on('click', onMapClick);
  }

  return state.map;
}

/**
 * Đặt các mốc khẳng định chủ quyền Biển Đông, Hoàng Sa, Trường Sa của Việt Nam
 */
export function renderSovereigntyBadges(mapInstance) {
  const map = mapInstance || state.map;
  if (!map) return;

  const nhanList = [
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

  nhanList.forEach(item => {
    const icon = L.divIcon({
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

/**
 * Vẽ hoặc cập nhật các pin trạm đo trên bản đồ
 */
export function renderStationMarkers(stations, payload, onSelectStation) {
  if (!state.map) return;

  const diem = [];
  stations.forEach(t => {
    if (typeof t.vi_do !== 'number' || typeof t.kinh_do !== 'number') return;
    const mat = t.trang_thai_ket_noi === 'Mất kết nối';
    const lop = mat ? 'matketnoi' : (t.muc_canh_bao ? LOP[t.muc_canh_bao] : 'chuachon');
    const nhan = mat ? 'Mất kết nối' : (t.muc_canh_bao || 'Chưa chọn xe');

    const label = getShortLocationLabel(t);
    const rapidClass = t.co_dang_nhanh ? ' pin-rapid' : '';

    const icon = L.divIcon({
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

    const names = parseStationName(t);
    const tooltipContent = '<div class="map-tooltip"><strong>' + esc(names.title) + '</strong><span>' +
      (t.muc_nuoc == null ? '—' : Math.round(t.muc_nuoc) + ' cm') + ' · ' + esc(nhan) + '</span></div>';

    let m = state.markers[t.ma_tram];
    if (!m) {
      m = state.markers[t.ma_tram] = L.marker([t.vi_do, t.kinh_do], { icon }).addTo(state.map);
      m.bindTooltip(tooltipContent, { direction: 'top', offset: [0, -20], className: 'custom-leaflet-tooltip' });
    } else {
      m.setIcon(icon);
      m.setTooltipContent(tooltipContent);
    }

    // Gắn sự kiện click mở detail drawer
    m.off('click').on('click', () => {
      if (typeof onSelectStation === 'function') {
        onSelectStation(t, payload);
      }
    });

    diem.push([t.vi_do, t.kinh_do]);
  });

  // Tự động bao quát trạm đo lần đầu
  if (!state.daFit && diem.length) {
    state.map.fitBounds(diem, { padding: [60, 60], maxZoom: 15 });
    state.daFit = true;
  }
}

/**
 * Canh giữa và bao quát toàn bộ các trạm
 */
export function recenterMap() {
  if (!state.map) return;
  const diem = [];
  Object.values(state.markers).forEach(m => {
    diem.push(m.getLatLng());
  });

  if (diem.length) {
    state.map.fitBounds(diem, { padding: [60, 60], maxZoom: 15 });
  } else {
    state.map.setView(DEFAULT_COORDS, 14);
  }
}
