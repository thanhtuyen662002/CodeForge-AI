import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateCandidate } from '../scripts/check-content-publication-safety.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = name => JSON.parse(readFileSync(path.join(root, 'tests/fixtures/content-safety', name), 'utf8'));
const checker = path.join(root, 'scripts/check-content-publication-safety.mjs');

test('accepts a synthetic candidate with explicit provenance and classification', () => {
  assert.deepEqual(validateCandidate(fixture('public-item.valid.json')), []);
});

test('rejects missing provenance', () => {
  assert.ok(validateCandidate(fixture('missing-provenance.invalid.json')).some(error => error.includes('provenance')));
});

test('rejects missing FACT / INFERENCE / PRACTICE_CONTENT classification', () => {
  assert.ok(validateCandidate(fixture('missing-classification.invalid.json')).some(error => error.includes('classification')));
});

test('rejects nested private grading / expected-output fields', () => {
  const errors = validateCandidate(fixture('hidden-answer.invalid.json'));
  assert.ok(errors.some(error => error.includes('forbidden answer/grading/private field')));
});

test('rejects duplicate JSON object keys before parsing, including nested escaped equivalents', () => {
  const raw = readFileSync(path.join(root, 'tests/fixtures/content-safety/duplicate-key-hidden-answer.invalid.json'), 'utf8');
  const errors = validateCandidate(raw);
  assert.ok(errors.some(error => error.includes('duplicate JSON object key')), errors.join('\n'));

  const nestedEscaped = '{"items":[{"key":1,"\\u006bey":2}]}';
  const nestedErrors = validateCandidate(nestedEscaped);
  assert.ok(nestedErrors.some(error => error.includes('duplicate JSON object key')), nestedErrors.join('\n'));
});

test('rejects unknown public fields instead of silently widening the contract', () => {
  const item = fixture('public-item.valid.json');
  item.unreviewedExtension = { value: true };
  assert.ok(validateCandidate(item).some(error => error.includes('unknown field')));
});

test('rejects duplicate skills and invalid difficulty', () => {
  const item = fixture('public-item.valid.json');
  item.skills = ['retry-safety', 'retry-safety'];
  item.difficulty = 11;
  const errors = validateCandidate(item);
  assert.ok(errors.some(error => error.includes('skills')));
  assert.ok(errors.some(error => error.includes('difficulty')));
});

test('rejects impossible provenance calendar dates', () => {
  const item = fixture('public-item.valid.json');
  item.provenance.checkedAt = '2026-02-31';
  assert.ok(validateCandidate(item).some(error => error.includes('real ISO calendar date')));
});

test('CLI exits zero for valid fixture and nonzero for forbidden answer data', () => {
  const good = spawnSync(process.execPath, [checker, path.join(root, 'tests/fixtures/content-safety/public-item.valid.json')], { encoding: 'utf8' });
  const bad = spawnSync(process.execPath, ['scripts/check-content-publication-safety.mjs', 'tests/fixtures/content-safety/hidden-answer.invalid.json'], { cwd: root, encoding: 'utf8' });
  assert.equal(good.status, 0, good.stderr);
  assert.match(good.stdout, /human content review and release authorization are still required/);
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /forbidden answer\/grading\/private field/);
});

test('CLI fails closed on a duplicate allowed key that hides nested grading data', () => {
  const duplicate = spawnSync(process.execPath, [checker, path.join(root, 'tests/fixtures/content-safety/duplicate-key-hidden-answer.invalid.json')], { encoding: 'utf8' });
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /duplicate JSON object key/);
});
