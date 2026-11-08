import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  validateCreationSpec,
  validateMainWorkflowPin,
  validateFoundationPr,
  assertFoundationPrStable,
  validateExistingTarget,
  validateLiveRuleset,
  assertMergeGateEvidence,
  assertNegativeControlEvidence,
  assertLatestWorkflowRunStable,
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
      required_reviewers: [],
      require_extra_approval_for_unattributed_changes: true,
      allowed_merge_methods: ['merge', 'squash', 'rebase'],
    } },
    { type: 'required_status_checks', parameters: {
      strict_required_status_checks_policy: true,
      do_not_enforce_on_create: false,
      required_status_checks: [{ context: 'merge-gate', integration_id: 15368 }],
    } },
    { type: 'workflows', parameters: {
      do_not_enforce_on_create: false,
      workflows: [{
        path: '.github/workflows/planning.yml',
        ref: 'main',
        repository_id: 1402071360,
        sha: '4ea8f8dc8401bfa3790e6aeabf3ffb80b8b28989',
      }],
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

function liveWithoutWorkflowRule(overrides = {}) {
  const snapshot = live(overrides);
  snapshot.rules = snapshot.rules.filter((rule) => rule.type !== 'workflows');
  return snapshot;
}

function workflowRun(id, run_number, created_at, options = {}) {
  const headSha = options.head_sha ?? 'abc';
  const headBranch = options.head_branch ?? 'foundation/learner-first-design';
  const event = options.event ?? 'pull_request';
  return {
    id,
    name: 'Foundation CI',
    path: options.path ?? '.github/workflows/ci.yml',
    head_sha: headSha,
    head_branch: headBranch,
    run_number,
    run_attempt: options.run_attempt ?? 1,
    event,
    created_at,
    run_started_at: Object.hasOwn(options, 'run_started_at') ? options.run_started_at : created_at,
    pull_requests: options.pull_requests ?? (event === 'pull_request'
      ? [{ number: 1, head: { ref: headBranch, sha: headSha }, base: { ref: 'main' } }]
      : []),
  };
}

function workflowRunsPayload(workflow_runs) {
  return { total_count: workflow_runs.length, workflow_runs };
}

function foundationPr(overrides = {}) {
  return {
    number: 1,
    state: 'open',
    head: { ref: 'foundation/learner-first-design', sha: 'abc' },
    base: { ref: 'main', sha: 'base123' },
    mergeable: true,
    ...overrides,
  };
}

function workflowJob(id, run_id, status, conclusion, head = 'abc') {
  return { id, run_id, name: 'merge-gate', status, conclusion, head_sha: head };
}

function checkRun(id, run_id, status, conclusion, head = 'abc') {
  return {
    id,
    name: 'merge-gate',
    app: { id: 15368 },
    head_sha: head,
    status,
    conclusion,
    details_url: 'https://github.com/thanhtuyen662002/CodeForge-AI/actions/runs/' + run_id + '/job/' + id,
  };
}

function checkRunsPayload(check_runs, source_total_count = check_runs.length) {
  return {
    source_total_count,
    source_check_runs: check_runs,
    total_count: check_runs.length,
    check_runs,
  };
}

function jobsPayload(jobs, total_count = jobs.length) {
  return { total_count, jobs };
}

test('ruleset requires the pinned trusted planning workflow and exact current-main SHA', () => {
  assert.equal(validateCreationSpec(expected), true);
  assert.equal(validateMainWorkflowPin(expected, '4ea8f8dc8401bfa3790e6aeabf3ffb80b8b28989'), true);
  assert.throws(() => validateMainWorkflowPin(expected, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    /trusted workflow pin does not match current main HEAD/);

  const missing = structuredClone(expected);
  missing.rules = missing.rules.filter((rule) => rule.type !== 'workflows');
  assert.throws(() => validateCreationSpec(missing), /must contain exactly/);

  for (const [field, value] of [
    ['path', '.github/workflows/untrusted.yml'],
    ['ref', 'refs/heads/attacker'],
    ['repository_id', 123],
    ['sha', 'not-a-commit'],
  ]) {
    const invalid = structuredClone(expected);
    invalid.rules.find((rule) => rule.type === 'workflows').parameters.workflows[0][field] = value;
    assert.throws(() => validateCreationSpec(invalid));
  }
});

test('existing ruleset can add a missing trusted workflow but refuses a different existing pin', () => {
  assert.equal(validateExistingTarget(expected, liveWithoutWorkflowRule()), true);
  const wrongPin = live();
  wrongPin.rules.find((rule) => rule.type === 'workflows').parameters.workflows[0].sha =
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  assert.throws(() => validateExistingTarget(expected, wrongPin),
    /existing trusted workflow pin differs from target/);
});

test('live read-back requires the exact trusted workflow pin', () => {
  assert.equal(validateLiveRuleset(expected, live()), true);
  assert.throws(() => validateLiveRuleset(expected, liveWithoutWorkflowRule()), /must contain exactly/);
  const wrongPath = live();
  wrongPath.rules.find((rule) => rule.type === 'workflows').parameters.workflows[0].path =
    '.github/workflows/untrusted.yml';
  assert.throws(() => validateLiveRuleset(expected, wrongPath), /trusted workflow path mismatch/);
});

test('existing ruleset read-back rejects malformed required status-check flags', () => {
  assert.equal(validateExistingTarget(expected, live()), true);

  const missingStrict = live();
  delete missingStrict.rules.find((rule) => rule.type === 'required_status_checks')
    .parameters.strict_required_status_checks_policy;
  assert.throws(() => validateExistingTarget(expected, missingStrict),
    /existing strict status-check policy is malformed/);

  const invalidEnforcement = live();
  invalidEnforcement.rules.find((rule) => rule.type === 'required_status_checks')
    .parameters.do_not_enforce_on_create = null;
  assert.throws(() => validateExistingTarget(expected, invalidEnforcement),
    /existing create enforcement flag is malformed/);
});

test('foundation PR must be open, mergeable, and based on the exact current main and head SHA', () => {
  assert.equal(validateFoundationPr(foundationPr(), 'abc', 'base123'), true);
  assert.throws(() => validateFoundationPr(foundationPr({ base: { ref: 'main', sha: 'old-main' } }), 'abc', 'base123'),
    /exact current main and head SHA/);
  assert.throws(() => validateFoundationPr(foundationPr({ mergeable: false }), 'abc', 'base123'),
    /exact current main and head SHA/);
  assert.throws(() => validateFoundationPr(foundationPr({ head: { ref: 'foundation/learner-first-design', sha: 'changed' } }), 'abc', 'base123'),
    /exact current main and head SHA/);
});

test('foundation PR snapshot is revalidated immediately before ruleset mutation', () => {
  const initial = foundationPr();
  assert.equal(assertFoundationPrStable(initial, foundationPr(), 'abc', 'base123'), true);
  assert.throws(() => assertFoundationPrStable(initial,
    foundationPr({ base: { ref: 'main', sha: 'new-main' } }), 'abc', 'base123'),
  /exact current main and head SHA/);
});

test('workflow run evidence rejects a PR run against a stale main base SHA', () => {
  const staleBase = workflowRun(150, 6, '2026-10-02T17:01:00Z', { base_sha: 'old-main' });
  const payload = checkRunsPayload([checkRun(5, staleBase.id, 'completed', 'success')]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([staleBase]), jobsPayload([
    workflowJob(5, staleBase.id, 'completed', 'success'),
  ]), 'abc', 'current-main'), /exact current base SHA/);
});

test('positive evidence follows the latest exact-branch workflow attempt, not the largest CheckRun ID', () => {
  const older = workflowRun(100, 5, '2026-10-02T17:00:00Z');
  const latest = workflowRun(150, 6, '2026-10-02T17:01:00Z');
  const unrelatedBranch = workflowRun(200, 99, '2026-10-03T17:00:00Z', { head_branch: 'foundation/cf05-content-contract-20261003' });
  const payload = checkRunsPayload([
    checkRun(10, older.id, 'completed', 'failure'),
    checkRun(99, unrelatedBranch.id, 'completed', 'failure'),
    checkRun(5, latest.id, 'completed', 'success'),
  ]);
  assert.equal(assertMergeGateEvidence(payload, workflowRunsPayload([older, latest, unrelatedBranch]), jobsPayload([
    workflowJob(5, latest.id, 'completed', 'success'),
  ]), 'abc'), true);
});

test('positive evidence rejects a newer failed workflow run after an older success', () => {
  const older = workflowRun(100, 5, '2026-10-02T17:00:00Z');
  const latest = workflowRun(150, 6, '2026-10-02T17:01:00Z');
  const payload = checkRunsPayload([
    checkRun(10, older.id, 'completed', 'success'),
    checkRun(11, latest.id, 'completed', 'failure'),
  ]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([older, latest]), jobsPayload([
    workflowJob(11, latest.id, 'completed', 'failure'),
  ]), 'abc'), /latest merge-gate conclusion must be success/);
});

test('positive evidence rejects a queued job in the latest workflow attempt despite an older success', () => {
  const latest = workflowRun(150, 6, '2026-10-02T17:01:00Z', { run_attempt: 2 });
  const payload = checkRunsPayload([
    checkRun(10, latest.id, 'completed', 'success'),
    checkRun(12, latest.id, 'queued', null),
  ]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([latest]), jobsPayload([
    workflowJob(12, latest.id, 'queued', null),
  ]), 'abc'), /not completed/);
});

