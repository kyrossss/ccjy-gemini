import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTier,
  resolveUpgradedTier,
  calculateDiscountedPrice,
  calculateEarnedPoints,
  calculateTokenReward,
  calculateConsignmentBreakdown,
  calculateCartSummary,
  validateReservation,
  resolveEffectiveMembership,
} from './teaLogic.ts';
import { TEA_WISDOM_ITEMS } from '../data/teaWisdomData.ts';
import { resolveWisdomShopAndSalonTarget } from './brewingLogic.ts';
import { PRODUCTS } from '../data/mockData.ts';
import { filterShopCatalog } from './terroirLogic.ts';
import {
  OFFICIAL_TEA_ARCHIVE,
  OFFICIAL_PORCELAIN_ARCHIVE,
  OFFICIAL_TEAPOT_ARCHIVE,
  BRAND_HISTORY_MILESTONES,
  OFFICIAL_YAO_PILLARS,
  OFFICIAL_YAO_SCENARIOS,
  OFFICIAL_BRAND_UPDATES,
  OFFICIAL_ENTERPRISE_INFO,
} from '../data/officialWebsiteData.ts';

test('calculateTier correctly assigns tiers based on point thresholds', () => {
  assert.equal(calculateTier(0).id, 'GUEST');
  assert.equal(calculateTier(999).id, 'GUEST');
  assert.equal(calculateTier(1000).id, 'ENTHUSIAST');
  assert.equal(calculateTier(4999).id, 'ENTHUSIAST');
  assert.equal(calculateTier(5000).id, 'MASTER');
  assert.equal(calculateTier(19999).id, 'MASTER');
  assert.equal(calculateTier(20000).id, 'YINSHAN');
  assert.equal(calculateTier(50000).id, 'YINSHAN');
});

test('resolveUpgradedTier promotes member tier when crossing thresholds and never downgrades', () => {
  // Promotion from GUEST -> ENTHUSIAST -> MASTER -> YINSHAN
  const promo1 = resolveUpgradedTier('GUEST', 1200);
  assert.equal(promo1.upgraded, true);
  assert.equal(promo1.nextTier, 'ENTHUSIAST');

  const promo2 = resolveUpgradedTier('ENTHUSIAST', 5500);
  assert.equal(promo2.upgraded, true);
  assert.equal(promo2.nextTier, 'MASTER');

  const promo3 = resolveUpgradedTier('MASTER', 21000);
  assert.equal(promo3.upgraded, true);
  assert.equal(promo3.nextTier, 'YINSHAN');

  // Non-downgrade when user is previewing YINSHAN with lower points
  const noDowngrade = resolveUpgradedTier('YINSHAN', 6850);
  assert.equal(noDowngrade.upgraded, false);
  assert.equal(noDowngrade.nextTier, 'YINSHAN');
});

test('resolveWisdomShopAndSalonTarget maps all 5 TEA_WISDOM_ITEMS to real products and non-empty shop filters', () => {
  assert.equal(TEA_WISDOM_ITEMS.length, 5);
  for (const item of TEA_WISDOM_ITEMS) {
    const target = resolveWisdomShopAndSalonTarget(item);
    assert.ok(target.salonTeaName.length > 0);
    const matchedProduct = PRODUCTS.find((p) => p.id === target.matchedProductId);
    assert.ok(matchedProduct, `Wisdom ${item.id} should map to a valid product in PRODUCTS`);

    const filteredShop = filterShopCatalog(PRODUCTS, {
      category: target.shopCategory,
      searchQuery: target.shopKeyword,
      sortBy: 'default',
    });
    assert.ok(
      filteredShop.length > 0,
      `Wisdom ${item.id} shop filter (${target.shopCategory}, ${target.shopKeyword}) should return matching products`
    );
  }
});

