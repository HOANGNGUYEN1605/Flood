// Kiểm soát C-11: cấu hình sai thì bị từ chối
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { validate } = require('../src/config');

const goc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
const copy = () => JSON.parse(JSON.stringify(goc));

test('config.json mặc định hợp lệ', () => {
  assert.deepStrictEqual(validate(copy()), []);
});

test('Ngưỡng tắt ≥ ngưỡng bật bị từ chối', () => {
  const c = copy(); c.canh_bao.nguong_tat_den = 15;
  assert.ok(validate(c).length > 0);
});

test('T không tăng dần theo loại xe bị từ chối', () => {
  const c = copy(); c.loai_xe[0].nguong_T = 30;
  assert.ok(validate(c).length > 0);
});

test('Trùng mã trạm bị từ chối', () => {
  const c = copy(); c.tram[1].ma_tram = 'TR01';
  assert.ok(validate(c).length > 0);
});