test('negative-control evidence accepts the latest failed workflow attempt after an older success', () => {
  const older = workflowRun(100, 5, '2026-10-02T17:00:00Z');
  const latest = workflowRun(150, 6, '2026-10-02T17:01:00Z');
  const payload = checkRunsPayload([
    checkRun(10, older.id, 'completed', 'success'),
    checkRun(11, latest.id, 'completed', 'failure'),
  ]);
  assert.equal(assertNegativeControlEvidence(payload, workflowRunsPayload([older, latest]), jobsPayload([
    workflowJob(11, latest.id, 'completed', 'failure'),
  ]), 'abc'), true);
});

test('negative-control evidence rejects a latest successful workflow attempt after an older failure', () => {
  const older = workflowRun(100, 5, '2026-10-02T17:00:00Z');
  const latest = workflowRun(150, 6, '2026-10-02T17:01:00Z');
  const payload = checkRunsPayload([
    checkRun(10, older.id, 'completed', 'failure'),
    checkRun(11, latest.id, 'completed', 'success'),
  ]);
  assert.throws(() => assertNegativeControlEvidence(payload, workflowRunsPayload([older, latest]), jobsPayload([
    workflowJob(11, latest.id, 'completed', 'success'),
  ]), 'abc'), /latest merge-gate conclusion must be failure/);
});

