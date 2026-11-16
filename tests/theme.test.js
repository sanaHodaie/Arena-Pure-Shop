import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const script = readFileSync(new URL('../public/theme-init.js', import.meta.url), 'utf8');
function initialTheme(saved, systemDark, storageBlocked = false) {
  const document = { documentElement: { dataset: {}, style: {} } };
  vm.runInNewContext(script, { document, localStorage: { getItem() { if (storageBlocked) throw Error('blocked'); return saved; } }, matchMedia: () => ({ matches: systemDark }) });
  return document.documentElement;
}
test('explicit saved theme wins over device preference before rendering', () => {
  assert.equal(initialTheme('light', true).dataset.theme, 'light');
  assert.equal(initialTheme('dark', false).dataset.theme, 'dark');
});
test('missing, invalid and inaccessible storage fall back to device preference', () => {
  for (const saved of [null, 'invalid']) {
    assert.equal(initialTheme(saved, true).dataset.theme, 'dark');
    assert.equal(initialTheme(saved, false).dataset.theme, 'light');
  }
  assert.equal(initialTheme(null, true, true).style.colorScheme, 'dark');
});
