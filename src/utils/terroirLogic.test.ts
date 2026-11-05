import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  TEA_REGIONS,
  TERROIR_RADAR_AXES,
  getRegionById,
  getScoreLevelCN,
  getRegionThemeMeta,
  compareTerroirProfiles,
  computeD3RadarGeometry,
  resolveRegionSelectionState,
  mapRegionToCatalogProducts,
  filterVisibleTerroirRegions,
  filterShopCatalog,
  createInitialTerroirInteractiveState,
  resetShopFilterState,
  resetTerroirInteractiveState,
  simulateTerroirUserInteraction,
} from './terroirLogic.ts';
import { PRODUCTS } from '../data/mockData.ts';

describe('terroirLogic & D3.js Mountain Terroir Visualization Suite', () => {
  test('TEA_REGIONS contains all 5 major tea mountains (Wuyi, Wudong, Xihu, Menghai, Fuding)', () => {
    assert.equal(TEA_REGIONS.length, 5);
    const ids = TEA_REGIONS.map((r) => r.id);
    assert.deepEqual(ids, ['wuyi', 'wudong', 'xihu', 'menghai', 'fuding']);
  });

  test('getRegionById returns correct region and falls back safely to Wuyi on invalid ID', () => {
    const wuyi = getRegionById('wuyi');
    assert.equal(wuyi.id, 'wuyi');
    assert.ok(wuyi.name.includes('武夷山'));

    const menghai = getRegionById('menghai');
    assert.equal(menghai.id, 'menghai');
    assert.ok(menghai.name.includes('勐海'));

    const fallback = getRegionById('unknown_region');
    assert.equal(fallback.id, 'wuyi');
  });

  test('All defaultProfiles have valid sensory notes and radar scores bounded between 0 and 100', () => {
    for (const region of TEA_REGIONS) {
      const p = region.defaultProfile;
      assert.ok(p.tagline.length > 5);
      assert.ok(p.poeticVision.length > 10);
      assert.ok(p.notes.top.length > 0);
      assert.ok(p.notes.heart.length > 0);
      assert.ok(p.notes.base.length > 0);
      assert.ok(p.radarScores.aroma >= 0 && p.radarScores.aroma <= 100);
      assert.ok(p.radarScores.mineralBody >= 0 && p.radarScores.mineralBody <= 100);
      assert.ok(p.radarScores.sweetness >= 0 && p.radarScores.sweetness <= 100);
      assert.ok(p.radarScores.mouthfeel >= 0 && p.radarScores.mouthfeel <= 100);
      assert.ok(p.radarScores.throatDepth >= 0 && p.radarScores.throatDepth <= 100);
    }
  });

  test('getScoreLevelCN returns accurate oriental rating descriptors across thresholds', () => {
    assert.equal(getScoreLevelCN(98), '极品至境');
    assert.equal(getScoreLevelCN(95), '极品至境');
    assert.equal(getScoreLevelCN(91), '超卓优异');
    assert.equal(getScoreLevelCN(86), '醇正充沛');
    assert.equal(getScoreLevelCN(80), '清雅宜人');
  });

  test('TERROIR_RADAR_AXES and getRegionThemeMeta provide complete D3 spectrum metadata and fallback theme', () => {
    assert.equal(TERROIR_RADAR_AXES.length, 5);
    const wuyiTheme = getRegionThemeMeta('wuyi');
    assert.ok(wuyiTheme.signatureCharm.includes('武夷岩韵'));
    const xihuTheme = getRegionThemeMeta('xihu');
    assert.ok(xihuTheme.signatureCharm.includes('西湖清芳'));
    const fallbackTheme = getRegionThemeMeta('non_existent');
    assert.equal(fallbackTheme.signatureCharm, '东方山场风土');
  });

  test('compareTerroirProfiles identifies key divergence between dual regions and handles single-region mode', () => {
    const wuyi = getRegionById('wuyi').defaultProfile;
    const xihu = getRegionById('xihu').defaultProfile;
    const comparison = compareTerroirProfiles(wuyi, xihu);
    assert.equal(comparison.dominantAxis.key, 'mineralBody');
    assert.ok(comparison.comparisonSummary.includes('武夷岩韵'));
    assert.ok(comparison.comparisonSummary.includes('98 vs 82'));

    // Single-region / self-comparison mode
    const singleMode = compareTerroirProfiles(wuyi, null);
    assert.equal(singleMode.dominantAxis.key, 'mineralBody');
    assert.ok(singleMode.comparisonSummary.includes('冠绝群伦'));
  });

  test('resolveRegionSelectionState switches active region, auto-focuses highest sensory axis, and prevents compare collision', () => {
    // 1. Clicking Wuyi -> highest axis is mineralBody (98)
    const stateWuyi = resolveRegionSelectionState('wuyi', 'xihu');
    assert.equal(stateWuyi.selectedRegion.id, 'wuyi');
    assert.equal(stateWuyi.topAxisKey, 'mineralBody');
    assert.equal(stateWuyi.nextCompareRegionId, 'xihu');

    // 2. Clicking Wudong -> highest axis is aroma (99)
    const stateWudong = resolveRegionSelectionState('wudong', 'xihu');
    assert.equal(stateWudong.selectedRegion.id, 'wudong');
    assert.equal(stateWudong.topAxisKey, 'aroma');
    assert.equal(stateWudong.nextCompareRegionId, 'xihu');

    // 3. Clicking Xihu while compareRegionId is already 'xihu' -> auto-switches compareRegionId to 'wuyi'
    const stateXihu = resolveRegionSelectionState('xihu', 'xihu');
    assert.equal(stateXihu.selectedRegion.id, 'xihu');
    assert.equal(stateXihu.topAxisKey, 'sweetness');
    assert.notEqual(stateXihu.nextCompareRegionId, 'xihu');
    assert.equal(stateXihu.nextCompareRegionId, 'wuyi');

    // 4. Clicking Menghai -> highest axis is throatDepth (99)
    const stateMenghai = resolveRegionSelectionState('menghai', null);
    assert.equal(stateMenghai.selectedRegion.id, 'menghai');
    assert.equal(stateMenghai.topAxisKey, 'throatDepth');
    assert.equal(stateMenghai.nextCompareRegionId, null);

    // 5. Clicking Fuding -> highest axis is sweetness (98)
    const stateFuding = resolveRegionSelectionState('fuding', 'wuyi');
    assert.equal(stateFuding.selectedRegion.id, 'fuding');
    assert.equal(stateFuding.topAxisKey, 'sweetness');
    assert.equal(stateFuding.nextCompareRegionId, 'wuyi');
  });

  test('mapRegionToCatalogProducts accurately maps all 5 regions to PRODUCTS catalog and filters matching mountain teas', () => {
    const expectedProductIds: Record<string, string> = {
      wuyi: 'tea-wuyi-01',
      wudong: 'tea-dancong-01',
      xihu: 'tea-xihu-01',
      menghai: 'tea-menghai-01',
      fuding: 'tea-fuding-01',
    };

    for (const region of TEA_REGIONS) {
      const mapped = mapRegionToCatalogProducts(region.id, PRODUCTS);
      assert.equal(mapped.region.id, region.id);
      assert.ok(mapped.searchKeyword.length >= 2, `Region ${region.id} should extract a valid search keyword`);

      // Verify 1-to-1 representative product resolution
      assert.ok(
        mapped.representativeProduct,
        `Region ${region.id} must resolve a non-null representativeProduct from PRODUCTS`
      );
      assert.equal(mapped.representativeProduct.id, expectedProductIds[region.id]);
      assert.equal(mapped.representativeProduct.category, 'tea');

      // Verify shop terroir filtering returns matching tea items and includes the representative product
      assert.ok(
        mapped.filteredProducts.length >= 1,
        `Region ${region.id} filter should match at least 1 tea product in PRODUCTS`
      );
      assert.ok(
        mapped.filteredProducts.some((p) => p.id === mapped.representativeProduct?.id),
        `Filtered products for ${region.id} must include its representative product`
      );
      assert.ok(
        mapped.filteredProducts.every((p) => p.category === 'tea'),
        `Filtered products for ${region.id} must all belong to 'tea' category`
      );
    }

    // Verify Wudong / Chaozhou matches multiple Dancong teas in catalog
    const wudongMapped = mapRegionToCatalogProducts('wudong', PRODUCTS);
    assert.ok(wudongMapped.filteredProducts.length >= 3);

    // Verify empty catalog resilience
    const emptyCatalogResult = mapRegionToCatalogProducts('wuyi', []);
    assert.equal(emptyCatalogResult.representativeProduct, null);
    assert.equal(emptyCatalogResult.filteredProducts.length, 0);
  });

  test('computeD3RadarGeometry generates valid D3 radial SVG paths, vertex coordinates, and concentric grid rings', () => {
    for (const region of TEA_REGIONS) {
      const smoothGeo = computeD3RadarGeometry(region.defaultProfile, {
        maxRadius: 82,
        smoothCurve: true,
      });
      const linearGeo = computeD3RadarGeometry(region.defaultProfile, {
        maxRadius: 82,
        smoothCurve: false,
      });

      // Valid SVG path strings starting with M and ending with Z
      assert.ok(smoothGeo.svgPathD.startsWith('M'), `Smooth D3 path for ${region.id} should start with M`);
      assert.ok(linearGeo.svgPathD.startsWith('M'), `Linear D3 path for ${region.id} should start with M`);
      assert.ok(linearGeo.svgPathD.endsWith('Z'), `Linear D3 path for ${region.id} should close with Z`);
      assert.notEqual(
        smoothGeo.svgPathD,
        linearGeo.svgPathD,
        'Cardinal smooth curve and linear closed curve should produce distinct SVG path geometry'
      );

      // 5 vertices bounded within [-maxRadius, maxRadius]
      assert.equal(smoothGeo.vertices.length, 5);
      for (const v of smoothGeo.vertices) {
        assert.ok(v.x >= -82 && v.x <= 82, `Vertex x (${v.x}) should be within [-82, 82]`);
        assert.ok(v.y >= -82 && v.y <= 82, `Vertex y (${v.y}) should be within [-82, 82]`);
        // Top axis (idx 0, angle -PI/2) must sit at x = 0, y < 0
        if (v.idx === 0) {
          assert.equal(v.x, 0);
          assert.ok(v.y < 0);
        }
      }

      // 4 concentric grid rings (25, 50, 75, 100)
      assert.equal(smoothGeo.gridRings.length, 4);
      assert.deepEqual(
        smoothGeo.gridRings.map((g) => g.level),
        [25, 50, 75, 100]
      );
      for (const ring of smoothGeo.gridRings) {
        const pairs = ring.points.split(' ');
        assert.equal(pairs.length, 5, `Grid ring at level ${ring.level} should have 5 polygon vertices`);
      }
    }
  });

  test('D3 region selection accurately filters corresponding tea items from PRODUCTS across all 5 mountains', () => {
    const initialState = createInitialTerroirInteractiveState(PRODUCTS);
    const regionExpectations: {
      regionId: string;
      expectedKeyword: string;
      expectedRepId: string;
      expectedTopAxis: string;
    }[] = [
      {
        regionId: 'wuyi',
        expectedKeyword: '武夷山',
        expectedRepId: 'tea-wuyi-01',
        expectedTopAxis: 'mineralBody',
      },
      {
        regionId: 'wudong',
        expectedKeyword: '潮州',
        expectedRepId: 'tea-dancong-01',
        expectedTopAxis: 'aroma',
      },
      {
        regionId: 'xihu',
        expectedKeyword: '西湖',
        expectedRepId: 'tea-xihu-01',
        expectedTopAxis: 'sweetness',
      },
      {
        regionId: 'menghai',
        expectedKeyword: '勐海',
        expectedRepId: 'tea-menghai-01',
        expectedTopAxis: 'throatDepth',
      },
      {
        regionId: 'fuding',
        expectedKeyword: '福鼎',
        expectedRepId: 'tea-fuding-01',
        expectedTopAxis: 'sweetness',
      },
    ];

    for (const exp of regionExpectations) {
      const nextState = simulateTerroirUserInteraction(
        initialState,
        { type: 'CLICK_REGION', regionId: exp.regionId },
        PRODUCTS
      );

      assert.equal(nextState.selectedRegionId, exp.regionId);
      assert.equal(nextState.activeAxisKey, exp.expectedTopAxis);
      assert.equal(nextState.shopFilterState.category, 'tea');
      assert.equal(nextState.shopFilterState.keyword, exp.expectedKeyword);

      // Verify filteredShopItems contains only teas and includes the region's representative tea
      assert.ok(nextState.filteredShopItems.length >= 1);
      assert.ok(nextState.filteredShopItems.every((item) => item.category === 'tea'));
      assert.ok(
        nextState.filteredShopItems.some((item) => item.id === exp.expectedRepId),
        `Selecting region ${exp.regionId} must include representative tea ${exp.expectedRepId}`
      );

      // Verify every filtered tea genuinely matches the region keyword or matchedProductId
      const kw = exp.expectedKeyword.toLowerCase();
      for (const tea of nextState.filteredShopItems) {
        const matchesRegion =
          tea.id === exp.expectedRepId ||
          tea.name.toLowerCase().includes(kw) ||
          tea.subCategory.toLowerCase().includes(kw) ||
          tea.origin.toLowerCase().includes(kw) ||
          tea.tagline.toLowerCase().includes(kw);
        assert.ok(
          matchesRegion,
          `Tea ${tea.id} (${tea.name}) should match region ${exp.regionId} keyword ${exp.expectedKeyword}`
        );
      }
    }
  });

  test('simulateTerroirUserInteraction simulates sequential region clicks, shop filtering, product opening, and salon reservation', () => {
    let state = createInitialTerroirInteractiveState(PRODUCTS);

    // Initial state should be Wuyi with mineralBody focused
    assert.equal(state.selectedRegionId, 'wuyi');
    assert.equal(state.compareRegionId, 'xihu');
    assert.equal(state.activeAxisKey, 'mineralBody');
    assert.equal(state.filteredShopItems.length, PRODUCTS.length);

    // Step 1: Simulate clicking "潮州 · 凤凰山乌岽顶" (wudong)
    state = simulateTerroirUserInteraction(state, { type: 'CLICK_REGION', regionId: 'wudong' }, PRODUCTS);
    assert.equal(state.selectedRegionId, 'wudong');
    assert.equal(state.activeAxisKey, 'aroma'); // 99 score
    assert.ok(state.filteredShopItems.length >= 3);
    assert.ok(state.filteredShopItems.some((item) => item.id === 'tea-dancong-01'));

    // Step 2: Simulate clicking "检索该山场" (TRIGGER_SHOP_FILTER) -> syncs with ShopView filter
    state = simulateTerroirUserInteraction(
      state,
      { type: 'TRIGGER_SHOP_FILTER', sortBy: 'price-desc' },
      PRODUCTS
    );
    assert.equal(state.shopFilterState.category, 'tea');
    assert.equal(state.shopFilterState.keyword, '潮州');
    assert.equal(state.shopFilterState.sortBy, 'price-desc');
    assert.ok(state.filteredShopItems.every((item) => item.category === 'tea'));
    assert.ok(state.filteredShopItems.some((item) => item.id === 'tea-dancong-01'));

    // Step 3: Simulate clicking "西湖 · 狮峰翁家山" (xihu) which collides with compareRegionId === 'xihu'
    state = simulateTerroirUserInteraction(state, { type: 'CLICK_REGION', regionId: 'xihu' }, PRODUCTS);
    assert.equal(state.selectedRegionId, 'xihu');
    assert.equal(state.compareRegionId, 'wuyi'); // Auto-resolved collision
    assert.equal(state.activeAxisKey, 'sweetness');
    assert.ok(state.filteredShopItems.some((item) => item.id === 'tea-xihu-01'));

    // Step 4: Simulate clicking "品鉴代表茶详情" (OPEN_REPRESENTATIVE_PRODUCT)
    state = simulateTerroirUserInteraction(state, { type: 'OPEN_REPRESENTATIVE_PRODUCT' }, PRODUCTS);
    assert.ok(state.openedProduct);
    assert.equal(state.openedProduct.id, 'tea-xihu-01');
    assert.ok(state.openedProduct.name.includes('龙井'));

    // Step 5: Simulate clicking "勐海 · 布朗山老班章" (menghai) and "携茶预约茶室" (RESERVE_SALON_TEA)
    state = simulateTerroirUserInteraction(state, { type: 'CLICK_REGION', regionId: 'menghai' }, PRODUCTS);
    state = simulateTerroirUserInteraction(state, { type: 'RESERVE_SALON_TEA' }, PRODUCTS);
    assert.equal(state.selectedRegionId, 'menghai');
    assert.equal(state.activeAxisKey, 'throatDepth');
    assert.equal(state.reservedSalonTea, '古树纯料普洱生茶');

    // Step 6: Simulate clicking "福鼎 · 太姥山荒野高山" (fuding), clicking a specific axis, and toggling D3 curve mode
    state = simulateTerroirUserInteraction(state, { type: 'CLICK_REGION', regionId: 'fuding' }, PRODUCTS);
    const smoothPathBefore = state.d3Geometry.svgPathD;
    state = simulateTerroirUserInteraction(state, { type: 'CLICK_AXIS', axisKey: 'mouthfeel' }, PRODUCTS);
    assert.equal(state.activeAxisKey, 'mouthfeel');

    state = simulateTerroirUserInteraction(state, { type: 'TOGGLE_CURVE_MODE' }, PRODUCTS);
    assert.equal(state.smoothCurve, false);
    assert.notEqual(state.d3Geometry.svgPathD, smoothPathBefore);

    // Step 7: Robustness check against invalid compareRegionId or invalid regionId click
    state = simulateTerroirUserInteraction(
      state,
      { type: 'SET_COMPARE_REGION', compareRegionId: 'fuding' }, // Same as selectedRegionId
      PRODUCTS
    );
    assert.equal(state.compareRegionId, null);

    state = simulateTerroirUserInteraction(
      state,
      { type: 'CLICK_REGION', regionId: 'invalid_mountain_id' },
      PRODUCTS
    );
    assert.equal(state.selectedRegionId, 'wuyi'); // Safe fallback
  });

  test('State update & reset logic: verifies SET_BELT_FILTER, RESET_SHOP_FILTER, and full RESET_TERROIR_STATE restoration', () => {
    const initialState = createInitialTerroirInteractiveState(PRODUCTS);
    let state = initialState;

    // 1. Mutate state via belt filter to 'wudong'
    state = simulateTerroirUserInteraction(
      state,
      { type: 'SET_BELT_FILTER', beltFilter: 'wudong' },
      PRODUCTS
    );
    assert.equal(state.terroirBeltFilter, 'wudong');
    assert.equal(state.visibleRegions.length, 1);
    assert.equal(state.visibleRegions[0].id, 'wudong');
    assert.equal(state.selectedRegionId, 'wudong');
    assert.equal(state.shopFilterState.category, 'tea');
    assert.equal(state.shopFilterState.keyword, '潮州');
    assert.ok(state.filteredShopItems.length < PRODUCTS.length);

    // 2. Mutate sort order via TRIGGER_SHOP_FILTER and verify RESET_SHOP_FILTER restores full shop catalog while keeping D3 region
    state = simulateTerroirUserInteraction(
      state,
      { type: 'TRIGGER_SHOP_FILTER', sortBy: 'price-asc' },
      PRODUCTS
    );
    assert.equal(state.shopFilterState.sortBy, 'price-asc');

    state = simulateTerroirUserInteraction(state, { type: 'RESET_SHOP_FILTER' }, PRODUCTS);
    assert.equal(state.selectedRegionId, 'wudong', 'Active D3 region should remain wudong on shop filter reset');
    assert.deepEqual(state.shopFilterState, {
      category: 'all',
      keyword: '',
      sortBy: 'default',
    });
    assert.equal(state.filteredShopItems.length, PRODUCTS.length);

    // 3. Mutate state to 'uncharted' belt (empty state), toggle curve mode, open product, reserve salon tea, and disable compare region
    state = simulateTerroirUserInteraction(
      state,
      { type: 'SET_BELT_FILTER', beltFilter: 'uncharted' },
      PRODUCTS
    );
    assert.equal(state.terroirBeltFilter, 'uncharted');
    assert.equal(state.visibleRegions.length, 0);
    assert.deepEqual(filterVisibleTerroirRegions('uncharted'), []);

    state = simulateTerroirUserInteraction(state, { type: 'CLICK_REGION', regionId: 'menghai' }, PRODUCTS);
    state = simulateTerroirUserInteraction(state, { type: 'TOGGLE_CURVE_MODE' }, PRODUCTS);
    state = simulateTerroirUserInteraction(state, { type: 'SET_COMPARE_REGION', compareRegionId: 'none' }, PRODUCTS);
    state = simulateTerroirUserInteraction(state, { type: 'OPEN_REPRESENTATIVE_PRODUCT' }, PRODUCTS);
    state = simulateTerroirUserInteraction(state, { type: 'RESERVE_SALON_TEA' }, PRODUCTS);

    assert.equal(state.selectedRegionId, 'menghai');
    assert.equal(state.smoothCurve, false);
    assert.equal(state.compareRegionId, null);
    assert.ok(state.openedProduct !== null);
    assert.ok(state.reservedSalonTea !== null);

    // 4. Execute full RESET_TERROIR_STATE and verify complete restoration to canonical initial state
    const resetState = simulateTerroirUserInteraction(
      state,
      { type: 'RESET_TERROIR_STATE' },
      PRODUCTS
    );

    assert.equal(resetState.terroirBeltFilter, 'all');
    assert.equal(resetState.visibleRegions.length, 5);
    assert.equal(resetState.selectedRegionId, 'wuyi');
    assert.equal(resetState.compareRegionId, 'xihu');
    assert.equal(resetState.activeAxisKey, 'mineralBody');
    assert.equal(resetState.smoothCurve, true);
    assert.equal(resetState.openedProduct, null);
    assert.equal(resetState.reservedSalonTea, null);
    assert.deepEqual(resetState.shopFilterState, {
      category: 'all',
      keyword: '',
      sortBy: 'default',
    });
    assert.equal(resetState.filteredShopItems.length, PRODUCTS.length);
    assert.equal(resetState.d3Geometry.svgPathD, initialState.d3Geometry.svgPathD);

    // Also verify direct helper calls resetShopFilterState and resetTerroirInteractiveState
    const directReset = resetTerroirInteractiveState(PRODUCTS);
    assert.deepEqual(directReset.shopFilterState, initialState.shopFilterState);
    assert.equal(directReset.selectedRegionId, 'wuyi');

    const partialReset = resetShopFilterState(state, PRODUCTS);
    assert.equal(partialReset.selectedRegionId, 'menghai');
    assert.equal(partialReset.filteredShopItems.length, PRODUCTS.length);
  });

  test('filterShopCatalog supports category filtering, keyword search, and price sorting cleanly', () => {
    const allTeas = filterShopCatalog(PRODUCTS, { category: 'tea', searchQuery: '' });
    assert.ok(allTeas.length >= 6);
    assert.ok(allTeas.every((p) => p.category === 'tea'));

    const ascTeas = filterShopCatalog(PRODUCTS, {
      category: 'tea',
      searchQuery: '',
      sortBy: 'price-asc',
    });
    for (let i = 1; i < ascTeas.length; i++) {
      assert.ok(ascTeas[i].price >= ascTeas[i - 1].price);
    }

    const descTeas = filterShopCatalog(PRODUCTS, {
      category: 'tea',
      searchQuery: '',
      sortBy: 'price-desc',
    });
    for (let i = 1; i < descTeas.length; i++) {
      assert.ok(descTeas[i].price <= descTeas[i - 1].price);
    }

    const noMatch = filterShopCatalog(PRODUCTS, {
      category: 'tea',
      searchQuery: '不存在的茶山关键词XYZ',
    });
    assert.equal(noMatch.length, 0);
  });
});

