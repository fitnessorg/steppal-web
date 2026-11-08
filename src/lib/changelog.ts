/**
 * Ecosystem changelog aggregation across steppal-core, steppal-mobile, and steppal-web.
 *
 * Reads the GitHub Releases API when online or configured, and falls back
 * seamlessly to curated milestone snapshots so static builds succeed 100%
 * offline with zero credentials.
 */

export type RepoName = 'steppal-core' | 'steppal-mobile' | 'steppal-web';

export interface ChangelogRelease {
  id: string;
  repo: RepoName;
  tag: string;
  title: string;
  publishedAt: string;
  url: string;
  summary: string;
  highlights: string[];
}

export const ECOSYSTEM_REPOS: readonly RepoName[] = [
  'steppal-core',
  'steppal-mobile',
  'steppal-web',
] as const;

export const FALLBACK_RELEASES: readonly ChangelogRelease[] = [
  {
    id: 'steppal-web-v0.3.0',
    repo: 'steppal-web',
    tag: 'v0.3.0',
    title: 'Resilient Waitlist, Motion Decoupling & Dynamic OG Cards',
    publishedAt: '2026-11-06',
    url: 'https://github.com/fitnessorg/steppal-web/releases/tag/v0.3.0',
    summary:
      'Decoupled smooth-scroll tickers from reading pages, added dynamic Open Graph social cards, and wired the steppal-core Postgres waitlist adapter.',
    highlights: [
      'Added pluggable steppal-core waitlist store with HTTP 409 idempotent deduplication.',
      'Scoped Lenis and GSAP RAF loops strictly to the interactive landing page.',
      'Generated route-specific Open Graph social cards via Next.js ImageResponse.',
      'Added automatic heading anchor permalinks and accessible tablist controls.',
    ],
  },
  {
    id: 'steppal-core-v0.2.0',
    repo: 'steppal-core',
    tag: 'v0.2.0',
    title: 'Soroban Escrow Contract & Deterministic Kobo Settlement',
    publishedAt: '2026-10-28',
    url: 'https://github.com/fitnessorg/steppal-core/releases/tag/v0.2.0',
    summary:
      'Implemented the Stellar Soroban escrow smart contract and integer-kobo settlement engine with full refunds when zero members hit the goal.',
    highlights: [
      'Soroban escrow contract holds pot stakes and enforces a 24-hour dispute window.',
      'Integer-kobo settlement distributes forfeited stakes evenly among winners.',
      'Automatic stake return when nobody in a pot meets the daily step goal.',
      'Published @steppal/sdk TypeScript client for mobile and web consumers.',
    ],
  },
  {
    id: 'steppal-mobile-v0.2.0',
    repo: 'steppal-mobile',
    tag: 'v0.2.0',
    title: 'Health Connect Step Sync & Zero-Server Mock Mode',
    publishedAt: '2026-10-19',
    url: 'https://github.com/fitnessorg/steppal-mobile/releases/tag/v0.2.0',
    summary:
      'Wired Android Health Connect daily step aggregation and built a complete mock data provider so contributors can run every screen without a server.',
    highlights: [
      'Local aggregation of Health Connect step records; only daily totals leave the phone.',
      'Zero-config mock mode when EXPO_PUBLIC_API_URL is unset.',
      'Live pot standings, weekly progress grid, and Naira wallet screens.',
    ],
  },
  {
    id: 'steppal-core-v0.1.0',
    repo: 'steppal-core',
    tag: 'v0.1.0',
    title: 'Step Claim Validation & Console OTP Authentication',
    publishedAt: '2026-10-04',
    url: 'https://github.com/fitnessorg/steppal-core/releases/tag/v0.1.0',
    summary:
      'Initial Fastify API and Postgres schema for phone-based authentication, pot creation, and plausibility-clamped step submissions.',
    highlights: [
      'Rejects future dates and backfills older than the active settlement window.',
      'Clamps implausible daily step counts while retaining raw figures for dispute audits.',
      'Idempotent per-day step writes to handle flaky mobile network retries safely.',
      'Console SMS provider (SMS_PROVIDER=console) for credential-free local development.',
    ],
  },
  {
    id: 'steppal-web-v0.1.0',
    repo: 'steppal-web',
    tag: 'v0.1.0',
    title: 'Initial Public Site, Architecture Docs & In-Memory Waitlist',
    publishedAt: '2026-09-15',
    url: 'https://github.com/fitnessorg/steppal-web/releases/tag/v0.1.0',
    summary:
      'Launched the StepPal public front door with scroll-driven landing sections, plain-language legal docs, and a zero-config waitlist.',
    highlights: [
      'Nine scroll-driven landing sections built with GSAP, ScrollTrigger, and Lenis.',
      'Plain-word Architecture, Contribute, Privacy, and Terms reading pages.',
      'Honeypot-protected, rate-limited waitlist API with in-memory default store.',
    ],
  },
];