test('latest attempt job identity rejects a stale CheckRun from an earlier attempt of the same workflow run', () => {
  const latest = workflowRun(150, 6, '2026-10-02T17:01:00Z', { run_attempt: 2 });
  const payload = checkRunsPayload([checkRun(10, latest.id, 'completed', 'success')]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([latest]), jobsPayload([
    workflowJob(12, latest.id, 'completed', 'failure'),
  ]), 'abc'), /no unique matching CheckRun/);
});

test('latest workflow selection ignores a newer run from a different workflow path', () => {
  const latestCi = workflowRun(150, 6, '2026-10-02T17:01:00Z');
  const newerOtherWorkflow = workflowRun(200, 20, '2026-10-02T18:00:00Z', { path: '.github/workflows/planning.yml' });
  const payload = checkRunsPayload([checkRun(5, latestCi.id, 'completed', 'success')]);
  assert.equal(assertMergeGateEvidence(payload, workflowRunsPayload([latestCi, newerOtherWorkflow]), jobsPayload([
    workflowJob(5, latestCi.id, 'completed', 'success'),
  ]), 'abc'), true);
});

test('latest workflow selection ignores a newer non-PR event on the same path, branch and SHA', () => {
  const latestPullRequest = workflowRun(150, 6, '2026-10-02T17:01:00Z', { event: 'pull_request' });
  const newerDispatch = workflowRun(200, 7, '2026-10-02T18:00:00Z', { event: 'workflow_dispatch' });
  const payload = checkRunsPayload([
    checkRun(5, latestPullRequest.id, 'completed', 'success'),
    checkRun(6, newerDispatch.id, 'completed', 'failure'),
  ]);
  assert.equal(assertMergeGateEvidence(payload, workflowRunsPayload([latestPullRequest, newerDispatch]), jobsPayload([
    workflowJob(5, latestPullRequest.id, 'completed', 'success'),
  ]), 'abc'), true);
});

