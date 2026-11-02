// Giả lập các trạm đo TR02..TR08 để demo khi chưa có đầy đủ phần cứng.
// Dùng:  node tools/simulator.js [http://localhost:3000]
//   IDS=TR02,TR03,TR04,TR05,TR06,TR07,TR08 (mặc định)
const fs = require('fs');
const path = require('path');
const { tinhMucNuocKichBan } = require('../src/mockFeeder');

const base = (process.argv[2] || process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
const allMockIds = cfg.tram.map(t => t.ma_tram).filter(id => id !== 'TR01').join(',');
const ids = (process.env.IDS || allMockIds).split(',').map((s) => s.trim());
const keyOf = (id) => process.env['KHOA_API_' + id] || (cfg.tram.find((t) => t.ma_tram === id) || {}).khoa_api;
const t0 = Date.now();

async function gui(id) {
  const s = (Date.now() - t0) / 1000;
  const h = tinhMucNuocKichBan(id, s);
  if (h == null) return console.log(`[${id}] t=${s.toFixed(0)}s: ngắt gửi (giả lập mất kết nối)`);
  const muc = Math.max(0, Math.round(h * 10) / 10);
  try {
    const key = keyOf(id);
    if (!key) return console.log(`[${id}] không tìm thấy khóa API`);
    const r = await fetch(base + '/api/ban-ghi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': key },
      body: JSON.stringify({ ma_tram: id, muc_nuoc: muc, thoi_diem_do: new Date().toISOString() }),
    });
    console.log(`[${id}] t=${s.toFixed(0)}s H=${muc} cm → ${r.status} ${await r.text()}`);
  } catch (e) {
    console.log(`[${id}] lỗi mạng: ${e.message}`);
  }
}

console.log(`Giả lập trạm: ${ids.join(', ')} → ${base} (mỗi 5 giây). Ctrl+C để dừng.`);
ids.forEach((id) => { gui(id); setInterval(() => gui(id), 5000); });
