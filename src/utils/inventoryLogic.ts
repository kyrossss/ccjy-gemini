import { TeaItem, ConsignmentItem } from '../data/mockData';

export type InventoryCategory = 'Tea' | 'Ceramics' | 'Consignments';
export type StockAlertLevel = 'critical' | 'low' | 'healthy';

export interface InventoryRecord {
  id: string;
  sku: string;
  name: string;
  category: InventoryCategory;
  categoryLabelCN: string;
  subCategory: string;
  origin: string;
  unitPrice: number;
  stockQuantity: number;
  safetyThreshold: number;
  maxCapacity: number;
  unitLabel: string;
  storageZone: string;
  image: string;
  lastReplenishedAt: string;
  quickReplenishPresets: number[];
}

export interface CategoryInventorySummary {
  category: InventoryCategory;
  labelCN: string;
  enLabel: string;
  totalSkus: number;
  lowStockCount: number;
  criticalCount: number;
  healthyCount: number;
  totalUnits: number;
  totalValuation: number;
}

export interface InventoryDashboardSummary {
  totalSkus: number;
  totalUnits: number;
  totalValuation: number;
  lowStockTotalCount: number;
  criticalTotalCount: number;
  healthyTotalCount: number;
  byCategory: Record<InventoryCategory, CategoryInventorySummary>;
}

export interface ValuationAlertStatus {
  isBelowThreshold: boolean;
  currentValuation: number;
  threshold: number;
  deficit: number;
  ratio: number; // currentValuation / threshold percentage (e.g. 84.5)
  severity: 'healthy' | 'warning' | 'severe';
  recommendedAction: string;
}

export const DEFAULT_VALUATION_THRESHOLD = 250000; // 25 万元默认安全基准

export const VALUATION_THRESHOLD_PRESETS = [
  { label: '稳健型 (¥30万)', value: 300000, desc: '旺季高峰备货，保障全馆三品类充裕流通' },
  { label: '标准基准 (¥25万)', value: 250000, desc: '常规运营基准，平衡资金占用与周转安全' },
  { label: '精益轻仓 (¥18万)', value: 180000, desc: '精细化流转基准，防范小众高价品积压' },
  { label: '预警底线 (¥12万)', value: 120000, desc: '不可跌破的紧急补货防线' },
];

/**
 * Evaluates whether total inventory valuation across all categories drops below the configurable threshold.
 */
export function evaluateInventoryValuationStatus(
  totalValuation: number,
  threshold: number
): ValuationAlertStatus {
  const safeValuation = Math.max(0, totalValuation);
  const safeThreshold = Math.max(1, threshold);
  const isBelow = safeValuation < safeThreshold;
  const deficit = Math.max(0, safeThreshold - safeValuation);
  const ratio = Math.round((safeValuation / safeThreshold) * 100);

  let severity: 'healthy' | 'warning' | 'severe' = 'healthy';
  let recommendedAction = '全品类货值充足，仓储资金流转与现货储备处于健康常态。';

  if (isBelow) {
    if (safeValuation <= safeThreshold * 0.7) {
      severity = 'severe';
      recommendedAction = `货值已深度跌破安全线（缺口 ¥${(deficit / 10000).toFixed(1)}万），请立即执行一键智能全馆补仓或重点增补高价值原叶与名家器物。`;
    } else {
      severity = 'warning';
      recommendedAction = `货值低于预警警戒线（当前达成率 ${ratio}%），建议排查原叶与紫砂低库存项，提前向景德镇与南山茶仓发起补货采购。`;
    }
  }

  return {
    isBelowThreshold: isBelow,
    currentValuation: safeValuation,
    threshold: safeThreshold,
    deficit,
    ratio,
    severity,
    recommendedAction,
  };
}

export interface ReplenishLogEntry {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  category: InventoryCategory;
  addedQuantity: number;
  previousStock: number;
  newStock: number;
  operator: string;
  timestamp: string;
  movementType?: 'inbound' | 'outbound';
}

