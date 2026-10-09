import type { ReactNode } from 'react';

/**
 * The reading shell for the pages that are mostly words.
 *
 * The landing page is built to be scrolled through; these are built to be
 * read, so they get a measure, ordinary type scale and no motion. A document
 * that animates while you are trying to read it is a document that fights you.
 */
export function Prose({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="px-(--spacing-gutter) py-(--spacing-section)">
      <article className="mx-auto w-full max-w-[68ch]">
        <p className="t-label text-cool">{eyebrow}</p>
        <h1 className="t-section mt-6">{title}</h1>
        {lede ? <p className="t-lead mt-6">{lede}</p> : null}
        <div className="prose-body mt-14">{children}</div>
      </article>
    </main>
  );
}
