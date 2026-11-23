import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSkincareRoutine, skinTypes } from '../src/data/skincareRoutine.js';

test('every skin type has an ordered morning routine using in-stock catalog items', () => {
  for (const [skin] of skinTypes) {
    const { routine } = buildSkincareRoutine(skin, []);
    assert.deepEqual(routine.items.map(item => item.label), ['شوینده', 'مرطوب‌کننده', 'ضدآفتاب صبح']);
    assert.ok(routine.items.every(item => item.product.inStock && item.reason && item.use));
    assert.equal(routine.total, routine.items.reduce((sum, item) => sum + item.product.price, 0));
  }
});

test('serum follows cleansing and is dropped before essential steps if the budget is tight', () => {
  const full = buildSkincareRoutine('oily', ['shine', 'pores'], 5_000_000);
  assert.deepEqual(full.routine.items.map(item => item.label), ['شوینده', 'سرم', 'مرطوب‌کننده', 'ضدآفتاب صبح']);
  assert.equal(full.routine.items[1].product.slug, 'ordinary-niacinamide-10-zinc-1');
  const basic = buildSkincareRoutine('oily', ['shine', 'pores'], full.minimum);
  assert.equal(basic.routine.items.length, 3);
  assert.equal(basic.routine.total, full.minimum);
  assert.equal(buildSkincareRoutine('oily', ['shine'], full.minimum - 1).routine, null);
});

test('dryness and sensitivity favor a hydrating serum over the oil-focused option', () => {
  const { routine } = buildSkincareRoutine('combination', ['dryness', 'sensitivity', 'shine']);
  assert.equal(routine.items[1].product.slug, 'ordinary-hyaluronic-acid-2-b5');
});
