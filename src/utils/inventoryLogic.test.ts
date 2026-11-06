import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateStockAlertLevel,
  buildInitialInventoryRecords,
  computeInventorySummary,
  filterInventoryRecords,
  replenishInventoryItem,
  batchReplenishLowStock,
  deductInventoryOnOrder,
  deductInventoryOnOrderWithAudit,
  updateItemSafetyThreshold,
  computeStoreBackendMetrics,
  generateInventoryAuditReportText,
  evaluateInventoryValuationStatus,
  DEFAULT_VALUATION_THRESHOLD,
} from './inventoryLogic.ts';
import { PRODUCTS, CONSIGNMENT_ITEMS } from '../data/mockData.ts';

describe('inventoryLogic & InventoryManagementDashboard Suite', () => {
  test('evaluateStockAlertLevel accurately classifies critical, low, and healthy stock levels', () => {
    // safetyThreshold = 8 => criticalThreshold = floor(8 * 0.4) = 3
    assert.equal(evaluateStockAlertLevel(2, 8), 'critical');
    assert.equal(evaluateStockAlertLevel(3, 8), 'critical');
    assert.equal(evaluateStockAlertLevel(5, 8), 'low');
    assert.equal(evaluateStockAlertLevel(8, 8), 'low');
    assert.equal(evaluateStockAlertLevel(12, 8), 'healthy');
  });

  test('buildInitialInventoryRecords maps all Tea, Ceramics, and Consignments and computeInventorySummary aggregates low-stock counts', () => {
    const records = buildInitialInventoryRecords(PRODUCTS, CONSIGNMENT_ITEMS);
    assert.equal(records.length, PRODUCTS.length + CONSIGNMENT_ITEMS.length);

    const summary = computeInventorySummary(records);
    assert.equal(summary.totalSkus, records.length);
    assert.ok(summary.byCategory.Tea.totalSkus > 0);
    assert.ok(summary.byCategory.Ceramics.totalSkus > 0);
    assert.ok(summary.byCategory.Consignments.totalSkus > 0);

    // Verify all 3 categories have low-stock items seeded for store admin inspection
    assert.ok(summary.byCategory.Tea.lowStockCount >= 1);
    assert.ok(summary.byCategory.Ceramics.lowStockCount >= 1);
    assert.ok(summary.byCategory.Consignments.lowStockCount >= 1);
    assert.equal(
      summary.lowStockTotalCount,
      summary.byCategory.Tea.lowStockCount +
        summary.byCategory.Ceramics.lowStockCount +
        summary.byCategory.Consignments.lowStockCount
    );
  });

  test('filterInventoryRecords filters by category, low-stock toggle, and search keyword', () => {
    const records = buildInitialInventoryRecords(PRODUCTS, CONSIGNMENT_ITEMS);

    const lowTeaOnly = filterInventoryRecords(records, {
      category: 'Tea',
      onlyLowStock: true,
    });
    assert.ok(lowTeaOnly.length >= 1);
    assert.ok(
      lowTeaOnly.every(
        (r) =>
          r.category === 'Tea' &&
          evaluateStockAlertLevel(r.stockQuantity, r.safetyThreshold) !== 'healthy'
      )
    );

    const ceramicSearch = filterInventoryRecords(records, {
      category: 'Ceramics',
      onlyLowStock: false,
      searchQuery: 'CCJY-CER-001',
    });
    assert.equal(ceramicSearch.length, 1);
    assert.equal(ceramicSearch[0].sku, 'CCJY-CER-001');
  });

  test('replenishInventoryItem and batchReplenishLowStock update stock quantities and resolve low-stock alerts', () => {
    const records = buildInitialInventoryRecords(PRODUCTS, CONSIGNMENT_ITEMS);
    const lowItem = records.find(
      (r) => evaluateStockAlertLevel(r.stockQuantity, r.safetyThreshold) === 'critical'
    )!;
    assert.ok(lowItem);

    // Single item quick replenish (+15)
    const singleResult = replenishInventoryItem(records, lowItem.id, 15, '10:30');
    assert.ok(singleResult.logEntry);
    assert.equal(singleResult.logEntry.addedQuantity, 15);
    assert.equal(singleResult.logEntry.newStock, lowItem.stockQuantity + 15);

    const updatedItem = singleResult.updatedRecords.find((r) => r.id === lowItem.id)!;
    assert.equal(
      evaluateStockAlertLevel(updatedItem.stockQuantity, updatedItem.safetyThreshold),
      'healthy'
    );

    // Batch replenish all remaining low-stock items across all categories
    const batchResult = batchReplenishLowStock(singleResult.updatedRecords, 'ALL', '10:35');
    assert.ok(batchResult.replenishedCount >= 1);
    assert.ok(batchResult.totalUnitsAdded >= 1);

    const afterSummary = computeInventorySummary(batchResult.updatedRecords);
    assert.equal(afterSummary.lowStockTotalCount, 0);
    assert.equal(afterSummary.criticalTotalCount, 0);
  });

  test('deductInventoryOnOrder and deductInventoryOnOrderWithAudit reduce stock and generate outbound logs', () => {
    const records = buildInitialInventoryRecords(PRODUCTS, CONSIGNMENT_ITEMS);
    const target = records[2]; // initial stock 14
    const afterDeduct = deductInventoryOnOrder(records, [{ id: target.id, quantity: 12 }]);
    const updatedTarget = afterDeduct.find((r) => r.id === target.id)!;
    assert.equal(updatedTarget.stockQuantity, target.stockQuantity - 12);
    assert.equal(
      evaluateStockAlertLevel(updatedTarget.stockQuantity, updatedTarget.safetyThreshold),
      'critical'
    );

    const auditResult = deductInventoryOnOrderWithAudit(
      records,
      [{ id: target.id, quantity: 4 }],
      '11:20',
      '前台结算'
    );
    assert.equal(auditResult.outboundLogs.length, 1);
    assert.equal(auditResult.outboundLogs[0].movementType, 'outbound');
    assert.equal(auditResult.outboundLogs[0].addedQuantity, -4);
    assert.equal(auditResult.outboundLogs[0].newStock, target.stockQuantity - 4);
  });

  test('evaluateInventoryValuationStatus computes deficit, ratio, severity and recommendedAction across thresholds', () => {
    // When valuation is above threshold
    const healthyStatus = evaluateInventoryValuationStatus(320000, 250000);
    assert.equal(healthyStatus.isBelowThreshold, false);
    assert.equal(healthyStatus.deficit, 0);
    assert.equal(healthyStatus.severity, 'healthy');
    assert.equal(healthyStatus.ratio, 128);

    // When valuation drops moderately below threshold (e.g. 80%)
    const warningStatus = evaluateInventoryValuationStatus(200000, 250000);
    assert.equal(warningStatus.isBelowThreshold, true);
    assert.equal(warningStatus.deficit, 50000);
    assert.equal(warningStatus.severity, 'warning');
    assert.equal(warningStatus.ratio, 80);
    assert.ok(warningStatus.recommendedAction.includes('低于预警警戒线'));

    // When valuation drops severely below threshold (<= 70%)
    const severeStatus = evaluateInventoryValuationStatus(150000, 250000);
    assert.equal(severeStatus.isBelowThreshold, true);
    assert.equal(severeStatus.deficit, 100000);
    assert.equal(severeStatus.severity, 'severe');
    assert.equal(severeStatus.ratio, 60);
    assert.ok(severeStatus.recommendedAction.includes('深度跌破安全线'));
  });

  test('updateItemSafetyThreshold, computeStoreBackendMetrics, and generateInventoryAuditReportText work accurately', () => {
    const records = buildInitialInventoryRecords(PRODUCTS, CONSIGNMENT_ITEMS);
    const first = records[0];
    const updated = updateItemSafetyThreshold(records, first.id, 12);
    assert.equal(updated[0].safetyThreshold, 12);

    const metrics = computeStoreBackendMetrics({
      records: updated,
      orders: [
        { totalAmount: 1960, reviewNote: '兰花香幽长', reviewTags: ['喉韵深长'] },
        { totalAmount: 680 },
      ],
      bookings: [{ guests: 3, finalPrice: 680 }],
      consignments: CONSIGNMENT_ITEMS,
    });
    assert.equal(metrics.totalOrdersCount, 2);
    assert.equal(metrics.reviewedOrdersCount, 1);
    assert.equal(metrics.totalGmvRevenue, 2640);
    assert.equal(metrics.totalBookedGuests, 3);
    assert.ok(metrics.consignmentPoolValuation > 0);
    assert.ok(metrics.estimatedConsignmentCommission > 0);

    const summary = computeInventorySummary(updated);
    const valStatus = evaluateInventoryValuationStatus(
      summary.totalValuation,
      DEFAULT_VALUATION_THRESHOLD
    );
    const report = generateInventoryAuditReportText(updated, summary, valStatus);
    assert.ok(report.includes('春城嘉叶 CHUN CHENG JIA YE · 全域仓储盘点与低库存核准单'));
    assert.ok(report.includes('山场原叶 (Tea)'));
  });
});