export interface StoreBackendMetrics {
  inventoryHealthScore: number; // 0-100
  totalGmvRevenue: number;
  totalOrdersCount: number;
  reviewedOrdersCount: number;
  activeBookingsCount: number;
  totalBookedGuests: number;
  salonBookingRevenue: number;
  activeConsignmentsCount: number;
  soldConsignmentsCount: number;
  consignmentPoolValuation: number;
  estimatedConsignmentCommission: number;
}

/**
 * Evaluates the visual alert level for a given stock quantity and safety threshold
 */
export function evaluateStockAlertLevel(
  stockQuantity: number,
  safetyThreshold: number
): StockAlertLevel {
  const safeQty = Math.max(0, stockQuantity);
  const criticalThreshold = Math.max(1, Math.floor(safetyThreshold * 0.4));
  if (safeQty <= criticalThreshold) {
    return 'critical';
  }
  if (safeQty <= safetyThreshold) {
    return 'low';
  }
  return 'healthy';
}

/**
 * Maps a product or consignment item into the unified 3-tier backend inventory category
 */
export function mapToInventoryCategory(
  rawCategory: 'tea' | 'teapot' | 'teaware' | 'yao' | 'consignment'
): InventoryCategory {
  if (rawCategory === 'tea' || rawCategory === 'yao') return 'Tea';
  if (rawCategory === 'teapot' || rawCategory === 'teaware') return 'Ceramics';
  return 'Consignments';
}

/**
 * Deterministic initial inventory builder across Tea, Ceramics, and Consignments.
 * Seeds realistic low-stock and critical-stock items across all 3 categories for store admin management.
 */
export function buildInitialInventoryRecords(
  products: TeaItem[],
  consignments: ConsignmentItem[]
): InventoryRecord[] {
  const records: InventoryRecord[] = [];

  // Deterministic initial stock pattern for Tea & Ceramics
  const teaStockCycle = [2, 5, 14, 3, 18, 6, 22, 4, 16, 25];
  const ceramicStockCycle = [1, 3, 7, 2, 8, 4, 6];

  let teaIdx = 0;
  let cerIdx = 0;

  for (const item of products) {
    const invCategory = mapToInventoryCategory(item.category);
    if (invCategory === 'Tea') {
      const stockQuantity = teaStockCycle[teaIdx % teaStockCycle.length];
      teaIdx++;
      const skuNum = String(teaIdx).padStart(3, '0');
      records.push({
        id: item.id,
        sku: `CCJY-TEA-${skuNum}`,
        name: item.name,
        category: 'Tea',
        categoryLabelCN: '山场原叶 · 茶简',
        subCategory: item.subCategory,
        origin: item.origin,
        unitPrice: item.price,
        stockQuantity,
        safetyThreshold: 8,
        maxCapacity: 40,
        unitLabel: item.category === 'yao' ? '盒' : '罐',
        storageZone: '南山恒温干仓 · 原叶A区',
        image: item.image,
        lastReplenishedAt: '2026-11-04 16:30',
        quickReplenishPresets: [5, 15, 30],
      });
    } else {
      const stockQuantity = ceramicStockCycle[cerIdx % ceramicStockCycle.length];
      cerIdx++;
      const skuNum = String(cerIdx).padStart(3, '0');
      records.push({
        id: item.id,
        sku: `CCJY-CER-${skuNum}`,
        name: item.name,
        category: 'Ceramics',
        categoryLabelCN: '手作茗壶 · 雅瓷',
        subCategory: item.subCategory,
        origin: item.origin,
        unitPrice: item.price,
        stockQuantity,
        safetyThreshold: 4,
        maxCapacity: 16,
        unitLabel: item.category === 'teapot' ? '把' : '套',
        storageZone: '枫溪与景德镇器物专库 · B区',
        image: item.image,
        lastReplenishedAt: '2026-11-03 11:20',
        quickReplenishPresets: [2, 5, 10],
      });
    }
  }

  consignments.forEach((cItem, idx) => {
    const skuNum = String(idx + 1).padStart(3, '0');
    // Sold consignment items have 0 stock, active ones have 1-3 stock with safetyThreshold 2
    const stockQuantity = cItem.status === 'sold' ? 0 : idx % 2 === 0 ? 1 : 3;
    records.push({
      id: cItem.id,
      sku: `CCJY-CON-${skuNum}`,
      name: cItem.name,
      category: 'Consignments',
      categoryLabelCN: '典藏寄售 · 保真孤品',
      subCategory:
        cItem.category === 'teapot'
          ? '寄售名家壶'
          : cItem.category === 'tea'
          ? '寄售陈年茶'
          : '寄售古雅器',
      origin: `鉴藏证号 ${cItem.certificateNo}`,
      unitPrice: cItem.currentPrice,
      stockQuantity,
      safetyThreshold: 2,
      maxCapacity: 6,
      unitLabel: '件',
      storageZone: '保真恒温保险库 · C区',
      image: cItem.image,
      lastReplenishedAt: '2026-11-02 14:00',
      quickReplenishPresets: [1, 2, 4],
    });
  });

  return records;
}

