// Giả lập trạm đo TR02, TR03 để demo khi chưa có phần cứng.
// Dùng:  node tools/simulator.js [http://localhost:3000]
//   IDS=TR02,TR03 (mặc định)  — chọn trạm giả lập
// TR02: chu kỳ 10 phút — yên → nước dâng nhanh → giữ cao → rút
// TR03: chu kỳ 6 phút  — dao động nhẹ, ngắt gửi 2 phút để thử "Mất kết nối"
const fs = require('fs');
const path = require('path');

const base = (process.argv[2] || process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
const ids = (process.env.IDS || 'TR02,TR03').split(',').map((s) => s.trim());
const keyOf = (id) => process.env['KHOA_API_' + id] || cfg.tram.find((t) => t.ma_tram === id).khoa_api;
const t0 = Date.now();

const kichBan = {
  TR02: (s) => {
    s %= 600;
    if (s < 90) return 5;
    if (s < 270) return 5 + (s - 90) * 0.1;        // +6 cm/phút → kích hoạt cờ dâng nhanh
    if (s < 420) return 23;
    if (s < 540) return Math.max(5, 23 - (s - 420) * 0.15);
    return 5;
  },
  TR03: (s) => {
    s %= 360;
    if (s >= 120 && s < 240) return null;          // ngắt gửi
    return 8 + 0.5 * Math.sin(s / 20);
  },
};

async function gui(id) {
  const fn = kichBan[id];
  if (!fn) return console.log(`[${id}] chưa có kịch bản`);
  const s = (Date.now() - t0) / 1000;
  const h = fn(s);
  if (h == null) return console.log(`[${id}] t=${s.toFixed(0)}s: ngắt gửi (giả lập mất kết nối)`);
  const muc = Math.max(0, Math.round((h + (Math.random() - 0.5) * 0.6) * 10) / 10);
  try {
    const r = await fetch(base + '/api/ban-ghi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': keyOf(id) },
      body: JSON.stringify({ ma_tram: id, muc_nuoc: muc, thoi_diem_do: new Date().toISOString() }),
    });
    console.log(`[${id}] t=${s.toFixed(0)}s H=${muc} → ${r.status} ${await r.text()}`);
  } catch (e) {
    console.log(`[${id}] lỗi mạng: ${e.message}`);
  }
}

console.log(`Giả lập ${ids.join(', ')} → ${base} (mỗi 5 giây). Ctrl+C để dừng.`);
ids.forEach((id) => { gui(id); setInterval(() => gui(id), 5000); });
