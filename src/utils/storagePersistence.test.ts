import test from 'node:test';
import assert from 'node:assert/strict';
import {
  APP_STORAGE_KEY,
  getDefaultPersistedState,
  loadPersistedAppState,
  savePersistedAppState,
  resetPersistedAppState,
} from './storagePersistence';
import {
  createPointsRedeemOrderRecord,
  createConsignmentPurchaseOrderRecord,
  buildAvailableSalonTeas,
} from './orderResumeLogic';

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, val: string) => {
      map.set(key, val);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
  };
}

test('loadPersistedAppState returns clean defaults when storage is empty or corrupted', () => {
  const mem = createMemoryStorage();
  const initial = loadPersistedAppState(mem);
  assert.equal(initial.userTier, 'MASTER');
  assert.equal(initial.leafPoints, 6850);
  assert.equal(initial.userOrders.length, 2);

  mem.setItem(APP_STORAGE_KEY, '{corrupted-json');
  const recovered = loadPersistedAppState(mem);
  assert.equal(recovered.userTier, 'MASTER');
  assert.equal(recovered.chaTokens, 320);
});

test('savePersistedAppState and resetPersistedAppState round-trip all closed-loop states including backend inventory & valuation threshold', () => {
  const mem = createMemoryStorage();
  const defaults = getDefaultPersistedState();
  const modified = {
    ...defaults,
    userTier: 'YINSHAN' as const,
    leafPoints: 25600,
    chaTokens: 510,
    hasCheckedInToday: true,
    preselectedSalonTea: '1998年大雪山野生古树散茶',
    valuationThreshold: 300000,
  };

  const savedOk = savePersistedAppState(modified, mem);
  assert.equal(savedOk, true);

  const loaded = loadPersistedAppState(mem);
  assert.equal(loaded.userTier, 'YINSHAN');
  assert.equal(loaded.leafPoints, 25600);
  assert.equal(loaded.hasCheckedInToday, true);
  assert.equal(loaded.preselectedSalonTea, '1998年大雪山野生古树散茶');
  assert.equal(loaded.valuationThreshold, 300000);
  assert.ok(Array.isArray(loaded.inventoryRecords) && loaded.inventoryRecords.length > 0);

  const afterReset = resetPersistedAppState(mem);
  assert.equal(afterReset.userTier, 'MASTER');
  assert.equal(mem.getItem(APP_STORAGE_KEY), null);
});

test('createPointsRedeemOrderRecord and createConsignmentPurchaseOrderRecord generate verifiable order records', () => {
  const redeemOrder = createPointsRedeemOrderRecord({
    id: 'pts-01',
    name: '景德镇草木灰手捏品茗杯',
    pointsRequired: 2800,
    marketValue: 360,
  });
  assert.equal(redeemOrder.totalAmount, 0);
  assert.ok(redeemOrder.statusText.includes('2,800'));
  assert.equal(redeemOrder.items[0].name, '景德镇草木灰手捏品茗杯（叶值礼遇兑换）');

  const consignOrder = createConsignmentPurchaseOrderRecord({
    id: 'csg-01',
    name: '1996年纯干仓易武正山野生大叶青饼',
    currentPrice: 28000,
    certificateNo: 'CCJY-CSG-960412',
    discountedPrice: 25200,
    pointsEarned: 37800,
    tokensEarned: 378,
  });
  assert.equal(consignOrder.totalAmount, 25200);
  assert.equal(consignOrder.antiCounterfeitCode, 'CCJY-CSG-960412');
  assert.equal(consignOrder.pointsEarned, 37800);
});

test('buildAvailableSalonTeas places preselected tea first without duplicates', () => {
  const list = buildAvailableSalonTeas(['老枞水仙', '白毫银针'], '潮州凤凰山·苦种单丛（古法炭焙）');
  assert.equal(list[0], '潮州凤凰山·苦种单丛（古法炭焙）');
  assert.ok(list.includes('老枞水仙'));

  const listWithDup = buildAvailableSalonTeas(['老枞水仙', '白毫银针'], '白毫银针');
  assert.equal(listWithDup[0], '白毫银针');
  assert.equal(listWithDup.filter((t) => t === '白毫银针').length, 1);
});
