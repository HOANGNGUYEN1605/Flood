require('dotenv').config();
const path = require('path');
const express = require('express');
const config = require('./src/config');
const db = require('./src/db');
const connection = require('./src/connection');
const mockFeeder = require('./src/mockFeeder');

async function main() {
  if (!config.load()) { console.error('Cấu hình ban đầu không hợp lệ, dừng.'); process.exit(1); }
  if (!process.env.MONGODB_URI) { console.error('Thiếu MONGODB_URI (xem .env.example).'); process.exit(1); }

  await db.connect(process.env.MONGODB_URI);
  await db.syncStations(config.get());
  config.watch((c) => db.syncStations(c).catch((e) => console.error('[sync]', e.message)));
  connection.start(5000);

  // Tự động sinh dữ liệu ngập mô phỏng thực tế cho các trạm giả lập (TR02..TR08)
  if (process.env.ENABLE_MOCK !== 'false') {
    await mockFeeder.start(5000);
    console.log('[mock-feeder] Đang chạy mô phỏng dữ liệu ngập thực tế cho các trạm giả lập Đà Nẵng.');
  }

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));
  app.use('/api', require('./src/ingest'));   // POST /api/ban-ghi (có khóa API)
  app.use('/api', require('./src/api'));      // GET (chỉ đọc)
  app.use(express.static(path.join(__dirname, 'public')));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ ket_qua: 'Từ chối – dữ liệu không hợp lệ' });
    }
    console.error(err);
    res.status(500).json({ loi: 'Lỗi máy chủ' });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server chạy tại http://localhost:${port}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
