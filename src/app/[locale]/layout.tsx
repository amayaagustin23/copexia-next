import { DefaultPageAnalyticsTracker } from '@/components/analytics/PageAnalyticsTracker';
import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import StructuredData from '@/components/SEO/StructuredData';
import { AppProvider } from '@/providers/AppProvider';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Lato } from 'next/font/google';
import { notFound } from 'next/navigation';
import PropTypes from 'prop-types';
import { SUPPORTED_LOCALES } from '@/lib/config/routes';
import '../globals.css';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const awaitedParams = await params;
  const locale = awaitedParams.locale;

  const t = await getTranslations({ locale, namespace: 'metadata' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dev.copexia.amayadev.cloud';
  const currentUrl = `${baseUrl}/${locale}`;

  return {
    title: {
      default: t('title'),
      template: '%s | Copexia',
    },
    description: t('description'),
    keywords: [
      // Términos generales de consultoría
      'consultora',
      'consultoría',
      'consultor empresarial',
      'asesoría empresarial',
      'consultoría empresas',
      'servicios de consultoría',

      // Transformación digital (muy buscado)
      'transformación digital',
      'digitalización empresas',
      'implementación digital',
      'soluciones digitales',
      'tecnología empresarial',
      'adopción tecnológica',
      'innovación digital',

      // Consultoría organizacional
      'consultoría organizacional',
      'desarrollo organizacional',
      'gestión organizacional',
      'mejora organizacional',
      'cambio organizacional',
      'cultura organizacional',

      // Optimización y procesos
      'optimización de procesos',
      'mejora de procesos',
      'gestión de procesos',
      'mejora continua',
      'eficiencia operacional',
      'productividad empresarial',

      // Capacitación
      'capacitación empresarial',
      'formación empresarial',
      'cursos empresas',
      'talleres empresariales',
      'capacitación corporativa',
      'desarrollo profesional',

      // Metodologías
      'metodologías ágiles',
      'agile',
      'scrum',
      'kaizen',
      'lean',
      'six sigma',

      // Gestión del cambio
      'gestión del cambio',
      'change management',
      'transformación cultural',
      'liderazgo',

      // Herramientas específicas
      'Power BI',
      'análisis de datos',
      'business intelligence',
      'dashboard empresarial',

      // Ubicación
      'Copexia',
      'Tucumán',
      'San Miguel de Tucumán',
      'Argentina',
      'consultora Tucumán',
      'consultoría Argentina',

      // Términos generales de negocio
      'soluciones empresariales',
      'servicios empresariales',
      'consultoría negocios',
      'estrategia empresarial',
      'innovación empresarial',
      'crecimiento empresarial',
      'gestión empresarial',
    ],
    authors: [{ name: 'Copexia Team' }],
    creator: 'Copexia',
    publisher: 'Copexia',
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
      url: currentUrl,
      title: t('og.title'),
      description: t('og.description'),
      siteName: 'Copexia',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_ES',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: t('og.alt'),
          type: 'image/jpeg',
        },
        {
          url: `${baseUrl}/og-image-square.jpg`,
          width: 1200,
          height: 1200,
          alt: t('og.alt'),
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitter.title'),
      description: t('twitter.description'),
      images: [`${baseUrl}/og-image.jpg`],
      creator: '@copexia',
      site: '@copexia',
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        'es-ES': `${baseUrl}/es`,
        'en-US': `${baseUrl}/en`,
      },
    },
    category: 'Business',
    classification: 'Business Consulting',
    other: {
      'geo.region': 'AR-T',
      'geo.placename': 'San Miguel de Tucumán',
      'geo.position': '-26.8241;-65.2226',
      ICBM: '-26.8241, -65.2226',
      'DC.title': t('title'),
      'DC.description': t('description'),
      'DC.subject':
        'Business Consulting, Digital Transformation, Organizational Development',
      'DC.language': locale === 'es' ? 'es' : 'en',
      'DC.coverage': 'Argentina, Tucumán',
      'DC.creator': 'Copexia Team',
      'DC.publisher': 'Copexia',
      'DC.rights': 'Copyright © 2024 Copexia. All rights reserved.',
      'DC.type': 'Website',
      'DC.format': 'text/html',
    },
    verification: {
      google: 'd1eb46f2425810a7',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.png',
    },
    // manifest: '/manifest.json', // Manifest is usually auto-detected or needs a route handler
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const awaitedParams = await params;
  if (!awaitedParams) notFound();

  const locale = awaitedParams.locale;

  // Validate locale
  if (!SUPPORTED_LOCALES.includes(locale as any)) {
    notFound();
  }

  try {
    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
      <html lang={locale} className={lato.variable} suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className="min-h-screen overflow-x-hidden"
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <AppProvider locale={locale} messages={messages}>
            <CookieConsentProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <CookieConsentBanner />
              <StructuredData type="organization" locale={locale} />
              <StructuredData type="website" locale={locale} />
              <StructuredData type="localBusiness" locale={locale} />
              <DefaultPageAnalyticsTracker />
            </CookieConsentProvider>
          </AppProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    locale: PropTypes.string,
  }).isRequired,
};
