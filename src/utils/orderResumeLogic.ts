/**
 * Pure business logic and types for Orders, Bookings, and Consignment Resumes
 */

export interface OrderItemRecord {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface UserOrderRecord {
  id: string;
  createdAt: string;
  items: OrderItemRecord[];
  totalAmount: number;
  pointsEarned: number;
  tokensEarned: number;
  tokensUsed: number;
  shippingCompany: string;
  trackingNumber: string;
  status: 'shipping' | 'delivered' | 'completed';
  statusText: string;
  antiCounterfeitCode: string;
  reviewNote?: string;
  reviewTags?: string[];
  syncedToTeaProfile?: boolean;
}

/**
 * Generate a simulated unique order record after checkout
 */
export function createOrderRecord(params: {
  items: OrderItemRecord[];
  total: number;
  pointsEarned: number;
  tokensEarned: number;
  tokensUsed: number;
  customStatusText?: string;
  customShippingCompany?: string;
  customAntiCounterfeitCode?: string;
  reviewNote?: string;
  reviewTags?: string[];
  syncedToTeaProfile?: boolean;
}): UserOrderRecord {
  const dateStr = new Date().toISOString().slice(0, 10);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `CCJY-ORD-${dateStr.replace(/-/g, '')}-${randomSuffix}`;
  const trackingNumber = `SF${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  const antiCounterfeitCode =
    params.customAntiCounterfeitCode ||
    `CHUN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id: orderId,
    createdAt: `${dateStr} ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`,
    items: params.items,
    totalAmount: params.total,
    pointsEarned: params.pointsEarned,
    tokensEarned: params.tokensEarned,
    tokensUsed: params.tokensUsed,
    shippingCompany: params.customShippingCompany || '顺丰速运 · 雅器恒温冷链特快',
    trackingNumber,
    status: 'shipping',
    statusText: params.customStatusText || '已备茶出库 · 顺丰特快在途',
    antiCounterfeitCode,
    reviewNote: params.reviewNote,
    reviewTags: params.reviewTags,
    syncedToTeaProfile: params.syncedToTeaProfile ?? true,
  };
}

/**
 * Create an order record when redeeming a points gift item
 */
export function createPointsRedeemOrderRecord(item: {
  id: string;
  name: string;
  pointsRequired: number;
  marketValue: number;
  image?: string;
}): UserOrderRecord {
  return createOrderRecord({
    items: [
      {
        id: item.id,
        name: `${item.name}（叶值礼遇兑换）`,
        price: 0,
        quantity: 1,
        image: item.image,
      },
    ],
    total: 0,
    pointsEarned: 0,
    tokensEarned: 1,
    tokensUsed: 0,
    customStatusText: `叶值兑礼 (-${item.pointsRequired.toLocaleString()}叶值) · 雅器备货中`,
    customShippingCompany: '顺丰速运 · 礼遇尊享专递',
  });
}

/**
 * Create an order record when directly acquiring an active consignment item
 */
export function createConsignmentPurchaseOrderRecord(params: {
  id: string;
  name: string;
  currentPrice: number;
  certificateNo: string;
  image?: string;
  discountedPrice: number;
  pointsEarned: number;
  tokensEarned: number;
}): UserOrderRecord {
  return createOrderRecord({
    items: [
      {
        id: params.id,
        name: `${params.name}（典藏流转孤品）`,
        price: params.discountedPrice,
        quantity: 1,
        image: params.image,
      },
    ],
    total: params.discountedPrice,
    pointsEarned: params.pointsEarned,
    tokensEarned: params.tokensEarned,
    tokensUsed: 0,
    customStatusText: '母仓调拨出库 · 附实物鉴藏证书',
    customShippingCompany: '顺丰保价特快 · 恒温专车护送',
    customAntiCounterfeitCode: params.certificateNo,
  });
}

/**
 * Merge preselected tea (e.g. from Tea Profile Dossier or Terroir Explorer) with room's recommended teas
 */
