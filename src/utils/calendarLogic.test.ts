import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDateStr,
  calculateDateTeaStatus,
  generateMonthDays,
  getTeaDifferentiatedScheduleAdvice,
  generateWeeklySchedule,
  resolveCharcoalTimeSlot,
} from './calendarLogic.ts';

test('formatDateStr formats numbers into YYYY-MM-DD format with padding', () => {
  assert.equal(formatDateStr(2026, 10, 4), '2026-11-04');
  assert.equal(formatDateStr(2026, 0, 1), '2026-01-01');
  assert.equal(formatDateStr(2026, 11, 25), '2026-12-25');
});

test('calculateDateTeaStatus identifies auspicious solar terms and booked status', () => {
  const auspicious = calculateDateTeaStatus('2026-11-07');
  assert.equal(auspicious.solarTerm, '立冬');
  assert.equal(auspicious.status, 'auspicious');

  const booked = calculateDateTeaStatus('2026-11-09');
  assert.equal(booked.status, 'booked');
  assert.equal(booked.availableRoomsCount, 0);

  const regular = calculateDateTeaStatus('2026-11-10');
  assert.equal(regular.status, 'available');
  assert.equal(regular.statusText, '宜茶');
});

test('generateMonthDays generates a complete calendar grid divisible by 7', () => {
  const days = generateMonthDays(2026, 10, '2026-11-04'); // Nov 2026
  assert.equal(days.length % 7, 0);
  assert.ok(days.length >= 35);

  const currentMonthDays = days.filter((d) => d.isCurrentMonth);
  assert.equal(currentMonthDays.length, 30); // November has 30 days

  // Today Nov 4 should be recognized
  const nov4 = days.find((d) => d.dateStr === '2026-11-04');
  assert.ok(nov4);
  assert.equal(nov4.isToday, true);
});

test('getTeaDifferentiatedScheduleAdvice differentiates slot, advice, and charcoal temperature note for single host room', () => {
  const dancong = getTeaDifferentiatedScheduleAdvice('诸心·凤凰单丛');
  assert.equal(dancong.teaCategory, 'dancong');
  assert.equal(dancong.recommendedSlotKey, 'morning');
  assert.equal(dancong.recommendedRoomId, 'room-01');
  assert.equal(dancong.recommendedSommelier, '主理人');
  assert.ok(dancong.waterTempNote.includes('炭'));

  const wuyi = getTeaDifferentiatedScheduleAdvice('沉芳·武夷岩茶');
  assert.equal(wuyi.teaCategory, 'wuyi');
  assert.equal(wuyi.recommendedSlotKey, 'afternoon');
  assert.equal(wuyi.recommendedRoomId, 'room-01');
  assert.equal(wuyi.recommendedSommelier, '主理人');
  assert.ok(wuyi.waterTempNote.includes('炭'));

  const puer = getTeaDifferentiatedScheduleAdvice('1996年·中茶牌八八青饼');
  assert.equal(puer.teaCategory, 'aged_puer');
  assert.equal(puer.recommendedSlotKey, 'evening');
  assert.equal(puer.recommendedRoomId, 'room-01');
  assert.equal(puer.recommendedSommelier, '主理人');
  assert.ok(puer.waterTempNote.includes('炭'));

  const yao = getTeaDifferentiatedScheduleAdvice('爻·茶简');
  assert.equal(yao.teaCategory, 'yao');
  assert.equal(yao.recommendedSlotKey, 'morning');
  assert.equal(yao.recommendedRoomId, 'room-01');
  assert.equal(yao.recommendedSommelier, '主理人');
});

test('generateWeeklySchedule produces 7 days with sole room and 3 time slots each and reflects active bookings', () => {
  const week = generateWeeklySchedule(
    '2026-11-05',
    [
      {
        date: '2026-11-06',
        timeSlot: '午席 (14:00 - 17:00 · 浮生半日)',
        roomName: '春城嘉叶 · 独幅独席',
      },
    ],
    '沉芳·武夷岩茶',
    '2026-11-04'
  );

  assert.equal(week.length, 7);
  assert.equal(week[0].dateStr, '2026-11-05');
  assert.equal(week[1].dateStr, '2026-11-06');
  // 全舍仅设一室一席
  assert.equal(week[1].rooms.length, 1);
  assert.equal(week[1].rooms[0].slots.length, 3);

  // Check that user booking on 2026-11-06 afternoon in sole room is marked as occupiedByUser
  const nov6Afternoon = week[1].rooms[0].slots[1];
  assert.equal(nov6Afternoon.occupiedByUser, true);
  assert.equal(nov6Afternoon.occupancyLabel, '我的已约');
});

