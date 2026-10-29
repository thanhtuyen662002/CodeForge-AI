#!/usr/bin/env node
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_FILE_BYTES = 64 * 1024;
const ALLOWED_ITEM_KEYS = new Set([
  'schemaVersion', 'itemId', 'version', 'classification', 'provenance',
  'title', 'prompt', 'skills', 'difficulty', 'visibility',
]);
const ALLOWED_PROVENANCE_KEYS = new Set(['kind', 'source', 'license', 'author', 'checkedAt']);
const CLASSIFICATIONS = new Set(['FACT', 'INFERENCE', 'PRACTICE_CONTENT']);
const PROVENANCE_KINDS = new Set(['original', 'licensed', 'public-domain', 'owner-authorized']);
const FORBIDDEN_KEYS = new Set([
  'answer', 'answers', 'answerkey', 'correctanswer', 'expectedoutput', 'expectedresults',
  'referencesolution', 'solution', 'solutions', 'solutionkey', 'hiddentest', 'hiddentests',
  'grading', 'gradingdata', 'gradingkey', 'grader', 'privateanswer', 'privateanswers',
  'privategrading', 'rubrickey', 'secret', 'secrets', 'servicerolekey',
]);

const normalizeKey = key => key.replace(/[^a-z0-9]/gi, '').toLowerCase();
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonEmptyString = value => typeof value === 'string' && value.trim().length > 0;

function scanForbiddenKeys(value, location, errors, depth = 0) {
  if (depth > 30) {
    errors.push(location + ': maximum object nesting depth exceeded');
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForbiddenKeys(item, location + '[' + index + ']', errors, depth + 1));
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(normalizeKey(key))) {
      errors.push(location + '.' + key + ': forbidden answer/grading/private field');
    }
    scanForbiddenKeys(child, location + '.' + key, errors, depth + 1);
  }
}

function rejectUnknownKeys(value, allowed, location, errors) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      errors.push(location + '.' + key + ': unknown field; extend the reviewed publication contract before use');
    }
  }
}

export function validateCandidate(item) {
  const errors = [];
  if (!isRecord(item)) return ['candidate must be a JSON object'];
  scanForbiddenKeys(item, '$', errors);
  rejectUnknownKeys(item, ALLOWED_ITEM_KEYS, '$', errors);

  if (item.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (!nonEmptyString(item.itemId) || !/^[a-z0-9][a-z0-9._-]{0,99}$/.test(item.itemId)) {
    errors.push('itemId must be a stable lowercase identifier (1–100 characters)');
  }
  if (!Number.isSafeInteger(item.version) || item.version < 1) errors.push('version must be a positive safe integer');
  if (!CLASSIFICATIONS.has(item.classification)) errors.push('classification must be FACT, INFERENCE, or PRACTICE_CONTENT');
  if (!nonEmptyString(item.title)) errors.push('title must be a non-empty string');
  if (!nonEmptyString(item.prompt)) errors.push('prompt must be a non-empty string');
  if (!Array.isArray(item.skills) || item.skills.length === 0 ||
      item.skills.some(skill => !nonEmptyString(skill)) || new Set(item.skills).size !== item.skills.length) {
    errors.push('skills must be a non-empty array of unique non-empty strings');
  }
  if (!Number.isInteger(item.difficulty) || item.difficulty < 1 || item.difficulty > 10) {
    errors.push('difficulty must be an integer from 1 to 10');
  }
  if (item.visibility !== 'public') errors.push('visibility must be public for this candidate checker');

  if (!isRecord(item.provenance)) {
    errors.push('provenance must be an object with source and usage-rights evidence');
  } else {
    rejectUnknownKeys(item.provenance, ALLOWED_PROVENANCE_KEYS, '$.provenance', errors);
    if (!PROVENANCE_KINDS.has(item.provenance.kind)) {
      errors.push('provenance.kind must identify original, licensed, public-domain, or owner-authorized material');
    }
    for (const key of ['source', 'license', 'author']) {
      if (!nonEmptyString(item.provenance[key])) errors.push('provenance.' + key + ' must be a non-empty string');
    }
    const checkedAt = item.provenance.checkedAt;
    const parsedDate = nonEmptyString(checkedAt) && /^\d{4}-\d{2}-\d{2}$/.test(checkedAt)
      ? new Date(checkedAt + 'T00:00:00Z')
      : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== checkedAt) {
      errors.push('provenance.checkedAt must be a real ISO calendar date (YYYY-MM-DD)');
    }
  }
  return errors;
}

function main(argv) {
  if (argv.length !== 1 || argv[0] === '--help' || argv[0] === '-h') {
    console.error('Usage: node scripts/check-content-publication-safety.mjs <candidate.json>');
    console.error('Checks a public-content candidate shape only; it does not approve or publish content.');
    return argv[0] === '--help' || argv[0] === '-h' ? 0 : 2;
  }
  try {
    const file = argv[0];
    if (statSync(file).size > MAX_FILE_BYTES) throw new Error('file exceeds ' + MAX_FILE_BYTES + ' bytes');
    const item = JSON.parse(readFileSync(file, 'utf8'));
    const errors = validateCandidate(item);
    if (errors.length) {
      console.error('INVALID candidate (' + errors.length + ' finding(s)):');
      for (const error of errors) console.error('- ' + error);
      return 1;
    }
    console.log('Candidate metadata safety checks passed; human content review and release authorization are still required.');
    return 0;
  } catch (error) {
    console.error('INVALID candidate: ' + (error instanceof Error ? error.message : String(error)));
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