test('latest workflow selection rejects evidence when only a non-PR event exists', () => {
  const dispatch = workflowRun(200, 7, '2026-10-02T18:00:00Z', { event: 'workflow_dispatch' });
  const payload = checkRunsPayload([checkRun(6, dispatch.id, 'completed', 'success')]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([dispatch]), jobsPayload([
    workflowJob(6, dispatch.id, 'completed', 'success'),
  ]), 'abc'), /no Foundation CI run found/);
});

test('workflow PR association must uniquely match PR #1 targeting main', () => {
  const wrongPr = workflowRun(301, 9, '2026-10-02T18:00:00Z', {
    pull_requests: [{ number: 2, head: { ref: 'foundation/learner-first-design', sha: 'abc' }, base: { ref: 'main', sha: options.base_sha ?? 'base123' } }],
  });
  const wrongBase = workflowRun(302, 10, '2026-10-02T18:01:00Z', {
    pull_requests: [{ number: 1, head: { ref: 'foundation/learner-first-design', sha: 'abc' }, base: { ref: 'release' } }],
  });
  const missingAssociation = workflowRun(303, 11, '2026-10-02T18:02:00Z', { pull_requests: [] });
  const multipleAssociations = workflowRun(304, 12, '2026-10-02T18:03:00Z', {
    pull_requests: [
      { number: 1, head: { ref: 'foundation/learner-first-design', sha: 'abc' }, base: { ref: 'main' } },
      { number: 2, head: { ref: 'foundation/learner-first-design', sha: 'abc' }, base: { ref: 'release' } },
    ],
  });
  for (const candidate of [wrongPr, wrongBase, missingAssociation, multipleAssociations]) {
    const payload = checkRunsPayload([checkRun(20, candidate.id, 'completed', 'success')]);
    assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([candidate]), jobsPayload([]), 'abc'),
      /PR association does not uniquely match PR #1 targeting main/);
  }
});

test('workflow-run evidence rejects a different head, invalid timestamp, or incomplete page', () => {
  const wrongHead = workflowRun(150, 6, '2026-10-02T17:01:00Z', { head_sha: 'def' });
  const payload = checkRunsPayload([checkRun(5, 150, 'completed', 'success')]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([wrongHead]), jobsPayload([
    workflowJob(5, 150, 'completed', 'success'),
  ]), 'abc'), /different head SHA/);

  const invalidTime = workflowRun(151, 7, 'not-a-date');
  assert.throws(() => assertMergeGateEvidence(checkRunsPayload([checkRun(6, 151, 'completed', 'success')]), workflowRunsPayload([invalidTime]), jobsPayload([
    workflowJob(6, 151, 'completed', 'success'),
  ]), 'abc'), /timestamp is invalid/);

  const incomplete = workflowRunsPayload([workflowRun(152, 8, '2026-10-02T17:02:00Z')]);
  incomplete.total_count = 2;
  assert.throws(() => assertMergeGateEvidence(checkRunsPayload([checkRun(7, 152, 'completed', 'success')]), incomplete, jobsPayload([
    workflowJob(7, 152, 'completed', 'success'),
  ]), 'abc'), /incomplete or paginated/);
});

