import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ['', '/contribute', '/architecture', '/privacy', '/terms'].map((path) => ({
    url: `${siteUrl()}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.6,
  }));
}
