import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  TEA_REGIONS,
  getRegionById,
  getScoreLevelCN,
} from './terroirLogic.ts';

describe('terroirLogic', () => {
  test('TEA_REGIONS contains all major tea mountains including Wuyi, Wudong, Xihu, Menghai, Fuding', () => {
    assert.ok(TEA_REGIONS.length >= 5);
    const ids = TEA_REGIONS.map((r) => r.id);
    assert.ok(ids.includes('wuyi'));
    assert.ok(ids.includes('wudong'));
    assert.ok(ids.includes('xihu'));
    assert.ok(ids.includes('menghai'));
    assert.ok(ids.includes('fuding'));
  });

  test('getRegionById returns correct region and falls back safely', () => {
    const wuyi = getRegionById('wuyi');
    assert.equal(wuyi.id, 'wuyi');
    assert.ok(wuyi.name.includes('武夷山'));

    const fallback = getRegionById('unknown_region');
    assert.equal(fallback.id, 'wuyi');
  });

  test('All defaultProfiles have valid sensory notes and radar scores between 0 and 100', () => {
    for (const region of TEA_REGIONS) {
      const p = region.defaultProfile;
      assert.ok(p.tagline.length > 5);
      assert.ok(p.poeticVision.length > 10);
      assert.ok(p.notes.top.length > 0);
      assert.ok(p.notes.heart.length > 0);
      assert.ok(p.notes.base.length > 0);
      assert.ok(p.radarScores.aroma >= 0 && p.radarScores.aroma <= 100);
      assert.ok(p.radarScores.mineralBody >= 0 && p.radarScores.mineralBody <= 100);
      assert.ok(p.radarScores.sweetness >= 0 && p.radarScores.sweetness <= 100);
      assert.ok(p.radarScores.mouthfeel >= 0 && p.radarScores.mouthfeel <= 100);
      assert.ok(p.radarScores.throatDepth >= 0 && p.radarScores.throatDepth <= 100);
    }
  });

  test('getScoreLevelCN returns proper rating descriptors', () => {
    assert.equal(getScoreLevelCN(98), '极品至境');
    assert.equal(getScoreLevelCN(91), '超卓优异');
    assert.equal(getScoreLevelCN(86), '醇正充沛');
    assert.equal(getScoreLevelCN(80), '清雅宜人');
  });
});
