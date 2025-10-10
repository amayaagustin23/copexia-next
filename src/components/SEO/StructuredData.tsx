'use client';

import { useTranslations } from 'next-intl';

interface StructuredDataProps {
  type:
    | 'organization'
    | 'website'
    | 'breadcrumb'
    | 'article'
    | 'localBusiness'
    | 'faq';
  data?: any;
  locale?: string;
}

export function StructuredData({ type, data, locale = 'es' }: StructuredDataProps) {
  const t = useTranslations('metadata');
  
  const getStructuredData = () => {
    const baseUrl = 'https://copexia.com';
    const currentLocale = locale === 'es' ? 'es' : 'en';
    const currentUrl = `${baseUrl}/${currentLocale}`;

    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Copexia',
          alternateName: 'COPEXIA',
          url: baseUrl,
          logo: `${baseUrl}/images/logo-copexia.png`,
          description: t('description'),
          foundingDate: '2021',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'AR',
            addressRegion: 'Tucumán',
            addressLocality: 'San Miguel de Tucumán',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'contacto@copexia.com',
            availableLanguage: ['Spanish', 'English'],
          },
          sameAs: [
            'https://linkedin.com/company/copexia',
            'https://twitter.com/copexia',
            'https://facebook.com/copexia',
          ],
          knowsAbout: [
            'Transformación Digital',
            'Consultoría Organizacional',
            'Optimización de Procesos',
            'Adopción Tecnológica',
            'Desarrollo Organizacional',
            'Capacitación Empresarial',
            'Power BI',
            'Metodologías Ágiles',
            'Gestión del Cambio',
          ],
          areaServed: {
            '@type': 'Country',
            name: 'Argentina',
          },
          serviceType: [
            'Consultoría Estratégica',
            'Transformación Digital',
            'Optimización de Procesos',
            'Capacitación y Desarrollo',
            'Implementación de Soluciones Digitales',
          ],
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Copexia',
          alternateName: 'COPEXIA',
          url: baseUrl,
          description: t('description'),
          inLanguage: currentLocale,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/${currentLocale}/posts?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Copexia',
            url: baseUrl,
          },
        };

      case 'localBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Copexia',
          description: t('description'),
          url: baseUrl,
          telephone: '+54-381-XXXX-XXXX',
          email: 'contacto@copexia.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'San Miguel de Tucumán',
            addressLocality: 'San Miguel de Tucumán',
            addressRegion: 'Tucumán',
            postalCode: '4000',
            addressCountry: 'AR',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -26.8241,
            longitude: -65.2226,
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
          priceRange: '$$',
          serviceArea: {
            '@type': 'Country',
            name: 'Argentina',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios de Consultoría',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Transformación Cultural y Organizacional',
                  description:
                    'Acompañamos a organizaciones en su proceso de cambio cultural',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Adopción e Implementación de Soluciones Digitales',
                  description:
                    'Implementamos herramientas tecnológicas para optimizar procesos',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Optimización de Procesos y Mejora Operativa',
                  description:
                    'Mejoramos la eficiencia operativa de tu organización',
                },
              },
            ],
          },
        };

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data?.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data?.title,
          description: data?.description,
          image: data?.image,
          author: {
            '@type': 'Organization',
            name: 'Copexia',
            url: baseUrl,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Copexia',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/images/logo-copexia.png`,
            },
          },
          datePublished: data?.publishedAt,
          dateModified: data?.updatedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data?.url,
          },
          articleSection: data?.category,
          keywords: data?.tags,
          wordCount: data?.wordCount,
          inLanguage: currentLocale,
        };

      case 'faq':
        if (!data?.faqs || !Array.isArray(data.faqs)) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqs.map(
            (faq: { question: string; answer: string }) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })
          ),
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default StructuredData;
