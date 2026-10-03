import {
  evaluateEnvironmentReadiness,
} from '../dist/index.js';

const publicNames = Object.keys(process.env).filter((name) => name.startsWith('NEXT_PUBLIC_'));
const privilegedKeyExposedToBrowser = publicNames.some((name) =>
  /(SERVICE_ROLE|SECRET|PRIVATE|DATABASE_URL|DB_PASSWORD|ACCESS_TOKEN)/.test(name),
);

const rawEnvironment = process.env.CODEFORGE_ENVIRONMENT ?? 'unknown';
const environment = ['unknown', 'local', 'development', 'staging', 'production'].includes(rawEnvironment)
  ? rawEnvironment
  : 'unknown';
const rawVercelEnvironment = process.env.VERCEL_ENV ?? '';
const vercelEnvironment = rawVercelEnvironment === 'production' || rawVercelEnvironment === 'preview'
  ? rawVercelEnvironment
  : null;

const readiness = evaluateEnvironmentReadiness({
  environment,
  expectedSupabaseProjectRef: process.env.CODEFORGE_SUPABASE_PROJECT_REF ?? '',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
  publishableKeyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  migrationAuthorityVerified: process.env.CODEFORGE_MIGRATION_AUTHORITY_VERIFIED === 'true',
  privilegedKeyExposedToBrowser,
  vercelProjectIdConfigured: Boolean(process.env.VERCEL_PROJECT_ID),
  vercelEnvironment,
  migrationTargetApproved: process.env.CODEFORGE_MIGRATION_TARGET_APPROVED === 'true',
  productionReleaseApproved: process.env.CODEFORGE_PRODUCTION_RELEASE_APPROVED === 'true',
});

console.log(JSON.stringify({
  environment,
  supabaseProjectRef: readiness.supabaseProjectRef,
  supabaseTargetMatches: readiness.supabaseTargetMatches,
  browserConfigReady: readiness.browserConfigReady,
  browserAccessAllowed: readiness.browserAccessAllowed,
  hostedDatabaseWritesAllowed: readiness.hostedDatabaseWritesAllowed,
  productionDeployAllowed: readiness.productionDeployAllowed,
  reasons: readiness.reasons,
}, null, 2));

if (privilegedKeyExposedToBrowser) {
  throw new Error('Privileged credential-shaped variable is exposed through NEXT_PUBLIC_.');
}

if (environment === 'unknown' &&
    (readiness.browserAccessAllowed ||
      readiness.hostedDatabaseWritesAllowed ||
      readiness.productionDeployAllowed)) {
  throw new Error('Unclassified environment must remain fail-closed.');
}
