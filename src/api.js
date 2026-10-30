// Các endpoint chỉ đọc cho web — tiến trình 4.1, 4.3, 4.4, 4.5 (C-10, NFR-07, FR-12, FR-15)
const express = require('express');
const config = require('./config');
const { Tram, BanGhi, mongoose } = require('./db');
const { mucCanhBao, KHUYEN_CAO, MAT_KET_NOI } = require('./alertLevel');
const { matKetNoi } = require('./connection');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

router.get('/cau-hinh', (req, res) => {
  const cfg = config.get();
  // Danh sách các khu vực duy nhất từ cấu hình trạm (F03, DE-04)
  const khuVucSet = new Set(cfg.tram.map((t) => t.khu_vuc).filter(Boolean));
  res.json({
    chu_ky_lam_moi: cfg.canh_bao.chu_ky_lam_moi,
    khuyen_cao: KHUYEN_CAO,
    loai_xe: cfg.loai_xe.map((x) => ({ loai_xe: x.loai_xe, ten_loai_xe: x.ten_loai_xe, nguong_T: x.nguong_T })),
    danh_sach_khu_vuc: Array.from(khuVucSet),
  });
});

// GET /api/tram — hỗ trợ loai_xe và lọc theo khu_vuc (F03, EV-09)
router.get('/tram', async (req, res, next) => {
  try {
    const cfg = config.get();
    const loai = req.query.loai_xe || null;
    const khuVuc = req.query.khu_vuc || null;
    const xe = loai ? cfg.loai_xe.find((x) => x.loai_xe === loai) : null;
    if (loai && !xe) return res.status(400).json({ loi: 'loai_xe không hợp lệ' });

    const now = Date.now();
    let filterTram = cfg.tram;
    if (khuVuc) {
      filterTram = filterTram.filter((t) => t.khu_vuc === khuVuc);
    }

    const dsTram = await Tram.find({ _id: { $in: filterTram.map((t) => t.ma_tram) } }).lean();

    // Chuẩn bị mốc 5 phút trước cho FR-12
    const tg5p = new Date(now - 5 * 60 * 1000);

    const ds = await Promise.all(dsTram.map(async (t) => {
      const cuoi = await BanGhi.findOne({ ma_tram: t._id }).sort({ thoi_diem_do: -1 }).lean();
      const mat = matKetNoi(t, now);
      const dangNhanh = !mat && !!t.co_dang_nhanh; // không hiện cờ khi mất kết nối
      let muc = null;
      if (mat) muc = MAT_KET_NOI;
      else if (xe && cuoi) muc = mucCanhBao(cuoi.muc_nuoc, xe.nguong_T, false);

      // FR-12: Tính xu hướng so với 5 phút trước (hoặc bản ghi gần mốc 5p nhất)
      let xuHuong = 'Ổn định';
      let chenhLech5p = 0;
      if (cuoi) {
        const banGhi5p = await BanGhi.findOne({
          ma_tram: t._id,
          thoi_diem_do: { $lte: tg5p },
        }).sort({ thoi_diem_do: -1 }).lean();

        if (banGhi5p && typeof banGhi5p.muc_nuoc === 'number') {
          chenhLech5p = Math.round((cuoi.muc_nuoc - banGhi5p.muc_nuoc) * 10) / 10;
          if (chenhLech5p >= 0.5) xuHuong = 'Đang lên';
          else if (chenhLech5p <= -0.5) xuHuong = 'Đang rút';
          else xuHuong = 'Ổn định';
        }
      }

      return {
        ma_tram: t._id,
        ten_vi_tri: t.ten_vi_tri,
        vi_do: t.vi_do,
        kinh_do: t.kinh_do,
        khu_vuc: t.khu_vuc,
        muc_nuoc: cuoi ? cuoi.muc_nuoc : null,
        thoi_diem_do: cuoi ? cuoi.thoi_diem_do : null,
        trang_thai_ket_noi: mat ? 'Mất kết nối' : 'Đang kết nối',
        co_dang_nhanh: dangNhanh,
        muc_canh_bao: muc,
        khuyen_cao: KHUYEN_CAO,
        xu_huong: xuHuong, // FR-12
        chenh_lech_5p: chenhLech5p,
      };
    }));

    // 4.5 / FR-17: trạm có cờ lên đầu, còn lại theo mã trạm
    ds.sort((a, b) => (Number(b.co_dang_nhanh) - Number(a.co_dang_nhanh)) || a.ma_tram.localeCompare(b.ma_tram));
    ds.forEach((d, i) => { d.thu_tu = i + 1; });

    res.set('Cache-Control', 'no-store');
    res.json({
      server_time: new Date(now),
      loai_xe: loai,
      khu_vuc: khuVuc,
      tram: ds,
    });
  } catch (err) { next(err); }
});

// FR-15: Lấy lịch sử mực nước của một trạm để vẽ biểu đồ
router.get('/tram/:ma_tram/lich-su', async (req, res, next) => {
  try {
    const { ma_tram } = req.params;
    const cfg = config.get();
    const hopLe = cfg.tram.some((t) => t.ma_tram === ma_tram);
    if (!hopLe) return res.status(404).json({ loi: 'Không tìm thấy trạm' });

    // Lấy tối đa 40 bản ghi gần nhất (trong vòng 1–2 giờ)
    const ds = await BanGhi.find({ ma_tram })
      .sort({ thoi_diem_do: -1 })
      .limit(40)
      .select('muc_nuoc thoi_diem_do -_id')
      .lean();

    // Sắp xếp tăng dần theo thời gian để vẽ biểu đồ từ trái sang phải
    ds.reverse();

    res.set('Cache-Control', 'no-store');
    res.json({
      ma_tram,
      tong_so: ds.length,
      lich_su: ds.map((b) => ({
        muc_nuoc: b.muc_nuoc,
        thoi_diem_do: b.thoi_diem_do,
      })),
    });
  } catch (err) { next(err); }
});

module.exports = router;
