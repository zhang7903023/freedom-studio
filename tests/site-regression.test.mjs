import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('JSON-LD preserves text without allowing a closing script tag', () => {
  const source = read('src/components/SEO.astro');
  const expression = source.match(/set:html=\{(JSON\.stringify\(data\)[^}]+)\}/)[1];
  const data = { headline: '</script><img src=x onerror=alert(1)> & 中文' };
  const serialized = vm.runInNewContext(expression, { data });
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), data);
});

test('theme initialization tolerates unavailable browser storage', () => {
  const script = read('src/layouts/BaseLayout.astro').match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
  assert.doesNotThrow(() => vm.runInNewContext(script, {
    localStorage: { getItem() { throw new Error('SecurityError'); } },
  }));
});

test('theme button updates accessible state when storage write fails', () => {
  const script = read('src/components/Header.astro').match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/\(\): void/g, '()').replace(/\(open: boolean\): void/g, '(open)');
  const handlers = {}, attrs = {}; let dark = false;
  class Button { setAttribute(k, v) { attrs[k] = v; } addEventListener(k, fn) { handlers[k] = fn; } }
  const button = new Button();
  vm.runInNewContext(script, {
    HTMLButtonElement: Button,
    document: { getElementById: id => id === 'theme-toggle' ? button : null, querySelector: () => null,
      documentElement: { classList: { contains: () => dark, toggle: () => dark = !dark } } },
    localStorage: { setItem() { throw new Error('SecurityError'); } },
  });
  handlers.click();
  assert.equal(attrs['aria-pressed'], 'true');
  assert.equal(attrs['aria-label'], '切换到浅色模式');
});