test('resolveCharcoalTimeSlot extends timeslots by 30 minutes when charcoal prep is enabled', () => {
  const morningBase = '晨席 (09:30 - 12:00 · 清和早茗)';
  const afternoonBase = '午席 (14:00 - 17:00 · 浮生半日)';
  const eveningBase = '暮席 (18:30 - 21:30 · 幽玄夜席)';

  assert.equal(resolveCharcoalTimeSlot(morningBase, false), morningBase);
  assert.equal(
    resolveCharcoalTimeSlot(morningBase, true),
    '晨席 (09:00 - 12:00 · 炭火备水·生火候汤)'
  );
  assert.equal(
    resolveCharcoalTimeSlot(afternoonBase, true),
    '午席 (13:30 - 17:00 · 炭火备水·慢火烹泉)'
  );
  assert.equal(
    resolveCharcoalTimeSlot(eveningBase, true),
    '暮席 (18:00 - 21:30 · 炭火备水·围炉夜候)'
  );

  // Test schedule generation with charcoal prep enabled
  const weekCharcoal = generateWeeklySchedule(
    '2026-11-05',
    [],
    '诸心·凤凰单丛',
    '2026-11-04',
    true
  );
  assert.equal(
    weekCharcoal[0].rooms[0].slots[0].fullTimeSlot,
    '晨席 (09:00 - 12:00 · 炭火备水·生火候汤)'
  );
  assert.equal(weekCharcoal[0].rooms[0].slots[0].timeRange, '09:00 - 12:00');
});

test('TIME_SLOT_CAROUSEL_OPTIONS correctly aligns 30-minute charcoal advance with resolveCharcoalTimeSlot', async () => {
  const { TIME_SLOT_CAROUSEL_OPTIONS } = await import('../components/ReservationModal.js');
  assert.equal(TIME_SLOT_CAROUSEL_OPTIONS.length, 3);

  const morning = TIME_SLOT_CAROUSEL_OPTIONS.find((s: { key: string }) => s.key === 'morning')!;
  assert.equal(morning.standardTime, '09:30 - 12:00');
  assert.equal(morning.charcoalTime, '09:00 - 12:00');
  assert.equal(resolveCharcoalTimeSlot(morning.standardSlot, true), morning.charcoalSlot);

  const afternoon = TIME_SLOT_CAROUSEL_OPTIONS.find((s: { key: string }) => s.key === 'afternoon')!;
  assert.equal(afternoon.standardTime, '14:00 - 17:00');
  assert.equal(afternoon.charcoalTime, '13:30 - 17:00');
  assert.equal(resolveCharcoalTimeSlot(afternoon.standardSlot, true), afternoon.charcoalSlot);

  const evening = TIME_SLOT_CAROUSEL_OPTIONS.find((s: { key: string }) => s.key === 'evening')!;
  assert.equal(evening.standardTime, '18:30 - 21:30');
  assert.equal(evening.charcoalTime, '18:00 - 21:30');
  assert.equal(resolveCharcoalTimeSlot(evening.standardSlot, true), evening.charcoalSlot);
});

test('TEA_ROOMS maintains 3 official tiers (2680, 1280, 598), deletes 98, and enforces verbatim copy standards', async () => {
  const { TEA_ROOMS } = await import('../data/mockData.js');

  // 1. Exactly 3 salon tiers, 98 consultation deleted
  assert.equal(TEA_ROOMS.length, 3);
  assert.equal(TEA_ROOMS[0].basePrice, 2680);
  assert.equal(TEA_ROOMS[1].basePrice, 1280);
  assert.equal(TEA_ROOMS[2].basePrice, 598);
  assert.ok(!TEA_ROOMS.some((r: { basePrice: number }) => r.basePrice === 98));

  // 2. All 3 tiers adhere to the unified cancellation rule
  TEA_ROOMS.forEach((room: { cancellationRule?: string }) => {
    assert.equal(
      room.cancellationRule,
      '开席前 24 小时取消，全额退还；24 小时内取消，可改期一次'
    );
  });

  // 3. Verifies jin prices strictly use lowercase w (e.g. 1.28w/斤, 8.8w/斤)
  const topTier = TEA_ROOMS[0];
  assert.ok(topTier.detailedCopy);
  const rounds = topTier.detailedCopy.teaRounds;
  assert.equal(rounds[0].pricePerJin, '1.28w/斤');
  assert.equal(rounds[1].pricePerJin, '3.8w/斤');
  assert.equal(rounds[2].pricePerJin, '8.8w/斤');
  assert.ok(!rounds.some((r: { pricePerJin: string }) => r.pricePerJin.includes('W/斤')));

  // 4. Verifies private tea sanctuary location note
  TEA_ROOMS.forEach((room: { locationNote?: string }) => {
    assert.equal(room.locationNote, '深圳·北站附近，私人茶室，不对外开放');
  });
});

