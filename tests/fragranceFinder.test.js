import assert from 'node:assert/strict';
import test from 'node:test';
import { findFragrances } from '../src/data/fragranceFinder.js';

test('fragrance suggestions honor all filters and explain each matching product', () => {
  const matches = findFragrances('fresh', 'day', 6_800_000);
  assert.equal(matches.length, 3);
  assert.ok(matches.every(({ product, families, occasions, reason }) =>
    product.category === 'fragrance' && product.inStock && product.price <= 6_800_000 &&
    families.includes('fresh') && occasions.includes('day') && reason));
  assert.deepEqual(findFragrances('warm', 'day', Infinity), []);
  assert.deepEqual(findFragrances('', '', 6_000_000), []);
});