test('check-run and workflow-job evidence must be complete and agree on the exact attempt', () => {
  const latest = workflowRun(150, 6, '2026-10-02T17:01:00Z');
  const payload = checkRunsPayload([checkRun(5, latest.id, 'completed', 'success')], 2);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([latest]), jobsPayload([
    workflowJob(5, latest.id, 'completed', 'success'),
  ]), 'abc'), /source check-runs evidence is incomplete/);

  assert.throws(() => assertMergeGateEvidence(checkRunsPayload([checkRun(5, latest.id, 'completed', 'success')]), workflowRunsPayload([latest]), jobsPayload([
    workflowJob(5, latest.id, 'completed', 'success'),
  ], 2), 'abc'), /workflow-job evidence is incomplete/);

  assert.throws(() => assertMergeGateEvidence(checkRunsPayload([checkRun(5, latest.id, 'completed', 'success')]), workflowRunsPayload([latest]), jobsPayload([
    workflowJob(5, latest.id, 'completed', 'success', 'def'),
  ]), 'abc'), /different head SHA/);
});

test('merge-gate CheckRun must be tied to the exact workflow run and job IDs', () => {
  const latest = workflowRun(150, 6, '2026-10-02T17:01:00Z');
  const badUrl = checkRun(5, 999, 'completed', 'success');
  assert.throws(() => assertMergeGateEvidence(checkRunsPayload([badUrl]), workflowRunsPayload([latest]), jobsPayload([
    workflowJob(5, latest.id, 'completed', 'success'),
  ]), 'abc'), /no unique matching CheckRun/);
});

