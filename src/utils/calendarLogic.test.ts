import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDateStr,
  calculateDateTeaStatus,
  generateMonthDays,
  SOLAR_TERMS_MAP,
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
