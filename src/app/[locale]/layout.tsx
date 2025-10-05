import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { AppProvider } from "@/providers/AppProvider";
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { Lato } from 'next/font/google';
import { notFound } from 'next/navigation';
import PropTypes from 'prop-types';
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

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'Copexia',
      'Tucumán',
      'San Miguel de Tucumán',
      'Argentina',
      'transformación cultural',
      'soluciones digitales',
      'optimización de procesos',
      'consultoría organizacional',
      'capacitación empresarial',
      'Power BI',
      'Kaizen',
      'metodologías ágiles',
      'gestión del cambio',
      'formación en acción',
    ],
    openGraph: {
      type: 'website',
      url: 'https://copexia.com',
      title: t('og.title'),
      description: t('og.description'),
      siteName: 'Copexia',
      images: [
        {
          url: 'https://copexia.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('og.alt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitter.title'),
      description: t('twitter.description'),
      images: ['https://copexia.com/og-image.jpg'],
    },
    metadataBase: new URL('https://copexia.com'),
    alternates: { canonical: '/' },
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const awaitedParams = await params;
  if (!awaitedParams) notFound();

  const locale = awaitedParams.locale;

  try {
    const messages = (await import(`../../../messages/${locale}.json`)).default;

    return (
      <html lang={locale} className={lato.variable} suppressHydrationWarning>
        <body suppressHydrationWarning>
          <AppProvider locale={locale} messages={messages}>
            <LayoutWrapper>{children}</LayoutWrapper>
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
