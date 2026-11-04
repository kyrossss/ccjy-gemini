import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  createOrderRecord,
  formatTimerSeconds,
  INITIAL_USER_ORDERS,
} from './orderResumeLogic.ts';

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
  });

  test('INITIAL_USER_ORDERS should contain valid predefined records', () => {
    assert.equal(INITIAL_USER_ORDERS.length, 2);
    assert.ok(INITIAL_USER_ORDERS[0].id.includes('CCJY-ORD-'));
    assert.ok(INITIAL_USER_ORDERS[1].items[0].name.includes('吴瑞全'));
  });
});
