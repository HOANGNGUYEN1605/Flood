// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Serial Bridge / Manual Tester cho Trạm thật TR01
// Cầu nối đọc dữ liệu từ cổng Serial USB hoặc nhập trực tiếp từ bàn phím
// ══════════════════════════════════════════════════════════════════════════
// Cách dùng:
// 1. Chạy trực tiếp test gửi mực nước:
//    node tools/serialBridge.js [Mực_nước_cm] [URL_Server]
//    Ví dụ: node tools/serialBridge.js 18.5
//
// 2. Chạy chế độ Interactive (nhập số cm từ bàn phím để mô phỏng TR01):
//    node tools/serialBridge.js
// ══════════════════════════════════════════════════════════════════════════

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const cfgPath = path.join(__dirname, '..', 'config.json');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const tr01 = cfg.tram.find(t => t.ma_tram === 'TR01') || {
  ma_tram: 'TR01',
  khoa_api: 'tr01demokey_change_me_0123456789'
};

const serverUrl = (process.argv[3] || process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '') + '/api/ban-ghi';

async function guiBanGhiTR01(mucNuoc) {
  const val = parseFloat(mucNuoc);
  if (isNaN(val) || val < 0 || val > 55) {
    console.log(`[Lỗi] Mực nước không hợp lệ: "${mucNuoc}". Cần nằm trong khoảng 0 đến 55 cm.`);
    return;
  }

  try {
    const res = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': tr01.khoa_api
      },
      body: JSON.stringify({
        ma_tram: tr01.ma_tram,
        muc_nuoc: Math.round(val * 10) / 10,
        thoi_diem_do: new Date().toISOString()
      })
    });

    const body = await res.text();
    console.log(`[TR01] Đã gửi mực nước = ${val.toFixed(1)} cm -> Server [${res.status}]: ${body}`);
  } catch (err) {
    console.log(`[TR01] Lỗi kết nối server (${serverUrl}): ${err.message}`);
  }
}

// Nếu truyền tham số mực nước từ dòng lệnh: node tools/serialBridge.js 25.4
if (process.argv[2] && !isNaN(parseFloat(process.argv[2]))) {
  guiBanGhiTR01(process.argv[2]).then(() => process.exit(0));
} else {
  console.log('══════════════════════════════════════════════════════════════════');
  console.log('  FloodSafe Đà Nẵng – Cầu nối mô phỏng dữ liệu trạm thật TR01    ');
  console.log(`  Gửi tới: ${serverUrl} | Khóa: ${tr01.khoa_api}`);
  console.log('══════════════════════════════════════════════════════════════════');
  console.log('Nhập mực nước (cm) rồi bấm Enter để gửi (hoặc gõ "exit" để thoát):');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (line) => {
    const str = line.trim();
    if (str.toLowerCase() === 'exit') process.exit(0);

    // Tự động tìm số mực nước nếu là dòng Serial copy từ Arduino IDE
    // Ví dụ dòng Serial: "[TR01] K.Cách: 36.8 cm | Mực nước: 15.2 cm | Cấp: 2"
    const match = str.match(/Mực nước:\s*([\d.]+)/i) || str.match(/^([\d.]+)/);
    if (match) {
      guiBanGhiTR01(match[1]);
    } else if (str) {
      console.log('Không nhận diện được mực nước. Vui lòng nhập số cm (ví dụ: 15.5)');
    }
  });
}
