import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/catalog.js';
import { filterSearchProducts, normalizeSearch, searchColorOptions, searchProducts } from '../src/data/productSearch.js';

test('normalizes Arabic letters, diacritics, Persian digits and spacing', () => {
  assert.equal(normalizeSearch('  كِرِم‌ ي ۳۵ ١٥  '), 'کرم ی 35 15');
});

test('matches Persian brand names typed with Arabic characters', () => {
  assert.deepEqual(searchProducts(products, 'ميبلين').map(p => p.id), [2, 4, 5, 68, 69]);
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

test('finds mixed-language brand and model aliases', () => {
  assert.deepEqual(searchProducts(products, 'Maybelline اسکای‌های').map(product => product.id), [5]);
  assert.deepEqual(searchProducts(products, 'می بی لین skyhigh').map(product => product.id), [5]);
  assert.deepEqual(searchProducts(products, 'مایبلین وینیل اینک ۱۵').map(product => product.id), [4]);
});

test('combines stock, maximum budget and known shade without using packaging colors', () => {
  const catalog = products.filter(product => [2, 4, 5].includes(product.id)).map(product =>
    ({ ...product, inStock: product.id !== 5 }));
  assert.ok(searchColorOptions(catalog).some(option => option.id === 'black'));
  assert.deepEqual(filterSearchProducts(catalog, { inStock: true, maxPrice: 900000, color: 'peach' }).map(product => product.id), [4]);
  assert.deepEqual(filterSearchProducts(catalog, { inStock: true, maxPrice: null, color: 'black' }), []);
  assert.deepEqual(filterSearchProducts(catalog, { inStock: false, maxPrice: 100, color: '' }), []);
});
