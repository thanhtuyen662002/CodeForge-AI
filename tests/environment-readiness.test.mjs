import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateEnvironmentReadiness,
  parseSupabaseProjectRef,
} from '../dist/index.js';

const projectRef = 'qvufngaseebmaxzthrdi';
const projectUrl = 'https://qvufngaseebmaxzthrdi.supabase.co';

const input = (changes = {}) => ({
  environment: 'unknown',
  expectedSupabaseProjectRef: projectRef,
  supabaseUrl: projectUrl,
  publishableKeyConfigured: false,
  privilegedServerKeyConfigured: false,
  privilegedKeyExposedToBrowser: false,
  vercelProjectIdConfigured: false,
  vercelEnvironment: null,
  migrationTargetApproved: false,
  productionReleaseApproved: false,
  ...changes,
});

test('parses only canonical Supabase project URLs', () => {
  assert.equal(parseSupabaseProjectRef(projectUrl), projectRef);
  assert.equal(parseSupabaseProjectRef(`${projectUrl}/`), projectRef);
  assert.equal(parseSupabaseProjectRef('http://qvufngaseebmaxzthrdi.supabase.co'), null);
  assert.equal(parseSupabaseProjectRef('https://example.com/qvufngaseebmaxzthrdi'), null);
  assert.equal(parseSupabaseProjectRef(null), null);
});

test('owner-provided project stays fail-closed while environment is unclassified', () => {
  const result = evaluateEnvironmentReadiness(input());
  assert.equal(result.supabaseTargetMatches, true);
  assert.equal(result.browserAccessAllowed, false);
  assert.equal(result.hostedDatabaseWritesAllowed, false);
  assert.equal(result.productionDeployAllowed, false);
  assert.ok(result.reasons.includes('environment_unclassified'));
});

test('wrong Supabase target cannot become browser-ready', () => {
  const result = evaluateEnvironmentReadiness(input({
    environment: 'development',
    supabaseUrl: 'https://wrong-project.supabase.co',
    publishableKeyConfigured: true,
  }));
  assert.equal(result.supabaseTargetMatches, false);
  assert.equal(result.browserConfigReady, false);
  assert.equal(result.browserAccessAllowed, false);
});

test('development hosted writes require explicit target approval and server credential', () => {
  const blocked = evaluateEnvironmentReadiness(input({
    environment: 'development',
    publishableKeyConfigured: true,
    privilegedServerKeyConfigured: true,
  }));
  assert.equal(blocked.browserAccessAllowed, true);
  assert.equal(blocked.hostedDatabaseWritesAllowed, false);

  const approved = evaluateEnvironmentReadiness(input({
    environment: 'development',
    publishableKeyConfigured: true,
    privilegedServerKeyConfigured: true,
    migrationTargetApproved: true,
  }));
  assert.equal(approved.hostedDatabaseWritesAllowed, true);
  assert.equal(approved.productionDeployAllowed, false);
});

test('privileged browser exposure blocks browser and hosted write readiness', () => {
  const result = evaluateEnvironmentReadiness(input({
    environment: 'staging',
    publishableKeyConfigured: true,
    privilegedServerKeyConfigured: true,
    privilegedKeyExposedToBrowser: true,
    migrationTargetApproved: true,
  }));
  assert.equal(result.browserConfigReady, false);
  assert.equal(result.browserAccessAllowed, false);
  assert.equal(result.hostedDatabaseWritesAllowed, false);
  assert.ok(result.reasons.includes('privileged_key_exposed_to_browser'));
});

test('production deploy requires verified Vercel production target and release approval', () => {
  const blocked = evaluateEnvironmentReadiness(input({
    environment: 'production',
    publishableKeyConfigured: true,
    vercelProjectIdConfigured: true,
    vercelEnvironment: 'production',
  }));
  assert.equal(blocked.productionDeployAllowed, false);

  const approved = evaluateEnvironmentReadiness(input({
    environment: 'production',
    publishableKeyConfigured: true,
    vercelProjectIdConfigured: true,
    vercelEnvironment: 'production',
    productionReleaseApproved: true,
  }));
  assert.equal(approved.browserAccessAllowed, true);
  assert.equal(approved.productionDeployAllowed, true);
  assert.equal(approved.hostedDatabaseWritesAllowed, false);
});

test('production database writes require separate migration approval', () => {
  const result = evaluateEnvironmentReadiness(input({
    environment: 'production',
    publishableKeyConfigured: true,
    privilegedServerKeyConfigured: true,
    vercelProjectIdConfigured: true,
    vercelEnvironment: 'production',
    productionReleaseApproved: true,
    migrationTargetApproved: true,
  }));
  assert.equal(result.productionDeployAllowed, true);
  assert.equal(result.hostedDatabaseWritesAllowed, true);
});

test('invalid runtime environment fails closed', () => {
  assert.throws(
    () => evaluateEnvironmentReadiness(input({ environment: 'qa' })),
    /invalid_environment/,
  );
});
