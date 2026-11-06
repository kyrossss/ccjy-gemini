import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  evaluateTeaDiaryLocally,
  mergeDiaryTagsIntoPalateTags,
  INITIAL_TEA_DIARIES,
  TEA_WARE_PRESETS,
  TEA_EXPERIENCE_TAG_SEEDS,
} from './teaDiaryLogic';

describe('teaDiaryLogic Suite', () => {
  it('contains tea ware presets and tasting tag seeds', () => {
    assert.ok(TEA_WARE_PRESETS.length >= 5);
    assert.ok(TEA_EXPERIENCE_TAG_SEEDS.length >= 8);
    assert.ok(TEA_WARE_PRESETS.some((w) => w.includes('朱泥')));
    assert.ok(TEA_EXPERIENCE_TAG_SEEDS.includes('喉底生津'));
  });

  it('evaluates tea diary and extracts oriental tags with radar deltas for Wuyi rock tea', () => {
    const analysis = evaluateTeaDiaryLocally(
      '潮州老梨皮朱泥手拉壶、橄榄炭小红炉',
      '沉芳·武夷岩茶（正岩）',
      '炭火慢煨初沸高冲，焙火香沉入汤底，岩骨厚实，两颊生津如泉，喉底幽兰冷香久驻。'
    );

    assert.ok(analysis.extractedTags.length >= 3);
    assert.ok(analysis.extractedTags.includes('岩骨厚实') || analysis.extractedTags.includes('重焙老火'));
    assert.ok(analysis.radarDeltas.roast > 5);
    assert.ok(analysis.radarDeltas.throatCharm > 5);
    assert.ok(analysis.terroirSummary.length > 10);
    assert.ok(analysis.sommelierNote.length > 5);
  });

  it('evaluates tea diary with aroma and Dancong emphasis', () => {
    const analysis = evaluateTeaDiaryLocally(
      '景德镇宋白瓷三件套盖碗',
      '诸心·凤凰单丛品鉴装',
      '初水滚沸即出，香高如幽兰栀子花，冷杯留香，舌底生津迅疾。'
    );

    assert.ok(analysis.extractedTags.includes('冷杯留香') || analysis.extractedTags.includes('幽兰暗香'));
    assert.ok(analysis.radarDeltas.aroma > 5);
  });

  it('merges new diary tags into personal palate tags without duplicates and capped at 8', () => {
    const current = ['重焙老火', '岩骨厚实', '冷杯留香'];
    const newTags = ['冷杯留香', '米汤稠滑', '喉底生津', '熟果蜜韵'];

    const merged = mergeDiaryTagsIntoPalateTags(current, newTags);
    assert.ok(merged.includes('米汤稠滑'));
    assert.ok(merged.includes('喉底生津'));
    assert.strictEqual(new Set(merged).size, merged.length, 'No duplicate tags allowed');
    assert.ok(merged.length <= 8);
  });

  it('maintains pre-seeded sample tea diaries with complete provenance structure', () => {
    const demo = INITIAL_TEA_DIARIES['demo-booking-01'];
    assert.ok(demo);
    assert.strictEqual(demo.roomName, '听竹 · 越窑秘色席');
    assert.ok(demo.teaWare.includes('朱泥'));
    assert.ok(demo.teaName.includes('武夷'));
    assert.strictEqual(demo.syncedToTerroirProfile, true);
    assert.ok(demo.extractedTags.length > 0);
  });
});
