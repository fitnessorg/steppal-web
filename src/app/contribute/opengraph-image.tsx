import { ImageResponse } from 'next/og';
import { OgCard } from '@/lib/og-card';

export const alt = 'Contribute to StepPal — Three repos that run with no accounts';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Open Source Contribution"
        badge="Good First Issues"
        title="Three repos, and none of them need the others to run."
        description="A project you cannot run is a project you will not contribute to. Zero accounts required, scoped contributor tasks, and mock servers out of the box."
        pills={['TypeScript', 'React Native', 'Rust & Soroban', 'MIT Licensed']}
      />
    ),
    {
      ...size,
    },
  );
}
