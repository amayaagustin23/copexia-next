import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dev.copexia.amayadev.cloud';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/*?*', // Query parameters
          '/es/admin/',
          '/en/admin/',
          '/es/login',
          '/en/login',
          '/es/forgot-password',
          '/en/forgot-password',
          '/es/reset-password',
          '/en/reset-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/es/admin/',
          '/en/admin/',
          '/es/login',
          '/en/login',
          '/es/forgot-password',
          '/en/forgot-password',
          '/es/reset-password',
          '/en/reset-password',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/es/admin/',
          '/en/admin/',
          '/es/login',
          '/en/login',
          '/es/forgot-password',
          '/en/forgot-password',
          '/es/reset-password',
          '/en/reset-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
