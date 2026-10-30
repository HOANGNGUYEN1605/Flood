// Tiến trình 3.3 — PS-3.3, BRULE-04, C-05: quá 60 giây không có bản ghi → "Mất kết nối"
const config = require('./config');
const { Tram } = require('./db');

function matKetNoi(tram, now = Date.now()) {
  const limit = config.get().canh_bao.thoi_gian_mat_ket_noi * 1000;
  return !tram.thoi_diem_nhan_cuoi || now - new Date(tram.thoi_diem_nhan_cuoi).getTime() > limit;
}

async function quet() {
  const cfg = config.get();
  const han = new Date(Date.now() - cfg.canh_bao.thoi_gian_mat_ket_noi * 1000);
  await Tram.updateMany(
    {
      _id: { $in: cfg.tram.map((t) => t.ma_tram) },
      trang_thai_ket_noi: 'Đang kết nối',
      $or: [{ thoi_diem_nhan_cuoi: null }, { thoi_diem_nhan_cuoi: { $lt: han } }],
    },
    { $set: { trang_thai_ket_noi: 'Mất kết nối', co_dang_nhanh: false, so_lan_dat_lien_tiep: 0 } },
  );
}

function start(intervalMs = 5000) {
  return setInterval(() => quet().catch((e) => console.error('[connection]', e.message)), intervalMs);
}

module.exports = { matKetNoi, quet, start };
