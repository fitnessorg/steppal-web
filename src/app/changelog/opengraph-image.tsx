import { ImageResponse } from 'next/og';
import { OgCard } from '@/lib/og-card';

export const alt = 'StepPal Changelog — Releases and milestones across the ecosystem';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Ecosystem Changelog"
        badge="Releases & Milestones"
        title="What shipped across the three repos."
        description="Chronological release history and milestone logs for steppal-core, steppal-mobile, and steppal-web."
        pills={['steppal-core', 'steppal-mobile', 'steppal-web']}
      />
    ),
    {
      ...size,
    },
  );
}
