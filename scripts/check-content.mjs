import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateSkillGraph, scoreSelection } from '../dist/index.js';

const graph = JSON.parse(readFileSync('content/skills.v1.json', 'utf8'));
const bank = JSON.parse(readFileSync('content/practice-fixtures.json', 'utf8'));
validateSkillGraph(graph.skills);
assert.equal(bank.visibility, 'public-practice-only');
assert.equal(bank.status, 'test-fixtures-not-published');
assert.ok(bank.questions.length > 0);
const skills = new Set(graph.skills.map((skill) => skill.id));
const ids = new Set();
for (const question of bank.questions) {
  assert.ok(!ids.has(question.id), 'duplicate question id');
  ids.add(question.id);
  assert.ok(skills.has(question.skillId), 'unknown skill');
  assert.ok(Number.isInteger(question.version) && question.version > 0);
  assert.ok(Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 10);
  assert.equal(question.provenance, 'original-practice');
  assert.equal(question.reviewStatus, 'draft');
  assert.equal(question.type, 'single_choice');
  assert.equal(question.correct.length, 1);
  assert.ok(question.familyId && question.prompt && question.explanation);
  assert.equal(scoreSelection(question.options, question.correct, question.correct), 1);
  assert.equal(scoreSelection(question.options, question.correct, []), 0);
}
console.log(`Validated ${graph.skills.length} draft skills and ${bank.questions.length} PUBLIC draft fixtures; not a production content review.`);
