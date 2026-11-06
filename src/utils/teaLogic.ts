/**
 * Pure business logic for the Oriental Tea Culture App
 * Handles membership tiers, points, token rewards, discounts, consignment math, and room reservations.
 */

export type MemberTierLevel =
  | 'GUEST'
  | 'ENTHUSIAST'
  | 'MASTER'
  | 'YINSHAN'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'BLACK_GOLD'
  | 'LIFETIME_PLATINUM'
  | 'LIFETIME_BLACK_GOLD';

export interface TierAestheticTheme {
  themeName: string; // e.g. "素竹素麻" | "冷泉青银" | "沉香暖金" | "汝窑月白" | "曜变黑金" | "天青冰裂" | "传世大漆"
  bgGradient: string; // CSS background gradient for luxury VIP card
  borderClass: string;
  badgeTextColor: string;
  badgeBgColor: string;
  sealText: string; // Oriental seal inscription
  sealColor: string;
  accentColor: string;
  category: 'annual' | 'lifetime';
  keyword: string; // keyword from brand document
  metalType?: 'bamboo' | 'silver' | 'gold' | 'platinum' | 'black_gold' | 'lifetime_platinum' | 'lifetime_black_gold';
  metalLabel?: string;
  metalSheenGradient?: string;
  cardGlow?: string;
}

export interface TierConfig {
  id: MemberTierLevel;
  name: string;
  enTitle: string;
  minPoints: number; // 年度成长值门槛
  discountRate: number; // e.g. 0.05 for 5% off
  pointMultiplier: number;
  consignmentFeeRate: number; // e.g. 0.08 for 8% platform fee
  badgeColor: string;
  privileges: string[];
  theme: TierAestheticTheme;
}

