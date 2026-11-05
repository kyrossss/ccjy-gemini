/**
 * Pure business logic for the Oriental Tea Culture App
 * Handles membership tiers, points, token rewards, discounts, consignment math, and room reservations.
 */

export type MemberTierLevel = 'GUEST' | 'ENTHUSIAST' | 'MASTER' | 'YINSHAN';

export interface TierConfig {
  id: MemberTierLevel;
  name: string;
  enTitle: string;
  minPoints: number;
  discountRate: number; // e.g. 0.05 for 5% off
  pointMultiplier: number;
  consignmentFeeRate: number; // e.g. 0.08 for 8% platform fee
  badgeColor: string;
  privileges: string[];
}

export const TIER_CONFIGS: Record<MemberTierLevel, TierConfig> = {
  GUEST: {
    id: 'GUEST',
    name: '客席',
    enTitle: 'Guest Companion',
    minPoints: 0,
    discountRate: 0,
    pointMultiplier: 1.0,
    consignmentFeeRate: 0.10, // 10%
    badgeColor: '#8C857B',
    privileges: ['正品防伪溯源', '基础茶席预约', '积分累积'],
  },
  ENTHUSIAST: {
    id: 'ENTHUSIAST',
    name: '茶人',
    enTitle: 'Tea Enthusiast',
    minPoints: 1000,
    discountRate: 0.05, // 5%
    pointMultiplier: 1.2,
    consignmentFeeRate: 0.08, // 8%
    badgeColor: '#36533F',
    privileges: ['全场器物茶叶95折', '生日赠礼茶包', '积分加速1.2倍', '寄售费率下调至8%'],
  },
  MASTER: {
    id: 'MASTER',
    name: '掌席',
    enTitle: 'Curatorial Master',
    minPoints: 5000,
    discountRate: 0.10, // 10%
    pointMultiplier: 1.5,
    consignmentFeeRate: 0.05, // 5%
    badgeColor: '#A37F3E',
    privileges: ['全场器物茶叶9折', '独家名家手拉壶优先认购', '私享茶室预留', '寄售费率下调至5%', '茗元代币双倍空投'],
  },
  YINSHAN: {
    id: 'YINSHAN',
    name: '隐山',
    enTitle: 'Yinshan Patron',
    minPoints: 20000,
    discountRate: 0.15, // 15%
    pointMultiplier: 2.0,
    consignmentFeeRate: 0.02, // 2%
    badgeColor: '#17211B',
    privileges: ['全场85折尊荣礼遇', '古树单株定制认养', '殿堂茶室无限次专席', '极低2%寄售费率', '流转代币季度分红'],
  },
};

/**
 * Determine the tier based on accumulated leaf points
 */
export function calculateTier(points: number): TierConfig {
  if (points >= TIER_CONFIGS.YINSHAN.minPoints) return TIER_CONFIGS.YINSHAN;
  if (points >= TIER_CONFIGS.MASTER.minPoints) return TIER_CONFIGS.MASTER;
  if (points >= TIER_CONFIGS.ENTHUSIAST.minPoints) return TIER_CONFIGS.ENTHUSIAST;
  return TIER_CONFIGS.GUEST;
}

const TIER_RANK_ORDER: Record<MemberTierLevel, number> = {
  GUEST: 0,
  ENTHUSIAST: 1,
  MASTER: 2,
  YINSHAN: 3,
};

/**
 * Evaluates whether new accumulated leafPoints promote the user to a higher tier.
 * Never downgrades if the user is manually previewing a higher tier.
 */
export function resolveUpgradedTier(
  currentTier: MemberTierLevel,
  newPoints: number
): { nextTier: MemberTierLevel; upgraded: boolean; tierConfig: TierConfig } {
  const computed = calculateTier(newPoints);
  if (TIER_RANK_ORDER[computed.id] > TIER_RANK_ORDER[currentTier]) {
    return {
      nextTier: computed.id,
      upgraded: true,
      tierConfig: computed,
    };
  }
  return {
    nextTier: currentTier,
    upgraded: false,
    tierConfig: TIER_CONFIGS[currentTier],
  };
}

