import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  MOOD_ARCHETYPES,
  evaluateImminentBookingCourtesy,
  generateCuratedMoodMemo,
} from './courtesyNotificationLogic.ts';
import { BookingInvitationData } from '../components/TeaInvitationModal';

describe('courtesyNotificationLogic', () => {
  const sampleBooking: BookingInvitationData = {
    id: 'YUN-SEAT-892104',
    roomName: '「月藏」THE MOON\'S SILENT RETREAT',
    date: '2026-11-08',
    timeSlot: '午席 (14:00 - 17:00)',
    guests: 2,
    sommelier: '苏婉',
    pairedTea: '荒野头春白毫银针',
    finalPrice: 612,
  };

  test('MOOD_ARCHETYPES defines 4 classical tea rendezvous moods', () => {
    assert.equal(MOOD_ARCHETYPES.length, 4);
    const ids = MOOD_ARCHETYPES.map((m) => m.id);
    assert.deepEqual(ids, ['pine-leisure', 'cleanse-heart', 'bosom-talk', 'solitary-zen']);
  });

  test('evaluateImminentBookingCourtesy detects bookings within 24 hours', () => {
    // 18 hours before 2026-11-08 14:00 -> 2026-11-07 20:00
    const now18hBefore = new Date(2026, 10, 7, 20, 0, 0);
    const result = evaluateImminentBookingCourtesy([sampleBooking], now18hBefore, false);

    assert.equal(result.isImminent, true);
    assert.equal(result.hoursRemaining, 18);
    assert.ok(result.notificationTitle.includes('雅席礼遇'));
    assert.ok(result.notificationMessage.includes('苏婉'));
  });

  test('evaluateImminentBookingCourtesy supports forceCourtesyPreview for simulated 24h push', () => {
    const nowFar = new Date(2026, 10, 5, 10, 0, 0);
    const result = evaluateImminentBookingCourtesy([sampleBooking], nowFar, true);

    assert.equal(result.isImminent, true);
    assert.equal(result.hoursRemaining, 24);
    assert.ok(result.notificationTitle.includes('24 小时'));
  });

  test('generateCuratedMoodMemo produces complete memo with verse, incense, and attire tip', () => {
    const memo = generateCuratedMoodMemo(sampleBooking, 'cleanse-heart');
    assert.equal(memo.moodLabel, '涤尘澄心');
    assert.ok(memo.poeticNote.includes('荒野头春白毫银针'));
    assert.ok(memo.incensePairing.includes('老山檀'));
    assert.ok(memo.attireTip.length > 5);
  });
});
