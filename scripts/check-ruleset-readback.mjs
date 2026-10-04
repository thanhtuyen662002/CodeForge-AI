#!/usr/bin/env node
import fs from 'node:fs';

const ACTIONS_APP_ID = 15368;
const EXPECTED_RULE_TYPES = [
  'deletion',
  'non_fast_forward',
  'required_linear_history',
  'pull_request',
  'required_status_checks',
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

function assertRuleSetShape(rules, label) {
  if (!Array.isArray(rules)) fail(`${label}.rules must be an array`);
  const types = rules.map((rule, index) => {
    if (!isObject(rule) || typeof rule.type !== 'string') fail(`${label}.rules[${index}] has invalid type`);
    return rule.type;
  });
  if (new Set(types).size !== types.length) fail(`${label}.rules contains duplicate rule types`);
  const sorted = [...types].sort();
  const expected = [...EXPECTED_RULE_TYPES].sort();
  if (JSON.stringify(sorted) !== JSON.stringify(expected)) {
    fail(`${label}.rules must contain exactly: ${EXPECTED_RULE_TYPES.join(', ')}`);
  }
}

export function validateCreationSpec(spec) {
  assertExactKeys(spec, ['name', 'target', 'enforcement', 'bypass_actors', 'conditions', 'rules'], 'ruleset spec');
  if (spec.name !== 'CodeForge main') fail('ruleset spec name mismatch');
  if (spec.target !== 'branch') fail('ruleset spec target must be branch');
  if (spec.enforcement !== 'active') fail('ruleset spec enforcement must be active');
  if (!Array.isArray(spec.bypass_actors) || spec.bypass_actors.length !== 0) fail('ruleset spec must not contain bypass actors');
  if (!isObject(spec.conditions) || !isObject(spec.conditions.ref_name) ||
      !Array.isArray(spec.conditions.ref_name.include) || spec.conditions.ref_name.include.length !== 1 ||
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
      ], 'pull_request parameters');
      const p = rule.parameters;
      if (p.required_approving_review_count !== 1) fail('pull_request must require exactly one approval');
      if (p.dismiss_stale_reviews_on_push !== true) fail('pull_request must dismiss stale reviews');
      if (p.require_code_owner_review !== false) fail('code-owner review must remain false during sole-owner bootstrap');
      if (p.require_last_push_approval !== true) fail('pull_request must require latest-push approval');
      if (p.required_review_thread_resolution !== true) fail('pull_request must require resolved review threads');
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

function getRule(rules, type) {
  const found = rules.filter((rule) => rule?.type === type);
  if (found.length !== 1) fail(`live ruleset must contain exactly one ${type} rule`);
  return found[0];
}

export function validateLiveRuleset(expected, actual) {
  validateCreationSpec(expected);
  if (!isObject(actual)) fail('live ruleset must be an object');
  if (actual.name !== expected.name || actual.target !== expected.target || actual.enforcement !== expected.enforcement) fail('live ruleset identity/enforcement mismatch');
  if (actual.source_type !== 'Repository' || actual.source !== 'thanhtuyen662002/CodeForge-AI') fail('live ruleset source mismatch');
  if (!Array.isArray(actual.bypass_actors) || actual.bypass_actors.length !== 0) fail('live ruleset has bypass actors');
  if (actual.current_user_can_bypass !== 'never') fail('current user must not be able to bypass ruleset');
  const liveRef = actual.conditions?.ref_name;
  if (!isObject(liveRef) || !Array.isArray(liveRef.include) || liveRef.include.length !== 1 ||
      liveRef.include[0] !== '~DEFAULT_BRANCH' || !Array.isArray(liveRef.exclude) || liveRef.exclude.length !== 0) {
    fail('live ruleset branch conditions mismatch');
  }
  assertRuleSetShape(actual.rules, 'live ruleset');

  for (const type of ['deletion', 'non_fast_forward', 'required_linear_history']) getRule(actual.rules, type);

  const expPr = getRule(expected.rules, 'pull_request').parameters;
  const livePr = getRule(actual.rules, 'pull_request').parameters;
  for (const key of Object.keys(expPr)) {
    if (livePr?.[key] !== expPr[key]) fail(`live pull_request parameter mismatch: ${key}`);
  }
  if ('required_reviewers' in livePr && (!Array.isArray(livePr.required_reviewers) || livePr.required_reviewers.length !== 0)) {
    fail('live ruleset unexpectedly requires named reviewers');
  }

  const expStatus = getRule(expected.rules, 'required_status_checks').parameters;
  const liveStatus = getRule(actual.rules, 'required_status_checks').parameters;
  if (liveStatus?.strict_required_status_checks_policy !== expStatus.strict_required_status_checks_policy) fail('live strict status-check policy mismatch');
  if (liveStatus?.do_not_enforce_on_create !== expStatus.do_not_enforce_on_create) fail('live do_not_enforce_on_create mismatch');
  if (!Array.isArray(liveStatus?.required_status_checks) || liveStatus.required_status_checks.length !== 1) fail('live required status check count mismatch');
  const liveCheck = liveStatus.required_status_checks[0];
  if (liveCheck.context !== 'merge-gate' || liveCheck.integration_id !== ACTIONS_APP_ID) fail('live merge-gate check mismatch');
  return true;
}

function validateCheckRuns(payload, headSha, expectedConclusion) {
  if (!isObject(payload) || !Number.isInteger(payload.total_count) || !Array.isArray(payload.check_runs)) fail('check-runs payload is malformed');
  if (payload.total_count < 1 || payload.check_runs.length < 1) fail('no merge-gate check-runs found');
  if (payload.total_count !== payload.check_runs.length) fail('check-runs evidence is incomplete or paginated');
  for (const run of payload.check_runs) {
    if (run?.name !== 'merge-gate') fail('unexpected check name in evidence');
    if (run?.app?.id !== ACTIONS_APP_ID) fail('merge-gate evidence is not from GitHub Actions');
    if (run?.head_sha !== headSha) fail('merge-gate evidence is for a different head SHA');
    if (run?.status !== 'completed') fail('merge-gate evidence is not completed');
    if (run?.conclusion !== expectedConclusion) fail(`merge-gate conclusion must be ${expectedConclusion}`);
  }
  return true;
}

export function assertMergeGateEvidence(payload, headSha) {
  return validateCheckRuns(payload, headSha, 'success');
}

export function assertNegativeControlEvidence(payload, headSha) {
  return validateCheckRuns(payload, headSha, 'failure');
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function usage() {
  console.error('Usage: check-ruleset-readback.mjs --validate-spec SPEC | --compare SPEC LIVE | --validate-merge-gate EVIDENCE HEAD_SHA | --validate-negative-control EVIDENCE HEAD_SHA');
  process.exit(2);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  try {
    const [mode, ...args] = process.argv.slice(2);
    if (mode === '--validate-spec' && args.length === 1) validateCreationSpec(readJson(args[0]));
    else if (mode === '--compare' && args.length === 2) validateLiveRuleset(readJson(args[0]), readJson(args[1]));
    else if (mode === '--validate-merge-gate' && args.length === 2) assertMergeGateEvidence(readJson(args[0]), args[1]);
    else if (mode === '--validate-negative-control' && args.length === 2) assertNegativeControlEvidence(readJson(args[0]), args[1]);
    else usage();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
