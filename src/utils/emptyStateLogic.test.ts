import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPTY_STATE_PRESETS,
  getEmptyStatePreset,
  resolveEmptyStateSmartNavigation,
  OrientalEmptyStateVariant,
} from './emptyStateLogic.ts';

describe('emptyStateLogic', () => {
  test('EMPTY_STATE_PRESETS defines complete Oriental Elegance metadata, ink-wash motifs, and smart recommendations for all 7 modules', () => {
    const requiredVariants: OrientalEmptyStateVariant[] = [
      'home',
      'terroir',
      'cart',
      'bookings',
      'consign',
      'shop',
      'orders',
    ];

    for (const v of requiredVariants) {
      const preset = EMPTY_STATE_PRESETS[v];
      assert.ok(preset, `Preset for ${v} should exist`);
      assert.equal(preset.variant, v);
      assert.ok(preset.themeTag.startsWith('东方雅韵 ·'), `Theme tag for ${v} should start with 东方雅韵 ·`);
      assert.ok(preset.inkMotif.startsWith('水墨设色 ·'), `Ink motif for ${v} should start with 水墨设色 ·`);
      assert.ok(preset.sealText.length === 2, `Seal text for ${v} should be a 2-character stamp`);
      assert.ok(preset.title.length > 0);
      assert.ok(preset.poem.length > 0);
      assert.ok(preset.description.length > 0);
      assert.ok(preset.primaryActionLabel.length > 0);
      assert.ok(
        preset.smartRecommendations.length >= 2,
        `Variant ${v} should provide at least 2 smart jump recommendations`
      );
    }
  });

  test('getEmptyStatePreset merges custom overrides cleanly while preserving defaults and smart recommendations', () => {
    const customized = getEmptyStatePreset('consign', {
      title: '您当前尚无委托流转中的藏品',
      secondaryActionLabel: '浏览流转大厅',
    });

    assert.equal(customized.variant, 'consign');
    assert.equal(customized.sealText, '待藏');
    assert.equal(customized.title, '您当前尚无委托流转中的藏品');
    assert.equal(customized.secondaryActionLabel, '浏览流转大厅');
    assert.ok(customized.poem.includes('器有分寸'));
    assert.equal(customized.smartRecommendations.length, 3);
  });

  test('terroir empty state preset includes ethereal mist seal and poetic guidance', () => {
    const terroirPreset = getEmptyStatePreset('terroir');
    assert.equal(terroirPreset.sealText, '云深');
    assert.ok(terroirPreset.title.includes('云深岚雾锁千山'));
    assert.ok(terroirPreset.poem.includes('只在此山中'));
  });

  test('resolveEmptyStateSmartNavigation resolves exact recommendation or falls back to primary smart target', () => {
    const cartRec = resolveEmptyStateSmartNavigation('cart', 'rec-cart-consign');
    assert.equal(cartRec.id, 'rec-cart-consign');
    assert.equal(cartRec.targetTab, 'consign');

    const fallbackBookingRec = resolveEmptyStateSmartNavigation('bookings', 'non-existent-id');
    assert.equal(fallbackBookingRec.id, 'rec-booking-songfeng');
    assert.equal(fallbackBookingRec.targetTab, 'room');
  });
});
