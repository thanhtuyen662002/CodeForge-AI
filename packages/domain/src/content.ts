export type PracticeCell = string | number | boolean | null;

export type LearnerPracticeQuestion =
  | {
      id: string;
      version: number;
      familyId: string;
      skillId: string;
      difficulty: number;
      prompt: string;
      type: 'single_choice';
      options: string[];
    }
  | {
      id: string;
      version: number;
      familyId: string;
      skillId: string;
      difficulty: number;
      prompt: string;
      type: 'code';
      language: 'python';
      starterCode: string;
      publicCases: Array<{ input: string }>;
    }
  | {
      id: string;
      version: number;
      familyId: string;
      skillId: string;
      difficulty: number;
      prompt: string;
      type: 'sql';
      dialect: 'postgresql';
      ordered: boolean;
      dataset: {
        asOf: string;
        columns: string[];
        rows: PracticeCell[][];
      };
      resultColumns: string[];
    };

const forbiddenAssessmentKeys = new Set([
  'hiddentests',
  'privatetests',
  'secretkey',
  'gradingkey',
  'productionanswerkey',
]);

function asObject(value: unknown, code: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(code);
  return value as Record<string, unknown>;
}

function requiredString(object: Record<string, unknown>, key: string, code: string): string {
  const value = object[key];
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error(code);
  return value;
}

function stringValue(object: Record<string, unknown>, key: string, code: string): string {
  const value = object[key];
  if (typeof value !== 'string') throw new Error(code);
  return value;
}

function stringArray(object: Record<string, unknown>, key: string, code: string): string[] {
  const value = object[key];
  if (!Array.isArray(value) || value.length === 0 ||
      value.some((item) => typeof item !== 'string' || item.length === 0)) throw new Error(code);
  return value as string[];
}

function assertNoForbiddenAssessmentKeys(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) assertNoForbiddenAssessmentKeys(item);
    return;
  }
  if (typeof value !== 'object' || value === null) return;
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenAssessmentKeys.has(key.toLowerCase())) {
      throw new Error('confidential_grading_material_forbidden');
    }
    assertNoForbiddenAssessmentKeys(child);
  }
}

function validateCells(rows: unknown, width: number, code: string): asserts rows is PracticeCell[][] {
  if (!Array.isArray(rows) || rows.length > 1000) throw new Error(code);
  for (const row of rows) {
    if (!Array.isArray(row) || row.length !== width) throw new Error(code);
    for (const value of row) {
      if (value !== null && typeof value !== 'string' && typeof value !== 'boolean' &&
          (typeof value !== 'number' || !Number.isFinite(value))) throw new Error(code);
    }
  }
}

function validateSingleChoice(item: Record<string, unknown>): void {
  const options = stringArray(item, 'options', 'invalid_choice_options');
  const correct = stringArray(item, 'correct', 'invalid_choice_answer');
  if (new Set(options).size !== options.length) throw new Error('duplicate_choice_option');
  if (correct.length !== 1 || !options.includes(correct[0] ?? '')) {
    throw new Error('single_choice_requires_one_valid_answer');
  }
}

function validateCode(item: Record<string, unknown>): void {
  if (item.language !== 'python') throw new Error('unsupported_practice_language');
  requiredString(item, 'starterCode', 'invalid_starter_code');
  requiredString(item, 'referenceCode', 'invalid_reference_code');
  const cases = item.publicCases;
  if (!Array.isArray(cases) || cases.length < 2 || cases.length > 20) {
    throw new Error('invalid_public_cases');
  }
  const inputs = new Set<string>();
  for (const candidate of cases) {
    const testCase = asObject(candidate, 'invalid_public_case');
    const input = stringValue(testCase, 'input', 'invalid_public_case_input');
    if (inputs.has(input)) throw new Error('duplicate_public_case_input');
    inputs.add(input);
    stringValue(testCase, 'expectedStdout', 'invalid_public_case_output');
  }
}