interface GitHubReleasePayload {
  id?: number;
  tag_name?: string;
  name?: string;
  published_at?: string;
  html_url?: string;
  body?: string;
  draft?: boolean;
}

/**
 * Parses a raw markdown release body into a concise summary sentence and bullet highlights.
 */
export function parseReleaseBody(body: string): { summary: string; highlights: string[] } {
  const lines = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const highlights: string[] = [];
  let summary = '';

  for (const line of lines) {
    if (line.startsWith('#')) continue;
    if (line.startsWith('- ') || line.startsWith('* ')) {
      highlights.push(line.slice(2).trim());
    } else if (!summary) {
      summary = line;
    }
  }

  return {
    summary: summary || 'Release update across the StepPal ecosystem.',
    highlights,
  };
}

/**
 * Sorts releases in descending chronological order (newest first).
 */
export function sortReleases(releases: readonly ChangelogRelease[]): ChangelogRelease[] {
  return [...releases].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Fetches releases across all three StepPal repositories from the GitHub API when
 * enabled, falling back cleanly to curated snapshot releases when offline,
 * rate-limited, or unconfigured.
 */
export async function fetchEcosystemReleases(
  options: {
    fetchImpl?: typeof fetch;
    enableNetwork?: boolean;
    githubToken?: string;
  } = {},
): Promise<ChangelogRelease[]> {
  const enableNetwork =
    options.enableNetwork ?? process.env.STEPPAL_FETCH_GITHUB_RELEASES === 'true';

  if (!enableNetwork) {
    return sortReleases(FALLBACK_RELEASES);
  }

  const fetchFn = options.fetchImpl ?? fetch;
  const token = options.githubToken ?? process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
  };
  if (token) {
    headers['authorization'] = `Bearer ${token}`;
  }

  try {
    const results = await Promise.all(
      ECOSYSTEM_REPOS.map(async (repo) => {
        const res = await fetchFn(
          `https://api.github.com/repos/fitnessorg/${repo}/releases?per_page=5`,
          { headers },
        );
        if (!res.ok) {
          throw new Error(`GitHub API responded ${res.status} for ${repo}`);
        }
        const data = (await res.json()) as GitHubReleasePayload[];
        return data
          .filter((item) => !item.draft && item.tag_name)
          .map((item): ChangelogRelease => {
            const parsed = parseReleaseBody(item.body ?? '');
            const tag = item.tag_name ?? 'v0.0.0';
            return {
              id: `${repo}-${tag}`,
              repo,
              tag,
              title: item.name || `${repo} ${tag}`,
              publishedAt: (item.published_at ?? new Date().toISOString()).slice(0, 10),
              url: item.html_url || `https://github.com/fitnessorg/${repo}/releases`,
              summary: parsed.summary,
              highlights: parsed.highlights,
            };
          });
      }),
    );

    const flat = results.flat();
    if (flat.length === 0) {
      return sortReleases(FALLBACK_RELEASES);
    }

    return sortReleases(flat);
  } catch {
    return sortReleases(FALLBACK_RELEASES);
  }
}
