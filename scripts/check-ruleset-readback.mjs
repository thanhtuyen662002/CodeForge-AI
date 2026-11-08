#!/usr/bin/env node
import fs from 'node:fs';

const ACTIONS_APP_ID = 15368;
const FOUNDATION_BRANCH = 'foundation/learner-first-design';
const FOUNDATION_WORKFLOW_PATH = '.github/workflows/ci.yml';
const EXPECTED_RULE_TYPES = [
  'deletion',
  'non_fast_forward',
  'required_linear_history',
  'pull_request',
  'required_status_checks',
  'workflows',
];

function fail(message) {
  throw new Error(message);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertExactKeys(object, allowed, label) {
  if (!isObject(object)) fail(`${label} must be an object`);
  const extras = Object.keys(object).filter((key) => !allowed.includes(key));
  if (extras.length) fail(`${label} contains unsupported keys: ${extras.join(', ')}`);
}

function assertRuleSetShape(rules, label, { allowMissingWorkflows = false } = {}) {
  if (!Array.isArray(rules)) fail(`${label}.rules must be an array`);
  const types = rules.map((rule, index) => {
    if (!isObject(rule) || typeof rule.type !== 'string') fail(`${label}.rules[${index}] has invalid type`);
    return rule.type;
  });
  if (new Set(types).size !== types.length) fail(`${label}.rules contains duplicate rule types`);
  const sorted = [...types].sort();
  const expected = [...EXPECTED_RULE_TYPES].sort();
  const withoutWorkflows = expected.filter((type) => type !== 'workflows');
  const exact = JSON.stringify(sorted) === JSON.stringify(expected);
  const safeToAddWorkflow = allowMissingWorkflows && JSON.stringify(sorted) === JSON.stringify(withoutWorkflows);
  if (!exact && !safeToAddWorkflow) {
    fail(`${label}.rules must contain exactly: ${EXPECTED_RULE_TYPES.join(', ')}${allowMissingWorkflows ? ' (or omit workflows only before adding the trusted pin)' : ''}`);
  }
}

function validateWorkflowParameters(parameters, label) {
  assertExactKeys(parameters, ['do_not_enforce_on_create', 'workflows'], label);
  if (parameters.do_not_enforce_on_create !== false) fail(`${label} must enforce on create`);
  if (!Array.isArray(parameters.workflows) || parameters.workflows.length !== 1) {
    fail(`${label} must contain exactly one trusted workflow`);
  }
  const workflow = parameters.workflows[0];
  assertExactKeys(workflow, ['path', 'ref', 'repository_id', 'sha'], `${label}.workflows[0]`);
  if (workflow.path !== '.github/workflows/planning.yml') fail('trusted workflow path mismatch');
  if (workflow.ref !== 'main') fail('trusted workflow ref must be main');
  if (workflow.repository_id !== 1402071360) fail('trusted workflow repository ID mismatch');
  if (typeof workflow.sha !== 'string' || !/^[0-9a-f]{40}$/.test(workflow.sha)) {
    fail('trusted workflow commit SHA is invalid');
  }
}

function workflowPinMatches(expectedParameters, actualParameters) {
  const expectedWorkflow = expectedParameters.workflows[0];
  const actualWorkflow = actualParameters.workflows[0];
  return expectedParameters.do_not_enforce_on_create === actualParameters.do_not_enforce_on_create &&
    expectedWorkflow.path === actualWorkflow.path &&
    expectedWorkflow.ref === actualWorkflow.ref &&
    expectedWorkflow.repository_id === actualWorkflow.repository_id &&
    expectedWorkflow.sha === actualWorkflow.sha;
}

export function validateCreationSpec(spec) {
  assertExactKeys(spec, ['name', 'target', 'enforcement', 'bypass_actors', 'conditions', 'rules'], 'ruleset spec');
  if (spec.name !== 'CodeForge main') fail('ruleset spec name mismatch');
  if (spec.target !== 'branch') fail('ruleset spec target must be branch');
  if (spec.enforcement !== 'active') fail('ruleset spec enforcement must be active');
  if (!Array.isArray(spec.bypass_actors) || spec.bypass_actors.length !== 0) fail('ruleset spec must not contain bypass actors');
  assertExactKeys(spec.conditions, ['ref_name'], 'ruleset spec conditions');
  assertExactKeys(spec.conditions.ref_name, ['include', 'exclude'], 'ruleset spec ref_name condition');
  if (!Array.isArray(spec.conditions.ref_name.include) || spec.conditions.ref_name.include.length !== 1 ||
      spec.conditions.ref_name.include[0] !== '~DEFAULT_BRANCH' ||
      !Array.isArray(spec.conditions.ref_name.exclude) || spec.conditions.ref_name.exclude.length !== 0) {
    fail('ruleset spec must target only the default branch');
  }
  assertRuleSetShape(spec.rules, 'ruleset spec');

  for (const rule of spec.rules) {
    if (rule.type === 'deletion' || rule.type === 'non_fast_forward' || rule.type === 'required_linear_history') {
      assertExactKeys(rule, ['type'], `rule ${rule.type}`);
      continue;
    }
    if (rule.type === 'pull_request') {
      assertExactKeys(rule, ['type', 'parameters'], 'pull_request rule');
      assertExactKeys(rule.parameters, [
        'required_approving_review_count',
        'dismiss_stale_reviews_on_push',
        'require_code_owner_review',
        'require_last_push_approval',
        'required_review_thread_resolution',
        'required_reviewers',
        'require_extra_approval_for_unattributed_changes',
        'allowed_merge_methods',
      ], 'pull_request parameters');
      const p = rule.parameters;
      if (p.required_approving_review_count !== 1) fail('pull_request must require exactly one approval');
      if (p.dismiss_stale_reviews_on_push !== true) fail('pull_request must dismiss stale reviews');
      if (p.require_code_owner_review !== false) fail('code-owner review must remain false during sole-owner bootstrap');
      if (p.require_last_push_approval !== true) fail('pull_request must require latest-push approval');
      if (p.required_review_thread_resolution !== true) fail('pull_request must require resolved review threads');
      if (!Array.isArray(p.required_reviewers) || p.required_reviewers.length !== 0) fail('pull_request must not pin a named reviewer during bootstrap');
      if (p.require_extra_approval_for_unattributed_changes !== true) fail('pull_request must require extra approval for unattributed changes');
      if (!Array.isArray(p.allowed_merge_methods) || p.allowed_merge_methods.length !== 3 ||
          new Set(p.allowed_merge_methods).size !== 3 ||
          p.allowed_merge_methods.some((method) => !['merge', 'squash', 'rebase'].includes(method))) {
        fail('pull_request allowed merge methods must be the reviewed known set');
      }
      continue;
    }
    if (rule.type === 'workflows') {
      assertExactKeys(rule, ['type', 'parameters'], 'workflows rule');
      validateWorkflowParameters(rule.parameters, 'workflows parameters');
      continue;
    }
    if (rule.type === 'required_status_checks') {
      assertExactKeys(rule, ['type', 'parameters'], 'required_status_checks rule');
      assertExactKeys(rule.parameters, [
        'strict_required_status_checks_policy',
        'do_not_enforce_on_create',
        'required_status_checks',
      ], 'required_status_checks parameters');
      const p = rule.parameters;
      if (p.strict_required_status_checks_policy !== true) fail('required status checks must be strict');
      if (p.do_not_enforce_on_create !== false) fail('required status checks must enforce on create');
      if (!Array.isArray(p.required_status_checks) || p.required_status_checks.length !== 1) fail('exactly one required status check is expected');
      const check = p.required_status_checks[0];
      assertExactKeys(check, ['context', 'integration_id'], 'required status check');
      if (check.context !== 'merge-gate' || check.integration_id !== ACTIONS_APP_ID) fail('merge-gate must come from GitHub Actions app 15368');
    }
  }
  return true;
}

export function validateMainWorkflowPin(spec, mainSha) {
  validateCreationSpec(spec);
  if (typeof mainSha !== 'string' || !/^[0-9a-f]{40}$/.test(mainSha)) {
    fail('current main commit SHA is invalid');
  }
  const workflow = getRule(spec.rules, 'workflows').parameters.workflows[0];
  if (workflow.sha !== mainSha) fail('trusted workflow pin does not match current main HEAD');
  return true;
}

function getRule(rules, type) {
  const found = rules.filter((rule) => rule?.type === type);
  if (found.length !== 1) fail(`live ruleset must contain exactly one ${type} rule`);
  return found[0];
}

export function validateExistingTarget(expected, actual) {
  validateCreationSpec(expected);
  if (!isObject(actual)) fail('existing ruleset must be an object');
  if (actual.name !== expected.name || actual.target !== expected.target || actual.enforcement !== expected.enforcement) fail('existing ruleset identity/enforcement mismatch');
  if (actual.source_type !== 'Repository' || actual.source !== 'thanhtuyen662002/CodeForge-AI') fail('existing ruleset source mismatch');
  if (!Array.isArray(actual.bypass_actors) || actual.bypass_actors.length !== 0) fail('existing ruleset has bypass actors; refusing in-place update');
  if (actual.current_user_can_bypass !== 'never') fail('current user must not be able to bypass existing ruleset');
  assertExactKeys(actual.conditions, ['ref_name'], 'existing ruleset conditions');
  const ref = actual.conditions.ref_name;
  assertExactKeys(ref, ['include', 'exclude'], 'existing ruleset ref_name condition');
  if (!Array.isArray(ref.include) || ref.include.length !== 1 || ref.include[0] !== '~DEFAULT_BRANCH' ||
      !Array.isArray(ref.exclude) || ref.exclude.length !== 0) fail('existing ruleset is not scoped only to the default branch');

  // Refuse an update that would remove an extra rule or weaken an existing stronger setting.
  assertRuleSetShape(actual.rules, 'existing ruleset', { allowMissingWorkflows: true });
  for (const type of ['deletion', 'non_fast_forward', 'required_linear_history']) {
    assertExactKeys(getRule(actual.rules, type), ['type'], `existing rule ${type}`);
  }
  const expectedPr = getRule(expected.rules, 'pull_request').parameters;
  const actualPr = getRule(actual.rules, 'pull_request').parameters;
  assertExactKeys(actualPr, Object.keys(expectedPr), 'existing pull_request parameters');
  if (!Number.isInteger(actualPr.required_approving_review_count) || actualPr.required_approving_review_count < 0 ||
      actualPr.required_approving_review_count > expectedPr.required_approving_review_count) {
    fail('existing approval count is stronger than target; refusing to lower it');
  }
  for (const key of ['dismiss_stale_reviews_on_push', 'require_code_owner_review', 'require_last_push_approval',
    'required_review_thread_resolution', 'require_extra_approval_for_unattributed_changes']) {
    if (typeof actualPr[key] !== 'boolean') fail(`existing pull_request parameter is missing/invalid: ${key}`);
    if (actualPr[key] === true && expectedPr[key] === false) fail(`existing pull_request parameter is stronger than target: ${key}`);
  }
  if (!Array.isArray(actualPr.required_reviewers) ||
      (expectedPr.required_reviewers.length === 0 && actualPr.required_reviewers.length !== 0) ||
      (expectedPr.required_reviewers.length > 0 && JSON.stringify(actualPr.required_reviewers) !== JSON.stringify(expectedPr.required_reviewers))) {
    fail('existing named reviewers would be removed or changed');
  }
  if (!Array.isArray(actualPr.allowed_merge_methods) || actualPr.allowed_merge_methods.length === 0 ||
      actualPr.allowed_merge_methods.some((method) => !expectedPr.allowed_merge_methods.includes(method)) ||
      expectedPr.allowed_merge_methods.some((method) => !actualPr.allowed_merge_methods.includes(method))) {
    fail('existing merge methods differ from target; refusing to broaden or silently change them');
  }

  const expectedWorkflow = getRule(expected.rules, 'workflows').parameters;
  const actualWorkflowRules = actual.rules.filter((rule) => rule.type === 'workflows');
  if (actualWorkflowRules.length === 1) {
    validateWorkflowParameters(actualWorkflowRules[0].parameters, 'existing workflows parameters');
    if (!workflowPinMatches(expectedWorkflow, actualWorkflowRules[0].parameters)) {
      fail('existing trusted workflow pin differs from target; refusing to replace it');
    }
  }

  const expectedStatus = getRule(expected.rules, 'required_status_checks').parameters;
  const actualStatus = getRule(actual.rules, 'required_status_checks').parameters;
  assertExactKeys(actualStatus, Object.keys(expectedStatus), 'existing required_status_checks parameters');
  if (typeof actualStatus.strict_required_status_checks_policy !== 'boolean') {
    fail('existing strict status-check policy is malformed');
  }
  if (typeof actualStatus.do_not_enforce_on_create !== 'boolean') {
    fail('existing create enforcement flag is malformed');
  }
  if (actualStatus.strict_required_status_checks_policy === true && expectedStatus.strict_required_status_checks_policy === false) {
    fail('existing strict status-check policy is stronger than target');
  }
  if (actualStatus.do_not_enforce_on_create === false && expectedStatus.do_not_enforce_on_create === true) {
    fail('existing create enforcement is stronger than target');
  }
  if (!Array.isArray(actualStatus.required_status_checks)) fail('existing required status checks are malformed');
  if (actualStatus.required_status_checks.length !== 0 &&
      JSON.stringify(actualStatus.required_status_checks) !== JSON.stringify(expectedStatus.required_status_checks)) {
    fail('existing required status checks would be removed or changed');
  }
  return true;
}

export function validateLiveRuleset(expected, actual) {
  validateCreationSpec(expected);
  if (!isObject(actual)) fail('live ruleset must be an object');
  if (actual.name !== expected.name || actual.target !== expected.target || actual.enforcement !== expected.enforcement) fail('live ruleset identity/enforcement mismatch');
  if (actual.source_type !== 'Repository' || actual.source !== 'thanhtuyen662002/CodeForge-AI') fail('live ruleset source mismatch');
  if (!Array.isArray(actual.bypass_actors) || actual.bypass_actors.length !== 0) fail('live ruleset has bypass actors');
  if (actual.current_user_can_bypass !== 'never') fail('current user must not be able to bypass ruleset');
  assertExactKeys(actual.conditions, ['ref_name'], 'live ruleset conditions');
  const liveRef = actual.conditions.ref_name;
  assertExactKeys(liveRef, ['include', 'exclude'], 'live ruleset ref_name condition');
  if (!Array.isArray(liveRef.include) || liveRef.include.length !== 1 ||
      liveRef.include[0] !== '~DEFAULT_BRANCH' || !Array.isArray(liveRef.exclude) || liveRef.exclude.length !== 0) {
    fail('live ruleset branch conditions mismatch');
  }
  assertRuleSetShape(actual.rules, 'live ruleset');
  const expectedWorkflow = getRule(expected.rules, 'workflows').parameters;
  const liveWorkflow = getRule(actual.rules, 'workflows');
  validateWorkflowParameters(liveWorkflow.parameters, 'live workflows parameters');
  if (!workflowPinMatches(expectedWorkflow, liveWorkflow.parameters)) {
    fail('live trusted workflow pin mismatch');
  }

  for (const type of ['deletion', 'non_fast_forward', 'required_linear_history']) {
    const rule = getRule(actual.rules, type);
    assertExactKeys(rule, ['type'], `live rule ${type}`);
  }

  const expPrRule = getRule(expected.rules, 'pull_request');
  const livePrRule = getRule(actual.rules, 'pull_request');
  assertExactKeys(livePrRule, ['type', 'parameters'], 'live pull_request rule');
  const expPr = expPrRule.parameters;
  const livePr = livePrRule.parameters;
  assertExactKeys(livePr, Object.keys(expPr), 'live pull_request parameters');
  for (const key of Object.keys(expPr).filter((key) => key !== 'allowed_merge_methods')) {
    if (Array.isArray(expPr[key]) ? JSON.stringify(livePr?.[key]) !== JSON.stringify(expPr[key]) : livePr?.[key] !== expPr[key]) {
      fail(`live pull_request parameter mismatch: ${key}`);
    }
  }
  if (!Array.isArray(livePr.allowed_merge_methods) || livePr.allowed_merge_methods.length < 1 ||
      new Set(livePr.allowed_merge_methods).size !== livePr.allowed_merge_methods.length ||
      livePr.allowed_merge_methods.some((method) => !expPr.allowed_merge_methods.includes(method))) {
    fail('live ruleset allowed merge methods are malformed or broader than the reviewed set');
  }

  const expStatusRule = getRule(expected.rules, 'required_status_checks');
  const liveStatusRule = getRule(actual.rules, 'required_status_checks');
  assertExactKeys(liveStatusRule, ['type', 'parameters'], 'live required_status_checks rule');
  const expStatus = expStatusRule.parameters;
  const liveStatus = liveStatusRule.parameters;
  assertExactKeys(liveStatus, Object.keys(expStatus), 'live required_status_checks parameters');
  if (liveStatus.strict_required_status_checks_policy !== expStatus.strict_required_status_checks_policy) fail('live strict status-check policy mismatch');
  if (liveStatus.do_not_enforce_on_create !== expStatus.do_not_enforce_on_create) fail('live do_not_enforce_on_create mismatch');
  if (!Array.isArray(liveStatus.required_status_checks) || liveStatus.required_status_checks.length !== 1) fail('live required status check count mismatch');
  const liveCheck = liveStatus.required_status_checks[0];
  assertExactKeys(liveCheck, ['context', 'integration_id'], 'live required status check');
  if (liveCheck.context !== 'merge-gate' || liveCheck.integration_id !== ACTIONS_APP_ID) fail('live merge-gate check mismatch');
  return true;
}

function selectLatestWorkflowRun(payload, headSha) {
  if (!isObject(payload) || !Number.isInteger(payload.total_count) || !Array.isArray(payload.workflow_runs)) {
    fail('workflow-runs payload is malformed');
  }
  if (payload.total_count !== payload.workflow_runs.length) {
    fail('workflow-runs evidence is incomplete or paginated');
  }
  if (payload.workflow_runs.length < 1) fail('no workflow runs found for the foundation head');

  const candidates = [];
  const seenIds = new Set();
  for (const run of payload.workflow_runs) {
    if (!isObject(run)) fail('workflow run is malformed');
    if (run.head_sha !== headSha) fail('workflow-run evidence is for a different head SHA');
    if (typeof run.path !== 'string') fail('workflow run is missing its workflow path');
    const path = run.path.split('@')[0];
    if (path !== FOUNDATION_WORKFLOW_PATH || run.head_branch !== FOUNDATION_BRANCH) continue;
    if (typeof run.event !== 'string') fail('workflow run event is invalid');
    if (run.event !== 'pull_request') continue;
    if (!Array.isArray(run.pull_requests) || run.pull_requests.length !== 1 ||
        run.pull_requests[0]?.number !== 1 ||
        run.pull_requests[0]?.head?.ref !== FOUNDATION_BRANCH ||
        run.pull_requests[0]?.head?.sha !== headSha ||
        run.pull_requests[0]?.base?.ref !== 'main') {
      fail('workflow run PR association does not uniquely match PR #1 targeting main');
    }
    if (!Number.isSafeInteger(run.id) || run.id < 1 || seenIds.has(run.id)) fail('workflow-run ID is invalid or duplicated');
    if (!Number.isSafeInteger(run.run_number) || run.run_number < 1) fail('workflow run number is invalid');
    if (!Number.isSafeInteger(run.run_attempt) || run.run_attempt < 1) fail('workflow run attempt is invalid');
    if (typeof run.created_at !== 'string' || !Number.isFinite(Date.parse(run.created_at))) fail('workflow run creation timestamp is invalid');
    // created_at stays fixed when a run is re-run; run_started_at resets for each attempt.
    if (typeof run.run_started_at !== 'string' || !Number.isFinite(Date.parse(run.run_started_at))) {
      fail('workflow run latest-attempt start timestamp is invalid');
    }
    seenIds.add(run.id);
    candidates.push(run);
  }
  if (candidates.length < 1) fail('no Foundation CI run found for the exact foundation branch and head SHA');

  candidates.sort((a, b) => Date.parse(a.run_started_at) - Date.parse(b.run_started_at));
  const latest = candidates[candidates.length - 1];
  const latestStartedAt = Date.parse(latest.run_started_at);
  const tied = candidates.filter((run) => Date.parse(run.run_started_at) === latestStartedAt);
  if (tied.length !== 1) fail('latest foundation workflow attempt timestamp is ambiguous');
  return latest;
}

export function assertLatestWorkflowRunStable(initialPayload, currentPayload, headSha) {
  const initial = selectLatestWorkflowRun(initialPayload, headSha);
  const current = selectLatestWorkflowRun(currentPayload, headSha);
  if (initial.id !== current.id || initial.run_attempt !== current.run_attempt ||
      initial.run_started_at !== current.run_started_at) {
    fail('latest foundation workflow attempt changed during validation');
  }
  return true;
}

function validateCheckRuns(checkRunsPayload, workflowRunsPayload, jobsPayload, headSha, expectedConclusion) {
  if (!isObject(checkRunsPayload) || !Number.isInteger(checkRunsPayload.total_count) || !Array.isArray(checkRunsPayload.check_runs)) {
    fail('check-runs payload is malformed');
  }
  if (!Number.isInteger(checkRunsPayload.source_total_count) || !Array.isArray(checkRunsPayload.source_check_runs) ||
      checkRunsPayload.source_total_count !== checkRunsPayload.source_check_runs.length) {
    fail('source check-runs evidence is incomplete or paginated');
  }
  if (checkRunsPayload.total_count !== checkRunsPayload.check_runs.length) fail('filtered check-runs evidence count is inconsistent');
  if (checkRunsPayload.total_count < 1) fail('no merge-gate check-runs found');

  const seenIds = new Set();
  for (const run of checkRunsPayload.check_runs) {
    if (run?.name !== 'merge-gate') fail('unexpected check name in evidence');
    if (run?.app?.id !== ACTIONS_APP_ID) fail('merge-gate evidence is not from GitHub Actions');
    if (run?.head_sha !== headSha) fail('merge-gate evidence is for a different head SHA');
    if (!Number.isSafeInteger(run?.id) || run.id < 1 || seenIds.has(run.id)) fail('merge-gate check-run ID is invalid or duplicated');
    if (typeof run.details_url !== 'string') fail('merge-gate check-run is missing its workflow-job URL');
    seenIds.add(run.id);
  }

  const latestWorkflowRun = selectLatestWorkflowRun(workflowRunsPayload, headSha);
  if (!isObject(jobsPayload) || !Number.isInteger(jobsPayload.total_count) || !Array.isArray(jobsPayload.jobs)) {
    fail('workflow-job payload is malformed');
  }
  if (jobsPayload.total_count !== jobsPayload.jobs.length) fail('workflow-job evidence is incomplete or paginated');
  if (jobsPayload.jobs.length < 1) fail('latest workflow attempt has no jobs');

  const jobIds = new Set();
  for (const job of jobsPayload.jobs) {
    if (!Number.isSafeInteger(job?.id) || job.id < 1 || jobIds.has(job.id)) fail('workflow-job ID is invalid or duplicated');
    if (job?.run_id !== latestWorkflowRun.id) fail('workflow-job belongs to a different workflow run');
    if (job?.head_sha !== headSha) fail('workflow-job belongs to a different head SHA');
    jobIds.add(job.id);
  }

  const mergeGateJobs = jobsPayload.jobs.filter((job) => job.name === 'merge-gate');
  if (mergeGateJobs.length !== 1) fail('latest workflow attempt must contain exactly one merge-gate job');
  const latestJob = mergeGateJobs[0];

  const matchingCheckRuns = checkRunsPayload.check_runs.filter((run) => {
    const match = run.details_url.match(/\/actions\/runs\/(\d+)\/job\/(\d+)(?:$|[?#])/);
    return match && Number(match[1]) === latestWorkflowRun.id && Number(match[2]) === latestJob.id && run.id === latestJob.id;
  });
  if (matchingCheckRuns.length !== 1) fail('latest workflow attempt merge-gate job has no unique matching CheckRun');
  const latestCheckRun = matchingCheckRuns[0];

  if (latestCheckRun.status !== latestJob.status || latestCheckRun.conclusion !== latestJob.conclusion) {
    fail('latest workflow attempt job and CheckRun status/conclusion disagree');
  }
  if (latestJob.status !== 'completed' || latestCheckRun.status !== 'completed') {
    fail('latest merge-gate workflow attempt is not completed');
  }
  if (latestJob.conclusion !== expectedConclusion || latestCheckRun.conclusion !== expectedConclusion) {
    fail('latest merge-gate conclusion must be ' + expectedConclusion);
  }
  return true;
}
export function assertMergeGateEvidence(checkRunsPayload, workflowRunsPayload, jobsPayload, headSha) {
  return validateCheckRuns(checkRunsPayload, workflowRunsPayload, jobsPayload, headSha, 'success');
}

export function assertNegativeControlEvidence(checkRunsPayload, workflowRunsPayload, jobsPayload, headSha) {
  return validateCheckRuns(checkRunsPayload, workflowRunsPayload, jobsPayload, headSha, 'failure');
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function usage() {
  console.error('Usage: check-ruleset-readback.mjs --validate-spec SPEC | --validate-main-workflow-pin SPEC MAIN_SHA | --validate-existing-target SPEC LIVE | --compare SPEC LIVE | --select-latest-workflow-run WORKFLOW_RUNS HEAD_SHA | --assert-latest-workflow-run-stable INITIAL CURRENT HEAD_SHA | --validate-merge-gate CHECK_RUNS WORKFLOW_RUNS JOBS HEAD_SHA | --validate-negative-control CHECK_RUNS WORKFLOW_RUNS JOBS HEAD_SHA');
  process.exit(2);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  try {
    const [mode, ...args] = process.argv.slice(2);
    if (mode === '--validate-spec' && args.length === 1) validateCreationSpec(readJson(args[0]));
    else if (mode === '--validate-main-workflow-pin' && args.length === 2) validateMainWorkflowPin(readJson(args[0]), args[1]);
    else if (mode === '--validate-existing-target' && args.length === 2) validateExistingTarget(readJson(args[0]), readJson(args[1]));
    else if (mode === '--compare' && args.length === 2) validateLiveRuleset(readJson(args[0]), readJson(args[1]));
    else if (mode === '--select-latest-workflow-run' && args.length === 2) {
      const run = selectLatestWorkflowRun(readJson(args[0]), args[1]);
      process.stdout.write(String(run.id) + '\t' + String(run.run_attempt) + '\n');
    }
    else if (mode === '--assert-latest-workflow-run-stable' && args.length === 3) {
      assertLatestWorkflowRunStable(readJson(args[0]), readJson(args[1]), args[2]);
    }
    else if (mode === '--validate-merge-gate' && args.length === 4) assertMergeGateEvidence(readJson(args[0]), readJson(args[1]), readJson(args[2]), args[3]);
    else if (mode === '--validate-negative-control' && args.length === 4) assertNegativeControlEvidence(readJson(args[0]), readJson(args[1]), readJson(args[2]), args[3]);
    else usage();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
