// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – UI Components (Onboarding, Modals & Resizer)
// ══════════════════════════════════════════════════════════════════════════

import { state, ghiLuu } from './state.js';
import { ONBOARD_ICON, ONBOARD_DESC } from './constants.js';
import { esc } from './utils.js';
import { renderVehiclePills, renderThresholdTable } from './stations.js';
import { capNhatTagXeTrenBangTimDuong, batTatBangTimDuong, dongBangTimDuong } from './route.js';

/**
 * Màn hình Onboarding M01 chọn loại phương tiện
 */
export function dungOnboarding(onStart) {
  const box = document.getElementById('onboarding-options');
  const btn = document.getElementById('onboarding-btn');
  if (!box || !btn || !state.cauHinh) return;

  let selected = state.loaiXe;
  box.innerHTML = '';

  state.cauHinh.loai_xe.forEach(x => {
    const opt = document.createElement('div');
    opt.className = 'onboarding-opt' + (x.loai_xe === selected ? ' selected' : '');
    opt.innerHTML =
      '<div class="onboarding-opt-icon">' + (ONBOARD_ICON[x.loai_xe] || '') + '</div>' +
      '<div class="onboarding-opt-name">' + esc(x.ten_loai_xe) + '</div>' +
      '<div class="onboarding-opt-desc">' + (ONBOARD_DESC[x.loai_xe] || '') + '</div>';

    opt.addEventListener('click', () => {
      selected = x.loai_xe;
      Array.from(box.children).forEach(c => c.classList.remove('selected'));
      opt.classList.add('selected');
      btn.disabled = false;
    });

    box.appendChild(opt);
  });

  if (selected) btn.disabled = false;

  btn.onclick = () => {
    if (!selected) return;
    state.loaiXe = selected;
    ghiLuu(state.loaiXe);

    const onboardingEl = document.getElementById('onboarding');
    const appEl = document.getElementById('app');
    if (onboardingEl) onboardingEl.style.display = 'none';
    if (appEl) appEl.style.display = 'flex';

    renderVehiclePills(xe => moXacNhanDoiXe(xe, onStart));
    renderThresholdTable();
    capNhatTagXeTrenBangTimDuong();

    if (state.map) {
      setTimeout(() => state.map.invalidateSize(), 150);
    }

    if (typeof onStart === 'function') {
      onStart();
    }
  };

  const helpBtn = document.getElementById('btn-onboarding-help');
  if (helpBtn) {
    helpBtn.onclick = () => {
      const modal = document.getElementById('about-modal');
      if (modal) modal.style.display = 'flex';
    };
  }
}

/**
 * Popup xác nhận khi người dùng muốn đổi loại xe di chuyển
 */
export function moXacNhanDoiXe(xeMoi, onConfirmed) {
  const overlay = document.getElementById('vehicle-confirm');
  const desc = document.getElementById('confirm-desc');
  const btnOk = document.getElementById('confirm-ok');
  const btnCancel = document.getElementById('confirm-cancel');
  const backdrop = overlay.querySelector('.confirm-backdrop');
  if (!overlay || !desc || !btnOk || !btnCancel) return;

  let tenCu = '';
  if (state.loaiXe && state.cauHinh) {
    const xeCu = state.cauHinh.loai_xe.find(x => x.loai_xe === state.loaiXe);
    if (xeCu) tenCu = xeCu.ten_loai_xe;
  }

  desc.innerHTML = 'Đổi từ <strong>' + esc(tenCu) + '</strong> sang <strong>' + esc(xeMoi.ten_loai_xe) +
    '</strong>. Mức cảnh báo ở tất cả các trạm sẽ được tính lại theo phương tiện mới.';

  overlay.style.display = 'flex';

  const newOk = btnOk.cloneNode(true);
  const newCancel = btnCancel.cloneNode(true);
  btnOk.parentNode.replaceChild(newOk, btnOk);
  btnCancel.parentNode.replaceChild(newCancel, btnCancel);

  newOk.addEventListener('click', () => {
    state.loaiXe = xeMoi.loai_xe;
    ghiLuu(state.loaiXe);
    overlay.style.display = 'none';
    renderVehiclePills(xe => moXacNhanDoiXe(xe, onConfirmed));
    renderThresholdTable();
    capNhatTagXeTrenBangTimDuong();

    if (typeof onConfirmed === 'function') {
      onConfirmed();
    }
  });

  newCancel.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  if (backdrop) {
    backdrop.onclick = () => {
      overlay.style.display = 'none';
    };
  }
}

/**
 * Đăng ký sự kiện mở/đóng các Modal (Mức cảnh báo, Giới thiệu, Drawer close, ESC key)
 */
