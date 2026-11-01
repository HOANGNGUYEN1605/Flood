// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Main Application Entry Point
// ══════════════════════════════════════════════════════════════════════════

import { state } from './state.js';
import { fetchCauHinh, fetchTinhHinh } from './api.js';
import { banner } from './utils.js';
import { initMap, recenterMap } from './map.js';
import {
  renderStationsList,
  renderVehiclePills,
  renderAreaPills,
  renderThresholdTable
} from './stations.js';
import {
  initRouteUI,
  apDungOrigin,
  chonDiemDen,
  tinhDuongDi,
  batTatChonOrigin,
  batTatChonDest
} from './route.js';
import { dungOnboarding, moXacNhanDoiXe, setupModals } from './ui.js';

/**
 * Xử lý sự kiện click trên bản đồ
 */
function handleMapClick(e) {
  if (state.route.isPickingOrigin) {
    apDungOrigin(e.latlng.lat, e.latlng.lng, 'Vị trí chọn: ' + e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4));
    batTatChonOrigin();
    if (state.route.destPos) tinhDuongDi();
  } else if (state.route.active || state.route.isPickingDest) {
    chonDiemDen(e.latlng.lat, e.latlng.lng, 'Tọa độ: ' + e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4));
    if (state.route.isPickingDest) batTatChonDest();
  }
}

/**
 * Lập lịch tự động cập nhật dữ liệu định kỳ (Polling EV-11)
 */
function hen() {
  clearTimeout(state.timer);
  const chuKy = (state.cauHinh && state.cauHinh.chu_ky_lam_moi) || 3;
  state.timer = setTimeout(tai, chuKy * 1000);
}

/**
 * Tải dữ liệu các trạm đo từ máy chủ
 */
export async function tai() {
  clearTimeout(state.timer);
  try {
    const du = await fetchTinhHinh(state.loaiXe, state.khuVuc);
    state.lanCuoi = du;
    banner(false);
    renderStationsList(du);
    hen();
  } catch (err) {
    if (err.status === 400 && state.loaiXe) {
      state.loaiXe = null;
      renderVehiclePills(xe => moXacNhanDoiXe(xe, tai));
    }
    banner(true, 'Không kết nối được máy chủ – dữ liệu đang hiển thị có thể đã cũ.');
    hen();
  }
}

/**
 * Khởi động ứng dụng
 */
async function khoiTao() {
  // 1. Khởi tạo bản đồ nền
  initMap(handleMapClick);

  // 2. Khởi tạo các tương tác UI và Modal
  setupModals();

  // 3. Khởi tạo tính năng tìm đường tránh ngập
  initRouteUI();

  // 4. Gắn sự kiện nút Refresh & Recenter
  const btnRefresh = document.getElementById('btn-refresh');
  if (btnRefresh) btnRefresh.addEventListener('click', tai);

  const btnRecenter = document.getElementById('btn-recenter');
  if (btnRecenter) {
    btnRecenter.addEventListener('click', () => {
      recenterMap();
    });
  }

  // 5. Nạp cấu hình từ backend
  try {
    const c = await fetchCauHinh();
    state.cauHinh = c;

    // Kiểm tra tính hợp lệ của loại xe đã lưu trong cache
    if (!c.loai_xe.some(x => x.loai_xe === state.loaiXe)) {
      state.loaiXe = null;
    }

    renderThresholdTable();
    renderAreaPills(kv => {
      state.khuVuc = kv;
      tai();
    });

    // Mở màn hình onboarding để người dùng chọn/xác nhận phương tiện
    const onboardingEl = document.getElementById('onboarding');
    const appEl = document.getElementById('app');
    if (onboardingEl) onboardingEl.style.display = 'flex';
    if (appEl) appEl.style.display = 'none';

    dungOnboarding(() => {
      tai();
    });
  } catch (err) {
    banner(true, 'Không tải được cấu hình từ máy chủ. Đang thử lại…');
    setTimeout(khoiTaoLai, 3000);
  }
}

/**
 * Thử lại nạp cấu hình khi mạng gặp sự cố
 */
async function khoiTaoLai() {
  try {
    const c = await fetchCauHinh();
    state.cauHinh = c;
    renderVehiclePills(xe => moXacNhanDoiXe(xe, tai));
    renderAreaPills(kv => {
      state.khuVuc = kv;
      tai();
    });
    renderThresholdTable();
    banner(false);
    tai();
  } catch (err) {
    setTimeout(khoiTaoLai, 3000);
  }
}

// Khởi chạy khi DOM sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', khoiTao);
} else {
  khoiTao();
}