test('calculateDiscountedPrice calculates accurate member discount', () => {
  const original = 1000;
  assert.equal(calculateDiscountedPrice(original, 'GUEST'), 1000); // 0% off
  assert.equal(calculateDiscountedPrice(original, 'ENTHUSIAST'), 950); // 5% off
  assert.equal(calculateDiscountedPrice(original, 'MASTER'), 900); // 10% off
  assert.equal(calculateDiscountedPrice(original, 'YINSHAN'), 850); // 15% off
});

test('calculateEarnedPoints applies correct multiplier per tier', () => {
  const amount = 500;
  assert.equal(calculateEarnedPoints(amount, 'GUEST'), 500);
  assert.equal(calculateEarnedPoints(amount, 'ENTHUSIAST'), 600); // 1.2x
  assert.equal(calculateEarnedPoints(amount, 'MASTER'), 750); // 1.5x
  assert.equal(calculateEarnedPoints(amount, 'YINSHAN'), 1000); // 2.0x
});

test('calculateTokenReward gives CHÁ tokens with tier bonuses', () => {
  const amount = 1000;
  assert.equal(calculateTokenReward(amount, 'GUEST'), 10);
  assert.equal(calculateTokenReward(amount, 'ENTHUSIAST'), 12);
  assert.equal(calculateTokenReward(amount, 'MASTER'), 15);
  assert.equal(calculateTokenReward(amount, 'YINSHAN'), 20);
});

test('calculateConsignmentBreakdown calculates fee rates and rewards accurately', () => {
  const guestResult = calculateConsignmentBreakdown(10000, 'GUEST');
  assert.equal(guestResult.platformFee, 1000); // 10%
  assert.equal(guestResult.sellerReceives, 9000);
  assert.equal(guestResult.chaTokenReward, 200);

  const blackGoldResult = calculateConsignmentBreakdown(10000, 'BLACK_GOLD');
  assert.equal(blackGoldResult.platformFee, 600); // 6%
  assert.equal(blackGoldResult.sellerReceives, 9400);

  const lifetimeBlackGoldResult = calculateConsignmentBreakdown(10000, 'LIFETIME_BLACK_GOLD');
  assert.equal(lifetimeBlackGoldResult.platformFee, 500); // 5% 最优
  assert.equal(lifetimeBlackGoldResult.sellerReceives, 9500);
});

test('calculateCartSummary computes totals, member discount, and token offsets', () => {
  const items = [
    { id: '1', name: '老枞水仙', price: 680, quantity: 1 },
    { id: '2', name: '手拉朱泥壶', price: 1800, quantity: 1 },
  ];
  // Subtotal = 2480
  // MASTER has 10% discount = 248 RMB off -> 2232
  // Max token deduction is 20% of 2232 = 446 RMB
  const summary = calculateCartSummary(items, 'MASTER', 100, 500);
  assert.equal(summary.rawSubtotal, 2480);
  assert.equal(summary.memberDiscount, 248);
  assert.equal(summary.discountedSubtotal, 2232);
  assert.equal(summary.tokensUsed, 100);
  assert.equal(summary.tokenDeductionAmount, 100);
  assert.equal(summary.finalTotal, 2132);
});

test('validateReservation enforces valid date, slot, and guest capacity', () => {
  const futureDate = '2028-10-10';
  assert.equal(validateReservation('', 'MORNING', 2).valid, false);
  assert.equal(validateReservation('2020-01-01', 'MORNING', 2).valid, false);
  assert.equal(validateReservation(futureDate, '', 2).valid, false);
  assert.equal(validateReservation(futureDate, 'MORNING', 0).valid, false);
  assert.equal(validateReservation(futureDate, 'MORNING', 10, 6).valid, false);
  assert.equal(validateReservation(futureDate, 'MORNING', 4, 6).valid, true);
});

