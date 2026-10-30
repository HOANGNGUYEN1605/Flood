// Các endpoint chỉ đọc cho web — tiến trình 4.1, 4.3, 4.4, 4.5 (C-10, NFR-07)
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
  res.json({
    chu_ky_lam_moi: cfg.canh_bao.chu_ky_lam_moi,
    khuyen_cao: KHUYEN_CAO,
    loai_xe: cfg.loai_xe.map((x) => ({ loai_xe: x.loai_xe, ten_loai_xe: x.ten_loai_xe })),
  });
});

router.get('/tram', async (req, res, next) => {
  try {
    const cfg = config.get();
    const loai = req.query.loai_xe || null;
    const xe = loai ? cfg.loai_xe.find((x) => x.loai_xe === loai) : null;
    if (loai && !xe) return res.status(400).json({ loi: 'loai_xe không hợp lệ' });

    const now = Date.now();
    const dsTram = await Tram.find({ _id: { $in: cfg.tram.map((t) => t.ma_tram) } }).lean();

    const ds = await Promise.all(dsTram.map(async (t) => {
      const cuoi = await BanGhi.findOne({ ma_tram: t._id }).sort({ thoi_diem_do: -1 }).lean();
      const mat = matKetNoi(t, now);
      const dangNhanh = !mat && !!t.co_dang_nhanh;   // không hiện cờ khi mất kết nối
      let muc = null;
      if (mat) muc = MAT_KET_NOI;
      else if (xe && cuoi) muc = mucCanhBao(cuoi.muc_nuoc, xe.nguong_T, false);
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
      };
    }));

    // 4.5 / FR-17: trạm có cờ lên đầu, còn lại theo mã trạm
    ds.sort((a, b) => (Number(b.co_dang_nhanh) - Number(a.co_dang_nhanh)) || a.ma_tram.localeCompare(b.ma_tram));
    ds.forEach((d, i) => { d.thu_tu = i + 1; });

    res.set('Cache-Control', 'no-store');
    res.json({ server_time: new Date(now), loai_xe: loai, tram: ds });
  } catch (err) { next(err); }
});

module.exports = router;
