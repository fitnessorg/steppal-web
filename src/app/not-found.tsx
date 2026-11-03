import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: '404 — Page Not Found · StepPal',
  description: 'The page you are looking for does not exist or has moved.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-between">
      <main
        id="main"
        className="flex flex-1 flex-col items-start justify-center px-(--spacing-gutter) py-(--spacing-section)"
      >
        <div className="mx-auto w-full max-w-[68ch]">
          <p className="t-label text-flame">404 · Out of bounds</p>
          <h1 className="t-section mt-6">This path went nowhere.</h1>
          <p className="t-lead mt-6">
            The page you were looking for has moved, expired, or never existed in
            this repository.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 font-medium text-accent-ink transition-opacity hover:opacity-90"
            >
              Back to home
            </Link>
            <Link
              href="/architecture"
              className="inline-flex items-center justify-center rounded-full border border-surface-2 bg-surface px-6 py-4 text-sm font-medium text-ink transition-colors hover:border-ink-faint"
            >
              Read architecture
            </Link>
            <Link
              href="/contribute"
              className="inline-flex items-center justify-center rounded-full border border-surface-2 bg-surface px-6 py-4 text-sm font-medium text-ink transition-colors hover:border-ink-faint"
            >
              Contributor tasks
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
