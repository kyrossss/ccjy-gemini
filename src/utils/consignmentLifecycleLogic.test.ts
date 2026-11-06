import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  generateConsignmentLifecycle,
  getConsignmentLifecycleSummary,
  getAffinityStories,
  addAffinityStory,
} from './consignmentLifecycleLogic';
import { CONSIGNMENT_ITEMS } from '../data/mockData';

describe('consignmentLifecycleLogic', () => {
  it('generates 4 sequential oriental lifecycle stages for all pre-seeded items', () => {
    for (const item of CONSIGNMENT_ITEMS) {
      const events = generateConsignmentLifecycle(item);
      assert.strictEqual(events.length, 4, `Item ${item.id} should have 4 lifecycle events`);

      // Verify stages order
      assert.strictEqual(events[0].stage, 'intake_appraisal');
      assert.strictEqual(events[1].stage, 'warehouse_custody');
      assert.strictEqual(events[2].stage, 'exhibition_interest');
      assert.strictEqual(events[3].stage, 'negotiation_settlement');

      // Verify each event has date, title, handler, and seal
      for (const evt of events) {
        assert.ok(evt.date, 'Event should have a date');
        assert.ok(evt.title, 'Event should have a title');
        assert.ok(evt.handler, 'Event should have a handler');
        assert.ok(evt.sealLabel, 'Event should have an oriental seal label');
        assert.ok(evt.detail, 'Event should have descriptive text');
      }
    }
  });

  it('marks sold items as fully completed in lifecycle', () => {
    const soldItem = CONSIGNMENT_ITEMS.find((i) => i.id === 'csg-004');
    assert.ok(soldItem);
    const events = generateConsignmentLifecycle(soldItem);
    const finalEvent = events[events.length - 1];
    assert.strictEqual(finalEvent.status, 'completed');
    assert.strictEqual(finalEvent.stageName, '圆满交割');

    const summary = getConsignmentLifecycleSummary(soldItem);
    assert.strictEqual(summary.isSettled, true);
    assert.strictEqual(summary.completedNodesCount, 4);
  });

  it('marks active items as current in final negotiation stage', () => {
    const activeItem = CONSIGNMENT_ITEMS.find((i) => i.id === 'csg-001');
    assert.ok(activeItem);
    const events = generateConsignmentLifecycle(activeItem);
    const finalEvent = events[events.length - 1];
    assert.strictEqual(finalEvent.status, 'current');
    assert.strictEqual(finalEvent.stageName, '结缘流转');

    const summary = getConsignmentLifecycleSummary(activeItem);
    assert.strictEqual(summary.isSettled, false);
    assert.strictEqual(summary.completedNodesCount, 3);
    assert.strictEqual(summary.interestHeatLevel, '活跃');
  });

  it('generates a valid lifecycle for user-submitted custom consignment item', () => {
    const customItem = {
      id: 'csg-custom-999',
      name: '定制朱泥水平壶',
      enName: 'Custom Zhuni Teapot',
      category: 'teapot' as const,
      currentPrice: 8800,
      originalEstimate: 9800,
      sellerName: '知音茶友',
      sellerTier: '品鉴',
      appraisalOrg: '春城嘉叶鉴藏院',
      certificateNo: 'CCJY-POT-CUSTOM01',
      status: 'active' as const,
      warehouseLocation: '春城嘉叶深圳中心母仓',
      condition: '全品相',
      image: '/assets/test.jpg',
      provenance: '传承清晰',
      views: 350,
      bidsCount: 2,
    };

    const events = generateConsignmentLifecycle(customItem);
    assert.strictEqual(events.length, 4);
    assert.strictEqual(events[0].title.includes('实物鉴真'), true);
    assert.strictEqual(events[3].status, 'current');

    const summary = getConsignmentLifecycleSummary(customItem);
    assert.strictEqual(summary.isSettled, false);
    assert.strictEqual(summary.totalNodesCount, 4);
    assert.ok(summary.daysInCustody > 0);
  });

  it('retrieves preset affinity stories for pre-seeded consignment items', () => {
    const stories001 = getAffinityStories('csg-001');
    assert.ok(stories001.length >= 2, 'Item csg-001 should have at least 2 affinity stories');
    assert.strictEqual(stories001[0].author, '藏家·林墨客');
    assert.ok(stories001[0].content.includes('八八青'));

    const stories002 = getAffinityStories('csg-002');
    assert.ok(stories002.length >= 2, 'Item csg-002 should have at least 2 affinity stories');
    assert.strictEqual(stories002[0].author, '古砚草堂主人');
  });

  it('allows adding a new affinity story with tags and oriental author info', () => {
    const newStory = addAffinityStory('csg-003', {
      author: '试茶学人',
      authorRole: '知音席位',
      content: '今日在私享茶仓亲嗅砖面，樟香馥郁，断定为自然干仓佳品。',
      tag: '煮水试汤',
    });

    assert.ok(newStory.id);
    assert.strictEqual(newStory.author, '试茶学人');
    assert.strictEqual(newStory.tag, '煮水试汤');
    assert.strictEqual(newStory.itemId, 'csg-003');
    assert.ok(newStory.date.length === 10);
  });
});

