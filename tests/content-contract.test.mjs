import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toLearnerPracticeQuestion,
  validatePublicPracticeQuestion,
} from '../dist/content.js';

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

test('public Python practice permits deterministic empty stdin/stdout', () => {
  assert.doesNotThrow(() => validatePublicPracticeQuestion({
    ...base,
    id: 'python-empty-io',
    type: 'code',
    language: 'python',
    starterCode: 'print("ready", end="")',
    referenceCode: 'print("ready", end="")',
    publicCases: [
      { input: '', expectedStdout: 'ready' },
      { input: 'ignored\n', expectedStdout: '' },
    ],
  }, skills));
});

test('public SQL practice pins time anchor, result projection and row-order policy', () => {
  assert.doesNotThrow(() => validatePublicPracticeQuestion({
    ...base,
    id: 'sql-1',
    skillId: 'sql.filter',
    type: 'sql',
    dialect: 'postgresql',
    referenceQuery: 'select name from learners where active = true',
    ordered: false,
    dataset: {
      asOf: '2026-01-15T00:00:00Z',
      columns: ['name', 'active'],
      rows: [['An', true], ['Binh', false]],
    },
    resultColumns: ['name'],
    expectedRows: [['An']],
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
    resultColumns: ['value'],
    expectedRows: [[1]],
  }, skills), /invalid_dataset_time_anchor/);

  assert.throws(() => validatePublicPracticeQuestion({
    ...base,
    id: 'sql-3',
    skillId: 'sql.filter',
    type: 'sql',
    dialect: 'postgresql',
    referenceQuery: 'select name from learners',
    ordered: false,
    dataset: {
      asOf: '2026-01-15T00:00:00Z',
      columns: ['name', 'active'],
      rows: [['An', true]],
    },
    resultColumns: ['name'],
    expectedRows: [['An', true]],
  }, skills), /invalid_expected_rows/);
});

test('learner code DTO excludes reference solution, expected outputs and explanation', () => {
  const dto = toLearnerPracticeQuestion({
    ...base,
    type: 'code',
    language: 'python',
    starterCode: 'pass',
    referenceCode: 'print("secret solution")',
    publicCases: [
      { input: '', expectedStdout: 'answer' },
      { input: 'x\n', expectedStdout: 'other' },
    ],
  }, skills);

  assert.deepEqual(dto, {
    id: 'q1',
    version: 1,
    familyId: 'family-1',
    skillId: 'python.conditions',
    difficulty: 2,
    prompt: 'Prompt',
    type: 'code',
    language: 'python',
    starterCode: 'pass',
    publicCases: [{ input: '' }, { input: 'x\n' }],
  });
  const serialized = JSON.stringify(dto);
  assert.doesNotMatch(serialized, /referenceCode|expectedStdout|Explanation|secret solution|answer/);
});

test('learner SQL DTO excludes reference query, expected rows and explanation', () => {
  const dto = toLearnerPracticeQuestion({
    ...base,
    id: 'sql-dto',
    skillId: 'sql.filter',
    type: 'sql',
    dialect: 'postgresql',
    referenceQuery: 'select secret from grading',
    ordered: true,
    dataset: {
      asOf: '2026-01-15T00:00:00Z',
      columns: ['name', 'active'],
      rows: [['An', true], ['Binh', false]],
    },
    resultColumns: ['name'],
    expectedRows: [['An']],
  }, skills);

  assert.deepEqual(dto, {
    id: 'sql-dto',
    version: 1,
    familyId: 'family-1',
    skillId: 'sql.filter',
    difficulty: 2,
    prompt: 'Prompt',
    type: 'sql',
    dialect: 'postgresql',
    ordered: true,
    dataset: {
      asOf: '2026-01-15T00:00:00Z',
      columns: ['name', 'active'],
      rows: [['An', true], ['Binh', false]],
    },
    resultColumns: ['name'],
  });
  assert.doesNotMatch(JSON.stringify(dto), /referenceQuery|expectedRows|Explanation|grading/);
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
