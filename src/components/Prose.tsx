import React, { isValidElement, cloneElement, type ReactNode, type ReactElement } from 'react';

/**
 * Normalizes heading text into an URL-safe and human-readable anchor slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word, non-whitespace, non-hyphen
    .replace(/\s+/g, '-')     // collapse whitespace into dashes
    .replace(/-+/g, '-');     // collapse duplicate dashes
}

/**
 * Recursively extracts plain text from a React node or tree.
 */
export function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return props.children ? extractText(props.children) : '';
  }
  return '';
}

/**
 * Traverses prose children and adds anchor links + IDs to h2 and h3 elements
 * so deep-linking directly to document sections works out of the box.
 */
export function enhanceHeadings(children: ReactNode): ReactNode {
  const seenSlugs = new Map<string, number>();

  function processNode(node: ReactNode): ReactNode {
    if (!isValidElement(node)) return node;

    if (node.type === React.Fragment) {
      const props = node.props as { children?: ReactNode };
      return props.children ? React.Children.map(props.children, processNode) : null;
    }

    if (node.type === 'h2' || node.type === 'h3') {
      const props = node.props as { id?: string; className?: string; children?: ReactNode };
      const rawText = extractText(props.children);
      const baseSlug = props.id || slugify(rawText) || 'section';

      let finalSlug = baseSlug;
      const count = seenSlugs.get(baseSlug) || 0;
      if (count > 0) {
        finalSlug = `${baseSlug}-${count}`;
      }
      seenSlugs.set(baseSlug, count + 1);

      const existingClass = props.className || '';
      const combinedClass = existingClass
        ? `${existingClass} group scroll-mt-24`
        : 'group scroll-mt-24';

      return cloneElement(
        node as ReactElement<{ id?: string; className?: string; children?: ReactNode }>,
        {
          id: finalSlug,
          className: combinedClass,
          children: [
            props.children,
            <a
              key="anchor"
              href={`#${finalSlug}`}
              className="heading-anchor"
              aria-label={`Permalink to ${rawText}`}
            >
              <span aria-hidden="true">#</span>
            </a>,
          ],
        },
      );
    }

    const props = node.props as { children?: ReactNode };
    if (props && props.children) {
      if (
        node.type === 'div' ||
        node.type === 'section' ||
        node.type === 'article'
      ) {
        return cloneElement(node as ReactElement<{ children?: ReactNode }>, {
          children: React.Children.map(props.children, processNode),
        });
      }
    }

    return node;
  }

  const result = React.Children.map(children, processNode);
  if (Array.isArray(result) && result.length === 1 && !Array.isArray(children)) {
    return result[0];
  }
  return result;
}

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
        <div className="prose-body mt-14">{enhanceHeadings(children)}</div>
      </article>
    </main>
  );
}
