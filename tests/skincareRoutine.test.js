import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSkincareRoutine, skinTypes } from '../src/data/skincareRoutine.js';

const keys = steps => steps.map(step => step.key);

test('every skin type has ordered morning and evening routines with frequency and a nonduplicated total', () => {
  for (const [skin] of skinTypes) {
    const { routine } = buildSkincareRoutine(skin, []);
    assert.deepEqual(keys(routine.morning), ['cleanser', 'moisturizer', 'sunscreen']);
    assert.deepEqual(keys(routine.evening), ['cleanser', 'moisturizer']);
    const steps = [...routine.morning, ...routine.evening];
    assert.ok(steps.every(step => step.product.inStock && step.reason && step.use && step.frequency));
    const prices = new Map(steps.map(step => [step.product.id, step.product.price]));
    assert.equal(routine.total, [...prices.values()].reduce((sum, price) => sum + price, 0));
  }
});

test('niacinamide follows evening cleansing and is dropped before essential steps if the budget is tight', () => {
  const full = buildSkincareRoutine('oily', ['shine', 'pores'], 5_000_000);
  assert.deepEqual(keys(full.routine.morning), ['cleanser', 'moisturizer', 'sunscreen']);
  assert.deepEqual(keys(full.routine.evening), ['cleanser', 'serum', 'moisturizer']);
  assert.equal(full.routine.evening[1].product.slug, 'ordinary-niacinamide-10-zinc-1');
  assert.match(full.routine.evening[1].frequency, /۲ تا ۳ شب/);
  const basic = buildSkincareRoutine('oily', ['shine', 'pores'], full.minimum);
  assert.equal(basic.routine.includesSerum, false);
  assert.equal(basic.routine.total, full.minimum);
  assert.equal(buildSkincareRoutine('oily', ['shine'], full.minimum - 1).routine, null);
});

test('dryness and sensitivity favor a hydrating serum before morning moisturizer', () => {
  const { routine } = buildSkincareRoutine('combination', ['dryness', 'sensitivity', 'shine']);
  assert.deepEqual(keys(routine.morning), ['cleanser', 'serum', 'moisturizer', 'sunscreen']);
  assert.equal(routine.morning[1].product.slug, 'ordinary-hyaluronic-acid-2-b5');
  assert.deepEqual(keys(routine.evening), ['cleanser', 'moisturizer']);
});
