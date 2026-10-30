// TC-08: bảng quyết định mức cảnh báo (Bảng 8.18, BRULE-02, BRULE-04)
const test = require('node:test');
const assert = require('node:assert');
const { mucCanhBao, MAT_KET_NOI } = require('../src/alertLevel');

const BT = 'Bình thường', CB = 'Cảnh báo', NH = 'Nguy hiểm', KC = 'Khẩn cấp';

// [H, xe máy T=15, ô tô gầm thấp T=20, ô tô gầm cao T=25] — lấy từ Bảng 8.18
const BANG = [
  [0, BT, BT, BT], [4, BT, BT, BT],
  [5, CB, BT, BT], [9, CB, BT, BT],
  [10, CB, CB, BT], [14, CB, CB, BT],
  [15, NH, CB, CB], [19, NH, CB, CB],
  [20, NH, NH, CB], [24, NH, NH, CB],
  [25, KC, NH, NH], [29, KC, NH, NH],
  [30, KC, KC, NH], [34, KC, KC, NH],
  [35, KC, KC, KC], [50, KC, KC, KC],
];

test('Bảng 8.18: mức cảnh báo theo loại xe', () => {
  for (const [H, xm, otThap, otCao] of BANG) {
    assert.strictEqual(mucCanhBao(H, 15, false), xm, `H=${H} xe máy`);
    assert.strictEqual(mucCanhBao(H, 20, false), otThap, `H=${H} ô tô gầm thấp`);
    assert.strictEqual(mucCanhBao(H, 25, false), otCao, `H=${H} ô tô gầm cao`);
  }
});

test('Mất kết nối → không suy ra mức từ dữ liệu cũ (BRULE-04)', () => {
  for (const T of [15, 20, 25]) assert.strictEqual(mucCanhBao(40, T, true), MAT_KET_NOI);
});

test('Không có mức nào là chữ "an toàn" (BRULE-03)', () => {
  for (const [H] of BANG) for (const T of [15, 20, 25]) {
    assert.ok(!/an toàn|qua được/i.test(mucCanhBao(H, T, false)));
  }
});
