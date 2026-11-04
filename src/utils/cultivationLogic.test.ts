import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCultivationProgress,
  CULTIVATION_STAGES,
  CULTIVATION_STAGE_ORDER,
} from './cultivationLogic';

test('New user with 0 points and 0 bookings starts at 初芽 (chouya)', () => {
  const result = calculateCultivationProgress(0, 0);

  assert.equal(result.currentStageKey, 'chouya');
  assert.equal(result.currentStage.name, '初芽');
  assert.equal(result.nextStage?.name, '问茗');
  assert.equal(result.isMaxStage, false);
  assert.equal(result.pointsRemaining, 1000);
  assert.equal(result.bookingsRemaining, 1);
  assert.equal(result.stageBadges[0].isUnlocked, true);
  assert.equal(result.stageBadges[0].isCurrent, true);
  assert.equal(result.stageBadges[1].isUnlocked, false);
});

test('User with high points but 0 bookings remains at 初芽 due to dual criteria', () => {
  const result = calculateCultivationProgress(5000, 0);

  assert.equal(result.currentStageKey, 'chouya');
  assert.equal(result.pointsMet, true);
  assert.equal(result.bookingsMet, false);
  assert.equal(result.pointsRemaining, 0);
  assert.equal(result.bookingsRemaining, 1);
  assert.ok(result.summaryHint.includes('积分已达成'));
  assert.ok(result.summaryHint.includes('尚需 1 次茶室预约'));
});

test('User with enough bookings but insufficient points remains at lower stage', () => {
  // To reach 识器 requires 3500 points and 2 bookings.
  // With 2000 points and 3 bookings, user is at 问茗 (requires 1000 points, 1 booking).
  const result = calculateCultivationProgress(2000, 3);

  assert.equal(result.currentStageKey, 'wenming');
  assert.equal(result.nextStage?.name, '识器');
  assert.equal(result.pointsMet, false);
  assert.equal(result.bookingsMet, true);
  assert.equal(result.pointsRemaining, 1500);
  assert.equal(result.bookingsRemaining, 0);
  assert.ok(result.summaryHint.includes('茶室预约已达成'));
  assert.ok(result.summaryHint.includes('尚需 1,500 积分'));
});

test('User reaching 识器 exact boundary (3500 points, 2 bookings)', () => {
  const result = calculateCultivationProgress(3500, 2);

  assert.equal(result.currentStageKey, 'shiqi');
  assert.equal(result.currentStage.name, '识器');
  assert.equal(result.nextStage?.name, '承艺');
  assert.equal(result.isMaxStage, false);
  assert.equal(result.stageBadges[0].isUnlocked, true);
  assert.equal(result.stageBadges[1].isUnlocked, true);
  assert.equal(result.stageBadges[2].isUnlocked, true);
  assert.equal(result.stageBadges[2].isCurrent, true);
  assert.equal(result.stageBadges[3].isUnlocked, false);
});

test('Grandmaster stage 宗师 (zongshi) when points >= 18000 and bookings >= 8', () => {
  const result = calculateCultivationProgress(25000, 10);

  assert.equal(result.currentStageKey, 'zongshi');
  assert.equal(result.currentStage.name, '宗师');
  assert.equal(result.nextStage, null);
  assert.equal(result.isMaxStage, true);
  assert.equal(result.overallProgressPercent, 100);
  assert.equal(result.stageBadges.every((b) => b.isUnlocked), true);
  assert.ok(result.summaryHint.includes('太虚归朴'));
});

test('Stage badges list contains all 5 badges in correct order', () => {
  const result = calculateCultivationProgress(6850, 2);

  assert.equal(result.stageBadges.length, 5);
  assert.deepEqual(
    result.stageBadges.map((b) => b.name),
    ['初芽', '问茗', '识器', '承艺', '宗师']
  );
  assert.equal(result.currentStage.name, '识器');
});
