import test from 'node:test';
import assert from 'node:assert/strict';
import { getTeaDossier } from './teaGiftManifestPdf.ts';

test('getTeaDossier matches existing catalog teas accurately', () => {
  const zhuxin = getTeaDossier('诸心·凤凰单丛');
  assert.ok(zhuxin.name.includes('诸心'));
  assert.ok(zhuxin.origin.includes('凤凰山'));
  assert.ok(zhuxin.vessel.length > 0);
  assert.ok(zhuxin.description.length > 0);

  const chenfang = getTeaDossier('沉芳·武夷岩茶');
  assert.ok(chenfang.name.length > 0);
  assert.ok(chenfang.origin.length > 0);

  const fallback = getTeaDossier('自选私房老白茶');
  assert.equal(fallback.name, '自选私房老白茶');
  assert.ok(fallback.description.length > 0);
  assert.ok(fallback.vessel.length > 0);
});
