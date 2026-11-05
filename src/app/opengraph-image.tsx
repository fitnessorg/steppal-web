import { ImageResponse } from 'next/og';
import { OgCard } from '@/lib/og-card';

export const alt = 'StepPal — put money on your step goal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Decentralized Commitment App"
        badge="Stellar · Soroban"
        title="Put money on your step goal."
        description="Form a group with your friends, everyone stakes money, and the week settles itself based on who actually walked. Open source, held in a smart contract."
        pills={['Soroban Escrow', 'Health Connect', 'Zero Platform Rake', 'MIT Licensed']}
      />
    ),
    {
      ...size,
    },
  );
}
