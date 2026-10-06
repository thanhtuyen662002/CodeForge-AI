import test from 'node:test';
import assert from 'node:assert/strict';

test('CF-01 negative control must fail', () => {
  assert.fail('Intentional failure to prove the protected main branch rejects a red merge-gate.');
});
