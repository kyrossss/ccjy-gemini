import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSteepTimeForRound,
  calculateWaterAmount,
  filterTeaWisdom,
  formatSteepDurationCN,
} from './brewingLogic';
import { TEA_WISDOM_ITEMS } from '../data/teaWisdomData';

test('getSteepTimeForRound returns accurate seconds from curve', () => {
  const dancong = TEA_WISDOM_ITEMS.find((i) => i.id === 'dancong-gongfu')!;
  assert.equal(getSteepTimeForRound(dancong, 1), 5);
  assert.equal(getSteepTimeForRound(dancong, 2), 5);
  assert.equal(getSteepTimeForRound(dancong, 3), 8);
  assert.equal(getSteepTimeForRound(dancong, 4), 12);
  // Extrapolate beyond curve (last is 30, so round 8 is 30 + 10 = 40)
  assert.equal(getSteepTimeForRound(dancong, 8), 40);
  // Zero / negative
  assert.equal(getSteepTimeForRound(dancong, 0), 0);
});

test('calculateWaterAmount accurately multiplies leaf grams by ratio', () => {
  // 1:20 ratio with 7.5g leaves => 150ml
  assert.equal(calculateWaterAmount(7.5, '1 : 20 (7-8g : 130ml)'), 150);
  // 1:35 ratio with 5g leaves => 175ml
  assert.equal(calculateWaterAmount(5, '1 : 35 ~ 1 : 50'), 175);
  // 0 leaves
  assert.equal(calculateWaterAmount(0, '1 : 20'), 0);
});

test('filterTeaWisdom correctly filters by category and keyword', () => {
  const all = filterTeaWisdom(TEA_WISDOM_ITEMS, null, '');
  assert.equal(all.length, TEA_WISDOM_ITEMS.length);

  const dancongOnly = filterTeaWisdom(TEA_WISDOM_ITEMS, '单丛工夫', '');
  assert.equal(dancongOnly.length, 1);
  assert.equal(dancongOnly[0].id, 'dancong-gongfu');

  const keywordMatch = filterTeaWisdom(TEA_WISDOM_ITEMS, null, '朱泥');
  assert.ok(keywordMatch.length >= 1);
  assert.ok(keywordMatch.some((item) => item.id === 'zhuni-pot-care'));
});

test('formatSteepDurationCN outputs accurate Chinese format', () => {
  assert.equal(formatSteepDurationCN(0), '秒出 (即出汤)');
  assert.equal(formatSteepDurationCN(15), '15 秒');
  assert.equal(formatSteepDurationCN(60), '1 分钟');
  assert.equal(formatSteepDurationCN(90), '1 分 30 秒');
  assert.equal(formatSteepDurationCN(180), '3 分钟');
});
