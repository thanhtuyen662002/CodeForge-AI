import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSkillGraph, summarizeEvidence, classifySubmission, scoreSelection, compareRows } from '../dist/index.js';

const observation = (n, changes = {}) => ({
  id: `e${n}`, skillId: 'python.conditions', familyId: `f${n}`, sessionId: n < 3 ? 's1' : 's2',
  observedAt: n + 1, source: 'server', correct: true, assisted: false,
  solutionViewed: false, delayedCheck: n === 4, ...changes,
});
const summarize = (rows) => summarizeEvidence(rows, 'python.conditions', 0, 100);

test('valid prerequisite DAG', () => {
  assert.doesNotThrow(() => validateSkillGraph([{ id: 'a', prerequisites: [] }, { id: 'b', prerequisites: ['a'] }]));
});
test('cycles and self edges rejected', () => {
  assert.throws(() => validateSkillGraph([{ id: 'a', prerequisites: ['b'] }, { id: 'b', prerequisites: ['a'] }]), /skill_cycle/);
  assert.throws(() => validateSkillGraph([{ id: 'a', prerequisites: ['a'] }]), /skill_cycle/);
});
test('missing and duplicate graph identifiers rejected', () => {
  assert.throws(() => validateSkillGraph([{ id: 'a', prerequisites: ['missing'] }]), /missing_prerequisite/);
  assert.throws(() => validateSkillGraph([{ id: 'a', prerequisites: [] }, { id: 'a', prerequisites: [] }]), /duplicate/);
  assert.throws(() => validateSkillGraph([{ id: 'a', prerequisites: ['b', 'b'] }]), /duplicate/);
});
test('unknown is null, never zero', () => {
  assert.deepEqual(summarize([]), { count: 0, successes: 0, sessions: 0, observedScore: null, evidenceLevel: 'unknown', masteryCandidate: false });
});
test('assisted and solution-viewed work cannot prove mastery', () => {
  assert.equal(summarize([observation(1, { assisted: true }), observation(2, { solutionViewed: true })]).count, 0);
});
test('browser-reported scores cannot prove mastery', () => {
  assert.equal(summarize([observation(1, { source: 'browser' })]).count, 0);
});
test('other skills and outside-window facts excluded', () => {
  assert.equal(summarize([observation(1, { skillId: 'sql.select' }), observation(2, { observedAt: 100 }), observation(3, { observedAt: -1 })]).count, 0);
});
test('replaying an identical event is idempotent', () => {
  const row = observation(1);
  assert.equal(summarize([row, { ...row }]).count, 1);
});
test('conflicting duplicate event rejected', () => {
  assert.throws(() => summarize([observation(1), observation(1, { correct: false })]), /conflicting_event/);
});
test('retry farming cannot erase first independent failure in window', () => {
  const result = summarize([observation(2, { familyId: 'shared' }), observation(1, { familyId: 'shared', correct: false })]);
  assert.equal(result.count, 1);
  assert.equal(result.successes, 0);
});
test('input order does not change evidence selection', () => {
  const rows = Array.from({ length: 5 }, (_, n) => observation(n));
  assert.deepEqual(summarize(rows), summarize([...rows].reverse()));
});
test('small sample is insufficient, not job-ready', () => {
  const result = summarize([observation(1)]);
  assert.equal(result.evidenceLevel, 'insufficient');
  assert.equal(result.masteryCandidate, false);
});
test('candidate requires diversity, sessions and delayed independent success', () => {
  const rows = Array.from({ length: 5 }, (_, n) => observation(n));
  assert.equal(summarize(rows).masteryCandidate, true);
  assert.equal(summarize(rows.map((row) => ({ ...row, sessionId: 'one' }))).masteryCandidate, false);
  assert.equal(summarize(rows.map((row) => ({ ...row, delayedCheck: false }))).masteryCandidate, false);
});
test('low observed score does not become candidate', () => {
  assert.equal(summarize(Array.from({ length: 5 }, (_, n) => observation(n, { correct: n > 2 }))).masteryCandidate, false);
});
test('invalid window, time and flags are rejected', () => {
  assert.throws(() => summarizeEvidence([], 's', 10, 10), /invalid_window/);
  assert.throws(() => summarize([observation(1, { observedAt: NaN })]), /invalid_time/);
  assert.throws(() => summarize([observation(1, { correct: 'true' })]), /invalid_observation/);
});
test('deadline is server-owned and exclusive', () => {
  assert.equal(classifySubmission(10, 20, 9), 'not_started');
  assert.equal(classifySubmission(10, 20, 10), 'accepted');
  assert.equal(classifySubmission(10, 20, 19), 'accepted');
  assert.equal(classifySubmission(10, 20, 20), 'expired');
  assert.equal(classifySubmission(10, 20, 21), 'expired');
});
test('invalid deadlines fail closed', () => {
  assert.throws(() => classifySubmission(20, 10, 15), /invalid_deadline/);
  assert.throws(() => classifySubmission(10, Infinity, 15), /invalid_time/);
});
test('selecting every answer does not beat exact-set grading', () => {
  assert.equal(scoreSelection(['a', 'b', 'c'], ['a', 'c'], ['c', 'a']), 1);
  assert.equal(scoreSelection(['a', 'b', 'c'], ['a', 'c'], ['a', 'b', 'c']), 0);
  assert.equal(scoreSelection(['a', 'b'], ['a'], []), 0);
});
test('unknown/duplicate selections and invalid ground truth rejected', () => {
  assert.throws(() => scoreSelection(['a'], ['a'], ['secret']), /invalid_selection/);
  assert.throws(() => scoreSelection(['a'], ['a'], ['a', 'a']), /invalid_selection/);
  assert.throws(() => scoreSelection(['a'], ['missing'], []), /invalid_question/);
});
test('row multiset preserves duplicates and type distinctions', () => {
  assert.equal(compareRows([[1], [2]], [[2], [1]]), true);
  assert.equal(compareRows([[1], [1]], [[1]]), false);
  assert.equal(compareRows([[null]], [['null']]), false);
  assert.equal(compareRows([[1]], [['1']]), false);
});
test('ordered rows respect task ordering', () => {
  assert.equal(compareRows([[1], [2]], [[2], [1]], true), false);
  assert.equal(compareRows([], []), true);
});
test('invalid numeric rows and excessive result sets are rejected', () => {
  assert.throws(() => compareRows([[NaN]], [[null]]), /invalid_cell/);
  assert.throws(() => compareRows(Array.from({ length: 10001 }, () => [1]), []), /too_many_rows/);
});
