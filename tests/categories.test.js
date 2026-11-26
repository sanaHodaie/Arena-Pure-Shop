import test from 'node:test';
import assert from 'node:assert/strict';
import { categoryPages, categoryUrl, findCategory } from '../src/data/categories.js';
import { products } from '../src/data/catalog.js';
import { getBestSellerProducts } from '../src/data/mockData.js';
import { findProduct, getProductDetails, productUrl } from '../src/data/productDetails.js';

test('both supported categories resolve from direct and trailing-slash URLs', () => {
  for (const category of Object.keys(categoryPages)) {
    assert.equal(findCategory(categoryUrl(category)), category);
    assert.equal(findCategory(`${categoryUrl(category)}/`), category);
  }
  for (const path of ['/', '/categories/missing', '/categories/skincare/extra']) assert.equal(findCategory(path), null);
});
test('skincare has ten distinct products with complete model identities and dedicated routes', () => {
  const items = products.filter(product => product.category === 'skincare');
  assert.equal(items.length, 10);
  assert.equal(new Set(items.map(product => product.slug)).size, 10);
  for (const product of items) {
    assert.equal(findProduct(productUrl(product)), product);
    assert.ok(getProductDetails(product).type && getProductDetails(product).model);
  }
});
test('new category products do not silently change the home best-seller selection', () => {
  assert.ok(getBestSellerProducts().every(product => product.id <= 12 && product.category !== 'haircare'));
});
