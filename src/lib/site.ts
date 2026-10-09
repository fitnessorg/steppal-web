/**
 * The canonical origin, in one place.
 *
 * The domain is not owned yet, so it is read from the environment rather than
 * hard-coded — a wrong canonical URL on every page is worse than no domain.
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL on production deploys, so a fresh
 * deploy is already correct; set NEXT_PUBLIC_SITE_URL when there is a real one.
 */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'http://localhost:3000';
}
