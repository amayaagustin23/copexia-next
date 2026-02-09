"use client";

import { animate, stagger } from 'animejs';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

const ANIMATION_CONFIG = {
    spring: { stiffness: 280, damping: 20 },
    stagger: 100,
    initialY: 40,
};

export default function NotFound() {
    const t = useTranslations('common.notFound');

    const titleRef = useRef<HTMLHeadingElement>(null);
    const codeRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) return;

        const elements = [
            codeRef.current,
            titleRef.current,
            descRef.current,
            buttonRef.current
        ].filter(Boolean);

        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = `translateY(${ANIMATION_CONFIG.initialY}px)`;
            }
        });

        // Animate in
        animate(elements, {
            opacity: [0, 1],
            translateY: [ANIMATION_CONFIG.initialY, 0],
            delay: stagger(ANIMATION_CONFIG.stagger),
            duration: 1200,
            easing: 'easeOutElastic(1, .6)',
        });

        // Continuous floating animation is now handled by CSS for better smoothness
    }, []);

    return (
        <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center overflow-hidden">
            {/* Background Effects */}
            <div
                aria-hidden
                className="hero-bg pointer-events-none absolute inset-0 -z-10 opacity-[0.8]"
            />
            <div
                aria-hidden
                className="gold-layer pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light"
            />

            <div
                ref={codeRef}
                className="mb-8 select-none"
                style={{ animation: 'float 6s ease-in-out infinite' }}
            >
                <span
                    className="text-[8rem] xs:text-[10rem] sm:text-[12rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text"
                    style={{
                        backgroundImage: 'var(--gold-gradient, linear-gradient(135deg, #dfcd81 0%, #b79653 45%, #ac7400 100%))',
                        textShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                >
                    404
                </span>
            </div>

            {/* Title */}
            <h1
                ref={titleRef}
                className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground"
            >
                {t('title')}
            </h1>

            {/* Description */}
            <p
                ref={descRef}
                className="mb-10 max-w-[500px] text-lg text-muted-foreground sm:text-xl leading-relaxed"
            >
                {t('description')}
            </p>

            {/* Button */}
            <Link
                ref={buttonRef}
                href="/"
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105 active:scale-95"
            >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>{t('backHome')}</span>

                {/* Button Sheen Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
            </Link>


            <style jsx global>{`
        .hero-bg {
          background: radial-gradient(
              1000px 1000px at 50% 0%,
              rgba(15, 28, 46, 0.05),
              transparent 70%
            ),
            var(--background);
        }

        .gold-layer {
          background: linear-gradient(
            115deg,
            rgba(223, 205, 129, 0.05),
            rgba(183, 150, 83, 0.03) 40%,
            transparent 90%
          );
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        /* Ocultar Header y Footer solo en esta página */
        header, footer, #whatsapp-widget {
          display: none !important;
        }
      `}</style>
        </div>
    );
}
