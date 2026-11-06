import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  REGIONAL_CONSIGNMENT_HEAT_DATA,
  generateConsignmentShowcaseAdvice,
} from './consignmentHeatmapLogic';
import { CONSIGNMENT_ITEMS } from '../data/mockData';

describe('consignmentHeatmapLogic Suite', () => {
  it('provides comprehensive regional heat metrics covering major Chinese tea cultural hubs', () => {
    assert.strictEqual(REGIONAL_CONSIGNMENT_HEAT_DATA.length, 5);
    const bayArea = REGIONAL_CONSIGNMENT_HEAT_DATA.find((r) => r.regionId === 'greater_bay');
    assert.ok(bayArea);
    assert.strictEqual(bayArea.heatScore >= 95, true);
    assert.ok(bayArea.inquiriesCount > 200);
    assert.ok(bayArea.coordinates.x > 0 && bayArea.coordinates.y > 0);

    for (const region of REGIONAL_CONSIGNMENT_HEAT_DATA) {
      assert.ok(region.regionName);
      assert.ok(region.memberCount > 500);
      assert.ok(region.preferredCategories.length > 0);
      assert.ok(region.inquiryFrequency.includes('每小时'));
    }
  });

  it('generates visual, narrative, and pricing showcase optimization advice for consignment items', () => {
    const teapotItem = CONSIGNMENT_ITEMS.find((i) => i.id === 'csg-002');
    assert.ok(teapotItem);

    const advice = generateConsignmentShowcaseAdvice(teapotItem);
    assert.strictEqual(advice.itemId, 'csg-002');
    assert.ok(advice.overallDisplayScore >= 60 && advice.overallDisplayScore <= 100);
    assert.ok(advice.adviceList.length >= 3);

    const visualAdvice = advice.adviceList.find((a) => a.type === 'visual');
    const narrativeAdvice = advice.adviceList.find((a) => a.type === 'narrative');
    const pricingAdvice = advice.adviceList.find((a) => a.type === 'pricing');

    assert.ok(visualAdvice, 'Should have visual optimization advice');
    assert.ok(narrativeAdvice, 'Should have narrative optimization advice');
    assert.ok(pricingAdvice, 'Should have pricing strategy advice');
    assert.ok(advice.historicalBenchmarks.length > 0, 'Should include historical benchmark sales');
  });

  it('handles sold items with full completion scores', () => {
    const soldItem = CONSIGNMENT_ITEMS.find((i) => i.id === 'csg-004');
    assert.ok(soldItem);

    const advice = generateConsignmentShowcaseAdvice(soldItem);
    assert.strictEqual(advice.status, 'sold');
    assert.strictEqual(advice.overallDisplayScore >= 90, true);
  });
});
