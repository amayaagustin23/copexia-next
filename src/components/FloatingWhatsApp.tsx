"use client";

import { animate, spring } from 'animejs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type PresetKey = number | 'otro';

type Props = {
  phone?: string; // por defecto toma el de env
};

export default function FloatingWhatsApp({
  phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '543813571707',
}: Props) {
  const t = useTranslations('whatsapp');

  // presets desde i18n
  const PRESETS = [
    t('presets.info'),
    t('presets.meeting'),
    t('presets.proposal'),
    t('presets.training'),
    t('presets.adoptionConsult'),
  ] as const;

  const [open, setOpen] = useState(false); // estado lógico
  const [render, setRender] = useState(false); // controla montaje para animar salida
  const [selected, setSelected] = useState<PresetKey>(0);
  const [customMsg, setCustomMsg] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  const messageToSend =
    selected === 'otro' ? customMsg.trim() : PRESETS[selected];

  const href = useMemo(
    () =>
      `https://wa.me/${phone}?text=${encodeURIComponent(messageToSend || '')}`,
    [messageToSend, phone]
  );

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // pop-in del botón con animación mejorada
  useEffect(() => {
    if (prefersReduced || !btnRef.current) return;
    const el = btnRef.current;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.8) rotate(-10deg)';
    animate(el, {
      opacity: [0, 1],
      scale: [0.8, 1.1, 1],
      rotate: [-10, 5, 0],
      duration: 800,
      ease: spring({ stiffness: 180, damping: 15 }),
    });
  }, [prefersReduced]);

  // Animación de pulso periódica
  useEffect(() => {
    if (prefersReduced || open || !showPulse) return;

    const pulseInterval = setInterval(() => {
      if (btnRef.current && !open) {
        animate(btnRef.current, {
          scale: [1, 1.15, 1],
          duration: 1200,
          ease: 'easeInOutSine',
        });
      }
    }, 3000);

    return () => clearInterval(pulseInterval);
  }, [prefersReduced, open, showPulse]);

  // abrir/cerrar con animación mejorada (y desmontaje al terminar salida)
  useEffect(() => {
    if (open && !render) {
      setRender(true);
      setShowPulse(false); // Detener pulso cuando se abre
      return;
    }
    if (!panelRef.current || prefersReduced) return;

    const el = panelRef.current;
    if (open) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px) scale(0.95)';
      el.style.filter = 'blur(4px)';
      animate(el, {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.95, 1.02, 1],
        filter: ['blur(4px)', 'blur(0px)'],
        duration: 500,
        ease: spring({ stiffness: 200, damping: 20 }),
      });
    } else {
      animate(el, {
        opacity: [1, 0],
        translateY: [0, 20],
        scale: [1, 0.95],
        filter: ['blur(0px)', 'blur(2px)'],
        duration: 300,
        easing: 'easeInOutQuad',
        complete: () => {
          setRender(false);
          setShowPulse(true); // Reanudar pulso cuando se cierra
        },
      });
    }
  }, [open, render, prefersReduced]);

  const handleMouseEnter = () => {
    if (prefersReduced || !btnRef.current) return;
    setIsHovered(true);
    setShowPulse(false); // Detener pulso en hover
    animate(btnRef.current!, {
      scale: [1, 1.15, 1.1],
      rotate: [0, 5, -5, 0],
      duration: 400,
      ease: spring({ stiffness: 400, damping: 20 }),
    });
  };

  const handleMouseLeave = () => {
    if (prefersReduced || !btnRef.current) return;
    setIsHovered(false);
    if (!open) {
      setShowPulse(true); // Reanudar pulso si no está abierto
    }
    animate(btnRef.current!, {
      scale: [1.1, 1],
      rotate: [0],
      duration: 200,
      ease: 'easeOutQuad',
    });
  };

  const canSend = Boolean(messageToSend);

  // Cerrar panel al hacer click fuera con animación
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        open
      ) {
        // Animación de cierre al hacer click fuera
        if (!prefersReduced && panelRef.current && btnRef.current) {
          const panelEl = panelRef.current;
          const btnEl = btnRef.current;

          // Animación del panel
          animate(panelEl, {
            opacity: [1, 0],
            translateY: [0, 20],
            scale: [1, 0.95],
            filter: ['blur(0px)', 'blur(2px)'],
            duration: 250,
            easing: 'easeInOutQuad',
            complete: () => {
              setOpen(false);
            },
          });

          // Animación sutil del botón para feedback visual
          animate(btnEl, {
            scale: [1, 0.95, 1],
            duration: 200,
            easing: 'easeOutQuad',
          });
        } else {
          setOpen(false);
        }
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, prefersReduced]);

  return (
    <div
      id="whatsapp-widget"
      ref={containerRef}
      className="fixed bottom-6 right-6 flex flex-col items-end max-h-[100vh] overflow-visible pointer-events-none"
      style={{
        zIndex: 2147483647,
        isolation: 'isolate',
        position: 'fixed',
      }}
    >
      {/* Panel */}
      {render && (
        <div
          ref={panelRef}
          className="pointer-events-auto mb-3 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-border bg-card text-card-foreground shadow-lg max-h-[calc(100vh-8rem)] overflow-y-auto"
          style={{
            position: 'relative',
            zIndex: 2147483647,
          }}
        >
          {/* Presets */}
          <div className="p-3">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {t('chooseMessage')}
            </p>

            <div className="flex flex-wrap gap-2">
              {PRESETS.map((text, i) => {
                const active = selected === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelected(i);
                      // Animación de selección
                      if (!prefersReduced) {
                        const btn = document.querySelector(
                          `[data-preset="${i}"]`
                        ) as HTMLElement;
                        if (btn) {
                          animate(btn, {
                            scale: [1, 1.1, 1],
                            duration: 200,
                            ease: 'easeOutQuad',
                          });
                        }
                      }
                    }}
                    data-preset={i}
                    className={`rounded-full px-3 py-1.5 text-sm transition-all duration-200 border transform cursor-pointer ${active
                        ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                        : 'bg-muted border-border text-foreground/80 hover:bg-muted/80 hover:scale-105 hover:shadow-sm'
                      }`}
                  >
                    {text}
                  </button>
                );
              })}

              {/* Otro */}
              <button
                type="button"
                onClick={() => {
                  setSelected('otro');
                  // Animación de selección
                  if (!prefersReduced) {
                    const btn = document.querySelector(
                      '[data-preset="otro"]'
                    ) as HTMLElement;
                    if (btn) {
                      animate(btn, {
                        scale: [1, 1.1, 1],
                        duration: 200,
                        ease: 'easeOutQuad',
                      });
                    }
                  }
                }}
                data-preset="otro"
                className={`rounded-full px-3 py-1.5 text-sm transition-all duration-200 border transform cursor-pointer ${selected === 'otro'
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-muted border-border text-foreground/80 hover:bg-muted/80 hover:scale-105 hover:shadow-sm'
                  }`}
              >
                {t('other')}
              </button>
            </div>
          </div>

          {/* Campo libre (Otro) */}
          {selected === 'otro' && (
            <div
              className="px-3 animate-in slide-in-from-top-2 duration-300"
              style={{
                animation: prefersReduced
                  ? 'none'
                  : 'slideInFromTop 0.3s ease-out',
              }}
            >
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={t('placeholder')}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-input p-3 text-base outline-none focus:ring-2 focus:ring-ring transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                rows={4}
                maxLength={1000}
              />
              <div className="mt-1 text-right text-xs text-muted-foreground transition-colors duration-200">
                <span
                  className={customMsg.length > 900 ? 'text-orange-500' : ''}
                >
                  {customMsg.length}/1000
                </span>
              </div>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between p-3 border-t border-border">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-sm rounded-lg bg-muted text-foreground/80 hover:bg-muted/80 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t('cancel')}
            </button>

            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!canSend) return;
                setOpen(false);
                // Animación de envío
                if (!prefersReduced) {
                  const btn = document.querySelector(
                    '[data-send-btn]'
                  ) as HTMLElement;
                  if (btn) {
                    animate(btn, {
                      scale: [1, 1.1, 1],
                      duration: 200,
                      ease: 'easeOutQuad',
                    });
                  }
                }
              }}
              data-send-btn
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 transform ${canSend
                  ? 'bg-primary text-primary-foreground hover:opacity-90 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              aria-disabled={!canSend}
            >
              {t('send')}
            </Link>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          setOpen((v) => !v);
          // Animación de click
          if (!prefersReduced && btnRef.current) {
            animate(btnRef.current, {
              scale: [1, 0.9, 1.1, 1],
              duration: 300,
              ease: 'easeOutQuad',
            });
          }
        }}
        className={`pointer-events-auto flex h-[50px] w-[50px] items-center justify-center rounded-full shadow-lg bg-transparent transition-all duration-300 cursor-pointer ${isHovered
            ? 'shadow-xl shadow-green-500/40 drop-shadow-[0_-6px_16px_rgba(34,197,94,0.4)] drop-shadow-[0_0_20px_rgba(34,197,94,0.2)]'
            : 'shadow-lg'
          } ${open ? 'rotate-12' : ''}`}
        aria-label={t('ariaOpen')}
        style={{
          position: 'relative',
          zIndex: 2147483647,
        }}
      >
        <Image
          src="/images/whatsapp.svg"
          alt="WhatsApp"
          width={50}
          height={50}
          className={`object-contain transition-all duration-300 ${isHovered
              ? 'brightness-110 drop-shadow-[0_-2px_8px_rgba(255,255,255,0.6)]'
              : ''
            }`}
          priority
        />
      </button>
    </div>
  );
}
