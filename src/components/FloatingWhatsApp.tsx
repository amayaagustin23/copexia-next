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

  const messageToSend =
    selected === 'otro' ? customMsg.trim() : PRESETS[selected];

  const href = useMemo(
    () =>
      `https://wa.me/${phone}?text=${encodeURIComponent(messageToSend || '')}`,
    [messageToSend, phone]
  );

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // pop-in del botón
  useEffect(() => {
    if (prefersReduced || !btnRef.current) return;
    const el = btnRef.current;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.8)';
    animate(el, {
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 520,
      ease: spring({ stiffness: 210, damping: 20 }),
    });
  }, [prefersReduced]);

  // abrir/cerrar con animación (y desmontaje al terminar salida)
  useEffect(() => {
    if (open && !render) {
      setRender(true);
      return;
    }
    if (!panelRef.current || prefersReduced) return;

    const el = panelRef.current;
    if (open) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      animate(el, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 380,
        ease: spring({ stiffness: 240, damping: 22 }),
      });
    } else {
      animate(el, {
        opacity: [1, 0],
        translateY: [0, 12],
        duration: 280,
        easing: 'easeInOutQuad',
        complete: () => setRender(false),
      });
    }
  }, [open, render, prefersReduced]);

  const handleMouseEnter = () => {
    if (prefersReduced || !btnRef.current) return;
    animate(btnRef.current!, {
      scale: [1, 1.06, 1],
      duration: 260,
      ease: spring({ stiffness: 300, damping: 18 }),
    });
  };

  const canSend = Boolean(messageToSend);

  return (
    <div
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
                    onClick={() => setSelected(i)}
                    className={`rounded-full px-3 py-1.5 text-sm transition border ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'
                    }`}
                  >
                    {text}
                  </button>
                );
              })}

              {/* Otro */}
              <button
                type="button"
                onClick={() => setSelected('otro')}
                className={`rounded-full px-3 py-1.5 text-sm transition border ${
                  selected === 'otro'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted border-border text-foreground/80 hover:bg-muted/80'
                }`}
              >
                {t('other')}
              </button>
            </div>
          </div>

          {/* Campo libre (Otro) */}
          {selected === 'otro' && (
            <div className="px-3">
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={t('placeholder')}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-input p-3 text-base outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                maxLength={1000}
              />
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {customMsg.length}/1000
              </div>
            </div>
          )}

          <div className="mt-2 flex items-center justify-between p-3 border-t border-border">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-sm rounded-lg bg-muted text-foreground/80 hover:bg-muted/80"
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
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                canSend
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
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
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto flex h-[50px] w-[50px] items-center justify-center rounded-full shadow-lg bg-transparent"
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
          className="object-contain"
          priority
        />
      </button>
    </div>
  );
}
