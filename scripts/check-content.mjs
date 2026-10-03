import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateSkillGraph } from '../dist/index.js';
import { validatePublicPracticeQuestion } from '../dist/content.js';

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
  validatePublicPracticeQuestion(question, skills);
}

console.log(`Validated ${graph.skills.length} draft skills and ${bank.questions.length} PUBLIC draft fixtures; not a production content review.`);
