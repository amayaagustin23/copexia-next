"use client";

import {
  Eye,
  Handshake,
  Heart,
  Sparkles,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  ComponentType,
  SVGProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type ValueItem = {
  n: number;
  title: string;
  desc: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export default function ValuesSection() {
  const t = useTranslations('home.values');

  const items: ValueItem[] = useMemo(
    () => [
      { n: 1, title: t('v1.title'), desc: t('v1.desc'), icon: Sparkles }, // Personalización
      { n: 2, title: t('v2.title'), desc: t('v2.desc'), icon: Eye }, // Transparencia
      { n: 3, title: t('v3.title'), desc: t('v3.desc'), icon: Heart }, // Pasión
      { n: 4, title: t('v4.title'), desc: t('v4.desc'), icon: Target }, // Empuje con propósito
      { n: 5, title: t('v5.title'), desc: t('v5.desc'), icon: Users }, // Acompañamiento activo
      { n: 6, title: t('v6.title'), desc: t('v6.desc'), icon: Handshake }, // Construcción compartida
      { n: 7, title: t('v7.title'), desc: t('v7.desc'), icon: Star }, // Excelencia
    ],
    [t]
  );

  const [active, setActive] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Intersection Observer para animaciones de entrada
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setInView(true);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setInView(true);
          }, 150);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Progreso con CSS transitions (sin anime)
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const pct = (active / (items.length - 1)) * 100;
    el.style.width = `${pct}%`;
  }, [active, items.length]);

  // Carrusel automático
  useEffect(() => {
    if (!isAutoPlaying) return;

    intervalRef.current = setInterval(() => {
      setActive((prevActive) => (prevActive + 1) % items.length);
    }, 5000); // Cambia cada 5 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, items.length]);

  // Pausar cuando el usuario interactúa
  const handleUserInteraction = (newActive: number) => {
    setIsAutoPlaying(false);
    setActive(newActive);

    // Reanudar después de 10 segundos de inactividad
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      const newActive = Math.min(active + 1, items.length - 1);
      handleUserInteraction(newActive);
    }
    if (e.key === 'ArrowLeft') {
      const newActive = Math.max(active - 1, 0);
      handleUserInteraction(newActive);
    }
  };

  const ActiveIcon = items[active].icon; // ✅ componente en mayúscula

  // Animaciones de hover para ValuesSection
  const handleMouseEnter = () => {
    if (inView) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section
      ref={sectionRef}
      id="valores"
      className="w-full bg-background text-foreground"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`w-full transition-all duration-300 ${
          isHovered ? 'transform translate-y-[-1px]' : ''
        }`}
      >
        <header
          className={`mb-8 text-center transition-all duration-700 will-change-transform ${
            inView
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95'
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {t('heading')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('subheading')}
          </p>
        </header>

        {/* Ribbon */}
        <div
          className={`relative mx-auto max-w-5xl transition-all duration-600 will-change-transform ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } ${isHovered ? 'scale-[1.01]' : ''}`}
          style={{ transitionDelay: inView ? '200ms' : '0ms' }}
          role="tablist"
          aria-label={t('heading')}
          onKeyDown={onKey}
          tabIndex={0}
        >
          {/* Línea base */}
          <div className="relative h-2 rounded-full bg-muted border border-border" />

          {/* Progreso */}
          <div
            ref={barRef}
            className="absolute left-0 top-0 h-2 rounded-full"
            style={{
              background: 'var(--ring)',
              width: '0%',
              transition: 'width 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            aria-hidden
          />

          {/* Checkpoints con íconos */}
          <div className="absolute top-[-14px] left-0 right-0 flex justify-between">
            {items.map((it, i) => {
              const isActive = i === active;
              const Icon = it.icon; // ✅ cada botón usa su propio icono
              return (
                <button
                  key={it.n}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`value-panel-${i}`}
                  id={`value-tab-${i}`}
                  onClick={() => handleUserInteraction(i)}
                  onMouseEnter={() => handleUserInteraction(i)}
                  className="group grid place-items-center focus:outline-none"
                >
                  <span
                    className={[
                      'grid h-8 w-8 place-items-center rounded-full border transition-transform',
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-110'
                        : 'bg-card text-foreground/80 border-border group-hover:scale-105',
                    ].join(' ')}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel detalle */}
        <div
          key={active /* re-mount para animación CSS */}
          id={`value-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`value-tab-${active}`}
          className={`mx-auto mt-6 max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center transition-all duration-600 will-change-transform ${
            inView
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          } ${isHovered ? 'shadow-lg scale-[1.02]' : ''}`}
          style={{
            animation: 'valuesFade 600ms ease-out',
            transitionDelay: inView ? '400ms' : '0ms',
          }}
        >
          <ActiveIcon className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-medium">{items[active].title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {items[active].desc}
          </p>
        </div>

        {/* Auto-play indicator and mobile helper */}
        <div
          className={`mt-3 text-center text-xs text-muted-foreground transition-all duration-600 will-change-transform ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: inView ? '600ms' : '0ms' }}
        >
          <p className="md:hidden">
            <span className="font-medium">Tip:</span> deslizá la fila de íconos
            o tocá cada uno.
          </p>
        </div>
      </div>

      {/* keyframes global (evita conflictos con nombres de clase) */}
      <style jsx global>{`
        @keyframes valuesFade {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
