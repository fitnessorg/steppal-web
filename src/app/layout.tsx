import type { Metadata, Viewport } from 'next';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Header } from '@/components/Header';

/*
  Fonts ship from npm rather than next/font/google: the woff2 files are in the
  lockfile, so builds need no network and are reproducible. Variable weights,
  so all three families cost three files total.

  Unbounded  — display. Geometric, high-personality, holds up at 15vw.
  Instrument — body. Clean and warm without being Inter.
  JetBrains  — data. Step counts, naira figures, labels.
*/
import '@fontsource-variable/unbounded';
import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/jetbrains-mono';

import './globals.css';

const SITE = 'https://steppal.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'StepPal — put money on your step goal',
  description:
    'Form a group with your friends, everyone stakes money, and at the end of the week it settles based on who actually walked. Open source, held in a smart contract.',
  openGraph: {
    title: 'StepPal — put money on your step goal',
    description:
      'Form a group, everyone stakes, the week settles itself. The pot is held in a contract, not by us.',
    url: SITE,
    siteName: 'StepPal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StepPal — put money on your step goal',
    description: 'Form a group, everyone stakes, the week settles itself.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F4F1' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0A08' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Runs before paint so an explicit theme choice never flashes the wrong
          ground. No stored value means follow the OS, and nothing is stamped.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <div className="frame" aria-hidden />
        <SmoothScroll>
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