export function setupModals() {
  // Drawer close button
  const drawerClose = document.getElementById('drawer-close');
  if (drawerClose) {
    drawerClose.addEventListener('click', () => {
      const drawer = document.getElementById('detail-drawer');
      if (drawer) drawer.style.display = 'none';
      state.activeStationId = null;
      Array.from(document.querySelectorAll('.station-card')).forEach(c => {
        c.classList.remove('active-selected');
      });
    });
  }

  // Close buttons for modals
  const levelsClose = document.getElementById('levels-close');
  if (levelsClose) {
    levelsClose.addEventListener('click', () => {
      const modal = document.getElementById('levels-modal');
      if (modal) modal.style.display = 'none';
    });
  }

  const aboutClose = document.getElementById('about-close');
  if (aboutClose) {
    aboutClose.addEventListener('click', () => {
      const modal = document.getElementById('about-modal');
      if (modal) modal.style.display = 'none';
    });
  }

  // Click outside to close modal overlays
  ['levels-modal', 'about-modal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function (e) {
        if (e.target === this) this.style.display = 'none';
      });
    }
  });

  // Navigation Links
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const target = el.getAttribute('data-nav');
      if (target === 'levels') {
        const modal = document.getElementById('levels-modal');
        if (modal) modal.style.display = 'flex';
      } else if (target === 'about') {
        const modal = document.getElementById('about-modal');
        if (modal) modal.style.display = 'flex';
      } else if (target === 'route') {
        const lvModal = document.getElementById('levels-modal');
        const abModal = document.getElementById('about-modal');
        if (lvModal) lvModal.style.display = 'none';
        if (abModal) abModal.style.display = 'none';
        batTatBangTimDuong();
      } else if (target === 'main') {
        const lvModal = document.getElementById('levels-modal');
        const abModal = document.getElementById('about-modal');
        if (lvModal) lvModal.style.display = 'none';
        if (abModal) abModal.style.display = 'none';
        dongBangTimDuong();
        document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
        const mainLink = document.querySelector('.nav-link[data-nav="main"]');
        if (mainLink) mainLink.classList.add('active');
      }
    });
  });

  // Settings icon trên navbar: mở lại onboarding để đổi xe
  const btnSettings = document.getElementById('btn-settings');
  if (btnSettings) {
    btnSettings.addEventListener('click', () => {
      const onboardingEl = document.getElementById('onboarding');
      const appEl = document.getElementById('app');
      if (onboardingEl) onboardingEl.style.display = 'flex';
      if (appEl) appEl.style.display = 'none';
      dungOnboarding();
    });
  }

  // Toggle chú giải bản đồ
  const legendToggle = document.getElementById('legend-toggle');
  const legendBody = document.querySelector('.legend-body');
  if (legendToggle && legendBody) {
    legendToggle.addEventListener('click', () => {
      legendBody.style.display = legendBody.style.display === 'none' ? 'block' : 'none';
    });
  }

  // Phím Escape đóng tất cả các panel/modal nổi
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.route.active) dongBangTimDuong();
      const drawer = document.getElementById('detail-drawer');
      if (drawer) drawer.style.display = 'none';
      const lvModal = document.getElementById('levels-modal');
      if (lvModal) lvModal.style.display = 'none';
      const abModal = document.getElementById('about-modal');
      if (abModal) abModal.style.display = 'none';
      const confModal = document.getElementById('vehicle-confirm');
      if (confModal) confModal.style.display = 'none';
      state.activeStationId = null;
      Array.from(document.querySelectorAll('.station-card')).forEach(c => {
        c.classList.remove('active-selected');
      });
    }
  });

  // Kéo thả thay đổi độ rộng sidebar
  setupResize();
}

/**
 * Kéo thả cạnh phải sidebar để thay đổi kích thước
 */
export function setupResize() {
  const handle = document.getElementById('resize-handle');
  const sidebar = document.querySelector('.sidebar');
  if (!handle || !sidebar) return;

  let dragging = false;
  let startX = 0;
  let startW = 0;

  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    dragging = true;
    startX = e.clientX;
    startW = sidebar.getBoundingClientRect().width;
    handle.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const newW = startW + (e.clientX - startX);
    const minW = 280;
    const maxW = window.innerWidth * 0.6;
    const clampedW = Math.max(minW, Math.min(maxW, newW));
    sidebar.style.width = clampedW + 'px';
    if (state.map) state.map.invalidateSize();
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (state.map) state.map.invalidateSize();
  });

  handle.addEventListener('dblclick', () => {
    sidebar.style.width = '440px';
    if (state.map) state.map.invalidateSize();
  });
}