test('CLI output is parsed by the same Bash tab-delimited handoff', () => {
  const directory = mkdtempSync(join(tmpdir(), 'codeforge-readback-'));
  const fixture = join(directory, 'workflow-runs.json');
  try {
    writeFileSync(fixture, JSON.stringify(workflowRunsPayload([
      workflowRun(123, 7, '2026-10-02T17:01:00Z', { run_attempt: 7 }),
    ])));
    const cli = spawnSync(process.execPath, [
      new URL('../scripts/check-ruleset-readback.mjs', import.meta.url).pathname,
      '--select-latest-workflow-run',
      fixture,
      'abc',
      'base123',
    ], { encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.equal(cli.stdout, '123\t7\n');

    const bashScript = "IFS=$'\\t' read -r run_id attempt <<< \"$1\"; printf '%s:%s' \"$run_id\" \"$attempt\"";
    const parsed = spawnSync('bash', ['-c', bashScript, 'bash', cli.stdout], { encoding: 'utf8' });
    assert.equal(parsed.status, 0, parsed.stderr);
    assert.equal(parsed.stdout, '123:7');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});


test('equal latest-attempt start timestamps are ambiguous and fail closed', () => {
  const lowerRunNumber = workflowRun(200, 7, '2026-10-02T17:00:00Z');
  const higherRunNumber = workflowRun(100, 8, '2026-10-02T17:00:00Z');
  const payload = checkRunsPayload([
    checkRun(900, lowerRunNumber.id, 'completed', 'failure'),
    checkRun(3, higherRunNumber.id, 'completed', 'success'),
  ]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([lowerRunNumber, higherRunNumber]), jobsPayload([
    workflowJob(3, higherRunNumber.id, 'completed', 'success'),
  ]), 'abc'), /latest foundation workflow attempt timestamp is ambiguous/);
});


test('latest attempt uses run_started_at when an older workflow run is re-run later', () => {
  const olderRunRerun = workflowRun(200, 7, '2026-10-02T17:00:00Z', {
    run_attempt: 2,
    run_started_at: '2026-10-02T19:00:00Z',
  });
  const newerCreatedRun = workflowRun(100, 8, '2026-10-02T18:00:00Z');
  const payload = checkRunsPayload([
    checkRun(5, olderRunRerun.id, 'completed', 'success'),
    checkRun(6, newerCreatedRun.id, 'completed', 'failure'),
  ]);
  assert.equal(assertMergeGateEvidence(payload, workflowRunsPayload([newerCreatedRun, olderRunRerun]), jobsPayload([
    workflowJob(5, olderRunRerun.id, 'completed', 'success'),
  ]), 'abc'), true);
});

test('a later failure from a re-run of an older workflow run blocks a newer-created success', () => {
  const olderRunRerun = workflowRun(200, 7, '2026-10-02T17:00:00Z', {
    run_attempt: 2,
    run_started_at: '2026-10-02T19:00:00Z',
  });
  const newerCreatedRun = workflowRun(100, 8, '2026-10-02T18:00:00Z');
  const payload = checkRunsPayload([
    checkRun(5, olderRunRerun.id, 'completed', 'failure'),
    checkRun(6, newerCreatedRun.id, 'completed', 'success'),
  ]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([newerCreatedRun, olderRunRerun]), jobsPayload([
    workflowJob(5, olderRunRerun.id, 'completed', 'failure'),
  ]), 'abc'), /latest merge-gate conclusion must be success/);
});

test('a matching queued re-run without a start timestamp fails closed', () => {
  const queuedRerun = workflowRun(200, 7, '2026-10-02T17:00:00Z', {
    run_attempt: 2,
    run_started_at: null,
  });
  const newerCreatedRun = workflowRun(100, 8, '2026-10-02T18:00:00Z');
  const payload = checkRunsPayload([checkRun(6, newerCreatedRun.id, 'completed', 'success')]);
  assert.throws(() => assertMergeGateEvidence(payload, workflowRunsPayload([newerCreatedRun, queuedRerun]), jobsPayload([
    workflowJob(6, newerCreatedRun.id, 'completed', 'success'),
  ]), 'abc'), /latest-attempt start timestamp is invalid/);
});


test('latest workflow evidence must remain stable through the ruleset validation window', () => {
  const initialRun = workflowRun(500, 20, '2026-10-02T17:00:00Z', {
    run_attempt: 1,
    run_started_at: '2026-10-02T17:00:00Z',
  });
  const unchanged = workflowRun(500, 20, '2026-10-02T17:00:00Z', {
    run_attempt: 1,
    run_started_at: '2026-10-02T17:00:00Z',
  });
  assert.equal(assertLatestWorkflowRunStable(
    workflowRunsPayload([initialRun]), workflowRunsPayload([unchanged]), 'abc'), true);

  const rerunStarted = workflowRun(500, 20, '2026-10-02T17:00:00Z', {
    run_attempt: 2,
    run_started_at: '2026-10-02T18:00:00Z',
  });
  assert.throws(() => assertLatestWorkflowRunStable(
    workflowRunsPayload([initialRun]), workflowRunsPayload([rerunStarted]), 'abc'),
  /latest foundation workflow attempt changed during validation/);

  const newerRun = workflowRun(501, 21, '2026-10-02T18:00:00Z');
  assert.throws(() => assertLatestWorkflowRunStable(
    workflowRunsPayload([initialRun]), workflowRunsPayload([initialRun, newerRun]), 'abc'),
  /latest foundation workflow attempt changed during validation/);
});

test('gh api variable bindings are passed to jq, not unsupported gh api flags', () => {
  const applyScript = readFileSync(new URL('../scripts/apply-ruleset.sh', import.meta.url), 'utf8');
  assert.ok(applyScript.includes('gh api --paginate --slurp "repos/$repo/commits/$foundation_head/check-runs?filter=all&per_page=100" | jq --arg sha "$foundation_head"'));
  assert.ok(applyScript.includes('gh api "repos/$repo/collaborators?per_page=100" --paginate | jq --arg owner "$owner" --arg actor "$actor"'));
  assert.doesNotMatch(applyScript, /gh api[^\n]*--jq\s+--arg/);
  assert.equal((applyScript.match(/--validate-main-workflow-pin/g) || []).length, 2);
  assert.ok(applyScript.includes('--validate-foundation-pr "$pr_result" "$foundation_head" "$main_head"'));
  assert.ok(applyScript.includes('--assert-foundation-pr-stable "$pr_result" "$latest_pr_result" "$foundation_head" "$main_head"'));
  assert.ok(applyScript.includes('--validate-merge-gate "$result" "$workflow_runs_result" "$jobs_result" "$foundation_head" "$main_head"'));
});
