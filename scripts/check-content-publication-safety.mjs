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

/**
 * Walk the original JSON text before using its parsed object. JSON.parse silently
 * keeps only the last duplicate key, which can erase an earlier forbidden field.
 * Key comparison uses decoded JSON strings, so escaped spellings cannot evade it.
 */
function assertNoDuplicateObjectKeys(jsonText) {
  let cursor = 0;
  const whitespace = () => {
    while (cursor < jsonText.length && /[\u0009\u000A\u000D\u0020]/.test(jsonText[cursor])) cursor++;
  };

  function readStringToken() {
    const start = cursor;
    if (jsonText[cursor] !== '"') throw new Error('invalid JSON string while checking duplicate keys');
    cursor++;
    while (cursor < jsonText.length) {
      const char = jsonText[cursor];
      if (char === '\\') {
        cursor += 2;
        continue;
      }
      cursor++;
      if (char === '"') return JSON.parse(jsonText.slice(start, cursor));
    }
    throw new Error('unterminated JSON string while checking duplicate keys');
  }

  function skipValue(depth, location) {
    whitespace();
    if (depth > 30) throw new Error(location + ': maximum JSON nesting depth exceeded');
    const char = jsonText[cursor];

    if (char === '{') {
      cursor++;
      whitespace();
      const seen = new Set();
      if (jsonText[cursor] === '}') {
        cursor++;
        return;
      }
      while (cursor < jsonText.length) {
        whitespace();
        const key = readStringToken();
        if (seen.has(key)) {
          throw new Error('duplicate JSON object key at ' + location + ': ' + JSON.stringify(key));
        }
        seen.add(key);
        whitespace();
        if (jsonText[cursor] !== ':') throw new Error('invalid JSON object while checking duplicate keys');
        cursor++;
        skipValue(depth + 1, location + '.' + key);
        whitespace();
        if (jsonText[cursor] === ',') {
          cursor++;
          continue;
        }
        if (jsonText[cursor] === '}') {
          cursor++;
          return;
        }
        throw new Error('invalid JSON object while checking duplicate keys');
      }
      throw new Error('unterminated JSON object while checking duplicate keys');
    }

    if (char === '[') {
      cursor++;
      whitespace();
      if (jsonText[cursor] === ']') {
        cursor++;
        return;
      }
      let index = 0;
      while (cursor < jsonText.length) {
        skipValue(depth + 1, location + '[' + index + ']');
        index++;
        whitespace();
        if (jsonText[cursor] === ',') {
          cursor++;
          continue;
        }
        if (jsonText[cursor] === ']') {
          cursor++;
          return;
        }
        throw new Error('invalid JSON array while checking duplicate keys');
      }
      throw new Error('unterminated JSON array while checking duplicate keys');
    }

    if (char === '"') {
      readStringToken();
      return;
    }

    const start = cursor;
    while (cursor < jsonText.length && !/[\u0009\u000A\u000D\u0020,\]}]/.test(jsonText[cursor])) cursor++;
    if (cursor === start) throw new Error(location + ': invalid JSON value while checking duplicate keys');
  }

  // Validate JSON grammar first; the scanner then checks the raw source, not the
  // lossy object produced by JSON.parse.
  JSON.parse(jsonText);
  skipValue(0, '$');
  whitespace();
  if (cursor !== jsonText.length) throw new Error('unexpected trailing JSON content');
}

function parseCandidateJson(jsonText) {
  if (typeof jsonText !== 'string') throw new TypeError('candidate JSON must be text');
  if (Buffer.byteLength(jsonText, 'utf8') > MAX_FILE_BYTES) throw new Error('candidate JSON exceeds ' + MAX_FILE_BYTES + ' bytes');
  const item = JSON.parse(jsonText);
  assertNoDuplicateObjectKeys(jsonText);
  return item;
}

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
  if (typeof item === 'string') {
    try {
      item = parseCandidateJson(item);
    } catch (error) {
      return ['candidate JSON is invalid or contains duplicate object keys: ' +
        (error instanceof Error ? error.message : String(error))];
    }
  }
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
    const jsonText = readFileSync(file, 'utf8');
    const errors = validateCandidate(jsonText);
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