export const TIER_CONFIGS: Record<MemberTierLevel, TierConfig> = {
  GUEST: {
    id: 'GUEST',
    name: '知音',
    enTitle: 'Zhi Yin · In Tune',
    minPoints: 0,
    discountRate: 0,
    pointMultiplier: 1.0,
    consignmentFeeRate: 0.10, // 10%
    badgeColor: '#4A5B52',
    privileges: ['正品防伪溯源', '基础茶席预约', '1.0x 积分累积', '寄售费率 10%', '嘉叶币储值支付'],
    theme: {
      themeName: '素竹素麻 · 初见知音',
      bgGradient: 'from-[#1A231F] via-[#24302A] to-[#161D1A]',
      borderClass: 'border-[#3D4C42]',
      badgeTextColor: '#E2DDD4',
      badgeBgColor: 'rgba(255, 255, 255, 0.08)',
      sealText: '伯牙知音',
      sealColor: '#8C9B8E',
      accentColor: '#5C7063',
      category: 'annual',
      keyword: '初涉茶境 · 见素逢友',
      metalLabel: '山林竹青缎',
    },
  },
  ENTHUSIAST: {
    id: 'ENTHUSIAST',
    name: '品鉴',
    enTitle: 'Pin Jian · Connoisseur',
    minPoints: 1000,
    discountRate: 0.05, // 5%
    pointMultiplier: 1.2,
    consignmentFeeRate: 0.09, // 9%
    badgeColor: '#3A5059',
    privileges: ['全场器物茶叶95折', '会员生日礼茶包', '积分加速 1.2x', '寄售费率下调至 9%', '优先报名普通茶会'],
    theme: {
      themeName: '越窑青瓷 · 细啜品鉴',
      bgGradient: 'from-[#172228] via-[#202E35] to-[#131C21]',
      borderClass: 'border-[#587382]/40 shadow-[0_10px_28px_rgba(0,0,0,0.35)]',
      badgeTextColor: '#C5D7E0',
      badgeBgColor: 'rgba(110, 142, 158, 0.16)',
      sealText: '明澈品鉴',
      sealColor: '#9FB8C5',
      accentColor: '#587382',
      category: 'annual',
      keyword: '心清神明 · 细品岩韵',
      metalLabel: '越窑青瓷缎',
    },
  },
  SILVER: {
    id: 'SILVER',
    name: '品鉴',
    enTitle: 'Pin Jian · Connoisseur',
    minPoints: 10000,
    discountRate: 0.05, // 5%
    pointMultiplier: 1.2,
    consignmentFeeRate: 0.09, // 9%
    badgeColor: '#3A5059',
    privileges: ['全场器物茶叶95折', '会员生日礼茶包', '积分加速 1.2x', '寄售费率下调至 9%', '优先报名普通茶会'],
    theme: {
      themeName: '越窑青瓷 · 细啜品鉴',
      bgGradient: 'from-[#172228] via-[#202E35] to-[#131C21]',
      borderClass: 'border-[#587382]/40 shadow-[0_10px_28px_rgba(0,0,0,0.35)]',
      badgeTextColor: '#C5D7E0',
      badgeBgColor: 'rgba(110, 142, 158, 0.16)',
      sealText: '明澈品鉴',
      sealColor: '#9FB8C5',
      accentColor: '#587382',
      category: 'annual',
      keyword: '心清神明 · 细品岩韵',
      metalLabel: '越窑青瓷缎',
    },
  },
  MASTER: {
    id: 'MASTER',
    name: '雅集',
    enTitle: 'Ya Ji · Salon Host',
    minPoints: 5000,
    discountRate: 0.10, // 10%
    pointMultiplier: 1.5,
    consignmentFeeRate: 0.08, // 8%
    badgeColor: '#6B4F3A',
    privileges: ['全场器物茶叶9折', '新品优先购买', '新茶试饮资格', '寄售费率下调至 8%', '专属客服服务', '积分加速 1.5x'],
    theme: {
      themeName: '沉檀古木 · 兰亭雅集',
      bgGradient: 'from-[#241C18] via-[#322621] to-[#1B1411]',
      borderClass: 'border-[#7E5E47]/45 shadow-[0_10px_28px_rgba(0,0,0,0.35)]',
      badgeTextColor: '#E2CEBF',
      badgeBgColor: 'rgba(126, 94, 71, 0.22)',
      sealText: '兰亭雅集',
      sealColor: '#C9AF9C',
      accentColor: '#8C684E',
      category: 'annual',
      keyword: '高朋满座 · 席主风范',
      metalLabel: '沉檀古木缎',
    },
  },
  GOLD: {
    id: 'GOLD',
    name: '雅集',
    enTitle: 'Ya Ji · Salon Host',
    minPoints: 30000,
    discountRate: 0.10, // 10%
    pointMultiplier: 1.5,
    consignmentFeeRate: 0.08, // 8%
    badgeColor: '#6B4F3A',
    privileges: ['全场器物茶叶9折', '新品优先购买', '新茶试饮资格', '寄售费率下调至 8%', '专属客服服务', '积分加速 1.5x'],
    theme: {
      themeName: '沉檀古木 · 兰亭雅集',
      bgGradient: 'from-[#241C18] via-[#322621] to-[#1B1411]',
      borderClass: 'border-[#7E5E47]/45 shadow-[0_10px_28px_rgba(0,0,0,0.35)]',
      badgeTextColor: '#E2CEBF',
      badgeBgColor: 'rgba(126, 94, 71, 0.22)',
      sealText: '兰亭雅集',
      sealColor: '#C9AF9C',
      accentColor: '#8C684E',
      category: 'annual',
      keyword: '高朋满座 · 席主风范',
      metalLabel: '沉檀古木缎',
    },
  },
  PLATINUM: {
    id: 'PLATINUM',
    name: '尊享',
    enTitle: 'Zun Xiang · Curator',
    minPoints: 80000,
    discountRate: 0.12, // 12%
    pointMultiplier: 1.8,
    consignmentFeeRate: 0.07, // 7%
    badgeColor: '#364956',
    privileges: ['全场88折尊享', '部分品鉴活动免费', '新品内测资格', '高端茶会优先邀请', '茶器鉴赏服务', '寄售优先展示与 7% 费率', '积分加速 1.8x'],
    theme: {
      themeName: '霁蓝墨黛 · 尊享名物',
      bgGradient: 'from-[#141B22] via-[#1D2731] to-[#10161C]',
      borderClass: 'border-[#4D697B]/45 shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
      badgeTextColor: '#C0D5E2',
      badgeBgColor: 'rgba(77, 105, 123, 0.2)',
      sealText: '至尊礼遇',
      sealColor: '#9EBDCF',
      accentColor: '#537488',
      category: 'annual',
      keyword: '鉴真藏幽 · 独席礼遇',
      metalLabel: '霁蓝墨黛缎',
    },
  },
  YINSHAN: {
    id: 'YINSHAN',
    name: '典藏',
    enTitle: 'Dian Cang · Grand Master',
    minPoints: 20000,
    discountRate: 0.15, // 15%
    pointMultiplier: 2.0,
    consignmentFeeRate: 0.06, // 6%
    badgeColor: '#28231F',
    privileges: ['全场85折重磅特权', '私享茶会专席', '大师手拉壶优先预约', '限量茶器购买资格', '私人收藏顾问', '专属会员编号', '寄售费率下调至 6%', '积分双倍 2.0x'],
    theme: {
      themeName: '建盏曜墨 · 传世典藏',
      bgGradient: 'from-[#12100F] via-[#1B1917] to-[#0D0B0A]',
      borderClass: 'border-[#615144]/50 shadow-[0_10px_32px_rgba(0,0,0,0.45)]',
      badgeTextColor: '#DDD3C4',
      badgeBgColor: 'rgba(97, 81, 68, 0.25)',
      sealText: '传世典藏',
      sealColor: '#BAAA97',
      accentColor: '#786454',
      category: 'annual',
      keyword: '大雅藏珍 · 宗师归真',
      metalLabel: '建盏曜墨缎',
    },
  },
  BLACK_GOLD: {
    id: 'BLACK_GOLD',
    name: '典藏',
    enTitle: 'Dian Cang · Grand Master',
    minPoints: 200000,
    discountRate: 0.15, // 15%
    pointMultiplier: 2.0,
    consignmentFeeRate: 0.06, // 6%
    badgeColor: '#28231F',
    privileges: ['全场85折重磅特权', '私享茶会专席', '大师手拉壶优先预约', '限量茶器购买资格', '私人收藏顾问', '专属会员编号', '寄售费率下调至 6%', '积分双倍 2.0x'],
    theme: {
      themeName: '建盏曜墨 · 传世典藏',
      bgGradient: 'from-[#12100F] via-[#1B1917] to-[#0D0B0A]',
      borderClass: 'border-[#615144]/50 shadow-[0_10px_32px_rgba(0,0,0,0.45)]',
      badgeTextColor: '#DDD3C4',
      badgeBgColor: 'rgba(97, 81, 68, 0.25)',
      sealText: '传世典藏',
      sealColor: '#BAAA97',
      accentColor: '#786454',
      category: 'annual',
      keyword: '大雅藏珍 · 宗师归真',
      metalLabel: '建盏曜墨缎',
    },
  },
  LIFETIME_PLATINUM: {
    id: 'LIFETIME_PLATINUM',
    name: '终身 · 尊享席',
    enTitle: 'Lifetime · Zun Xiang Curator',
    minPoints: 600000, // 累计消费 60万元
    discountRate: 0.15, // 15%
    pointMultiplier: 2.5, // 2.5x
    consignmentFeeRate: 0.06, // 6%
    badgeColor: '#1D3B3D',
    privileges: ['永久尊享席位身份（永不降级）', '永久专属会员编号', '年度定制尊荣会员礼', '优先受邀品牌所有活动', '寄售费率按 6% 执行', '积分加速 2.5x', '私享独席随时优先预留'],
    theme: {
      themeName: '天青秘色 · 永久尊席',
      bgGradient: 'from-[#0C1A1C] via-[#14282B] to-[#081214]',
      borderClass: 'border-[#365D60]/55 shadow-[0_12px_36px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(54,93,96,0.25)]',
      badgeTextColor: '#BFE0E2',
      badgeBgColor: 'rgba(54, 93, 96, 0.25)',
      sealText: '秘色尊享',
      sealColor: '#78B0B3',
      accentColor: '#45797C',
      category: 'lifetime',
      keyword: '永久尊享 · 金石长存',
      metalLabel: '天青秘色缎',
    },
  },
  LIFETIME_BLACK_GOLD: {
    id: 'LIFETIME_BLACK_GOLD',
    name: '终身 · 典藏席主',
    enTitle: 'Lifetime · Dian Cang Master',
    minPoints: 1000000, // 累计消费 100万元
    discountRate: 0.18, // 18%
    pointMultiplier: 3.0, // 3.0x 最高积分
    consignmentFeeRate: 0.05, // 5% 最惠寄售
    badgeColor: '#362B1D',
    privileges: ['永久典藏殿堂席位', '传世专属收藏编号（金石入档）', '限量孤品茶器终身首位认购权', '年度定制私人茶会', '品牌共创与新品研发体验', '建立个人传世茶器收藏档案', '寄售成交服务费享 5% 最优', '积分按顶格 3.0x 累计'],
    theme: {
      themeName: '大漆沉香 · 典藏共创',
      bgGradient: 'from-[#14100D] via-[#201A15] to-[#0C0907]',
      borderClass: 'border-[#69543B]/60 shadow-[0_14px_38px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(105,84,59,0.3)]',
      badgeTextColor: '#DDD0BE',
      badgeBgColor: 'rgba(105, 84, 59, 0.25)',
      sealText: '典藏至尊',
      sealColor: '#BCA890',
      accentColor: '#755E42',
      category: 'lifetime',
      keyword: '传世典藏 · 终身共创',
      metalLabel: '大漆沉香缎',
    },
  },
};

