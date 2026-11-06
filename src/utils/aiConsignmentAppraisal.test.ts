import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  evaluateConsignmentImageAppraisal,
  HISTORICAL_CONSIGNMENT_SALES,
} from './aiConsignmentAppraisal';

describe('aiConsignmentAppraisal Suite', () => {
  it('extracts correct teapot attributes and pricing range from image appraisal', () => {
    const result = evaluateConsignmentImageAppraisal(
      '/assets/aistudio/IMG_6487_f774f6f1.JPG',
      'teapot'
    );

    assert.strictEqual(result.detectedCategory, 'teapot');
    assert.ok(result.suggestedName.includes('朱泥'));
    assert.ok(result.material.includes('梨皮朱泥'));
    assert.ok(result.estimatedEra.length > 0);
    assert.ok(result.craftsmanshipFeatures.length >= 3);
    assert.ok(result.priceRange.minPrice > 0);
    assert.ok(result.priceRange.maxPrice >= result.priceRange.suggestedPrice);
    assert.ok(result.priceRange.suggestedPrice >= result.priceRange.minPrice);
    assert.ok(result.historicalSales.length > 0);
    assert.strictEqual(result.confidenceScore >= 90, true);
  });

  it('extracts tea attributes when tea image or keyword is provided', () => {
    const result = evaluateConsignmentImageAppraisal(
      '/assets/aistudio/IMG_6492_3fd88e0f.JPG',
      'tea',
      '1996年老生普七子青饼'
    );

    assert.strictEqual(result.detectedCategory, 'tea');
    assert.ok(result.suggestedName.includes('普'));
    assert.ok(result.material.includes('云南'));
    assert.ok(result.conditionRating.includes('纯干仓'));
    assert.ok(result.priceRange.suggestedPrice >= 30000);
  });

  it('extracts antique attributes when porcelain cup or antique keyword is provided', () => {
    const result = evaluateConsignmentImageAppraisal(
      '/assets/aistudio/IMG_6490_7c61932b.JPG',
      'antique',
      '双描金白瓷公道杯'
    );

    assert.strictEqual(result.detectedCategory, 'antique');
    assert.ok(result.material.includes('景德镇'));
    assert.ok(result.priceRange.suggestedPrice > 0);
  });

  it('contains verified historical transactions with sale prices and regions', () => {
    assert.ok(HISTORICAL_CONSIGNMENT_SALES.length >= 5);
    for (const sale of HISTORICAL_CONSIGNMENT_SALES) {
      assert.ok(sale.id);
      assert.ok(sale.name);
      assert.ok(sale.soldPrice > 0);
      assert.ok(sale.cycleDays > 0);
      assert.ok(sale.region.length > 0);
    }
  });
});
