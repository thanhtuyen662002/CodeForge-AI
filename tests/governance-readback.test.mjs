import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  validateCreationSpec,
  validateExistingTarget,
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
      required_reviewers: [],
      require_extra_approval_for_unattributed_changes: true,
      allowed_merge_methods: ['merge', 'squash', 'rebase'],
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

function workflowRun(id, run_number, created_at, options = {}) {
  return {
    id,
    name: 'Foundation CI',
    path: options.path ?? '.github/workflows/ci.yml',
    head_sha: options.head_sha ?? 'abc',
    head_branch: options.head_branch ?? 'foundation/learner-first-design',
    run_number,
    run_attempt: options.run_attempt ?? 1,
    created_at,
  };
}

function workflowRunsPayload(workflow_runs) {
  return { total_count: workflow_runs.length, workflow_runs };
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


test('equal workflow-run timestamps use run_number, not CheckRun ID, as the deterministic tie-breaker', () => {
  const lowerRunNumber = workflowRun(200, 7, '2026-10-02T17:00:00Z');
  const higherRunNumber = workflowRun(100, 8, '2026-10-02T17:00:00Z');
  const payload = checkRunsPayload([
    checkRun(900, lowerRunNumber.id, 'completed', 'failure'),
    checkRun(3, higherRunNumber.id, 'completed', 'success'),
  ]);
  assert.equal(assertMergeGateEvidence(payload, workflowRunsPayload([lowerRunNumber, higherRunNumber]), jobsPayload([
    workflowJob(3, higherRunNumber.id, 'completed', 'success'),
  ]), 'abc'), true);
});
