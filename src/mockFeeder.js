// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Mock Data Feeder (Mô phỏng dữ liệu ngập thực tế)
// Dựa trên dữ liệu các đợt ngập lịch sử tại các điểm trũng TP. Đà Nẵng
// ══════════════════════════════════════════════════════════════════════════

const config = require('./config');
const { Tram, BanGhi } = require('./db');
const { danhGia } = require('./rapidRise');

const t0 = Date.now();

/**
 * Kịch bản mô phỏng mực nước ngập thực tế cho từng trạm
 * @param {string} maTram Mã trạm giả lập
 * @param {number} s Thời gian trôi qua tính bằng giây
 * @returns {number|null} Mực nước (cm) hoặc null nếu giả lập mất kết nối
 */
function tinhMucNuocKichBan(maTram, s) {
  switch (maTram) {
    // TR02: Hàm Nghi – Hùng Vương (Bờ hồ Thạc Gián, Thanh Khê)
    // Tình huống: Mức KHẨN CẤP (36 - 45 cm), dập dềnh sóng nhẹ
    case 'TR02': {
      const cycle = s % 600;
      const base = 38 + 4 * Math.sin(cycle / 50);
      const noise = (Math.random() - 0.5) * 1.2;
      return Math.max(34, Math.round((base + noise) * 10) / 10);
    }

    // TR03: Nguyễn Văn Linh – Hoàng Diệu (Hải Châu)
    // Tình huống: Mức NGUY HIỂM (21 - 28 cm), dao động theo chu kỳ máy bơm
    case 'TR03': {
      const cycle = s % 480;
      const base = 24 + 3 * Math.cos(cycle / 40);
      const noise = (Math.random() - 0.5) * 1.0;
      return Math.max(18, Math.round((base + noise) * 10) / 10);
    }

    // TR04: Khu Khe Cạn – Đường Mẹ Suốt (Liên Chiểu)
    // Tình huống: NƯỚC DÂNG NHANH (+4cm/phút kích hoạt cờ dâng nhanh) → ĐỈNH KHẨN CẤP (46 - 52 cm) → rút chậm
    case 'TR04': {
      const cycle = s % 600;
      let val = 12;
      if (cycle < 60) {
        val = 12 + cycle * 0.1;
      } else if (cycle < 240) {
        // Tăng vọt +4.5 cm/phút: kích hoạt cờ dâng nhanh FR-17
        val = 18 + (cycle - 60) * 0.16;
      } else if (cycle < 420) {
        // Đỉnh ngập sâu 46 - 50 cm
        val = 47 + 2 * Math.sin(cycle / 25);
      } else {
        // Rút dần về 15cm
        val = Math.max(15, 47 - (cycle - 420) * 0.18);
      }
      const noise = (Math.random() - 0.5) * 0.8;
      return Math.max(10, Math.round((val + noise) * 10) / 10);
    }

    // TR05: Tôn Đức Thắng – Trước Bến xe Trung tâm (Cẩm Lệ)
    // Tình huống: Mức CẢNH BÁO → NGUY HIỂM (16 - 24 cm)
    case 'TR05': {
      const cycle = s % 360;
      const base = 19 + 3.5 * Math.sin(cycle / 30);
      const noise = (Math.random() - 0.5) * 1.0;
      return Math.max(14, Math.round((base + noise) * 10) / 10);
    }

    // TR06: Trưng Nữ Vương – Chân cầu Trần Thị Lý (Hải Châu)
    // Tình huống: Mức CẢNH BÁO (12 - 16 cm, cảnh báo xe máy, ô tô an toàn hơn)
    case 'TR06': {
      const cycle = s % 300;
      const base = 14 + 1.8 * Math.sin(cycle / 35);
      const noise = (Math.random() - 0.5) * 0.6;
      return Math.max(10, Math.round((base + noise) * 10) / 10);
    }

    // TR07: Lê Duẩn – Ngã tư Quang Trung (Hải Châu)
    // Tình huống: Mức BÌNH THƯỜNG (5 - 9 cm, ngập nhẹ lưu thông bình thường)
    case 'TR07': {
      const cycle = s % 240;
      const base = 6.5 + 1.5 * Math.cos(cycle / 30);
      const noise = (Math.random() - 0.5) * 0.5;
      return Math.max(3, Math.round((base + noise) * 10) / 10);
    }

    // TR08: Như Nguyệt – Chân cầu Thuận Phước (Hải Châu)
    // Tình huống: MẤT KẾT NỐI (chu kỳ 5 phút: 3 phút gửi bình thường 16-20cm, 2 phút ngắt truyền)
    case 'TR08': {
      const cycle = s % 360;
      // Ngắt gửi ở khoảng giây 150 đến 300 (> 60s để kích hoạt Mất kết nối theo BRULE-04)
      if (cycle >= 150 && cycle < 300) {
        return null;
      }
      const base = 18 + 2 * Math.sin(cycle / 20);
      const noise = (Math.random() - 0.5) * 0.8;
      return Math.max(12, Math.round((base + noise) * 10) / 10);
    }

    default:
      return null;
  }
}

