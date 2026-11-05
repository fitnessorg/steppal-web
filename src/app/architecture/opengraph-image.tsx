import { ImageResponse } from 'next/og';
import { OgCard } from '@/lib/og-card';

export const alt = 'StepPal Architecture — Where the money sits and who may move it';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Architecture & Protocol Design"
        badge="System Architecture"
        title="Where the money sits, and who is allowed to move it."
        description="Three repos, one seam: why business logic lives in steppal-core, how step claims are validated, and how smart contract escrow guarantees fund safety."
        pills={['steppal-core', 'Soroban Escrow Contract', 'Deterministic Settlement']}
      />
    ),
    {
      ...size,
    },
  );
}