/**
 * Determine the tier based on accumulated leaf points
 */
export function calculateTier(points: number): TierConfig {
  if (points >= TIER_CONFIGS.BLACK_GOLD.minPoints) return TIER_CONFIGS.BLACK_GOLD;
  if (points >= TIER_CONFIGS.PLATINUM.minPoints) return TIER_CONFIGS.PLATINUM;
  if (points >= TIER_CONFIGS.YINSHAN.minPoints) return TIER_CONFIGS.YINSHAN;
  if (points >= TIER_CONFIGS.MASTER.minPoints) return TIER_CONFIGS.MASTER;
  if (points >= TIER_CONFIGS.ENTHUSIAST.minPoints) return TIER_CONFIGS.ENTHUSIAST;
  return TIER_CONFIGS.GUEST;
}

const TIER_RANK_ORDER: Record<MemberTierLevel, number> = {
  GUEST: 0,
  SILVER: 1,
  ENTHUSIAST: 1,
  GOLD: 2,
  MASTER: 2,
  PLATINUM: 3,
  YINSHAN: 4,
  BLACK_GOLD: 4,
  LIFETIME_PLATINUM: 5,
  LIFETIME_BLACK_GOLD: 6,
};

export interface EffectiveMembershipResolution {
  effectiveTierConfig: TierConfig;
  appliedReason: string;
  isLifetimeActive: boolean;
  effectivePointMultiplier: number;
  effectiveConsignmentFeeRate: number;
  effectiveMultiplier: number;
  effectiveConsignmentRate: number;
  primaryTierId: MemberTierLevel;
  hasLifetimeStatus: boolean;
}

