import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Route Bundle & Motion Isolation Invariants', () => {
  const readAppFile = (relativePath: string) => {
    const fullPath = path.join(process.cwd(), relativePath);
    return fs.readFileSync(fullPath, 'utf8');
  };

  it('verifies RootLayout does not import SmoothScroll or Unbounded display font', () => {
    const layout = readAppFile('src/app/layout.tsx');
    expect(layout).not.toContain('SmoothScroll');
    expect(layout).not.toContain('@fontsource-variable/unbounded');
    expect(layout).toContain('@fontsource-variable/instrument-sans');
    expect(layout).toContain('@fontsource-variable/jetbrains-mono');
  });

  it('verifies the interactive landing page mounts SmoothScroll and Unbounded font', () => {
    const home = readAppFile('src/app/page.tsx');
    expect(home).toContain('SmoothScroll');
    expect(home).toContain('@fontsource-variable/unbounded');
  });

  it('verifies document pages do not mount motion or Lenis tickers', () => {
    const prosePages = [
      'src/app/architecture/page.tsx',
      'src/app/contribute/page.tsx',
      'src/app/privacy/page.tsx',
      'src/app/terms/page.tsx',
      'src/components/Prose.tsx',
    ];

    for (const pagePath of prosePages) {
      const code = readAppFile(pagePath);
      expect(code).not.toContain('SmoothScroll');
      expect(code).not.toContain('lenis');
      expect(code).not.toContain('ScrollTrigger');
    }
  });
});
