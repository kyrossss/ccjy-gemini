import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  TEA_DIMENSIONS,
  NICHE_TEA_CATALOG,
  AVAILABLE_TASTE_TAGS,
  TEA_MOOD_THEMES,
  calculateRadarCoordinates,
  generateCuratedTeaProfile,
  generateCuratedTeaWhisperPoster,
} from './teaProfileLogic.ts';

describe('teaProfileLogic', () => {
  test('TEA_DIMENSIONS defines the five core oriental Gongfu dimensions', () => {
    assert.equal(TEA_DIMENSIONS.length, 5);
    const keys = TEA_DIMENSIONS.map((d) => d.key);
    assert.deepEqual(keys, ['roast', 'aroma', 'sweetness', 'mouthfeel', 'throatCharm']);
  });

  test('NICHE_TEA_CATALOG contains boutique rare teas with full metadata', () => {
    assert.ok(NICHE_TEA_CATALOG.length >= 4);
    for (const tea of NICHE_TEA_CATALOG) {
      assert.ok(tea.id.length > 0);
      assert.ok(tea.name.length > 0);
      assert.ok(tea.origin.length > 0);
      assert.ok(tea.rarity.length > 0);
      assert.ok(tea.price > 0);
      assert.ok(tea.sampleSpec.length > 0);
      assert.ok(tea.tastingNotes.length >= 2);
      assert.ok(tea.matchScore >= 80 && tea.matchScore <= 100);
    }
  });

  test('calculateRadarCoordinates produces valid 5-point polygon string and bounds', () => {
    const center = { x: 150, y: 150 };
    const radius = 100;
    const radar = {
      roast: 85,
      aroma: 90,
      sweetness: 88,
      mouthfeel: 92,
      throatCharm: 95,
    };

    const result = calculateRadarCoordinates(radar, center, radius);
    assert.equal(result.axisPoints.length, 5);

    const points = result.pointsString.split(' ');
    assert.equal(points.length, 5);
    for (const pt of points) {
      const [xStr, yStr] = pt.split(',');
      const x = parseFloat(xStr);
      const y = parseFloat(yStr);
      assert.ok(!isNaN(x) && x >= 50 && x <= 250);
      assert.ok(!isNaN(y) && y >= 50 && y <= 250);
    }
  });

  test('generateCuratedTeaProfile adapts radar scores according to tea orders', () => {
    const ordersWithWuyi = [{ name: '丛味百年·老枞水仙', price: 980 }];
    const profile = generateCuratedTeaProfile(ordersWithWuyi, [], ['重焙老火', '岩骨厚实']);

    assert.ok(profile.radar.roast >= 80);
    assert.ok(profile.radar.throatCharm >= 85);
    assert.ok(profile.characterTitle.includes('岩骨') || profile.characterTitle.includes('深谷'));
    assert.equal(profile.recommendedTeas.length, 3);
  });

  test('generateCuratedTeaProfile adapts to aroma-heavy preferences', () => {
    const ordersDancong = [{ name: '诸心·凤凰单丛', price: 680 }];
    const profile = generateCuratedTeaProfile(ordersDancong, [], ['幽兰暗香', '冷杯留香', '轻火鲜灵']);

    assert.ok(profile.radar.aroma >= 85);
    assert.ok(profile.recommendedTeas.some((t) => t.id === 'niche-tongtianxiang'));
  });

  test('AVAILABLE_TASTE_TAGS contains key oriental palate descriptors', () => {
    assert.ok(AVAILABLE_TASTE_TAGS.includes('重焙老火'));
    assert.ok(AVAILABLE_TASTE_TAGS.includes('幽兰暗香'));
    assert.ok(AVAILABLE_TASTE_TAGS.includes('舌底生津'));
    assert.ok(AVAILABLE_TASTE_TAGS.includes('岩骨厚实'));
  });

  test('TEA_MOOD_THEMES defines four poetic mood options for tea whisper posters', () => {
    assert.equal(TEA_MOOD_THEMES.length, 4);
    const ids = TEA_MOOD_THEMES.map((m) => m.id);
    assert.deepEqual(ids, ['pine-mist', 'orchid-spring', 'amber-hearth', 'moon-zen']);
  });

  test('generateCuratedTeaWhisperPoster synthesizes 5D radar and 4-line mood poetry with WeChat share caption', () => {
    const orders = [{ name: '丛味百年·老枞水仙', price: 980 }];
    const profile = generateCuratedTeaProfile(orders, [], ['重焙老火', '岩骨厚实']);

    for (const mood of TEA_MOOD_THEMES) {
      const poster = generateCuratedTeaWhisperPoster(
        profile,
        mood.id,
        '林清羽',
        '掌席茶人 · MASTER'
      );

      assert.equal(poster.moodId, mood.id);
      assert.ok(poster.moodLabel.includes(mood.label));
      assert.ok(poster.poeticTitle.includes('·'));
      assert.equal(poster.moodPoem.length, 4);
      for (const verse of poster.moodPoem) {
        assert.ok(verse.length >= 4);
      }
      assert.ok(poster.moodReflection.length > 0);
      assert.ok(poster.sealText.length >= 2 && poster.sealText.length <= 4);
      assert.ok(poster.dominantDimension.label.length > 0);
      assert.ok(poster.dominantDimension.score >= 80);
      assert.ok(poster.wechatShareCaption.includes('林清羽'));
      assert.ok(poster.wechatShareCaption.includes('【春城嘉叶 · 雅致茶语海报】'));
    }
  });
});
