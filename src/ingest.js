// POST /api/ban-ghi — tiến trình 3.1 (kiểm tra), 3.2 (lưu), 3.4 (dâng nhanh)
const express = require('express');
const crypto = require('crypto');
const config = require('./config');
const { Tram, BanGhi } = require('./db');
const { danhGia } = require('./rapidRise');

const router = express.Router();

function khoaKhop(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

router.post('/ban-ghi', async (req, res, next) => {
  try {
    const cfg = config.get();
    const body = req.body || {};
    const { ma_tram, muc_nuoc, thoi_diem_do } = body;
    const khoa = req.get('X-API-Key');

    // 3.1 / C-01: trạm tồn tại và khóa khớp
    const hoatDong = typeof ma_tram === 'string' && cfg.tram.some((t) => t.ma_tram === ma_tram);
    const tram = hoatDong ? await Tram.findById(ma_tram).lean() : null;
    if (!tram || !khoaKhop(khoa, tram.khoa_api)) {
      return res.status(401).json({ ket_qua: 'Từ chối – sai khóa' });
    }

    // 3.1 / C-02: đủ trường và đúng miền giá trị
    if (typeof muc_nuoc !== 'number' || !Number.isFinite(muc_nuoc) || thoi_diem_do == null || thoi_diem_do === '' ||
        muc_nuoc < 0 || muc_nuoc > tram.chieu_cao_lap) {
      return res.status(400).json({ ket_qua: 'Từ chối – dữ liệu không hợp lệ' });
    }

    // 3.2 / C-07: dùng đồng hồ máy chủ làm chuẩn
    const tNhan = new Date();
    let tDo = new Date(thoi_diem_do);
    if (Number.isNaN(tDo.getTime()) || Math.abs(tDo.getTime() - tNhan.getTime()) > 60000) tDo = tNhan;

    await BanGhi.create({ ma_tram, muc_nuoc, thoi_diem_do: tDo, thoi_diem_nhan: tNhan });
    const moi = await Tram.findByIdAndUpdate(
      ma_tram,
      { $set: { thoi_diem_nhan_cuoi: tNhan, trang_thai_ket_noi: 'Đang kết nối' } },
      { new: true },
    ).lean();

    // 3.4: phát hiện nước dâng nhanh
    const p = cfg.canh_bao;
    const tMoi = tDo.getTime();
    const cu = await BanGhi.findOne({
      ma_tram, thoi_diem_do: { $lte: new Date(tMoi - p.cua_so_so_sanh * 1000) },
    }).sort({ thoi_diem_do: -1 }).lean();

    const kq = danhGia({
      matKetNoi: false,
      hCu: cu ? cu.muc_nuoc : null,
      tCu: cu ? cu.thoi_diem_do.getTime() : null,
      hMoi: muc_nuoc,
      tMoi,
      state: {
        co_dang_nhanh: moi.co_dang_nhanh,
        so_lan_dat_lien_tiep: moi.so_lan_dat_lien_tiep,
        thoi_diem_dat_cuoi: moi.thoi_diem_dat_cuoi ? moi.thoi_diem_dat_cuoi.getTime() : null,
      },
      p,
    });
    await Tram.updateOne({ _id: ma_tram }, {
      $set: {
        co_dang_nhanh: kq.co_dang_nhanh,
        so_lan_dat_lien_tiep: kq.so_lan_dat_lien_tiep,
        thoi_diem_dat_cuoi: kq.thoi_diem_dat_cuoi != null ? new Date(kq.thoi_diem_dat_cuoi) : null,
      },
    });

    res.json({ ket_qua: 'Đã nhận' });
  } catch (err) { next(err); }
});

module.exports = router;