/**
 * Computes aggregated low-stock alerts and valuation metrics across Tea, Ceramics, and Consignments
 */
export function computeInventorySummary(
  records: InventoryRecord[]
): InventoryDashboardSummary {
  const byCategory: Record<InventoryCategory, CategoryInventorySummary> = {
    Tea: {
      category: 'Tea',
      labelCN: '山场原叶 (Tea)',
      enLabel: 'MOUNTAIN TEA & YÁO',
      totalSkus: 0,
      lowStockCount: 0,
      criticalCount: 0,
      healthyCount: 0,
      totalUnits: 0,
      totalValuation: 0,
    },
    Ceramics: {
      category: 'Ceramics',
      labelCN: '茗壶雅瓷 (Ceramics)',
      enLabel: 'TEAPOTS & PORCELAIN',
      totalSkus: 0,
      lowStockCount: 0,
      criticalCount: 0,
      healthyCount: 0,
      totalUnits: 0,
      totalValuation: 0,
    },
    Consignments: {
      category: 'Consignments',
      labelCN: '典藏寄售 (Consignments)',
      enLabel: 'CONSIGNMENT ARCHIVE',
      totalSkus: 0,
      lowStockCount: 0,
      criticalCount: 0,
      healthyCount: 0,
      totalUnits: 0,
      totalValuation: 0,
    },
  };

  let totalSkus = 0;
  let totalUnits = 0;
  let totalValuation = 0;
  let lowStockTotalCount = 0;
  let criticalTotalCount = 0;
  let healthyTotalCount = 0;

  for (const rec of records) {
    const catSummary = byCategory[rec.category];
    const alert = evaluateStockAlertLevel(rec.stockQuantity, rec.safetyThreshold);
    const itemValuation = rec.stockQuantity * rec.unitPrice;

    totalSkus += 1;
    totalUnits += rec.stockQuantity;
    totalValuation += itemValuation;

    catSummary.totalSkus += 1;
    catSummary.totalUnits += rec.stockQuantity;
    catSummary.totalValuation += itemValuation;

    if (alert === 'critical') {
      criticalTotalCount += 1;
      lowStockTotalCount += 1;
      catSummary.criticalCount += 1;
      catSummary.lowStockCount += 1;
    } else if (alert === 'low') {
      lowStockTotalCount += 1;
      catSummary.lowStockCount += 1;
    } else {
      healthyTotalCount += 1;
      catSummary.healthyCount += 1;
    }
  }

  return {
    totalSkus,
    totalUnits,
    totalValuation,
    lowStockTotalCount,
    criticalTotalCount,
    healthyTotalCount,
    byCategory,
  };
}

/**
 * Filters and sorts inventory records for the InventoryManagementDashboard
 */
