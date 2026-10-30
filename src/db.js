// D1 (Trạm đo) và D2 (Bản ghi mực nước) trên MongoDB
const mongoose = require('mongoose');

const TRANG_THAI = ['Đang kết nối', 'Mất kết nối'];

const tramSchema = new mongoose.Schema({
  _id: { type: String },                                   // ma_tram
  ten_vi_tri: { type: String, required: true, maxlength: 100 },
  vi_do: Number,
  kinh_do: Number,
  khu_vuc: String,
  chieu_cao_lap: { type: Number, required: true, min: 0.1 },
  khoa_api: { type: String, required: true },
  thoi_diem_nhan_cuoi: { type: Date, default: null },
  trang_thai_ket_noi: { type: String, enum: TRANG_THAI, default: 'Mất kết nối' },
  co_dang_nhanh: { type: Boolean, default: false },
  so_lan_dat_lien_tiep: { type: Number, default: 0 },
  thoi_diem_dat_cuoi: { type: Date, default: null },
}, { versionKey: false });

const banGhiSchema = new mongoose.Schema({
  ma_tram: { type: String, required: true },
  muc_nuoc: { type: Number, required: true, min: 0 },
  thoi_diem_do: { type: Date, required: true },
  thoi_diem_nhan: { type: Date, required: true },
}, { versionKey: false });
banGhiSchema.index({ ma_tram: 1, thoi_diem_do: -1 });

const Tram = mongoose.model('Tram', tramSchema, 'tram');
const BanGhi = mongoose.model('BanGhi', banGhiSchema, 'ban_ghi');

async function connect(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  await BanGhi.syncIndexes();
}

// Tiến trình 5.1: đồng bộ thông tin trạm từ config.json vào D1 (không đụng trạng thái vận hành)
async function syncStations(cfg) {
  const ops = cfg.tram.map((t) => ({
    updateOne: {
      filter: { _id: t.ma_tram },
      update: {
        $set: {
          ten_vi_tri: t.ten_vi_tri, vi_do: t.vi_do, kinh_do: t.kinh_do, khu_vuc: t.khu_vuc,
          chieu_cao_lap: t.chieu_cao_lap, khoa_api: t.khoa_api,
        },
        $setOnInsert: {
          thoi_diem_nhan_cuoi: null, trang_thai_ket_noi: 'Mất kết nối',
          co_dang_nhanh: false, so_lan_dat_lien_tiep: 0, thoi_diem_dat_cuoi: null,
        },
      },
      upsert: true,
    },
  }));
  await Tram.bulkWrite(ops);
}

module.exports = { mongoose, Tram, BanGhi, connect, syncStations };
