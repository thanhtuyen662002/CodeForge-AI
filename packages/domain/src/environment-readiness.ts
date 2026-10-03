export type DeploymentEnvironment = 'unknown' | 'local' | 'development' | 'staging' | 'production';
export type VercelEnvironment = 'preview' | 'production';

export interface EnvironmentReadinessInput {
  readonly environment: DeploymentEnvironment;
  readonly expectedSupabaseProjectRef: string;
  readonly supabaseUrl: string | null;
  readonly publishableKeyConfigured: boolean;
  readonly migrationAuthorityVerified: boolean;
  readonly privilegedKeyExposedToBrowser: boolean;
  readonly vercelProjectIdConfigured: boolean;
  readonly vercelEnvironment: VercelEnvironment | null;
  readonly migrationTargetApproved: boolean;
  readonly productionReleaseApproved: boolean;
}

export interface EnvironmentReadiness {
  readonly supabaseProjectRef: string | null;
  readonly supabaseTargetMatches: boolean;
  readonly browserConfigReady: boolean;
  readonly browserAccessAllowed: boolean;
  readonly hostedDatabaseWritesAllowed: boolean;
  readonly productionDeployAllowed: boolean;
  readonly reasons: readonly string[];
}

const DEPLOYMENT_ENVIRONMENTS: readonly string[] = [
  'unknown',
  'local',
  'development',
  'staging',
  'production',
];

export function parseSupabaseProjectRef(url: string | null): string | null {
  if (url === null) return null;
  const match = /^https:\/\/([a-z0-9-]+)\.supabase\.co\/?$/.exec(url.trim());
  return match?.[1] ?? null;
}

export function evaluateEnvironmentReadiness(
  input: EnvironmentReadinessInput,
): EnvironmentReadiness {
  if (!DEPLOYMENT_ENVIRONMENTS.includes(input.environment)) {
    throw new Error('invalid_environment');
  }

  const expectedRef = input.expectedSupabaseProjectRef.trim();
  const supabaseProjectRef = parseSupabaseProjectRef(input.supabaseUrl);
  const supabaseTargetMatches =
    expectedRef.length > 0 && supabaseProjectRef === expectedRef;
  const browserConfigReady =
    supabaseTargetMatches &&
    input.publishableKeyConfigured &&
    !input.privilegedKeyExposedToBrowser;
  const browserAccessAllowed =
    (input.environment === 'development' ||
      input.environment === 'staging' ||
      input.environment === 'production') &&
    browserConfigReady;

  const nonProductionHostedWrite =
    (input.environment === 'development' || input.environment === 'staging') &&
    input.migrationTargetApproved;
  const productionHostedWrite =
    input.environment === 'production' &&
    input.migrationTargetApproved &&
    input.productionReleaseApproved;
  const hostedDatabaseWritesAllowed =
    supabaseTargetMatches &&
    input.migrationAuthorityVerified &&
    !input.privilegedKeyExposedToBrowser &&
    (nonProductionHostedWrite || productionHostedWrite);

  const productionDeployAllowed =
    input.environment === 'production' &&
    supabaseTargetMatches &&
    browserConfigReady &&
    input.vercelProjectIdConfigured &&
    input.vercelEnvironment === 'production' &&
    input.productionReleaseApproved;

  const reasons: string[] = [];
  if (input.environment === 'unknown') reasons.push('environment_unclassified');
  if (input.environment === 'local') reasons.push('local_environment_no_hosted_access');
  if (supabaseProjectRef === null) reasons.push('invalid_or_missing_supabase_url');
  if (!supabaseTargetMatches) reasons.push('supabase_project_ref_mismatch');
  if (!input.publishableKeyConfigured) reasons.push('publishable_key_not_configured');
  if (input.privilegedKeyExposedToBrowser) reasons.push('privileged_key_exposed_to_browser');
  if (!input.migrationTargetApproved) reasons.push('migration_target_not_approved');
  if (!input.migrationAuthorityVerified) reasons.push('migration_authority_not_verified');
  if (!input.vercelProjectIdConfigured) reasons.push('vercel_project_not_verified');
  if (input.vercelEnvironment !== 'production') reasons.push('vercel_environment_not_production');
  if (!input.productionReleaseApproved) reasons.push('production_release_not_approved');

  return {
    supabaseProjectRef,
    supabaseTargetMatches,
    browserConfigReady,
    browserAccessAllowed,
    hostedDatabaseWritesAllowed,
    productionDeployAllowed,
    reasons,
  };
}