test('chunchengjiaye.com official website archive (30 teas, 5 porcelain wares, 7 teapots) maps 100% to PRODUCTS', () => {
  assert.equal(OFFICIAL_TEA_ARCHIVE.length, 30);
  assert.equal(OFFICIAL_PORCELAIN_ARCHIVE.length, 5);
  assert.equal(OFFICIAL_TEAPOT_ARCHIVE.length, 7);
  assert.equal(BRAND_HISTORY_MILESTONES.length, 8);
  assert.equal(OFFICIAL_YAO_PILLARS.length, 3);
  assert.equal(OFFICIAL_YAO_SCENARIOS.length, 6);
  assert.equal(OFFICIAL_BRAND_UPDATES.length, 4);
  assert.equal(OFFICIAL_ENTERPRISE_INFO.icpFiling, '粤ICP备2026111187号-1');

  const all42Items = [
    ...OFFICIAL_TEA_ARCHIVE,
    ...OFFICIAL_PORCELAIN_ARCHIVE,
    ...OFFICIAL_TEAPOT_ARCHIVE,
  ];
  assert.equal(all42Items.length, 42);

  for (const item of all42Items) {
    assert.ok(item.image.startsWith('https://www.chunchengjiaye.com/images/'));
    const product = PRODUCTS.find((p) => p.id === item.matchedProductId);
    assert.ok(
      product,
      `Official archive item ${item.index} (${item.name}) must resolve matchedProductId "${item.matchedProductId}" in PRODUCTS`
    );
  }
});

test('calculateCartSummary supports 100% full Jiaye Coins store-value payment', () => {
  const items = [
    { id: '1', name: '大红袍茶席', price: 1200, quantity: 1 },
  ];
  // Subtotal = 1200, GUEST has 0% discount
  // 100% full deduction: user has 1500 tokens, requests 1200
  const fullPay = calculateCartSummary(items, 'GUEST', 1200, 1500);
  assert.equal(fullPay.rawSubtotal, 1200);
  assert.equal(fullPay.discountedSubtotal, 1200);
  assert.equal(fullPay.tokensUsed, 1200);
  assert.equal(fullPay.tokenDeductionAmount, 1200);
  assert.equal(fullPay.finalTotal, 0); // 0 RMB cash needed!

  // Partial pay: user has 500 tokens, requests 500
  const partialPay = calculateCartSummary(items, 'GUEST', 500, 1500);
  assert.equal(partialPay.tokensUsed, 500);
  assert.equal(partialPay.finalTotal, 700);
});

test('resolveEffectiveMembership adjudicates dual-track membership with highest privilege principle', () => {
  // Case 1: Annual GUEST + Lifetime Black Gold (100w)
  // Multiplier: max(1.0, 3.0) = 3.0x; Fee rate: min(10%, 5%) = 5%
  const res1 = resolveEffectiveMembership('GUEST', 'LIFETIME_BLACK_GOLD');
  assert.equal(res1.effectiveMultiplier, 3.0);
  assert.equal(res1.effectiveConsignmentRate, 0.05);
  assert.equal(res1.primaryTierId, 'LIFETIME_BLACK_GOLD');
  assert.equal(res1.hasLifetimeStatus, true);

  // Case 2: Annual Black Gold (20w points, 2.0x, 6%) + Lifetime Platinum (60w spent, 2.5x, 6%)
  // Multiplier: max(2.0, 2.5) = 2.5x; Fee rate: min(6%, 6%) = 6%
  const res2 = resolveEffectiveMembership('BLACK_GOLD', 'LIFETIME_PLATINUM');
  assert.equal(res2.effectiveMultiplier, 2.5);
  assert.equal(res2.effectiveConsignmentRate, 0.06);
  assert.equal(res2.primaryTierId, 'LIFETIME_PLATINUM');

  // Case 3: Annual Gold (3w points, 1.5x, 8%) + No lifetime status
  const res3 = resolveEffectiveMembership('GOLD', null);
  assert.equal(res3.effectiveMultiplier, 1.5);
  assert.equal(res3.effectiveConsignmentRate, 0.08);
  assert.equal(res3.primaryTierId, 'GOLD');
  assert.equal(res3.hasLifetimeStatus, false);
});
