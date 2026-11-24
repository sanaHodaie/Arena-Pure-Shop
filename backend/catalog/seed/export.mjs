import { writeFile } from 'node:fs/promises';
import { products } from '../../../src/data/catalog.js';
import { categoryPages } from '../../../src/data/categories.js';
import { getProductDetails } from '../../../src/data/productDetails.js';
import { productSuitability } from '../../../src/data/productSuitability.js';

const seed = {
  categories: Object.entries(categoryPages).map(([slug, category]) => ({ slug, ...category })),
  products: products.map(product => {
    const { type, model, family, shade, color, undertone, shadeNote, extra } = getProductDetails(product);
    return {
      ...product, type, model, family, shade, color, undertone, shadeNote, extra,
      suitability: productSuitability[product.id],
    };
  }),
};

await writeFile(new URL('./storefront.json', import.meta.url), JSON.stringify(seed, null, 2) + '\n');
