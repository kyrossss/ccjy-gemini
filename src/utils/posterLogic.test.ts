import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  POSTER_THEMES,
  getSensoryForPairedTea,
  generateCuratedPosterData,
} from './posterLogic.ts';
import { BookingInvitationData } from '../components/TeaInvitationModal';

describe('posterLogic', () => {
  test('POSTER_THEMES contains all 3 oriental aesthetic themes', () => {
    assert.equal(POSTER_THEMES.length, 3);
    const ids = POSTER_THEMES.map((t) => t.id);
    assert.deepEqual(ids, ['ink', 'xuan', 'gold']);
  });

  test('getSensoryForPairedTea correctly maps rock tea, dancong, and white tea', () => {
    const rockSensory = getSensoryForPairedTea('正岩老枞水仙');
    assert.ok(rockSensory.radarScores.throatCharm >= 95);
    assert.ok(rockSensory.keyDescriptors.includes('三坑岩骨'));

    const dancongSensory = getSensoryForPairedTea('诸心·凤凰单丛');
    assert.ok(dancongSensory.radarScores.aroma >= 95);
    assert.ok(dancongSensory.keyDescriptors.includes('高山蜜韵') || dancongSensory.keyDescriptors.includes('幽兰水栀'));

    const whiteSensory = getSensoryForPairedTea('荒野白毫银针');
    assert.ok(whiteSensory.radarScores.sweetness >= 90);
  });

  test('generateCuratedPosterData formats poem, seal, and sensory chart for booking', () => {
    const mockBooking: BookingInvitationData = {
      id: 'YUN-SEAT-892104',
      roomName: '「月藏」THE MOON\'S SILENT RETREAT',
      date: '2026-11-08',
      timeSlot: '午席 (14:00 - 17:00)',
      guests: 2,
      sommelier: '苏婉',
      pairedTea: '荒野头春白毫银针',
      finalPrice: 612,
    };

    const poster = generateCuratedPosterData(mockBooking, 'ink');
    assert.ok(poster.poeticTitle.length > 0);
    assert.equal(poster.invitationVerse.length, 4);
    assert.equal(poster.sealText, '春城雅席');
    assert.ok(poster.teaSensory.radarScores.sweetness >= 80);
    assert.ok(poster.brewingRitual.length > 0);
  });
});