/**
 * Ghi nhận một bản ghi đo mực nước vào cơ sở dữ liệu và đánh giá cờ dâng nhanh
 */
async function ghiBanGhiMock(maTram, mucNuoc, thoiDiem = new Date()) {
  const cfg = config.get();
  const tram = await Tram.findById(maTram).lean();
  if (!tram) return;

  const tNhan = thoiDiem;
  const tDo = thoiDiem;

  await BanGhi.create({
    ma_tram: maTram,
    muc_nuoc: mucNuoc,
    thoi_diem_do: tDo,
    thoi_diem_nhan: tNhan
  });

  const moi = await Tram.findByIdAndUpdate(
    maTram,
    { $set: { thoi_diem_nhan_cuoi: tNhan, trang_thai_ket_noi: 'Đang kết nối' } },
    { new: true }
  ).lean();

  // Đánh giá nước dâng nhanh FR-17
  const p = cfg.canh_bao;
  const tMoi = tDo.getTime();
  const cu = await BanGhi.findOne({
    ma_tram: maTram,
    thoi_diem_do: { $lte: new Date(tMoi - p.cua_so_so_sanh * 1000) }
  }).sort({ thoi_diem_do: -1 }).lean();

  const kq = danhGia({
    matKetNoi: false,
    hCu: cu ? cu.muc_nuoc : null,
    tCu: cu ? cu.thoi_diem_do.getTime() : null,
    hMoi: mucNuoc,
    tMoi,
    state: {
      co_dang_nhanh: moi.co_dang_nhanh,
      so_lan_dat_lien_tiep: moi.so_lan_dat_lien_tiep,
      thoi_diem_dat_cuoi: moi.thoi_diem_dat_cuoi ? moi.thoi_diem_dat_cuoi.getTime() : null
    },
    p
  });

  await Tram.updateOne(
    { _id: maTram },
    {
      $set: {
        co_dang_nhanh: kq.co_dang_nhanh,
        so_lan_dat_lien_tiep: kq.so_lan_dat_lien_tiep,
        thoi_diem_dat_cuoi: kq.thoi_diem_dat_cuoi != null ? new Date(kq.thoi_diem_dat_cuoi) : null
      }
    }
  );
}

/**
 * Seed dữ liệu lịch sử cho các trạm giả lập để biểu đồ SVG (FR-15) có ngay dữ liệu đẹp
 */
async function seedLichSuMock() {
  const cfg = config.get();
  const mockIds = cfg.tram.map(t => t.ma_tram).filter(id => id !== 'TR01');

  for (const id of mockIds) {
    const count = await BanGhi.countDocuments({ ma_tram: id });
    if (count < 10) {
      console.log(`[mock-feeder] Khởi tạo dữ liệu lịch sử 60 phút cho trạm ${id}...`);
      const now = Date.now();
      const records = [];

      // Tạo 25 bản ghi trong vòng 50 phút gần nhất (mỗi 2 phút 1 bản ghi)
      for (let i = 25; i >= 1; i--) {
        const pastSeconds = (Date.now() - (now - i * 120 * 1000) - t0) / 1000;
        let h = tinhMucNuocKichBan(id, pastSeconds);
        if (h == null) h = 18.0; // fallback cho TR08 lúc tạo lịch sử

        records.push({
          ma_tram: id,
          muc_nuoc: h,
          thoi_diem_do: new Date(now - i * 120 * 1000),
          thoi_diem_nhan: new Date(now - i * 120 * 1000)
        });
      }

      await BanGhi.insertMany(records);
      await Tram.updateOne(
        { _id: id },
        {
          $set: {
            thoi_diem_nhan_cuoi: new Date(now - 120 * 1000),
            trang_thai_ket_noi: 'Đang kết nối'
          }
        }
      );
    }
  }
}

/**
 * Bắn dữ liệu mô phỏng thời gian thực cho tất cả trạm giả lập
 */
async function tickMock() {
  const cfg = config.get();
  const mockIds = cfg.tram.map(t => t.ma_tram).filter(id => id !== 'TR01');
  const s = (Date.now() - t0) / 1000;

  for (const id of mockIds) {
    try {
      const h = tinhMucNuocKichBan(id, s);
      if (h != null) {
        await ghiBanGhiMock(id, h, new Date());
      }
    } catch (e) {
      console.error(`[mock-feeder] Lỗi gửi dữ liệu trạm ${id}:`, e.message);
    }
  }
}

/**
 * Khởi động background mock feeder
 */
async function start(intervalMs = 5000) {
  try {
    await seedLichSuMock();
    // Bắn một lượt ngay lập tức
    await tickMock();
  } catch (err) {
    console.error('[mock-feeder] Lỗi seed ban đầu:', err.message);
  }

  return setInterval(() => {
    tickMock().catch(e => console.error('[mock-feeder]', e.message));
  }, intervalMs);
}

module.exports = { start, tinhMucNuocKichBan };
