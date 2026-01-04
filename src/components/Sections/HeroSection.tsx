"use client";

import { animate, spring } from 'animejs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const ANIMATION_CONFIG = {
  spring: { stiffness: 320, damping: 18 },
  scale: [1, 1.03, 1],
  scaleDuration: 260,
  progressDuration: { enter: 900, leave: 300 },
};

const HeroSection = () => {
  const t = useTranslations('home.hero');
  const ctasRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springAnimation = useMemo(() => spring(ANIMATION_CONFIG.spring), []);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      [logoRef, titleRef, subtitleRef, ctasRef].forEach((ref) => {
        if (ref.current) {
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'none';
        }
      });
      return;
    }

    const elements = [
      { ref: logoRef, delay: 0, scale: [0.9, 1] },
      { ref: titleRef, delay: 300, scale: [0.95, 1] },
      { ref: subtitleRef, delay: 500, scale: [0.95, 1] },
      { ref: ctasRef, delay: 700, scale: [0.9, 1] },
    ].filter((item) => item.ref.current);

    elements.forEach(({ ref }) => {
      const el = ref.current;
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.9)';
        el.style.willChange = 'opacity, transform';
      }
    });

    const timeline = elements.map(({ ref, delay, scale }) => {
      const el = ref.current;
      if (!el) return null;

      return animate(el, {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: scale || [0.9, 1],
        delay,
        duration: 1000,
        ease: springAnimation,
        complete: () => {
          el.style.willChange = 'auto';
        },
      });
    });

    return () => {
      timeline.forEach((anim) => anim?.pause());
    };
  }, [springAnimation]);

  const handleMouseEnter = () => {
    setIsHovered(true);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const elements = [
      logoRef.current,
      titleRef.current,
      subtitleRef.current,
    ].filter(Boolean);

    animate(elements, {
      scale: [1, 1.02],
      duration: 400,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const elements = [
      logoRef.current,
      titleRef.current,
      subtitleRef.current,
    ].filter(Boolean);

    animate(elements, {
      scale: [1.02, 1],
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  useEffect(() => {
    const root = ctasRef.current;
    if (!root) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const buttons = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('[data-cta]')
    );
    if (!buttons.length) return;

    const createProgressBar = (anchor: HTMLAnchorElement): HTMLElement => {
      let bar = anchor.querySelector<HTMLElement>('[data-progress]');
      if (!bar) {
        bar = document.createElement('span');
        bar.setAttribute('data-progress', 'true');
        Object.assign(bar.style, {
          position: 'absolute',
          insetInlineStart: '0',
          insetBlockEnd: '0',
          height: '2px',
          width: '0%',
          background: 'var(--ring)',
          transformOrigin: 'left center',
          transition: 'opacity .18s ease',
          opacity: '0.95',
        } as Partial<CSSStyleDeclaration>);
        anchor.style.position = 'relative';
        anchor.appendChild(bar);
      }
      return bar;
    };

    const setupButtonAnimation = (anchor: HTMLAnchorElement) => {
      const bar = createProgressBar(anchor);

      const handleEnter = () => {
        animate(anchor, {
          scale: ANIMATION_CONFIG.scale,
          duration: ANIMATION_CONFIG.scaleDuration,
          ease: springAnimation,
        });
        animate(bar, {
          width: ['0%', '100%'],
          duration: ANIMATION_CONFIG.progressDuration.enter,
          easing: 'easeInOutQuad',
        });
      };

      const handleLeave = () => {
        animate(bar, {
          width: ['100%', '0%'],
          duration: ANIMATION_CONFIG.progressDuration.leave,
          easing: 'easeOutQuad',
        });
      };

      anchor.addEventListener('mouseenter', handleEnter);
      anchor.addEventListener('mouseleave', handleLeave);

      return () => {
        anchor.removeEventListener('mouseenter', handleEnter);
        anchor.removeEventListener('mouseleave', handleLeave);
      };
    };

    const cleanups = buttons.map(setupButtonAnimation);
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [springAnimation]);

  return (
    <section
      className="relative isolate flex flex-col items-center justify-center text-center w-full min-h-screen py-12 xs:py-16 sm:py-20 lg:py-24 text-foreground"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        aria-hidden
        className="hero-bg pointer-events-none absolute inset-0 -z-10 opacity-[0.95]"
      />
      <div
        aria-hidden
        className="gold-layer pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light"
      />

      <div ref={logoRef} className="mb-3 xs:mb-4 sm:mb-6 md:mb-8">
        <Image
          src="/images/logo-copexia.png"
          alt={t('brandAlt')}
          width={500}
          height={200}
          priority
          quality={90}
          sizes="(min-width: 1024px) 200px, (min-width: 768px) 160px, (min-width: 475px) 120px, 80px"
          className="w-auto h-12 xs:h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 object-contain"
        />
      </div>

      <div className="w-full text-center px-3 xs:px-4 sm:px-6 md:px-8">
        <h1
          ref={titleRef}
          className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-3 xs:mb-4 sm:mb-6 md:mb-8 leading-tight"
        >
          <span
            className="bg-clip-text text-transparent inline-block"
            style={{ backgroundImage: 'var(--gold-gradient)' }}
          >
            {t('title')}
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground mb-4 xs:mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          {t('subtitle')}
        </p>

        <div
          ref={ctasRef}
          className="flex flex-row flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 max-w-2xl mx-auto"
        >
          <Link
            href="#sobre-nosotros"
            data-cta
            className="relative overflow-hidden rounded-lg bg-primary px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-xs xs:text-sm sm:text-base font-medium text-primary-foreground hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ring w-auto active:scale-95 transition-transform duration-150"
          >
            <span
              aria-hidden
              className="sheen pointer-events-none absolute inset-y-0 left-[-140%] w-[140%] skew-x-[-20deg] opacity-0"
            />
            <span className="relative z-10">{t('cta.services')}</span>
          </Link>
          <Link
            href="#valores"
            data-cta
            className="relative overflow-hidden rounded-lg border border-primary/20 bg-background/50 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-xs xs:text-sm sm:text-base font-medium text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring w-auto active:scale-95 transition-transform duration-150"
          >
            <span
              aria-hidden
              className="sheen pointer-events-none absolute inset-y-0 left-[-140%] w-[140%] skew-x-[-20deg] opacity-0"
            />
            <span className="relative z-10">{t('cta.values')}</span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .hero-bg {
          background: radial-gradient(
              1200px 600px at 90% -10%,
              rgba(15, 28, 46, 0.08),
              transparent 60%
            ),
            radial-gradient(
              900px 520px at 0% 110%,
              rgba(15, 28, 46, 0.07),
              transparent 55%
            ),
            var(--background);
          -webkit-mask-image: radial-gradient(
            1200px 1200px at 50% 0%,
            rgba(0, 0, 0, 0.75),
            rgba(0, 0, 0, 0.92)
          );
          mask-image: radial-gradient(
            1200px 1200px at 50% 0%,
            rgba(0, 0, 0, 0.75),
            rgba(0, 0, 0, 0.92)
          );
        }

        .gold-layer {
          background: linear-gradient(
            115deg,
            rgba(223, 205, 129, 0.12),
            rgba(183, 150, 83, 0.08) 40%,
            rgba(172, 116, 0, 0.06) 70%,
            transparent 90%
          );
          background-size: 200% 200%;
          animation: bg-pan 9s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .gold-layer {
            animation: none;
          }
        }

        @keyframes bg-pan {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .sheen {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.25) 35%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0.25) 65%,
            transparent 100%
          );
          transition: opacity 0.15s ease;
        }

        a[data-cta]:hover > .sheen,
        a[data-cta]:focus-visible > .sheen {
          opacity: 1;
          animation: sheen-slide 900ms ease-in-out forwards;
        }

        @keyframes sheen-slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
