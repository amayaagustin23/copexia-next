// SEO Configuration for Copexia
export const seoConfig = {
  baseUrl: 'https://copexia.com',
  organization: {
    name: 'Copexia',
    alternateName: 'COPEXIA',
    description: 'Consultora especializada en transformación digital, optimización de procesos y desarrollo organizacional desde San Miguel de Tucumán, Argentina.',
    foundingDate: '2021',
    logo: '/images/logo-copexia.png',
    address: {
      streetAddress: 'San Miguel de Tucumán',
      addressLocality: 'San Miguel de Tucumán',
      addressRegion: 'Tucumán',
      postalCode: '4000',
      addressCountry: 'AR',
    },
    geo: {
      latitude: -26.8241,
      longitude: -65.2226,
    },
    contactPoint: {
      contactType: 'Customer Service',
      email: 'contacto@copexia.com',
      availableLanguage: ['Spanish', 'English'],
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/copexia',
      twitter: 'https://twitter.com/copexia',
      facebook: 'https://facebook.com/copexia',
    },
    services: [
      'Transformación Cultural y Organizacional',
      'Adopción e Implementación de Soluciones Digitales',
      'Optimización de Procesos y Mejora Operativa',
      'Capacitación y Desarrollo Empresarial',
      'Consultoría Estratégica',
      'Implementación de Power BI',
      'Metodologías Ágiles',
      'Gestión del Cambio',
    ],
    keywords: [
      'transformación digital',
      'consultoría organizacional',
      'optimización de procesos',
      'desarrollo organizacional',
      'capacitación empresarial',
      'Power BI',
      'metodologías ágiles',
      'gestión del cambio',
      'adopción tecnológica',
      'consultoría estratégica',
      'mejora continua',
      'innovación organizacional',
      'soluciones empresariales',
      'formación corporativa',
      'Tucumán',
      'Argentina',
      'San Miguel de Tucumán',
    ],
  },
  
  // Default meta tags
  defaultMeta: {
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Copexia',
      locale: 'es_ES',
      alternateLocale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@copexia',
      creator: '@copexia',
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
  },

  // Performance settings
  performance: {
    imageFormats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    preloadCriticalResources: true,
    lazyLoadImages: true,
  },

  // Analytics (add your tracking IDs)
  analytics: {
    googleAnalytics: 'GA_TRACKING_ID',
    googleTagManager: 'GTM_TRACKING_ID',
    facebookPixel: 'FB_PIXEL_ID',
  },

  // Structured data templates
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
    },
    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
    },
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
    },
  },
};

export default seoConfig;
