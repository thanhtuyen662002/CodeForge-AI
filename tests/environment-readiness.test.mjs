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
  migrationAuthorityVerified: false,
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

test('development hosted writes require target approval and verified migration authority', () => {
  const noTargetApproval = evaluateEnvironmentReadiness(input({
    environment: 'development',
    publishableKeyConfigured: true,
    migrationAuthorityVerified: true,
  }));
  assert.equal(noTargetApproval.browserAccessAllowed, true);
  assert.equal(noTargetApproval.hostedDatabaseWritesAllowed, false);

  const noMigrationAuthority = evaluateEnvironmentReadiness(input({
    environment: 'development',
    publishableKeyConfigured: true,
    migrationTargetApproved: true,
  }));
  assert.equal(noMigrationAuthority.hostedDatabaseWritesAllowed, false);
  assert.ok(noMigrationAuthority.reasons.includes('migration_authority_not_verified'));

  const approved = evaluateEnvironmentReadiness(input({
    environment: 'development',
    publishableKeyConfigured: true,
    migrationAuthorityVerified: true,
    migrationTargetApproved: true,
  }));
  assert.equal(approved.hostedDatabaseWritesAllowed, true);
  assert.equal(approved.productionDeployAllowed, false);
});

test('application API privilege is not modeled as migration authority', () => {
  const result = evaluateEnvironmentReadiness(input({
    environment: 'staging',
    publishableKeyConfigured: true,
    migrationTargetApproved: true,
    migrationAuthorityVerified: false,
  }));
  assert.equal(result.hostedDatabaseWritesAllowed, false);
  assert.ok(result.reasons.includes('migration_authority_not_verified'));
});

test('privileged browser exposure blocks browser and hosted write readiness', () => {
  const result = evaluateEnvironmentReadiness(input({
    environment: 'staging',
    publishableKeyConfigured: true,
    migrationAuthorityVerified: true,
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

test('production database writes require separate migration target and authority approval', () => {
  const withoutAuthority = evaluateEnvironmentReadiness(input({
    environment: 'production',
    publishableKeyConfigured: true,
    vercelProjectIdConfigured: true,
    vercelEnvironment: 'production',
    productionReleaseApproved: true,
    migrationTargetApproved: true,
  }));
  assert.equal(withoutAuthority.productionDeployAllowed, true);
  assert.equal(withoutAuthority.hostedDatabaseWritesAllowed, false);

  const approved = evaluateEnvironmentReadiness(input({
    environment: 'production',
    publishableKeyConfigured: true,
    migrationAuthorityVerified: true,
    vercelProjectIdConfigured: true,
    vercelEnvironment: 'production',
    productionReleaseApproved: true,
    migrationTargetApproved: true,
  }));
  assert.equal(approved.productionDeployAllowed, true);
  assert.equal(approved.hostedDatabaseWritesAllowed, true);
});

test('invalid runtime environment fails closed', () => {
  assert.throws(
    () => evaluateEnvironmentReadiness(input({ environment: 'qa' })),
    /invalid_environment/,
  );
});
