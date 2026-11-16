import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/catalog.js';
import { findProduct, getProductDetails, productUrl } from '../src/data/productDetails.js';
import { searchProducts } from '../src/data/productSearch.js';

test('haircare contains exactly ten distinct products with dedicated detail pages', () => {
  const haircare = products.filter(product => product.category === 'haircare');
  assert.equal(haircare.length, 10);
  assert.equal(new Set(haircare.map(product => product.id)).size, 10);
  for (const product of haircare) {
    assert.equal(findProduct(productUrl(product)), product);
    assert.ok(getProductDetails(product).model);
    assert.ok(getProductDetails(product).type);
    assert.equal(new URL(product.sourceUrl).protocol, 'https:');
    assert.ok(getProductDetails(product).related.every(item => item.category === 'haircare' && item.id !== product.id));
  }
});
test('new hair products are searchable by model and Persian brand', () => {
  assert.equal(searchProducts(products, 'No.7 Bonding')[0].slug, 'olaplex-no-7-bonding-oil');
  assert.equal(searchProducts(products, 'کراستاس')[0].slug, 'kerastase-elixir-ultime-lhuile-originale');
});
