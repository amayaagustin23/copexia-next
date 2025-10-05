'use client';

import { BookOpenCheck, BrainCircuit, PlugZap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Types
interface LearningModule {
  key: string;
  title: string;
  icon: React.ReactNode;
  text: string;
}

const MODULES: LearningModule[] = [
  {
    key: 'modelado-datos',
    title: 'Modelado de datos',
    icon: <BrainCircuit className="h-5 w-5" />,
    text: 'Bases sólidas para reportes y análisis reales.',
  },
  {
    key: 'storytelling-ux',
    title: 'Visualización & Storytelling',
    icon: <BookOpenCheck className="h-5 w-5" />,
    text: 'Tableros que se entienden sin explicación.',
  },
  {
    key: 'integraciones',
    title: 'Integraciones & Automatización',
    icon: <PlugZap className="h-5 w-5" />,
    text: 'Power Automate, Apps y scripts para ir más lejos.',
  },
];

const LearningOverview = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  // Intersection Observer para animaciones de entrada
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setInView(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setInView(true);
          }, 100);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`grid md:grid-cols-3 gap-6 transition-all duration-700 will-change-transform ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {MODULES.map((m, index) => (
        <article
          key={m.key}
          className={`rounded-2xl border p-6 bg-card shadow-sm transition-all duration-600 will-change-transform hover:shadow-md hover:scale-105 hover:border-primary/20 ${
            inView
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95'
          }`}
          style={{
            transitionDelay: inView ? `${200 + index * 150}ms` : '0ms',
          }}
          data-animate
        >
          <div className="flex items-center gap-2 text-primary mb-2">
            {m.icon}
            <h4 className="font-semibold">{m.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{m.text}</p>
          <div className="mt-4">
            <a
              href={`#/learning/${m.key}`}
              className="text-sm underline hover:no-underline transition-all duration-200 hover:text-primary"
            >
              Ver contenidos
            </a>
          </div>
        </article>
      ))}
    </div>
  );
};

export default LearningOverview;
