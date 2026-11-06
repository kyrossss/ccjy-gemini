import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TOTAL_CHARCOAL_BREW_SECONDS,
  CHARCOAL_BREW_STAGES,
  getCharcoalBrewStage,
  formatBrewTime,
  calculateBrewProgressRatio,
} from './charcoalBrewLogic.ts';

test('charcoalBrewLogic constants and formatting', () => {
  assert.equal(TOTAL_CHARCOAL_BREW_SECONDS, 1800);
  assert.equal(CHARCOAL_BREW_STAGES.length, 4);

  assert.equal(formatBrewTime(1800), '30:00');
  assert.equal(formatBrewTime(125), '02:05');
  assert.equal(formatBrewTime(0), '00:00');
  assert.equal(formatBrewTime(-10), '00:00');
});

test('calculateBrewProgressRatio bounds progress from 0 to 1', () => {
  assert.equal(calculateBrewProgressRatio(0), 0);
  assert.equal(calculateBrewProgressRatio(900), 0.5);
  assert.equal(calculateBrewProgressRatio(1800), 1);
  assert.equal(calculateBrewProgressRatio(2000), 1);
});

test('getCharcoalBrewStage identifies correct stage across 30 minutes', () => {
  // Stage 0: 0 - 8 mins (0 - 480s)
  const stage0 = getCharcoalBrewStage(100);
  assert.equal(stage0.index, 0);
  assert.equal(stage0.name, '榄炭引火');

  // Stage 1: 8 - 16 mins (480 - 960s)
  const stage1 = getCharcoalBrewStage(600);
  assert.equal(stage1.index, 1);
  assert.equal(stage1.name, '陶铫温炉');

  // Stage 2: 16 - 24 mins (960 - 1440s)
  const stage2 = getCharcoalBrewStage(1000);
  assert.equal(stage2.index, 2);
  assert.equal(stage2.name, '蟹眼微沸');

  // Stage 3: 24 - 30 mins (1440 - 1800s)
  const stage3 = getCharcoalBrewStage(1600);
  assert.equal(stage3.index, 3);
  assert.equal(stage3.name, '候汤吉时');

  // At or beyond 1800s
  const stageFinal = getCharcoalBrewStage(1800);
  assert.equal(stageFinal.index, 3);
  assert.equal(stageFinal.name, '候汤吉时');
});
