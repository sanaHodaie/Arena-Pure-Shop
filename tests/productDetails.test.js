import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/catalog.js';
import { findProduct, getProductDetails, productUrl } from '../src/data/productDetails.js';

test('every catalog product resolves from its unique shareable URL', () => {
  assert.equal(new Set(products.map(productUrl)).size, products.length);
  for (const product of products) {
    assert.equal(findProduct(productUrl(product)), product);
    assert.equal(findProduct(`${productUrl(product)}/`), product);
    const details = getProductDetails(product);
    assert.ok(details.model && details.type);
    assert.equal(details.gallery[0].src, product.image);
    assert.ok(!details.related.some(item => item.id === product.id));
  }
});
test('unknown and malformed product routes do not resolve to another product', () => {
  for (const path of ['/', '/products/', '/products/missing', '/products/maybelline-vinyl-ink-35-cheeky/extra']) assert.equal(findProduct(path), null);
});
test('Vinyl Ink variants preserve individual colors, images and cart identities', () => {
  const cheeky = findProduct('/products/maybelline-vinyl-ink-35-cheeky');
  const peachy = findProduct('/products/maybelline-vinyl-ink-15-peachy');
  assert.deepEqual(getProductDetails(cheeky).variants.map(item => item.id), [2, 4]);
  assert.deepEqual(getProductDetails(peachy).variants.map(item => item.id), [2, 4]);
  assert.notEqual(cheeky.image, peachy.image);
  assert.equal(getProductDetails(cheeky).shade, '35 Cheeky');
  assert.equal(getProductDetails(peachy).shade, '15 Peachy');
  assert.equal(getProductDetails(products[4]).variants.length, 0);
});
