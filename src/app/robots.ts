import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The waitlist endpoint has nothing to index and rate-limits by IP.
      disallow: '/api/',
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