/**
 * Compute discounted item price based on member tier
 */
export function calculateDiscountedPrice(originalPrice: number, tierId: MemberTierLevel): number {
  const config = TIER_CONFIGS[tierId];
  const discountAmount = Math.round(originalPrice * config.discountRate);
  return Math.max(0, originalPrice - discountAmount);
}

/**
 * Calculate leaf points earned from a purchase amount
 */
export function calculateEarnedPoints(amount: number, tierId: MemberTierLevel): number {
  const config = TIER_CONFIGS[tierId];
  return Math.floor(amount * config.pointMultiplier);
}

/**
 * Calculate CHÁ tokens earned from a purchase amount (1 token per 100 RMB, multiplied by tier bonus)
 */
export function calculateTokenReward(amount: number, tierId: MemberTierLevel): number {
  const baseTokens = Math.floor(amount / 100);
  const multiplier = tierId === 'YINSHAN' ? 2 : tierId === 'MASTER' ? 1.5 : tierId === 'ENTHUSIAST' ? 1.2 : 1.0;
  return Math.floor(baseTokens * multiplier);
}

/**
 * Consignment proceeds and fee breakdown
 */
export interface ConsignmentCalculation {
  sellingPrice: number;
  platformFeeRate: number;
  platformFee: number;
  sellerReceives: number;
  chaTokenReward: number;
}

export function calculateConsignmentBreakdown(
  sellingPrice: number,
  tierId: MemberTierLevel
): ConsignmentCalculation {
  const config = TIER_CONFIGS[tierId];
  const platformFee = Math.round(sellingPrice * config.consignmentFeeRate);
  const sellerReceives = Math.max(0, sellingPrice - platformFee);
  // Consigning also rewards CHÁ tokens to incentivize circulation
  const chaTokenReward = Math.floor(sellingPrice / 50);

  return {
    sellingPrice,
    platformFeeRate: config.consignmentFeeRate,
    platformFee,
    sellerReceives,
    chaTokenReward,
  };
}

/**
 * Cart item interface
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Cart summary with discounts & optional CHÁ token deduction
 * 1 CHÁ token = 1 RMB deduction, max up to 20% of subtotal
 */
export function calculateCartSummary(
  items: CartItem[],
  tierId: MemberTierLevel,
  tokensToUse: number = 0,
  availableTokens: number = 0
) {
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const config = TIER_CONFIGS[tierId];
  const memberDiscount = Math.round(rawSubtotal * config.discountRate);
  const discountedSubtotal = rawSubtotal - memberDiscount;

  // Max token deduction is 20% of discounted subtotal
  const maxTokenDeduction = Math.floor(discountedSubtotal * 0.20);
  const actualTokensUsed = Math.min(tokensToUse, availableTokens, maxTokenDeduction);
  const tokenDeductionAmount = actualTokensUsed; // 1:1 RMB

  const finalTotal = Math.max(0, discountedSubtotal - tokenDeductionAmount);
  const earnedPoints = calculateEarnedPoints(finalTotal, tierId);
  const earnedTokens = calculateTokenReward(finalTotal, tierId);

  return {
    rawSubtotal,
    memberDiscount,
    discountedSubtotal,
    tokensUsed: actualTokensUsed,
    tokenDeductionAmount,
    maxTokenDeduction,
    finalTotal,
    earnedPoints,
    earnedTokens,
  };
}

/**
 * Reservation slot validator
 */
export function validateReservation(
  dateStr: string,
  timeSlot: string,
  guestCount: number,
  maxRoomCapacity: number = 6
): { valid: boolean; reason?: string } {
  if (!dateStr) {
    return { valid: false, reason: '请选择预约日期' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(dateStr);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { valid: false, reason: '预约日期不可早于今日' };
  }
  if (!timeSlot) {
    return { valid: false, reason: '请选择茶席时段' };
  }
  if (guestCount < 1) {
    return { valid: false, reason: '入席人数至少为1人' };
  }
  if (guestCount > maxRoomCapacity) {
    return { valid: false, reason: `该茶室最大容纳人数为 ${maxRoomCapacity} 人` };
  }
  return { valid: true };
}