function validateSql(item: Record<string, unknown>): void {
  if (item.dialect !== 'postgresql') throw new Error('unsupported_sql_dialect');
  requiredString(item, 'referenceQuery', 'invalid_reference_query');
  if (typeof item.ordered !== 'boolean') throw new Error('invalid_sql_order_policy');

  const dataset = asObject(item.dataset, 'invalid_sql_dataset');
  const asOf = requiredString(dataset, 'asOf', 'invalid_dataset_time_anchor');
  if (!asOf.endsWith('Z') || Number.isNaN(Date.parse(asOf))) {
    throw new Error('invalid_dataset_time_anchor');
  }
  const columns = stringArray(dataset, 'columns', 'invalid_dataset_columns');
  if (new Set(columns).size !== columns.length) throw new Error('duplicate_dataset_column');
  validateCells(dataset.rows, columns.length, 'invalid_dataset_rows');

  const resultColumns = stringArray(item, 'resultColumns', 'invalid_result_columns');
  if (new Set(resultColumns).size !== resultColumns.length) throw new Error('duplicate_result_column');
  validateCells(item.expectedRows, resultColumns.length, 'invalid_expected_rows');
}

/**
 * Validate PUBLIC PRACTICE fixtures only.
 * A passing fixture remains draft content and is never suitable as a confidential test bank.
 */
export function validatePublicPracticeQuestion(
  question: unknown,
  skillIds: ReadonlySet<string>,
): void {
  assertNoForbiddenAssessmentKeys(question);
  const item = asObject(question, 'invalid_practice_question');
  requiredString(item, 'id', 'invalid_question_id');
  requiredString(item, 'familyId', 'invalid_question_family');
  const skillId = requiredString(item, 'skillId', 'invalid_question_skill');
  requiredString(item, 'prompt', 'invalid_question_prompt');
  requiredString(item, 'explanation', 'invalid_question_explanation');

  if (!skillIds.has(skillId)) throw new Error('unknown_question_skill');
  if (!Number.isInteger(item.version) || (item.version as number) <= 0) {
    throw new Error('invalid_question_version');
  }
  if (!Number.isInteger(item.difficulty) || (item.difficulty as number) < 1 ||
      (item.difficulty as number) > 10) {
    throw new Error('invalid_question_difficulty');
  }
  if (item.provenance !== 'original-practice') throw new Error('invalid_question_provenance');
  if (item.reviewStatus !== 'draft') throw new Error('unreviewed_fixture_must_remain_draft');

  if (item.type === 'single_choice') return validateSingleChoice(item);
  if (item.type === 'code') return validateCode(item);
  if (item.type === 'sql') return validateSql(item);
  throw new Error('unsupported_practice_question_type');
}

/**
 * Build the pre-submit learner DTO from a validated practice fixture.
 * Correct answers, reference solutions, expected outputs/rows and explanations stay server-side.
 */
export function toLearnerPracticeQuestion(
  question: unknown,
  skillIds: ReadonlySet<string>,
): LearnerPracticeQuestion {
  validatePublicPracticeQuestion(question, skillIds);
  const item = asObject(question, 'invalid_practice_question');
  const common = {
    id: item.id as string,
    version: item.version as number,
    familyId: item.familyId as string,
    skillId: item.skillId as string,
    difficulty: item.difficulty as number,
    prompt: item.prompt as string,
  };

  if (item.type === 'single_choice') {
    return {
      ...common,
      type: 'single_choice',
      options: [...(item.options as string[])],
    };
  }

  if (item.type === 'code') {
    return {
      ...common,
      type: 'code',
      language: 'python',
      starterCode: item.starterCode as string,
      publicCases: (item.publicCases as unknown[]).map((candidate) => ({
        input: asObject(candidate, 'invalid_public_case').input as string,
      })),
    };
  }

  const dataset = asObject(item.dataset, 'invalid_sql_dataset');
  return {
    ...common,
    type: 'sql',
    dialect: 'postgresql',
    ordered: item.ordered as boolean,
    dataset: {
      asOf: dataset.asOf as string,
      columns: [...(dataset.columns as string[])],
      rows: (dataset.rows as PracticeCell[][]).map((row) => [...row]),
    },
    resultColumns: [...(item.resultColumns as string[])],
  };
}
