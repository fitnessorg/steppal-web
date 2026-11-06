import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Waitlist } from '@/components/sections/Waitlist';

describe('Waitlist Component Tree', () => {
  it('renders a section container with waitlist anchor id', () => {
    const html = renderToStaticMarkup(<Waitlist />);
    expect(html).toContain('id="waitlist"');
  });

  it('renders the email input, honeypot, and submit button in initial idle state', () => {
    const html = renderToStaticMarkup(<Waitlist />);

    expect(html).toContain('type="email"');
    expect(html).toContain('placeholder="you@example.com"');
    expect(html).toContain('name="company"');
    expect(html).toContain('Join the waitlist');
  });
});
