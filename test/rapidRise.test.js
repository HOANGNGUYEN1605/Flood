// TC-16: quy tắc nước dâng nhanh (Bảng 8.19, BRULE-07)
const test = require('node:test');
const assert = require('node:assert');
const { danhGia } = require('../src/rapidRise');

const p = { nguong_dang_nhanh: 3, cua_so_so_sanh: 60, so_lan_lien_tiep: 2, thoi_gian_go_co: 180 };
const T0 = Date.UTC(2026, 9, 30, 8, 0, 0);
const s = (n) => T0 + n * 1000;
const rong = { co_dang_nhanh: false, so_lan_dat_lien_tiep: 0, thoi_diem_dat_cuoi: null };

function buoc(state, hCu, hMoi, tMoi, extra = {}) {
  return danhGia({ matKetNoi: false, hCu, tCu: tMoi - 60000, hMoi, tMoi, state, p, ...extra });
}

test('Nước lên nhanh: +4 cm, lặp lại lần sau → bật cờ', () => {
  let st = buoc(rong, 6, 10, s(100));
  assert.strictEqual(st.co_dang_nhanh, false);
  assert.strictEqual(st.so_lan_dat_lien_tiep, 1);
  st = buoc(st, 6.5, 10.5, s(105));
  assert.strictEqual(st.co_dang_nhanh, true);
});

test('Nước lên chậm: +1 cm → không có cờ', () => {
  const st = buoc(rong, 6, 7, s(100));
  assert.strictEqual(st.co_dang_nhanh, false);
  assert.strictEqual(st.so_lan_dat_lien_tiep, 0);
});

test('Mặt nước gợn một lần → chưa đủ 2 lần liên tiếp, không có cờ', () => {
  let st = buoc(rong, 6, 9, s(100));        // +3 → 1 lần
  st = buoc(st, 6, 7, s(105));              // +1 → reset
  assert.strictEqual(st.co_dang_nhanh, false);
  assert.strictEqual(st.so_lan_dat_lien_tiep, 0);
});

test('Đúng ngưỡng 3,0 cm vẫn tính là đạt', () => {
  assert.strictEqual(buoc(rong, 6, 9, s(100)).so_lan_dat_lien_tiep, 1);
});

test('Nước ngừng dâng: gỡ cờ sau 3 phút liên tục không đạt', () => {
  let st = { co_dang_nhanh: true, so_lan_dat_lien_tiep: 2, thoi_diem_dat_cuoi: s(100) };
  st = buoc(st, 10, 10, s(100 + 179));
  assert.strictEqual(st.co_dang_nhanh, true, 'chưa đủ 180 giây');
  st = buoc(st, 10, 10, s(100 + 180));
  assert.strictEqual(st.co_dang_nhanh, false, 'đủ 180 giây thì gỡ');
  assert.strictEqual(st.so_lan_dat_lien_tiep, 0);
});

test('Điều kiện còn đúng thì cờ không bị gỡ', () => {
  let st = { co_dang_nhanh: true, so_lan_dat_lien_tiep: 2, thoi_diem_dat_cuoi: s(100) };
  st = buoc(st, 10, 14, s(400));
  assert.strictEqual(st.co_dang_nhanh, true);
  assert.strictEqual(st.thoi_diem_dat_cuoi, s(400));
});

test('Trạm mất kết nối hoặc chưa đủ 60 giây dữ liệu → không đánh giá', () => {
  const dang = { co_dang_nhanh: true, so_lan_dat_lien_tiep: 1, thoi_diem_dat_cuoi: s(50) };
  assert.deepStrictEqual(buoc(dang, 1, 20, s(100), { matKetNoi: true }), dang);
  assert.deepStrictEqual(buoc(dang, null, 20, s(100), { tCu: null }), dang);
});

test('Bản ghi cũ quá xa (sau thời gian mất kết nối dài) → không so sánh', () => {
  const st = danhGia({ matKetNoi: false, hCu: 1, tCu: s(0), hMoi: 20, tMoi: s(1000), state: rong, p });
  assert.deepStrictEqual(st, rong);
});
