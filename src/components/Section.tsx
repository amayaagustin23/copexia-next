'use client';

import { animate, createScope, spring, stagger } from 'animejs';
import React, { useEffect, useRef, useState } from 'react';

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
  titleClassName = 'text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 xs:mb-8 text-center leading-tight',
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

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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

    const setupInitialState = () => {
      elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = `translateY(${DEFAULT_ANIMATION_CONFIG.initialOffset}px) scale(0.95)`;
        el.style.willChange = 'opacity, transform';
        el.style.transition = 'none';
      });
    };

    const cleanupReducedMotion = () => {
      elements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.willChange = 'auto';
        el.style.transition = '';
      });
    };

    setupInitialState();

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
              ease: spring(DEFAULT_ANIMATION_CONFIG.spring),
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

  const handleMouseEnter = () => {
    if (hasAnimated) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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

    if (elements.length === 0) return;

    animate(elements, {
      scale: [1, 1.02],
      duration: 300,
      easing: 'easeOutQuad',
      complete: () => {
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
      <div className="w-full py-12 xs:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 lg:px-25 mx-auto" >
        {title && <h2 className={titleClassName}>{title}</h2>}
        <div ref={innerRef}>{children}</div>
      </div>
    </section>
  );
};

export default Section;