export function filterInventoryRecords(
  records: InventoryRecord[],
  options: {
    category?: 'ALL' | InventoryCategory;
    onlyLowStock?: boolean;
    searchQuery?: string;
    sortBy?: 'alert-priority' | 'stock-asc' | 'value-desc';
  }
): InventoryRecord[] {
  const category = options.category ?? 'ALL';
  const onlyLowStock = options.onlyLowStock ?? false;
  const q = (options.searchQuery ?? '').trim().toLowerCase();
  const sortBy = options.sortBy ?? 'alert-priority';

  const alertPriorityScore: Record<StockAlertLevel, number> = {
    critical: 0,
    low: 1,
    healthy: 2,
  };

  return records
    .filter((rec) => {
      if (category !== 'ALL' && rec.category !== category) return false;
      const alert = evaluateStockAlertLevel(rec.stockQuantity, rec.safetyThreshold);
      if (onlyLowStock && alert === 'healthy') return false;
      if (q) {
        const matches =
          rec.name.toLowerCase().includes(q) ||
          rec.sku.toLowerCase().includes(q) ||
          rec.subCategory.toLowerCase().includes(q) ||
          rec.origin.toLowerCase().includes(q) ||
          rec.storageZone.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'stock-asc') {
        return a.stockQuantity - b.stockQuantity;
      }
      if (sortBy === 'value-desc') {
        return b.stockQuantity * b.unitPrice - a.stockQuantity * a.unitPrice;
      }
      const alertA = evaluateStockAlertLevel(a.stockQuantity, a.safetyThreshold);
      const alertB = evaluateStockAlertLevel(b.stockQuantity, b.safetyThreshold);
      if (alertPriorityScore[alertA] !== alertPriorityScore[alertB]) {
        return alertPriorityScore[alertA] - alertPriorityScore[alertB];
      }
      return a.stockQuantity - b.stockQuantity;
    });
}

/**
 * Replenishes a single SKU item by a positive quantity and returns the updated records and log entry
 */
export function replenishInventoryItem(
  records: InventoryRecord[],
  itemId: string,
  addQuantity: number,
  timestamp = '2026-11-06 10:00'
): {
  updatedRecords: InventoryRecord[];
  logEntry: ReplenishLogEntry | null;
} {
  const safeAdd = Math.max(1, Math.round(addQuantity));
  let logEntry: ReplenishLogEntry | null = null;

  const updatedRecords = records.map((rec) => {
    if (rec.id !== itemId) return rec;
    const previousStock = rec.stockQuantity;
    const newStock = previousStock + safeAdd;
    logEntry = {
      id: `REP-${Date.now()}-${rec.id}`,
      itemId: rec.id,
      sku: rec.sku,
      itemName: rec.name,
      category: rec.category,
      addedQuantity: safeAdd,
      previousStock,
      newStock,
      operator: '掌柜管理员 · 林清羽',
      timestamp,
    };
    return {
      ...rec,
      stockQuantity: newStock,
      lastReplenishedAt: timestamp,
    };
  });

  return { updatedRecords, logEntry };
}

/**
 * Batch replenishes all low-stock and critical-stock items (optionally scoped to a specific category)
 * up to their maxCapacity so administrators can resolve alerts in one click.
 */
export function batchReplenishLowStock(
  records: InventoryRecord[],
  categoryFilter: 'ALL' | InventoryCategory = 'ALL',
  timestamp = '2026-11-06 10:00'
): {
  updatedRecords: InventoryRecord[];
  replenishedCount: number;
  totalUnitsAdded: number;
  logs: ReplenishLogEntry[];
} {
  let replenishedCount = 0;
  let totalUnitsAdded = 0;
  const logs: ReplenishLogEntry[] = [];

  const updatedRecords = records.map((rec) => {
    if (categoryFilter !== 'ALL' && rec.category !== categoryFilter) {
      return rec;
    }
    const alert = evaluateStockAlertLevel(rec.stockQuantity, rec.safetyThreshold);
    if (alert === 'healthy') {
      return rec;
    }

    const targetStock = Math.max(rec.safetyThreshold + 4, rec.maxCapacity);
    const added = Math.max(1, targetStock - rec.stockQuantity);
    const previousStock = rec.stockQuantity;
    const newStock = previousStock + added;

    replenishedCount += 1;
    totalUnitsAdded += added;
    logs.push({
      id: `BATCH-${Date.now()}-${rec.id}`,
      itemId: rec.id,
      sku: rec.sku,
      itemName: rec.name,
      category: rec.category,
      addedQuantity: added,
      previousStock,
      newStock,
      operator: '掌柜管理员 · 批量补仓',
      timestamp,
      movementType: 'inbound',
    });

    return {
      ...rec,
      stockQuantity: newStock,
      lastReplenishedAt: timestamp,
    };
  });

  return {
    updatedRecords,
    replenishedCount,
    totalUnitsAdded,
    logs,
  };
}

