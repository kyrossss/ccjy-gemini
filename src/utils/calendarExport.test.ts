import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSlotTimes,
  formatIcsDateTime,
  generateIcsContent,
  parseBookingTargetDate,
  calculateCountdownParts,
  CalendarEventData,
} from './calendarExport';

test('parseSlotTimes correctly extracts hours and minutes for different slots', () => {
  const morning = parseSlotTimes('晨席 (09:30 - 12:00 · 清和早茗)');
  assert.equal(morning.startHour, 9);
  assert.equal(morning.startMinute, 30);
  assert.equal(morning.endHour, 12);
  assert.equal(morning.endMinute, 0);

  const afternoon = parseSlotTimes('午席 (14:00 - 17:00 · 浮生半日)');
  assert.equal(afternoon.startHour, 14);
  assert.equal(afternoon.startMinute, 0);
  assert.equal(afternoon.endHour, 17);
  assert.equal(afternoon.endMinute, 0);

  const night = parseSlotTimes('暮席 (18:30 - 21:30 · 幽玄夜席)');
  assert.equal(night.startHour, 18);
  assert.equal(night.startMinute, 30);
  assert.equal(night.endHour, 21);
  assert.equal(night.endMinute, 30);
});

test('formatIcsDateTime formats date string and hours into YYYYMMDDTHHmmss', () => {
  assert.equal(formatIcsDateTime('2026-11-07', 14, 0), '20261107T140000');
  assert.equal(formatIcsDateTime('2026-11-04', 9, 30), '20261104T093000');
});

test('generateIcsContent produces valid RFC 5545 VCALENDAR string with event and alarm', () => {
  const mockBooking: CalendarEventData = {
    roomName: '「月藏」THE MOON\'S SILENT RETREAT',
    date: '2026-11-07',
    timeSlot: '午席 (14:00 - 17:00 · 浮生半日)',
    guests: 2,
    sommelier: '苏婉',
    pairedTea: '老枞水仙',
    bookingCode: 'YUN-SEAT-888',
  };

  const ics = generateIcsContent(mockBooking);

  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('END:VCALENDAR'));
  assert.ok(ics.includes('BEGIN:VEVENT'));
  assert.ok(ics.includes('END:VEVENT'));
  assert.ok(ics.includes('DTSTART:20261107T140000'));
  assert.ok(ics.includes('DTEND:20261107T170000'));
  assert.ok(ics.includes('SUMMARY:春城嘉叶茶事 · 【「月藏」THE MOON\'S SILENT RETREAT】雅席'));
  assert.ok(ics.includes('LOCATION:春城嘉叶 · 潮州工夫茶舍（深圳市南山区）'));
  assert.ok(ics.includes('BEGIN:VALARM'));
  assert.ok(ics.includes('TRIGGER:-PT2H'));
});

test('parseBookingTargetDate and calculateCountdownParts accurately compute remaining days, hours, minutes, and seconds', () => {
  const target = parseBookingTargetDate('2026-11-08', '午席 (14:00 - 17:00)');
  const now = new Date(2026, 10, 5, 12, 30, 15); // 2026-11-05 12:30:15
  const parts = calculateCountdownParts(target, now);

  assert.equal(parts.isUpcoming, true);
  assert.equal(parts.days, 3);
  assert.equal(parts.hours, 1);
  assert.equal(parts.minutes, 29);
  assert.equal(parts.seconds, 45);
  assert.ok(parts.stageTag.includes('席次预热'));
});

