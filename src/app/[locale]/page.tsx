'use client';

// Components
import Section from '@/components/Section';
import AboutSection from '@/components/Sections/AboutSection';
import ContactSection from '@/components/Sections/ContactSection';
import HeroSection from '@/components/Sections/HeroSection';
import PostsSection from '@/components/Sections/PostsSection';
import ValuesSection from '@/components/Sections/ValuesSection';
import PainPointsSection from '@/components/Sections/PainPointsSection';
import ServicesSection from '@/components/Sections/ServicesSection';
import FaroMethodSection from '@/components/Sections/FaroMethodSection';
import StructuredData from '@/components/SEO/StructuredData';
import homePageSEO from './page-metadata';

// Hooks
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

// Types
interface SectionConfig {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const seoData =
    homePageSEO[locale as keyof typeof homePageSEO] || homePageSEO.es;

  // Configuración global de animaciones
  useEffect(() => {
    // Preload fonts for better animation performance
    if (typeof document !== 'undefined') {
      document.fonts.ready.then(() => {
        // Fonts loaded, animations can start smoothly
      });
    }
  }, []);

  // Sección de configuración centralizada para mejor mantenimiento
  const sections: SectionConfig[] = [
    {
      id: 'inicio',
      title: 'Inicio - Copexia Transformación Digital',
      children: <HeroSection />,
      className: 'h-screen w-full bg-background',
    },
    {
      id: 'identificacion',
      title: '',
      children: <PainPointsSection />,
      className: 'section-pain-points',
    },
    {
      id: 'sobre-nosotros',
      title: '',
      children: <AboutSection />,
      className: 'section-about bg-muted/5',
    },
    {
      id: 'servicios',
      title: '',
      children: <ServicesSection />,
      className: 'section-services',
    },
    {
      id: 'metodo-faro',
      title: '',
      children: <FaroMethodSection />,
      className: 'section-faro bg-muted/5',
    },
    {
      id: 'valores',
      title: '',
      children: <ValuesSection />,
      className: 'section-values bg-background',
    },
    {
      id: 'blog',
      title: '',
      children: <PostsSection />,
      className: 'section-posts bg-background',
    },
    {
      id: 'contacto',
      title: '',
      children: <ContactSection />,
      className: 'section-contact bg-muted/5',
    },
  ];

  return (
    <main
      className="min-h-screen w-full"
      role="main"
      aria-label="Página principal de Copexia"
    >
      <style jsx global>{`
        /* Configuración global de animaciones */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Optimizaciones de rendimiento */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Smooth scrolling para navegación */
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }

        /* Mejoras de rendimiento para animaciones */
        [data-animate],
        .transition-all,
        .will-change-transform {
          will-change: transform, opacity;
        }

        /* Optimización para elementos animados */
        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-slide-left {
          animation: slideInLeft 0.7s ease-out forwards;
        }

        .animate-slide-right {
          animation: slideInRight 0.7s ease-out forwards;
        }
      `}</style>

      {sections.map((section) => {
        if (section.id === 'inicio') {
          // Hero section con ancho completo pero respetando container
          return (
            <section key={section.id} className={`${section.className} w-full`}>
              {section.children}
            </section>
          );
        }

        return (
          <Section
            key={section.id}
            id={section.id}
            title={section.title}
            className={section.className}
            itemSelector="[data-animate]"
            staggerChildren={true}
            threshold={0.15}
          >
            {section.children}
          </Section>
        );
      })}

      {/* Structured Data for FAQs */}
      <StructuredData
        type="faq"
        data={{ faqs: seoData.faqs }}
        locale={locale}
      />
    </main>
  );
}
