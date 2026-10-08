// Translation structure, not native-language approval or product validation.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const context = { window: {} };
vm.runInNewContext(readFileSync(new URL('../docs/blueprint/prototype/messages.js', import.meta.url), 'utf8'), context, { timeout: 1000 });
const catalog = context.window.CodeForgeCopy;
const tags = Array.from(catalog.languages, item => item.tag);
assert.equal(new Set(tags).size, tags.length);
assert.ok(tags.includes(catalog.fallback_locale));
assert.ok(tags.includes(catalog.source_locale));
const state = JSON.parse(readFileSync(new URL('../docs/PROJECT_STATE.yaml', import.meta.url), 'utf8'));
const model = JSON.parse(readFileSync(new URL('../docs/blueprint/model.json', import.meta.url), 'utf8'));
assert.deepEqual(tags, state.localization.ui_locales, 'Current state locale list');
assert.deepEqual(tags, model.ui_locales, 'Blueprint locale list');
assert.equal(Object.keys(catalog.messages).length, state.localization.prototype_message_count);
const sourceValues = new Set();
for (const [id, message] of Object.entries(catalog.messages)) {
  assert.match(id, /^copy\d{3}$/);
  assert.deepEqual(Object.keys(message).sort(), [...tags].sort(), `${id}: exact locale coverage`);
  assert.ok(!sourceValues.has(message[catalog.source_locale]), `${id}: duplicate source text`);
  sourceValues.add(message[catalog.source_locale]);
  for (const tag of tags) {
    assert.ok(typeof message[tag] === 'string' && message[tag].trim(), `${id}/${tag}: empty copy`);
    assert.ok(!/[<>]/.test(message[tag]), `${id}/${tag}: translation must be plain text`);
  }
}
console.log(`Locale integrity passed: ${tags.length} languages, ${Object.keys(catalog.messages).length} complete message IDs. Draft translations require human review.`);
