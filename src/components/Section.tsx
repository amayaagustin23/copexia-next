'use client';

import { animate, createScope, createSpring, stagger } from 'animejs';
import React, { useEffect, useRef, useState } from 'react';

// Types
interface SectionProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  staggerChildren?: boolean;
  itemSelector?: string;
  className?: string;
  titleClassName?: string;
  threshold?: number;
}

// Constants
const DEFAULT_ANIMATION_CONFIG = {
  threshold: 0.15,
  duration: 900,
  delay: 120,
  spring: { stiffness: 240, damping: 28 },
  initialOffset: 30,
};

const Section: React.FC<SectionProps> = ({
  id,
  title,
  children,
  ariaLabel,
  staggerChildren = false,
  itemSelector,
  className = 'w-full',
  titleClassName = 'text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-center',
  threshold = DEFAULT_ANIMATION_CONFIG.threshold,
}) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const scopeRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    // Verificar si el usuario prefiere animaciones reducidas
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Preparar elementos para animación
    const getElementsToAnimate = (): HTMLElement[] => {
      if (itemSelector) {
        return Array.from(inner.querySelectorAll<HTMLElement>(itemSelector));
      } else if (staggerChildren) {
        return Array.from(inner.children) as HTMLElement[];
      }
      return [inner];
    };

    const elements =
      getElementsToAnimate().length > 0 ? getElementsToAnimate() : [inner];

    // Configurar estado inicial de animación mejorado
    const setupInitialState = () => {
      elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = `translateY(${DEFAULT_ANIMATION_CONFIG.initialOffset}px) scale(0.95)`;
        el.style.willChange = 'opacity, transform';
        el.style.transition = 'none'; // Evitar transiciones CSS durante la animación JS
      });
    };

    // Limpiar animaciones reducidas
    const cleanupReducedMotion = () => {
      elements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.willChange = 'auto';
        el.style.transition = '';
      });
    };

    setupInitialState();

    // Configurar animación principal
    scopeRef.current = createScope({ root }).add((self: any) => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;

            if (prefersReduced) {
              cleanupReducedMotion();
              observer.disconnect();
              return;
            }

            animate(elements, {
              opacity: [0, 1],
              translateY: [DEFAULT_ANIMATION_CONFIG.initialOffset, 0],
              scale: [0.95, 1],
              delay:
                staggerChildren || itemSelector
                  ? stagger(DEFAULT_ANIMATION_CONFIG.delay)
                  : 0,
              duration: DEFAULT_ANIMATION_CONFIG.duration,
              ease: createSpring(DEFAULT_ANIMATION_CONFIG.spring),
              complete: () =>
                elements.forEach((el) => {
                  el.style.willChange = 'auto';
                  el.style.transition = '';
                }),
            });

            setHasAnimated(true);
            observer.disconnect();
          }
        },
        { threshold }
      );

      observer.observe(root);
      self.add('cleanupIO', () => observer.disconnect());
    });

    return () => {
      scopeRef.current?.methods?.cleanupIO?.();
      scopeRef.current?.revert?.();
    };
  }, [staggerChildren, itemSelector, threshold]);

  // Animaciones de hover
  const handleMouseEnter = () => {
    if (hasAnimated) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Animación de hover
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!isHovered || !hasAnimated || prefersReduced) return;

    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    const getElementsToAnimate = (): HTMLElement[] => {
      if (itemSelector) {
        return Array.from(inner.querySelectorAll<HTMLElement>(itemSelector));
      } else if (staggerChildren) {
        return Array.from(inner.children) as HTMLElement[];
      }
      return [inner];
    };

    const elements = getElementsToAnimate();

    // Animación sutil de hover
    animate(elements, {
      scale: [1, 1.02],
      duration: 300,
      easing: 'easeOutQuad',
      complete: () => {
        // Volver a escala normal después de un momento
        setTimeout(() => {
          if (!isHovered) {
            animate(elements, {
              scale: [1.02, 1],
              duration: 200,
              easing: 'easeOutQuad',
            });
          }
        }, 500);
      },
    });
  }, [isHovered, hasAnimated, itemSelector, staggerChildren]);

  return (
    <section
      ref={rootRef}
      id={id}
      aria-label={ariaLabel ?? title}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full mx-auto py-20">
        {title && <h2 className={titleClassName}>{title}</h2>}
        <div ref={innerRef}>{children}</div>
      </div>
    </section>
  );
};

export default Section;
