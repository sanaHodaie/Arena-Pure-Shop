import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('storefront always initializes in light mode without storage or system access', () => {
 const document = { documentElement: { dataset: {}, style: {} } };
 vm.runInNewContext(fs.readFileSync(new URL('../public/theme-init.js', import.meta.url), 'utf8'), { document });
 assert.equal(document.documentElement.dataset.theme, 'light');
 assert.equal(document.documentElement.style.colorScheme, 'light');
});
