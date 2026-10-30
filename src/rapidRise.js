// Tiến trình 3.4 — PS-3.4, BRULE-07. Hàm thuần: nhận trạng thái cũ, trả trạng thái mới.
// Thời gian tính bằng mili giây (Date.getTime()).
const EPS = 1e-9;

function danhGia({ matKetNoi, hCu, tCu, hMoi, tMoi, state, p }) {
  const giu = { ...state };
  // Không đánh giá khi mất kết nối hoặc chưa đủ dữ liệu 60 giây
  if (matKetNoi || hCu == null) return giu;
  // Bản ghi cũ quá xa (vd. sau thời gian mất kết nối dài) thì không so sánh được
  if (tCu != null && tMoi - tCu > p.cua_so_so_sanh * 2000) return giu;

  let { co_dang_nhanh, so_lan_dat_lien_tiep, thoi_diem_dat_cuoi } = state;

  if (hMoi - hCu >= p.nguong_dang_nhanh - EPS) {
    so_lan_dat_lien_tiep += 1;
    thoi_diem_dat_cuoi = tMoi;
  } else {
    so_lan_dat_lien_tiep = 0;
  }

  if (so_lan_dat_lien_tiep >= p.so_lan_lien_tiep) co_dang_nhanh = true;

  if (co_dang_nhanh && thoi_diem_dat_cuoi != null &&
      tMoi - thoi_diem_dat_cuoi >= p.thoi_gian_go_co * 1000) {
    co_dang_nhanh = false;
    so_lan_dat_lien_tiep = 0;
  }
  return { co_dang_nhanh, so_lan_dat_lien_tiep, thoi_diem_dat_cuoi };
}

module.exports = { danhGia };
