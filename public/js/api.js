// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – API Services Layer
// ══════════════════════════════════════════════════════════════════════════

/**
 * Lấy cấu hình hệ thống (ngưỡng nước, thông tin loại xe, danh sách khu vực)
 */
export async function fetchCauHinh() {
  const res = await fetch('/api/cau-hinh', { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải cấu hình (HTTP ' + res.status + ')');
  return await res.json();
}

/**
 * Lấy tình hình trạm hiện tại theo loại xe và khu vực lọc
 */
export async function fetchTinhHinh(loaiXe, khuVuc) {
  let url = '/api/tram?';
  const params = [];
  if (loaiXe) params.push('loai_xe=' + encodeURIComponent(loaiXe));
  if (khuVuc) params.push('khu_vuc=' + encodeURIComponent(khuVuc));
  url += params.join('&');

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const err = new Error('HTTP ' + res.status);
    err.status = res.status;
    throw err;
  }
  return await res.json();
}

/**
 * Lấy lịch sử đo mực nước của một trạm để vẽ biểu đồ
 */
export async function fetchLichSuTram(maTram) {
  const res = await fetch('/api/tram/' + encodeURIComponent(maTram) + '/lich-su?gio=6', { cache: 'no-store' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return await res.json();
}

/**
 * Gọi dịch vụ định tuyến OSRM công khai
 * @param {Array<[number, number]>} coords Mảng các toạ độ [[lng, lat], ...]
 */
export async function fetchOSRMRoute(coords) {
  const coordStr = coords.map(c => c[0] + ',' + c[1]).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&alternatives=true`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[api] OSRM request failed:', err.message);
    return null;
  }
}

/**
 * Định vị thô qua địa chỉ IP (fallback khi GPS không khả dụng)
 */
export async function fetchIPLocation() {
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data && data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
      return {
        lat: data.latitude,
        lng: data.longitude,
        city: data.city || 'Đà Nẵng'
      };
    }
  } catch (err) {
    console.warn('[api] IP location fallback failed:', err.message);
  }
  return null;
}
