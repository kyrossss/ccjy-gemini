import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  createOrderRecord,
  formatTimerSeconds,
  INITIAL_USER_ORDERS,
  updateOrderReview,
  extractAggregatedOrderReviews,
  extractDescriptorTagsFromReview,
  syncOrderReviewToCustomPalateTags,
} from './orderResumeLogic.ts';
import { TEA_REGIONS } from './terroirLogic.ts';
import { PRODUCTS } from '../data/mockData.ts';
import { generateCuratedTeaProfile } from './teaProfileLogic.ts';

describe('orderResumeLogic', () => {
  test('formatTimerSeconds should format minutes and seconds correctly', () => {
    assert.equal(formatTimerSeconds(0), '00:00');
    assert.equal(formatTimerSeconds(5), '00:05');
    assert.equal(formatTimerSeconds(15), '00:15');
    assert.equal(formatTimerSeconds(60), '01:00');
    assert.equal(formatTimerSeconds(75), '01:15');
    assert.equal(formatTimerSeconds(-5), '00:00');
  });

  test('createOrderRecord should create well-formed order with unique codes', () => {
    const order = createOrderRecord({
      items: [
        {
          id: 'tea-01',
          name: '凤凰单丛·乌岽老丛八仙',
          price: 1280,
          quantity: 2,
        },
      ],
      total: 2304,
      pointsEarned: 3456,
      tokensEarned: 34,
      tokensUsed: 20,
    });

    assert.ok(order.id.startsWith('CCJY-ORD-'));
    assert.ok(order.trackingNumber.startsWith('SF'));
    assert.ok(order.antiCounterfeitCode.startsWith('CHUN-'));
    assert.equal(order.totalAmount, 2304);
    assert.equal(order.pointsEarned, 3456);
    assert.equal(order.tokensEarned, 34);
    assert.equal(order.tokensUsed, 20);
    assert.equal(order.items.length, 1);
    assert.equal(order.status, 'shipping');
    assert.equal(order.syncedToTeaProfile, true);
  });

  test('INITIAL_USER_ORDERS should contain valid predefined records with initial tasting reviews', () => {
    assert.equal(INITIAL_USER_ORDERS.length, 2);
    assert.ok(INITIAL_USER_ORDERS[0].id.includes('CCJY-ORD-'));
    assert.ok(INITIAL_USER_ORDERS[1].items[0].name.includes('吴瑞全'));
    assert.ok((INITIAL_USER_ORDERS[0].reviewTags?.length ?? 0) > 0);
  });

  test('updateOrderReview and extractAggregatedOrderReviews should update order reviews and feed into 5D radar', () => {
    const targetId = INITIAL_USER_ORDERS[1].id;
    const updated = updateOrderReview(
      INITIAL_USER_ORDERS,
      targetId,
      '通顶姜花香极高扬，冷杯留香持久。',
      ['幽兰暗香', '冷杯留香', '轻火鲜灵'],
      true
    );

    const targetOrder = updated.find((o) => o.id === targetId);
    assert.ok(targetOrder);
    assert.equal(targetOrder.reviewNote, '通顶姜花香极高扬，冷杯留香持久。');
    assert.equal(targetOrder.syncedToTeaProfile, true);
    assert.ok(targetOrder.reviewTags?.includes('幽兰暗香'));
    assert.ok(targetOrder.reviewTags?.includes('冷杯留香'));

    const aggregated = extractAggregatedOrderReviews(updated);
    assert.ok(aggregated.reviewNotes.includes('通顶姜花香极高扬，冷杯留香持久。'));
    assert.ok(aggregated.reviewTags.includes('幽兰暗香'));
    assert.ok(aggregated.reviewTags.includes('轻火鲜灵'));

    const profile = generateCuratedTeaProfile(
      updated.flatMap((o) => o.items),
      aggregated.reviewNotes,
      aggregated.reviewTags
    );
    assert.ok(profile.radar.aroma >= 88);
  });

  test('存入茶性档案 (syncOrderReviewToCustomPalateTags) updates customPalateTags with user descriptors and shifts 5D radar in real time', () => {
    const targetId = INITIAL_USER_ORDERS[1].id;
    const baseAgg = extractAggregatedOrderReviews(INITIAL_USER_ORDERS);
    const beforeProfile = generateCuratedTeaProfile(
      INITIAL_USER_ORDERS.flatMap((o) => o.items),
      baseAgg.reviewNotes,
      baseAgg.reviewTags
    );

    // User inputs custom descriptors "蜜兰高香、冰糖甜润" and checks "存入茶性档案" (syncToTeaProfile = true)
    const descriptorTags = extractDescriptorTagsFromReview(
      '开汤栀子花香清亮，冰糖甜感明显',
      '蜜兰高香、冰糖甜润'
    );
    assert.ok(descriptorTags.includes('蜜兰高香'));
    assert.ok(descriptorTags.includes('冰糖甜润'));
    assert.ok(descriptorTags.includes('栀子清甜'));

    const updatedOrders = updateOrderReview(
      INITIAL_USER_ORDERS,
      targetId,
      '开汤栀子花香清亮，冰糖甜感明显',
      ['幽兰暗香', ...descriptorTags],
      true
    );

    const nextCustomPalateTags = syncOrderReviewToCustomPalateTags(
      null,
      updatedOrders,
      ['幽兰暗香', ...descriptorTags],
      '开汤栀子花香清亮，冰糖甜感明显',
      true
    );

    assert.ok(nextCustomPalateTags.includes('蜜兰高香'));
    assert.ok(nextCustomPalateTags.includes('冰糖甜润'));
    assert.ok(nextCustomPalateTags.includes('幽兰暗香'));

    const afterProfile = generateCuratedTeaProfile(
      updatedOrders.flatMap((o) => o.items),
      extractAggregatedOrderReviews(updatedOrders).reviewNotes,
      nextCustomPalateTags
    );

    // Aroma and sweetness scores on the 5D radar must increase in real time
    assert.ok(
      afterProfile.radar.aroma > beforeProfile.radar.aroma,
      `Expected aroma to increase from ${beforeProfile.radar.aroma} to ${afterProfile.radar.aroma}`
    );
    assert.ok(
      afterProfile.radar.sweetness > beforeProfile.radar.sweetness,
      `Expected sweetness to increase from ${beforeProfile.radar.sweetness} to ${afterProfile.radar.sweetness}`
    );

    // When syncToTeaProfile is false ("仅存本单评价"), the order's tags are excluded from aggregated profile tags
    const unsyncedOrders = updateOrderReview(
      INITIAL_USER_ORDERS,
      targetId,
      '仅自留笔记不入茶性档案',
      ['极冷香单株'],
      false
    );
    const unsyncedPalateTags = syncOrderReviewToCustomPalateTags(
      null,
      unsyncedOrders,
      ['极冷香单株'],
      '仅自留笔记不入茶性档案',
      false
    );
    assert.ok(!unsyncedPalateTags.includes('极冷香单株'));
  });

  test('all 5 TEA_REGIONS matchedProductId should resolve to real products in PRODUCTS catalog', () => {
    assert.equal(TEA_REGIONS.length, 5);
    for (const region of TEA_REGIONS) {
      const matched = PRODUCTS.find((p) => p.id === region.matchedProductId);
      assert.ok(
        matched,
        `Expected region ${region.id} (${region.name}) matchedProductId=${region.matchedProductId} to exist in PRODUCTS`
      );
      assert.equal(matched.category, 'tea');
    }
  });
});