/**
 * 核心双轨特权裁定器（年度会籍 vs 终身身份，孰高原则）
 * 当同时具备年度与终身身份时，积分倍率与最惠寄售费率自动按最高最优执行
 */
export function resolveEffectiveMembership(
  annualTierId: MemberTierLevel,
  lifetimeTierId?: 'LIFETIME_PLATINUM' | 'LIFETIME_BLACK_GOLD' | null
): EffectiveMembershipResolution {
  const annualConfig = TIER_CONFIGS[annualTierId] || TIER_CONFIGS.GUEST;
  if (!lifetimeTierId) {
    return {
      effectiveTierConfig: annualConfig,
      appliedReason: `按年度会籍【${annualConfig.name}】正常生效`,
      isLifetimeActive: false,
      effectivePointMultiplier: annualConfig.pointMultiplier,
      effectiveConsignmentFeeRate: annualConfig.consignmentFeeRate,
      effectiveMultiplier: annualConfig.pointMultiplier,
      effectiveConsignmentRate: annualConfig.consignmentFeeRate,
      primaryTierId: annualTierId,
      hasLifetimeStatus: false,
    };
  }

  const lifetimeConfig = TIER_CONFIGS[lifetimeTierId];
  if (!lifetimeConfig) {
    return {
      effectiveTierConfig: annualConfig,
      appliedReason: `按年度会籍【${annualConfig.name}】正常生效`,
      isLifetimeActive: false,
      effectivePointMultiplier: annualConfig.pointMultiplier,
      effectiveConsignmentFeeRate: annualConfig.consignmentFeeRate,
      effectiveMultiplier: annualConfig.pointMultiplier,
      effectiveConsignmentRate: annualConfig.consignmentFeeRate,
      primaryTierId: annualTierId,
      hasLifetimeStatus: false,
    };
  }

  // 孰高原则：积分倍率更高、寄售费率更低者优先
  const effectiveMultiplier = Math.max(annualConfig.pointMultiplier, lifetimeConfig.pointMultiplier);
  const effectiveConsignmentRate = Math.min(annualConfig.consignmentFeeRate, lifetimeConfig.consignmentFeeRate);
  const effectiveDiscountRate = Math.max(annualConfig.discountRate, lifetimeConfig.discountRate);

  const mergedConfig: TierConfig = {
    ...lifetimeConfig,
    pointMultiplier: effectiveMultiplier,
    consignmentFeeRate: effectiveConsignmentRate,
    discountRate: effectiveDiscountRate,
  };

  return {
    effectiveTierConfig: mergedConfig,
    appliedReason: `同时具备年度与终身身份，系统已按孰高原则自动执行【${lifetimeConfig.name}】特权（${effectiveMultiplier}x积分 · ${Math.round(effectiveConsignmentRate * 100)}%最惠寄售费率）`,
    isLifetimeActive: true,
    effectivePointMultiplier: effectiveMultiplier,
    effectiveConsignmentFeeRate: effectiveConsignmentRate,
    effectiveMultiplier,
    effectiveConsignmentRate,
    primaryTierId: lifetimeTierId,
    hasLifetimeStatus: true,
  };
}

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
  const multiplier =
    tierId === 'LIFETIME_BLACK_GOLD'
      ? 3.0
      : tierId === 'LIFETIME_PLATINUM'
      ? 2.5
      : tierId === 'YINSHAN' || tierId === 'BLACK_GOLD'
      ? 2.0
      : tierId === 'PLATINUM'
      ? 1.8
      : tierId === 'MASTER' || tierId === 'GOLD'
      ? 1.5
      : tierId === 'ENTHUSIAST' || tierId === 'SILVER'
      ? 1.2
      : 1.0;
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
 * Cart summary with discounts & optional CHÁ token (嘉叶币) deduction
 * 嘉叶币是 1:1 等同现金储值金，全额可直接购买抵扣（多退少补）
 */
export function calculateCartSummary(
  items: CartItem[],
  tierId: MemberTierLevel,
  tokensToUse: number = 0,
  availableTokens: number = 0
) {
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const config = TIER_CONFIGS[tierId] || TIER_CONFIGS.GUEST;
  const memberDiscount = Math.round(rawSubtotal * config.discountRate);
  const discountedSubtotal = rawSubtotal - memberDiscount;

  // 嘉叶币即春城嘉叶储值金，100% 全额可直接支付抵扣
  const maxTokenDeduction = discountedSubtotal;
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