export function buildAvailableSalonTeas(
  roomRecommendedTeas: string[],
  preselectedTea?: string | null
): string[] {
  const defaultCurated = ['荒野头春白毫银针', '牛栏坑足火肉桂', '宋种百年老丛东方红'];
  const merged: string[] = [];
  if (preselectedTea && preselectedTea.trim()) {
    merged.push(preselectedTea.trim());
  }
  for (const tea of [...roomRecommendedTeas, ...defaultCurated]) {
    if (tea && !merged.includes(tea)) {
      merged.push(tea);
    }
  }
  return merged;
}

/**
 * Extract structured descriptor tags from user's free-form review note and custom descriptor input
 */
export function extractDescriptorTagsFromReview(
  reviewNote: string,
  customDescriptorInput = ''
): string[] {
  const extracted = new Set<string>();

  // 1. Parse explicit custom descriptor tokens separated by commas,顿号, spaces, or semicolons
  if (customDescriptorInput && customDescriptorInput.trim()) {
    const tokens = customDescriptorInput
      .split(/[,，、;；\s/]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length >= 2 && t.length <= 10);
    tokens.forEach((t) => extracted.add(t));
  }

  // 2. Detect key oriental sensory descriptors from free-form reviewNote text
  const note = `${reviewNote || ''} ${customDescriptorInput || ''}`;
  const keywordMappings: { pattern: RegExp; tag: string }[] = [
    { pattern: /炭焙|足火|老火|火功|焦糖/, tag: '重焙老火' },
    { pattern: /兰香|幽兰|兰花|空谷幽兰/, tag: '幽兰暗香' },
    { pattern: /生津|鸣泉|回甘|甘泉/, tag: '舌底生津' },
    { pattern: /岩骨|岩韵|骨力|三坑两涧/, tag: '岩骨厚实' },
    { pattern: /冷杯|杯底香|留香|挂杯/, tag: '冷杯留香' },
    { pattern: /青苔|苔藓|老枞|丛味/, tag: '青苔野韵' },
    { pattern: /栀子|花蜜|蜜香|蜜桃/, tag: '栀子清甜' },
    { pattern: /甘冽|冰糖甜|清甜/, tag: '回味甘冽' },
    { pattern: /稠滑|米汤|果胶|醇厚|如绢/, tag: '稠滑如胶' },
    { pattern: /山场|山野|荒野|高山韵/, tag: '山野气韵' },
    { pattern: /轻火|鲜灵|鲜爽|清雅/, tag: '轻火鲜灵' },
    { pattern: /沉水|老木|木质|陈香|药香/, tag: '沉水老木' },
  ];

  for (const rule of keywordMappings) {
    if (rule.pattern.test(note)) {
      extracted.add(rule.tag);
    }
  }

  return Array.from(extracted);
}

/**
 * Update tasting review note, tags & syncedToTeaProfile flag on a specific order record
 */
export function updateOrderReview(
  orders: UserOrderRecord[],
  orderId: string,
  reviewNote: string,
  reviewTags: string[],
  syncToTeaProfile = true
): UserOrderRecord[] {
  const autoExtracted = extractDescriptorTagsFromReview(reviewNote);
  const mergedOrderTags = Array.from(
    new Set([...reviewTags.map((t) => t.trim()).filter(Boolean), ...autoExtracted])
  );

  return orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          reviewNote: reviewNote.trim(),
          reviewTags: mergedOrderTags,
          syncedToTeaProfile: syncToTeaProfile,
        }
      : order
  );
}

/**
 * Synchronize order review tags & user descriptors into customPalateTags state
 * so saving an order review with "存入茶性档案" immediately updates customPalateTags and 5D radar.
 */
