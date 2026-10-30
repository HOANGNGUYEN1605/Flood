// D3 (bảng ngưỡng loại xe) + D4 (cấu hình cảnh báo) + danh sách trạm — đọc từ config.json (FR-14)
// Kiểm soát C-11: cấu hình sai thì GIỮ cấu hình cũ.
const fs = require('fs');
const path = require('path');

const FILE = process.env.CONFIG_FILE || path.join(__dirname, '..', 'config.json');
const SO_DUONG = [
  'nguong_bat_den', 'nguong_tat_den', 'nguong_dang_nhanh', 'cua_so_so_sanh',
  'so_lan_lien_tiep', 'thoi_gian_go_co', 'thoi_gian_mat_ket_noi', 'chu_ky_lam_moi',
];

let current = null;

function validate(c) {
  const e = [];
  if (!c || typeof c !== 'object') return ['Tệp cấu hình không phải đối tượng JSON'];

  const cb = c.canh_bao || {};
  for (const k of SO_DUONG) {
    if (typeof cb[k] !== 'number' || !(cb[k] > 0)) e.push(`canh_bao.${k} phải là số > 0`);
  }
  if (cb.nguong_tat_den >= cb.nguong_bat_den) e.push('nguong_tat_den phải < nguong_bat_den (C-11)');

  const xe = {};
  for (const x of c.loai_xe || []) xe[x.loai_xe] = x;
  for (const k of ['XM', 'OT_THAP', 'OT_CAO']) {
    if (!xe[k] || typeof xe[k].nguong_T !== 'number') e.push(`Thiếu loại xe ${k} hoặc nguong_T`);
  }
  if (xe.XM && xe.OT_THAP && xe.OT_CAO &&
      !(xe.XM.nguong_T < xe.OT_THAP.nguong_T && xe.OT_THAP.nguong_T < xe.OT_CAO.nguong_T)) {
    e.push('Phải có T xe máy < T ô tô gầm thấp < T ô tô gầm cao (C-11)');
  }

  if (!Array.isArray(c.tram) || c.tram.length === 0) e.push('Danh sách tram rỗng');
  const seen = new Set();
  for (const t of c.tram || []) {
    if (!t.ma_tram || typeof t.ma_tram !== 'string') e.push('Có trạm thiếu ma_tram');
    else if (seen.has(t.ma_tram)) e.push(`Trùng ma_tram ${t.ma_tram} (BRULE-06)`);
    else seen.add(t.ma_tram);
    if (!t.ten_vi_tri) e.push(`Trạm ${t.ma_tram}: thiếu ten_vi_tri`);
    if (typeof t.chieu_cao_lap !== 'number' || !(t.chieu_cao_lap > 0)) e.push(`Trạm ${t.ma_tram}: chieu_cao_lap phải > 0`);
    if (!t.khoa_api || typeof t.khoa_api !== 'string') e.push(`Trạm ${t.ma_tram}: thiếu khoa_api`);
  }
  return e;
}

function load() {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    for (const t of raw.tram || []) {
      const envKey = process.env['KHOA_API_' + t.ma_tram];
      if (envKey) t.khoa_api = envKey;
    }
    const errs = validate(raw);
    if (errs.length) {
      console.error('[config] Cấu hình không hợp lệ, giữ cấu hình cũ:\n - ' + errs.join('\n - '));
      return false;
    }
    current = raw;
    return true;
  } catch (err) {
    console.error('[config] Không đọc được cấu hình, giữ cấu hình cũ:', err.message);
    return false;
  }
}

function get() { return current; }

function watch(onChange) {
  fs.watchFile(FILE, { interval: 2000 }, () => {
    if (load()) {
      console.log('[config] Đã nạp lại cấu hình');
      if (onChange) onChange(current);
    }
  });
}

module.exports = { load, get, watch, validate };
