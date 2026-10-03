import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePublicPracticeQuestion } from '../dist/content.js';

const skills = new Set(['logic.sequence', 'python.conditions', 'sql.filter']);
const base = {
  id: 'q1',
  version: 1,
  familyId: 'family-1',
  skillId: 'python.conditions',
  difficulty: 2,
  prompt: 'Prompt',
  explanation: 'Explanation',
  provenance: 'original-practice',
  reviewStatus: 'draft',
};

test('public Python practice requires deterministic public cases', () => {
  assert.doesNotThrow(() => validatePublicPracticeQuestion({
    ...base,
    type: 'code',
    language: 'python',
    starterCode: 'value = int(input())',
    referenceCode: 'print(value)',
    publicCases: [
      { input: '1\n', expectedStdout: '1\n' },
      { input: '2\n', expectedStdout: '2\n' },
    ],
  }, skills));

  assert.throws(() => validatePublicPracticeQuestion({
    ...base,
    type: 'code',
    language: 'python',
    starterCode: 'pass',
    referenceCode: 'pass',
    publicCases: [{ input: '1\n', expectedStdout: '1\n' }],
  }, skills), /invalid_public_cases/);
});

test('public SQL practice pins time anchor and row-order policy', () => {
  assert.doesNotThrow(() => validatePublicPracticeQuestion({
    ...base,
    id: 'sql-1',
    skillId: 'sql.filter',
    type: 'sql',
    dialect: 'postgresql',
    referenceQuery: 'select name, active from learners where active = true',
    ordered: false,
    dataset: {
      asOf: '2026-01-15T00:00:00Z',
      columns: ['name', 'active'],
      rows: [['An', true], ['Binh', false]],
    },
    expectedRows: [['An', true]],
  }, skills));

  assert.throws(() => validatePublicPracticeQuestion({
    ...base,
    id: 'sql-2',
    skillId: 'sql.filter',
    type: 'sql',
    dialect: 'postgresql',
    referenceQuery: 'select 1',
    ordered: false,
    dataset: { asOf: 'today', columns: ['value'], rows: [[1]] },
    expectedRows: [[1]],
  }, skills), /invalid_dataset_time_anchor/);
});

test('public practice rejects confidential grading material', () => {
  assert.throws(() => validatePublicPracticeQuestion({
    ...base,
    type: 'single_choice',
    options: ['a', 'b'],
    correct: ['a'],
    hiddenTests: [{ input: 'secret' }],
  }, skills), /confidential_grading_material_forbidden/);
});

test('single-choice fixture rejects duplicate options and invalid answer', () => {
  assert.throws(() => validatePublicPracticeQuestion({
    ...base,
    type: 'single_choice',
    options: ['a', 'a'],
    correct: ['a'],
  }, skills), /duplicate_choice_option/);
  assert.throws(() => validatePublicPracticeQuestion({
    ...base,
    type: 'single_choice',
    options: ['a', 'b'],
    correct: ['c'],
  }, skills), /single_choice_requires_one_valid_answer/);
});
