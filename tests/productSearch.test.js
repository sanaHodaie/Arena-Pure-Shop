import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/catalog.js';
import { normalizeSearch, searchProducts } from '../src/data/productSearch.js';

test('normalizes Arabic letters, diacritics, Persian digits and spacing', () => {
  assert.equal(normalizeSearch('  كِرِم‌ ي ۳۵ ١٥  '), 'کرم ی 35 15');
});

test('matches Persian brand names typed with Arabic characters', () => {
  assert.deepEqual(searchProducts(products, 'ميبلين').map(p => p.id), [2, 4, 5]);
});

test('matches English product names regardless of case or token order', () => {
  assert.deepEqual(searchProducts(products, 'CHEEKY vinyl').map(p => p.id), [2]);
});

test('matches Persian shade numbers against English catalog numbers', () => {
  assert.deepEqual(searchProducts(products, 'میبلین ۳۵').map(p => p.id), [2]);
});

test('returns all products for whitespace and no products for unknown queries', () => {
  assert.equal(searchProducts(products, '  '), products);
  assert.deepEqual(searchProducts(products, 'no-such-product-xyz'), []);
});
