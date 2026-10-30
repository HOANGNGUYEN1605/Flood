// Tiến trình 4.3 — BRULE-02, BRULE-04, BRULE-03. Hàm thuần, không phụ thuộc CSDL.
const MAT_KET_NOI = 'Mất kết nối – dữ liệu cũ';
const KHUYEN_CAO = 'Hạn chế đi qua đoạn đường ngập';

function mucCanhBao(H, T, matKetNoi) {
  if (matKetNoi) return MAT_KET_NOI;
  if (H < T - 10) return 'Bình thường';
  if (H < T) return 'Cảnh báo';
  if (H < T + 10) return 'Nguy hiểm';
  return 'Khẩn cấp';
}

module.exports = { mucCanhBao, KHUYEN_CAO, MAT_KET_NOI };