/**
 * Deducts inventory quantities when a storefront order is placed
 */
export function deductInventoryOnOrder(
  records: InventoryRecord[],
  orderedItems: { id: string; quantity: number }[]
): InventoryRecord[] {
  const qtyMap = new Map<string, number>();
  for (const item of orderedItems) {
    qtyMap.set(item.id, (qtyMap.get(item.id) ?? 0) + item.quantity);
  }

  return records.map((rec) => {
    const deduct = qtyMap.get(rec.id);
    if (!deduct || deduct <= 0) return rec;
    return {
      ...rec,
      stockQuantity: Math.max(0, rec.stockQuantity - deduct),
    };
  });
}

/**
 * Deducts inventory quantities on order and generates outbound audit trail entries
 */
export function deductInventoryOnOrderWithAudit(
  records: InventoryRecord[],
  orderedItems: { id: string; quantity: number }[],
  timestamp = '2026-11-06 10:15',
  operator = '前台茶舍订单 · 自动扣减'
): {
  updatedRecords: InventoryRecord[];
  outboundLogs: ReplenishLogEntry[];
} {
  const qtyMap = new Map<string, number>();
  for (const item of orderedItems) {
    qtyMap.set(item.id, (qtyMap.get(item.id) ?? 0) + item.quantity);
  }

  const outboundLogs: ReplenishLogEntry[] = [];

  const updatedRecords = records.map((rec) => {
    const deduct = qtyMap.get(rec.id);
    if (!deduct || deduct <= 0) return rec;
    const previousStock = rec.stockQuantity;
    const newStock = Math.max(0, previousStock - deduct);
    const actualDeducted = Math.max(1, previousStock - newStock);

    outboundLogs.push({
      id: `OUT-${Date.now()}-${rec.id}`,
      itemId: rec.id,
      sku: rec.sku,
      itemName: rec.name,
      category: rec.category,
      addedQuantity: -actualDeducted,
      previousStock,
      newStock,
      operator,
      timestamp,
      movementType: 'outbound',
    });

    return {
      ...rec,
      stockQuantity: newStock,
    };
  });

  return {
    updatedRecords,
    outboundLogs,
  };
}

/**
 * Allows store administrators to customize the safety stock threshold for a specific SKU
 */
export function updateItemSafetyThreshold(
  records: InventoryRecord[],
  itemId: string,
  newSafetyThreshold: number
): InventoryRecord[] {
  const safeVal = Math.max(1, Math.round(newSafetyThreshold));
  return records.map((rec) => {
    if (rec.id !== itemId) return rec;
    return {
      ...rec,
      safetyThreshold: Math.min(rec.maxCapacity - 1, safeVal),
    };
  });
}

/**
 * Computes comprehensive Mini Program Store Backend operational KPIs across Inventory, Orders, Bookings, and Consignments
 */
