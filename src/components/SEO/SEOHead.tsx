'use client';

import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import StructuredData from './StructuredData';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  noindex?: boolean;
  nofollow?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  breadcrumbs,
  noindex = false,
  nofollow = false,
}: SEOHeadProps) {
  const t = useTranslations('metadata');
  const params = useParams();
  const locale = params?.locale as string || 'es';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dev.copexia.amayadev.cloud';
  const currentUrl = url || `${baseUrl}/${locale}`;
  const currentTitle = title ? `${title} | Copexia` : t('title');
  const currentDescription = description || t('description');
  const currentImage = image || `${baseUrl}/og-image.jpg`;

  const defaultKeywords = [
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
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{currentTitle}</title>
        <meta name="description" content={currentDescription} />
        <meta name="keywords" content={allKeywords.join(', ')} />
        <meta name="author" content={author || 'Copexia Team'} />
        <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
        <meta name="googlebot" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />

        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={currentTitle} />
        <meta property="og:description" content={currentDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="Copexia" />
        <meta property="og:image" content={currentImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={currentTitle} />
        <meta property="og:locale" content={locale === 'es' ? 'es_ES' : 'en_US'} />

        {/* Article specific meta tags */}
        {type === 'article' && (
          <>
            {author && <meta property="article:author" content={author} />}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {section && <meta property="article:section" content={section} />}
            {tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
          </>
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentTitle} />
        <meta name="twitter:description" content={currentDescription} />
        <meta name="twitter:image" content={currentImage} />
        <meta name="twitter:site" content="@copexia" />
        <meta name="twitter:creator" content="@copexia" />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />

        {/* Geo Tags */}
        <meta name="geo.region" content="AR-T" />
        <meta name="geo.placename" content="San Miguel de Tucumán" />
        <meta name="geo.position" content="-26.8241;-65.2226" />
        <meta name="ICBM" content="-26.8241, -65.2226" />

        {/* Dublin Core */}
        <meta name="DC.title" content={currentTitle} />
        <meta name="DC.description" content={currentDescription} />
        <meta name="DC.subject" content={allKeywords.join(', ')} />
        <meta name="DC.language" content={locale === 'es' ? 'es' : 'en'} />
        <meta name="DC.coverage" content="Argentina, Tucumán" />
        <meta name="DC.creator" content="Copexia Team" />
        <meta name="DC.publisher" content="Copexia" />
        <meta name="DC.type" content={type} />
        <meta name="DC.format" content="text/html" />

        {/* Hreflang for multilingual support */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/es`} />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />

        {/* DNS prefetch */}
        <link rel="dns-prefetch" href={baseUrl} />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </Head>

      {/* Structured Data */}
      <StructuredData type="organization" locale={locale} />
      <StructuredData type="website" locale={locale} />
      <StructuredData type="localBusiness" locale={locale} />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <StructuredData type="breadcrumb" data={breadcrumbs} locale={locale} />
      )}

      {type === 'article' && (
        <StructuredData
          type="article"
          data={{
            title: currentTitle,
            description: currentDescription,
            image: currentImage,
            url: currentUrl,
            publishedAt: publishedTime,
            updatedAt: modifiedTime,
            category: section,
            tags: tags,
            wordCount: currentDescription.length,
          }}
          locale={locale}
        />
      )}
    </>
  );
}

export default SEOHead;
