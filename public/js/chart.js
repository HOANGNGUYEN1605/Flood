// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Historical Water Level Chart (FR-15, SVG)
// ══════════════════════════════════════════════════════════════════════════

import { fetchLichSuTram } from './api.js';
import { gio, esc } from './utils.js';

/**
 * Tải dữ liệu lịch sử và vẽ biểu đồ SVG mực nước
 * @param {string} maTram Mã trạm đo
 * @param {number} nguongT Ngưỡng nguy hiểm của xe (cm)
 */
export async function taiVaVeBieuDo(maTram, nguongT) {
  const mount = document.getElementById('chart-mount');
  if (!mount) return;

  try {
    const res = await fetchLichSuTram(maTram);
    const data = res.lich_su || [];

    if (!data.length) {
      mount.innerHTML = '<div class="chart-empty">Chưa có lịch sử đo cho trạm này.</div>';
      return;
    }

    // Cập nhật nhãn thời gian trục X
    const tStartEl = document.getElementById('chart-t-start');
    const tEndEl = document.getElementById('chart-t-end');
    if (tStartEl && data[0] && data[0].thoi_diem_do) {
      tStartEl.textContent = gio(data[0].thoi_diem_do);
    }
    if (tEndEl && data[data.length - 1] && data[data.length - 1].thoi_diem_do) {
      tEndEl.textContent = gio(data[data.length - 1].thoi_diem_do);
    }

    // Kích thước SVG
    const W = 360;
    const H = 140;
    const padT = 15;
    const padB = 20;
    const padL = 25;
    const padR = 15;

    // Tìm Max Y để tính tỉ lệ (ít nhất là 35 hoặc ngưỡng khẩn cấp + 5)
    let maxVal = Math.max(35, (nguongT || 20) + 12);
    data.forEach(d => {
      if (typeof d.muc_nuoc === 'number') maxVal = Math.max(maxVal, d.muc_nuoc + 5);
    });

    const getY = val => {
      const ratio = (val || 0) / maxVal;
      return H - padB - ratio * (H - padT - padB);
    };

    const getX = i => {
      if (data.length <= 1) return (padL + W - padR) / 2;
      return padL + (i / (data.length - 1)) * (W - padL - padR);
    };

    // Tọa độ đường ngưỡng
    const yKhancap = getY((nguongT || 20) + 10);
    const yCanhbao = getY((nguongT || 20) - 10);

    // Tạo path line & area
    const points = data.map((d, i) => {
      return getX(i).toFixed(1) + ',' + getY(d.muc_nuoc).toFixed(1);
    });

    const pathLine = 'M ' + points.join(' L ');
    const pathArea = 'M ' + points[0] + ' L ' + points.join(' L ') +
      ' L ' + getX(data.length - 1).toFixed(1) + ',' + (H - padB) +
      ' L ' + getX(0).toFixed(1) + ',' + (H - padB) + ' Z';

    let svgHtml = '<svg class="chart-svg" viewBox="0 0 ' + W + ' ' + H + '">' +
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
      '<text x="' + (padL - 4) + '" y="' + (yKhancap + 3) + '" font-size="9" fill="#dc2626" font-weight="700" text-anchor="end">' + ((nguongT || 20) + 10) + '</text>' +

      // Vùng fill & đường line mực nước
      '<path d="' + pathArea + '" fill="url(#chartGrad)"/>' +
      '<path d="' + pathLine + '" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';

    // Điểm chấm tròn tại các mốc
    data.forEach((d, i) => {
      const cx = getX(i).toFixed(1);
      const cy = getY(d.muc_nuoc).toFixed(1);
      const tooltip = esc(gio(d.thoi_diem_do)) + ': ' + (d.muc_nuoc != null ? d.muc_nuoc + ' cm' : '—');
      svgHtml += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="#ffffff" stroke="#2563eb" stroke-width="2">' +
        '<title>' + tooltip + '</title>' +
      '</circle>';
    });

    svgHtml += '</svg>';
    mount.innerHTML = svgHtml;
  } catch (err) {
    mount.innerHTML = '<div class="chart-empty">Không tải được biểu đồ lịch sử.</div>';
  }
}