export function syncOrderReviewToCustomPalateTags(
  currentCustomTags: string[] | null | undefined,
  updatedOrders: UserOrderRecord[],
  incomingTags: string[],
  reviewNote: string,
  syncToTeaProfile: boolean
): string[] {
  const aggregated = extractAggregatedOrderReviews(updatedOrders);
  const baseTags =
    currentCustomTags && currentCustomTags.length > 0
      ? currentCustomTags
      : aggregated.reviewTags;

  if (!syncToTeaProfile) {
    // Recompute from remaining synced orders so unsynced order tags are not forced
    return aggregated.reviewTags;
  }

  const descriptorTags = extractDescriptorTagsFromReview(reviewNote);
  return Array.from(
    new Set([
      ...incomingTags.map((t) => t.trim()).filter(Boolean),
      ...descriptorTags,
      ...baseTags,
    ])
  );
}

/**
 * Aggregate all user order tasting reviews and tags for Personal Tea Character Radar analysis
 * Only includes orders where syncedToTeaProfile !== false.
 */
export function extractAggregatedOrderReviews(orders: UserOrderRecord[]): {
  reviewNotes: string[];
  reviewTags: string[];
} {
  const notes: string[] = [];
  const tagSet = new Set<string>();

  for (const order of orders) {
    if (order.syncedToTeaProfile === false) continue;
    if (order.reviewNote && order.reviewNote.trim()) {
      notes.push(order.reviewNote.trim());
    }
    if (Array.isArray(order.reviewTags)) {
      for (const t of order.reviewTags) {
        if (t && t.trim()) tagSet.add(t.trim());
      }
    }
  }

  if (tagSet.size === 0) {
    ['重焙老火', '岩骨厚实', '舌底生津', '冷杯留香'].forEach((t) => tagSet.add(t));
  }

  return {
    reviewNotes: notes,
    reviewTags: Array.from(tagSet),
  };
}

/**
 * Format countdown seconds into MM:SS
 */
export function formatTimerSeconds(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safeSec / 60);
  const s = safeSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Default initial mock orders for demo
 */
export const INITIAL_USER_ORDERS: UserOrderRecord[] = [
  {
    id: 'CCJY-ORD-20261102-8392',
    createdAt: '2026-11-02 16:45',
    items: [
      {
        id: 'tea-wuyi-01',
        name: '沉芳·武夷岩茶（正岩老枞水仙）',
        price: 1380,
        quantity: 1,
        image: 'https://www.chunchengjiaye.com/images/craftsmanship/tea/001-chenfang-wide.jpg',
      },
    ],
    totalAmount: 1242,
    pointsEarned: 1863,
    tokensEarned: 18,
    tokensUsed: 0,
    shippingCompany: '顺丰速运 · 雅器特快',
    trackingNumber: 'SF193820491038',
    status: 'shipping',
    statusText: '运输中 · 附赠同批试饮茶样已品评',
    antiCounterfeitCode: 'CHUN-WUYI-8392',
    reviewNote: '正岩慧苑坑老枞水仙炭焙火候极稳，三泡后青苔木质味显露，汤感稠滑如米汤，喉底清凉感极强。',
    reviewTags: ['重焙老火', '岩骨厚实', '青苔野韵', '稠滑如胶'],
    syncedToTeaProfile: true,
  },
  {
    id: 'CCJY-ORD-20261028-4912',
    createdAt: '2026-10-28 11:20',
    items: [
      {
        id: 'pot-01',
        name: '潮州非遗手拉朱泥壶·吴瑞全「孟臣梨壶」',
        price: 3600,
        quantity: 1,
        image: 'https://www.chunchengjiaye.com/images/craftsmanship/teapot/002-wu-ruiquan-mengchen-lihu-wide.jpg',
      },
    ],
    totalAmount: 3240,
    pointsEarned: 4860,
    tokensEarned: 48,
    tokensUsed: 50,
    shippingCompany: '顺丰速运 · 贵重名品专送',
    trackingNumber: 'SF182930192840',
    status: 'completed',
    statusText: '已签收 · 证书与金石印章已入阁',
    antiCounterfeitCode: 'CHUN-WRQ-4912',
    reviewNote: '吴瑞全大师110ml孟臣梨壶出水利落如柱，用来冲泡乌岽单丛聚香极佳，冷杯留香持久。',
    reviewTags: ['舌底生津', '冷杯留香'],
    syncedToTeaProfile: true,
  },
];
