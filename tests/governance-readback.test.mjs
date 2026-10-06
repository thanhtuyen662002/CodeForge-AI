import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCreationSpec,
  validateLiveRuleset,
  assertMergeGateEvidence,
  assertNegativeControlEvidence,
} from '../scripts/check-ruleset-readback.mjs';

const expected = {
  name: 'CodeForge main', target: 'branch', enforcement: 'active', bypass_actors: [],
  conditions: { ref_name: { include: ['~DEFAULT_BRANCH'], exclude: [] } },
  rules: [
    { type: 'deletion' }, { type: 'non_fast_forward' }, { type: 'required_linear_history' },
    { type: 'pull_request', parameters: {
      required_approving_review_count: 1,
      dismiss_stale_reviews_on_push: true,
      require_code_owner_review: false,
      require_last_push_approval: true,
      required_review_thread_resolution: true,
    } },
    { type: 'required_status_checks', parameters: {
      strict_required_status_checks_policy: true,
      do_not_enforce_on_create: false,
      required_status_checks: [{ context: 'merge-gate', integration_id: 15368 }],
    } },
  ],
};

function live(overrides = {}) {
  return {
    id: 24379959,
    source_type: 'Repository', source: 'thanhtuyen662002/CodeForge-AI', current_user_can_bypass: 'never',
    ...structuredClone(expected),
    rules: structuredClone(expected.rules).map((rule) => rule.type === 'pull_request'
      ? { ...rule, parameters: { ...rule.parameters, required_reviewers: [], require_extra_approval_for_unattributed_changes: true, allowed_merge_methods: ['merge', 'squash', 'rebase'] } }
      : rule),
    ...overrides,
  };
}

function evidence(conclusion, head = 'abc') {
  return { total_count: 1, check_runs: [{ name: 'merge-gate', app: { id: 15368 }, head_sha: head, status: 'completed', conclusion }] };
}

test('creation spec accepts reviewed minimal policy', () => assert.equal(validateCreationSpec(expected), true));
test('creation spec rejects bypass actor', () => assert.throws(() => validateCreationSpec({ ...structuredClone(expected), bypass_actors: [{ actor_id: 1 }] }), /bypass/));
test('creation spec rejects unknown server metadata', () => assert.throws(() => validateCreationSpec({ ...structuredClone(expected), id: 1 }), /unsupported keys/));
test('creation spec rejects lowered approvals', () => {
  const spec = structuredClone(expected); spec.rules.find((r) => r.type === 'pull_request').parameters.required_approving_review_count = 0;
  assert.throws(() => validateCreationSpec(spec), /one approval/);
});
test('creation spec rejects extra condition block', () => {
  const spec = structuredClone(expected); spec.conditions.repository_name = { include: ['x'], exclude: [] };
  assert.throws(() => validateCreationSpec(spec), /conditions contains unsupported keys/);
});
test('creation spec rejects extra ref condition key', () => {
  const spec = structuredClone(expected); spec.conditions.ref_name.extra = true;
  assert.throws(() => validateCreationSpec(spec), /ref_name condition contains unsupported keys/);
});

test('live ruleset accepts safe server read-back extras', () => assert.equal(validateLiveRuleset(expected, live()), true));
test('live ruleset accepts reordered condition keys from GitHub JSON', () => {
  const actual = live(); actual.conditions = { ref_name: { exclude: [], include: ['~DEFAULT_BRANCH'] } };
  assert.equal(validateLiveRuleset(expected, actual), true);
});
test('live ruleset rejects extra condition block', () => {
  const actual = live(); actual.conditions.repository_name = { include: ['x'], exclude: [] };
  assert.throws(() => validateLiveRuleset(expected, actual), /live ruleset conditions contains unsupported keys/);
});
test('live ruleset rejects bypass capability', () => assert.throws(() => validateLiveRuleset(expected, live({ current_user_can_bypass: 'always' })), /must not be able to bypass/));
test('live ruleset rejects changed required check', () => {
  const actual = live(); actual.rules.find((r) => r.type === 'required_status_checks').parameters.required_status_checks[0].context = 'quality';
  assert.throws(() => validateLiveRuleset(expected, actual), /merge-gate/);
});
test('live ruleset rejects unknown pull-request server parameter', () => {
  const actual = live(); actual.rules.find((r) => r.type === 'pull_request').parameters.mystery_bypass = true;
  assert.throws(() => validateLiveRuleset(expected, actual), /pull_request parameters contains unsupported keys/);
});
test('live ruleset rejects disabled extra approval for unattributed changes', () => {
  const actual = live(); actual.rules.find((r) => r.type === 'pull_request').parameters.require_extra_approval_for_unattributed_changes = false;
  assert.throws(() => validateLiveRuleset(expected, actual), /extra approval for unattributed changes/);
});
test('live ruleset accepts a nonempty known merge-method subset', () => {
  const actual = live(); actual.rules.find((r) => r.type === 'pull_request').parameters.allowed_merge_methods = ['squash'];
  assert.equal(validateLiveRuleset(expected, actual), true);
});
test('live ruleset rejects unknown merge method', () => {
  const actual = live(); actual.rules.find((r) => r.type === 'pull_request').parameters.allowed_merge_methods = ['octopus'];
  assert.throws(() => validateLiveRuleset(expected, actual), /allowed merge methods are malformed/);
});
test('live primitive rule rejects unexpected parameters', () => {
  const actual = live(); actual.rules.find((r) => r.type === 'deletion').parameters = { bypass: true };
  assert.throws(() => validateLiveRuleset(expected, actual), /live rule deletion contains unsupported keys/);
});
test('live required status check rejects unknown keys', () => {
  const actual = live(); actual.rules.find((r) => r.type === 'required_status_checks').parameters.required_status_checks[0].extra = true;
  assert.throws(() => validateLiveRuleset(expected, actual), /live required status check contains unsupported keys/);
});

test('positive evidence requires exact completed successful head', () => assert.equal(assertMergeGateEvidence(evidence('success'), 'abc'), true));
test('positive evidence rejects wrong head', () => assert.throws(() => assertMergeGateEvidence(evidence('success', 'def'), 'abc'), /different head/));
test('positive evidence rejects incomplete page', () => assert.throws(() => assertMergeGateEvidence({ ...evidence('success'), total_count: 2 }, 'abc'), /incomplete/));
test('negative evidence requires failure', () => assert.equal(assertNegativeControlEvidence(evidence('failure'), 'abc'), true));
test('negative evidence rejects success', () => assert.throws(() => assertNegativeControlEvidence(evidence('success'), 'abc'), /must be failure/));
