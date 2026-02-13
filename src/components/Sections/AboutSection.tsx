"use client";

import type {
  Cell,
  CopexiaItem,
  CrossSpec,
  CrosswordGrid,
} from '@/schemas/crossword';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ANCHOR = 'COPEXIA';

// Utils
const indexOfOccurrence = (
  word: string,
  letter: string,
  occurrence = 1
): number => {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      count++;
      if (count === occurrence) return i;
    }
  }
  return -1;
};

export default function AboutSection() {
  const t = useTranslations('home.about');

  // Intersection Observer refs
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Data configuration
  const items: CopexiaItem[] = useMemo(
    () => [
      { k: 'C', title: t('letters.C.title'), desc: t('letters.C.desc') },
      { k: 'O', title: t('letters.O.title'), desc: t('letters.O.desc') },
      { k: 'P', title: t('letters.P.title'), desc: t('letters.P.desc') },
      { k: 'E', title: t('letters.E.title'), desc: t('letters.E.desc') },
      { k: 'X', title: t('letters.X.title'), desc: t('letters.X.desc') },
      { k: 'I', title: t('letters.I.title'), desc: t('letters.I.desc') },
      { k: 'A', title: t('letters.A.title'), desc: t('letters.A.desc') },
    ],
    [t]
  );

  const crosses: CrossSpec[] = useMemo(
    () => [
      { word: 'COLABORACION', letter: 'C', occurrence: 2 },
      { word: 'ORGANIZACION', letter: 'O', occurrence: 2 },
      { word: 'PERSONALIZACION', letter: 'P' },
      { word: 'ESTRATEGIA', letter: 'E', occurrence: 2 },
      { word: 'EXCELENCIA', letter: 'X' },
      { word: 'INNOVACION', letter: 'I', occurrence: 2 },
      { word: 'ACOMPANAMIENTO', letter: 'A', occurrence: 2 },
    ],
    []
  );

  const centerX = useMemo(() => {
    let maxLeftOffset = 0;
    let maxRightOffset = 0;

    for (const cw of crosses) {
      const row = ANCHOR.indexOf(cw.letter);
      if (row < 0) continue;

      const idxInside = indexOfOccurrence(
        cw.word,
        cw.letter,
        cw.occurrence ?? 1
      );
      if (idxInside < 0) continue;

      maxLeftOffset = Math.max(maxLeftOffset, idxInside);
      maxRightOffset = Math.max(maxRightOffset, cw.word.length - idxInside - 1);
    }

    const totalWidth = maxLeftOffset + maxRightOffset + 1; // +1 for COPEXIA column
    return Math.floor(totalWidth / 2);
  }, [crosses]);

  // Crossword grid calculation with proper typing
  const crosswordGrid: CrosswordGrid = useMemo(() => {
    const gridRecord: Record<string, Cell> = {};
    const keyOf = (x: number, y: number) => `${x},${y}`;

    const byLetterRecord: Record<string, CopexiaItem> = {};
    items.forEach((it) => {
      byLetterRecord[it.k] = it;
    });

    // Vertical anchor COPEXIA at centerX to be visually centered
    for (let i = 0; i < ANCHOR.length; i++) {
      const ch = ANCHOR[i];
      const k = keyOf(centerX, i);
      gridRecord[k] = {
        ch,
        key: k,
        isAnchor: true,
        letterKey: ch,
        word: ANCHOR,
      };
    }

    // Horizontal words
    for (const cw of crosses) {
      const row = ANCHOR.indexOf(cw.letter);
      if (row < 0) continue;

      const idxInside = indexOfOccurrence(
        cw.word,
        cw.letter,
        cw.occurrence ?? 1
      );
      if (idxInside < 0) continue;

      const startX = centerX - idxInside; // intersects at centerX
      for (let i = 0; i < cw.word.length; i++) {
        const x = startX + i;
        const y = row;
        const ch = cw.word[i];
        const k = keyOf(x, y);

        const existing = gridRecord[k];
        if (existing && existing.ch !== ch) continue;

        if (!existing) {
          gridRecord[k] = {
            ch,
            key: k,
            isAnchor: x === centerX,
            word: cw.word,
            letterKey: cw.letter,
          };
        }
      }
    }

    // Calculate bounds
    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = ANCHOR.length - 1;
    for (const k of Object.keys(gridRecord)) {
      const [xStr, yStr] = k.split(',');
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    return {
      grid: gridRecord,
      minX,
      maxX,
      minY,
      maxY,
      infoByLetter: byLetterRecord,
    };
  }, [items, crosses, centerX]);

  // Grid dimensions
  const { grid, minX, maxX, minY, maxY, infoByLetter } = crosswordGrid;
  const rows = maxY - minY + 1;
  const cols = maxX - minX + 1;

  // Intersection Observer for animations mejorado
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
          // Pequeño delay para mejor UX
          setTimeout(() => {
            setInView(true);
          }, 100);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animation calculations
  const animationCenterX = minX + Math.floor(cols / 2);
  const centerY = minY + Math.floor(rows / 2);
  const baseDelay = 28; // ms per distance ring from center

  // Cell styling helper
  const getCellClasses = useCallback(
    (cell: Cell | undefined, isAnchorCol: boolean) => {
      const baseClasses = [
        'relative w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-sm border cursor-pointer will-change-transform',
        'flex items-center justify-center text-[10px] xs:text-xs sm:text-base font-bold leading-none',
        'transition-all duration-700 ease-out',
        'hover:scale-105 sm:hover:scale-110 hover:shadow-xl hover:z-10 hover:-translate-y-0.5 sm:hover:-translate-y-1',
        'hover:transition-all hover:duration-300 hover:ease-in-out',
        'active:scale-95 active:transition-all active:duration-150',
      ];

      if (!cell) {
        return [...baseClasses, 'border-transparent'].join(' ');
      }

      const cellClasses = [
        ...baseClasses,
        'border-border/60 bg-gradient-to-br from-card to-card/70 shadow-sm',
      ];

      if (isAnchorCol) {
        cellClasses.push(
          'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg border-primary/50'
        );
      } else {
        cellClasses.push(
          'hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/20 hover:border-primary/30'
        );
      }

      return cellClasses.join(' ');
    },
    []
  );

  // Animation delay calculation mejorado
  const getAnimationDelay = useCallback(
    (c: number, r: number) => {
      const dist = Math.abs(c - animationCenterX) + Math.abs(r - centerY);
      // Animación más fluida con delays escalonados
      const baseDelayMs = dist * baseDelay;
      const maxDelay = Math.max(cols, rows) * baseDelay;
      const normalizedDelay = Math.min(baseDelayMs, maxDelay);
      return inView ? `${normalizedDelay}ms` : undefined;
    },
    [animationCenterX, centerY, baseDelay, inView, cols, rows]
  );

  // Animaciones de hover para AboutSection
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
      id="sobre-nosotros"
      ref={sectionRef}
      className="bg-background text-foreground w-full min-h-screen"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Keyframes locales para animaciones */}
      <style jsx>{`
        @keyframes breathe {
          0% {
            transform: translateY(0) scale(1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }
          100% {
            transform: translateY(0) scale(1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
        }

        @keyframes cellGlow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
          }
        }

        @keyframes letterReveal {
          0% {
            transform: translateY(15px) scale(0.95);
            opacity: 0;
          }
          60% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes subtleGlow {
          0%,
          100% {
            box-shadow: 0 0 0px rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.1);
          }
        }

        @keyframes crosswordFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        /* Aplicar animaciones especiales */
        [data-anchor='true'] {
          animation: breathe 2.5s ease-in-out infinite;
        }

        [data-cell]:hover {
          animation: crosswordFloat 1s ease-in-out infinite;
        }

        [data-anchor='false']:hover {
          animation: cellGlow 1.5s ease-in-out infinite;
        }

        /* Animaciones de hover para la sección */
        .about-section-hover {
          transition: transform 0.3s ease-out;
        }

        .about-section-hover:hover {
          transform: translateY(-2px);
        }

        /* Mejoras responsive para dispositivos muy pequeños */
        @media (max-width: 320px) {
          [data-cell] {
            font-size: 0.65rem;
            min-width: 0.75rem;
            min-height: 0.75rem;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        /* Ajustes para teléfonos pequeños */
        @media (max-width: 480px) {
          [data-cell] {
            font-size: 0.7rem;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .crossword-grid {
            gap: 0.1rem 0.1rem;
          }
        }

        /* Ajustes para tablet */
        @media (min-width: 640px) and (max-width: 768px) {
          .grid-crossword {
            gap: 0.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-anchor='true'],
          [data-cell]:hover,
          [data-anchor='false']:hover {
            animation: none;
          }
        }
      `}</style>

      <div
        className={`w-full px-3 xs:px-4 sm:px-6 lg:px-8 pt-12 xs:pt-16 sm:pt-20 pb-12 xs:pb-16 sm:pb-20 space-y-8 xs:space-y-12 sm:space-y-16 about-section-hover ${isHovered ? 'transform translate-y-[-2px]' : ''
          }`}
      >
        {/* Page Header */}
        <header
          className={`text-center transition-all duration-700 will-change-transform ${inView
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95'
            }`}
        >
          <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
            <p className="text-[11px] xs:text-xs sm:text-sm tracking-widest uppercase text-muted-foreground/80 font-medium mb-2 xs:mb-3 sm:mb-4">
              {t('eyebrow')}
            </p>
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {t('heading')}
            </h2>
          </div>
        </header>

        {/* Management + Technology Section */}
        <section
          className={`text-center transition-all duration-600 will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          style={{ transitionDelay: inView ? '200ms' : '0ms' }}
        >
          <div className="w-full space-y-3 xs:space-y-4 sm:space-y-5 text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground/90 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto leading-relaxed">
            <p>{t('intro1')}</p>
            <p>{t('intro2')}</p>
            <p>{t('differential')}</p>
          </div>
        </section>

        {/* Crossword Section */}
        <section
          className={`text-center space-y-8 xs:space-y-12 transition-all duration-600 will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          style={{ transitionDelay: inView ? '400ms' : '0ms' }}
        >
          <div className="px-3 xs:px-4 sm:px-6">
            <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-4 xs:mb-6">
              {t('meaningTitle')}
            </h3>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('meaningDesc')}
            </p>
          </div>

          <div className="flex justify-center px-2">
            <div
              className="relative p-2 xs:p-4"
              aria-label="Crucigrama COPEXIA"
              role="application"
            >
              <div
                className="grid justify-items-center items-center mx-auto crossword-grid"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0.75rem, 2.5rem))`,
                  gridTemplateRows: `repeat(${rows}, minmax(1rem, 2.5rem))`,
                  gap: '0.1rem 0.1rem', // gap reducido para ser más compacto
                  maxWidth: 'fit-content',
                }}
              >
                {Array.from({ length: rows * cols }).map((_, i) => {
                  const r = Math.floor(i / cols) + minY;
                  const c = (i % cols) + minX;
                  const cell = grid[`${c},${r}`];
                  const has = Boolean(cell);
                  const isAnchorCol = c === centerX && has;
                  const item = cell?.letterKey
                    ? infoByLetter[cell.letterKey]
                    : undefined;

                  return (
                    <div
                      key={`${c},${r}`}
                      data-cell
                      data-anchor={isAnchorCol ? 'true' : 'false'}
                      className={getCellClasses(cell, isAnchorCol)}
                      style={{
                        transitionDelay: getAnimationDelay(c, r),
                        animation:
                          inView && isAnchorCol
                            ? 'breathe 2200ms ease-in-out infinite'
                            : undefined,
                      }}
                    >
                      {cell?.ch ?? ''}
                      {has && item && (
                        <div className="pointer-events-none absolute z-10 w-56 xs:w-64 rounded-xl border border-border bg-popover p-2 xs:p-3 shadow-sm opacity-0 translate-y-1 transition-all duration-200 hover:opacity-100 hover:translate-y-0">
                          <div className="flex items-center gap-2">
                            <span className="grid h-5 w-5 xs:h-6 xs:w-6 place-items-center rounded-full bg-primary text-[10px] xs:text-[11px] font-bold text-primary-foreground">
                              {cell!.letterKey}
                            </span>
                            <p className="font-medium text-xs xs:text-sm">
                              {item.title}
                            </p>
                          </div>
                          <p className="mt-1 text-[10px] xs:text-xs text-muted-foreground leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Letter Meanings */}
        <section
          className={`text-center transition-all duration-600 will-change-transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          style={{ transitionDelay: inView ? '600ms' : '0ms' }}
        >
          <header className="mb-6 xs:mb-8 px-2">
            <h4 className="uppercase tracking-widest text-xs xs:text-sm font-bold text-primary/80">
              Significado de cada letra
            </h4>
          </header>

          <div className="grid gap-2 xs:gap-3 sm:gap-4 md:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 w-full px-3 xs:px-4 sm:px-6 lg:px-8">
            {items.map((item, index) => (
              <article
                key={item.k}
                className="group relative"
                style={{
                  animationDelay: inView ? `${800 + index * 150}ms` : '0ms',
                  animation: inView
                    ? 'letterReveal 800ms ease-out forwards'
                    : 'none',
                  opacity: inView ? 1 : 0,
                }}
                aria-label={`${item.k}: ${item.title}`}
              >
                <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 p-2 xs:p-3 sm:p-4 rounded-lg hover:bg-muted/20 transition-all duration-500 hover:shadow-sm border border-transparent hover:border-border/30">
                  <div className="flex-shrink-0 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-xs xs:text-sm sm:text-base font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                    {item.k}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs xs:text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-200 text-left leading-tight">
                      {item.title}
                    </h5>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground leading-relaxed text-left">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