export function computeStoreBackendMetrics(params: {
  records: InventoryRecord[];
  orders: { totalAmount: number; reviewNote?: string; reviewTags?: string[] }[];
  bookings: { guests: number; finalPrice: number }[];
  consignments: { status: 'active' | 'in_review' | 'sold'; currentPrice: number }[];
}): StoreBackendMetrics {
  const summary = computeInventorySummary(params.records);
  const inventoryHealthScore =
    summary.totalSkus > 0
      ? Math.round((summary.healthyTotalCount / summary.totalSkus) * 100)
      : 100;

  const totalOrdersCount = params.orders.length;
  const totalGmvRevenue = params.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const reviewedOrdersCount = params.orders.filter(
    (o) => Boolean(o.reviewNote?.trim()) || Boolean(o.reviewTags && o.reviewTags.length > 0)
  ).length;

  const activeBookingsCount = params.bookings.length;
  const totalBookedGuests = params.bookings.reduce((sum, b) => sum + (b.guests || 0), 0);
  const salonBookingRevenue = params.bookings.reduce(
    (sum, b) => sum + (b.finalPrice || 0),
    0
  );

  const activeConsignments = params.consignments.filter((c) => c.status === 'active');
  const soldConsignments = params.consignments.filter((c) => c.status === 'sold');
  const consignmentPoolValuation = params.consignments.reduce(
    (sum, c) => sum + (c.currentPrice || 0),
    0
  );
  // 8% standard appraisal & custody service commission
  const estimatedConsignmentCommission = Math.round(consignmentPoolValuation * 0.08);

  return {
    inventoryHealthScore,
    totalGmvRevenue,
    totalOrdersCount,
    reviewedOrdersCount,
    activeBookingsCount,
    totalBookedGuests,
    salonBookingRevenue,
    activeConsignmentsCount: activeConsignments.length,
    soldConsignmentsCount: soldConsignments.length,
    consignmentPoolValuation,
    estimatedConsignmentCommission,
  };
}

/**
 * Generates an official formatted Eastern Aesthetics inventory audit report string for clipboard/export
 */
export function generateInventoryAuditReportText(
  records: InventoryRecord[],
  summary: InventoryDashboardSummary,
  valuationStatus: ValuationAlertStatus
): string {
  const lowItems = records.filter(
    (r) => evaluateStockAlertLevel(r.stockQuantity, r.safetyThreshold) !== 'healthy'
  );
  const lines = [
    '【春城嘉叶 CHUN CHENG JIA YE · 全域仓储盘点与低库存核准单】',
    `生成时间：${new Date().toLocaleString('zh-CN')}`,
    `全馆在库总 SKU：${summary.totalSkus} 项 | 在库总件数：${summary.totalUnits} 件`,
    `全馆在库总货值：¥${summary.totalValuation.toLocaleString()} (警戒基准：¥${valuationStatus.threshold.toLocaleString()} · 达成率 ${valuationStatus.ratio}%)`,
    `库存健康度统计：充盈 ${summary.healthyTotalCount} 项 | 偏低预警 ${summary.lowStockTotalCount} 项 (含紧急告罄 ${summary.criticalTotalCount} 项)`,
    '----------------------------------------',
    `▶ 山场原叶 (Tea)：共 ${summary.byCategory.Tea.totalSkus} 项，预警 ${summary.byCategory.Tea.lowStockCount} 项，货值 ¥${summary.byCategory.Tea.totalValuation.toLocaleString()}`,
    `▶ 茗壶雅瓷 (Ceramics)：共 ${summary.byCategory.Ceramics.totalSkus} 项，预警 ${summary.byCategory.Ceramics.lowStockCount} 项，货值 ¥${summary.byCategory.Ceramics.totalValuation.toLocaleString()}`,
    `▶ 典藏寄售 (Consignments)：共 ${summary.byCategory.Consignments.totalSkus} 项，预警 ${summary.byCategory.Consignments.lowStockCount} 项，货值 ¥${summary.byCategory.Consignments.totalValuation.toLocaleString()}`,
    '----------------------------------------',
    lowItems.length > 0
      ? `【待补货重点清单 (${lowItems.length} 项)】\n` +
        lowItems
          .slice(0, 12)
          .map(
            (item) =>
              `· [${item.sku}] ${item.name} (${item.category})：余 ${item.stockQuantity}${item.unitLabel} / 安全线 ${item.safetyThreshold}${item.unitLabel} (建议补 +${Math.max(1, item.maxCapacity - item.stockQuantity)}${item.unitLabel})`
          )
          .join('\n')
      : '【当前全馆三大品类均处于安全水位以上，无需紧急调拨】',
  ];
  return lines.join('\n');
}

