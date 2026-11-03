import { describe, it, expect } from 'vitest';
import NotFound, { metadata } from '@/app/not-found';

describe('NotFound', () => {
  it('exports correct metadata for 404 page', () => {
    expect(metadata.title).toBe('404 — Page Not Found · StepPal');
    expect(metadata.description).toBeDefined();
  });

  it('renders a valid React element tree', () => {
    const element = NotFound();
    expect(element).toBeDefined();
    expect(element.type).toBe('div');
  });
});
