import type { Metadata } from 'next';
import Link from 'next/link';
import { Prose } from '@/components/Prose';
import { FALLBACK_RELEASES, sortReleases, type ChangelogRelease } from '@/lib/changelog';

export const metadata: Metadata = {
  title: 'Changelog — StepPal',
  description:
    'What shipped across steppal-core, steppal-mobile, and steppal-web: Soroban escrow milestones, Health Connect sync, and web updates.',
  alternates: {
    canonical: '/changelog',
  },
  openGraph: {
    title: 'Changelog — StepPal',
    description:
      'What shipped across steppal-core, steppal-mobile, and steppal-web: Soroban escrow milestones, Health Connect sync, and web updates.',
    url: '/changelog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog — StepPal',
    description: 'What shipped across steppal-core, steppal-mobile, and steppal-web.',
  },
};

export function ChangelogView({
  releases = sortReleases(FALLBACK_RELEASES),
}: {
  releases?: readonly ChangelogRelease[];
}) {
  return (
    <Prose
      eyebrow="Changelog"
      title="What shipped across the three repos."
      lede="StepPal moves across three repositories — steppal-core, steppal-mobile, and steppal-web. Every tagged milestone and architectural release is recorded here in chronological order."
    >
      {releases.map((release) => (
        <section key={release.id} className="mb-12 border-b border-surface-2 pb-10 last:border-b-0">
          <p className="t-label text-ink-faint">
            <code>{release.repo}</code> · {release.tag} ·{' '}
            <time dateTime={release.publishedAt}>{release.publishedAt}</time>
          </p>

          <h2 id={release.id}>
            {release.repo} {release.tag} — {release.title}
          </h2>

          <p>{release.summary}</p>

          {release.highlights.length > 0 ? (
            <ul>
              {release.highlights.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : null}

          <p className="text-sm">
            <a href={release.url} target="_blank" rel="noopener noreferrer">
              View release on GitHub ({release.repo} {release.tag}) ↗
            </a>
          </p>
        </section>
      ))}

      <h2>Following the work</h2>

      <p>
        Every repository builds and runs independently without external credentials. See the{' '}
        <Link href="/architecture">architecture notes</Link> for how the three repositories fit
        together, or the <Link href="/contribute">contribution guide</Link> to pick up an open task.
      </p>
    </Prose>
  );
}

export default function Changelog() {
  return <ChangelogView />;
}
