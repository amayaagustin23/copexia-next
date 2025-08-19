// src/components/about/CopexiaHighlightsBand.tsx
"use client";

import { animate, createSpring } from "animejs";
import type { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Item = {
  id: string;
  title: string;
  desc?: string;
  k?: string; // opcional: inicial (C/O/P/E/X/I/A)
};

type Props = {
  heading?: string;
  items?: Item[];
  delayMs?: number; // autoplay delay
};

const baseOptions: EmblaOptionsType = { loop: true, align: "center" };

export default function CopexiaHighlightsBand({
  heading = "Copexia",
  items,
  delayMs = 3600,
}: Props) {
  // DATA por defecto (enfocado en la empresa)
  const slides = useMemo<Item[]>(
    () =>
      items ?? [
        {
          id: "quienes-somos",
          title: "Gestión + Tecnología + Enfoque humano",
          desc: "Mejora continua y adopción real con prácticas simples, medibles y sostenibles.",
        },
        {
          id: "transformacion",
          title: "Transformación & Cultura",
          desc: "Propósito, liderazgo y procesos alineados para evolucionar con sentido.",
        },
        {
          id: "adopcion",
          title: "Adopción Tecnológica",
          desc: "Soluciones que se usan: onboarding, soporte y métricas de valor.",
        },
        {
          id: "optimizacion",
          title: "Optimización Operativa",
          desc: "Diagnóstico, priorización y mejora continua con foco en el cliente.",
        },
        {
          id: "investigaciones",
          title: "Investigaciones & Learning",
          desc: "Clima, madurez y talleres para desarrollar capacidades internas.",
        },
        // Iniciales COPEXIA (opcional)
        {
          id: "C",
          k: "C",
          title: "Colaboración / Co-creación",
          desc: "Construimos en alianza con tus equipos.",
        },
        {
          id: "O",
          k: "O",
          title: "Organización / Oportunidad",
          desc: "Estructura y aprovechamiento del potencial.",
        },
        {
          id: "P",
          k: "P",
          title: "Personalización / Propósito",
          desc: "Nada genérico: cada proceso es único.",
        },
        {
          id: "E",
          k: "E",
          title: "Estrategia / Evolución",
          desc: "Planes reales, medibles y sostenibles.",
        },
        {
          id: "X",
          k: "X",
          title: "Experiencia / eXcelencia",
          desc: "Cambio con impacto y ambición.",
        },
        {
          id: "I",
          k: "I",
          title: "Innovación",
          desc: "Datos + creatividad para mejores decisiones.",
        },
        {
          id: "A",
          k: "A",
          title: "Acompañamiento / Acción / Autenticidad",
          desc: "Cerca, ejecutando con sentido humano.",
        },
      ],
    [items]
  );

  // Embla + autoplay
  const autoplay = useRef(
    Autoplay({
      delay: delayMs,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );
  const [viewportRef, embla] = useEmblaCarousel(baseOptions, [
    autoplay.current,
  ]);
  const [selected, setSelected] = useState(0);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // micro-animación del slide activo
  const animateActive = useCallback(
    (index: number) => {
      if (prefersReduced) return;
      const card = document.querySelector<HTMLElement>(
        `[data-copecia-slide='${index}'] .card`
      );
      if (!card) return;
      card.style.opacity = "0";
      card.style.transform = "translateY(14px)";
      animate(card, {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 700,
        delay: 30,
        ease: createSpring({ stiffness: 220, damping: 22 }),
      });
    },
    [prefersReduced]
  );

  // on mount / on select
  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      const i = embla.selectedScrollSnap();
      setSelected(i);
      animateActive(i);
    };
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, animateActive]);

  // dots click
  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  return (
    <section aria-label={heading} className="relative w-full">
      {/* Banda celeste estilo PCH */}
      <div className="bg-sky-500 text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
          {/* Encabezado (sin CTA) */}
          <header className="text-center mb-6">
            <p className="text-[11px] tracking-[0.18em] uppercase/relaxed opacity-80">
              Conocenos
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {heading}
            </h3>
          </header>

          {/* Carrusel */}
          <div className="embla">
            <div
              className="embla__viewport overflow-hidden"
              ref={viewportRef}
              aria-roledescription="carousel"
            >
              <div className="embla__container flex">
                {slides.map((s, i) => (
                  <article
                    key={s.id}
                    data-copecia-slide={i}
                    className="embla__slide min-w-0 flex-[0_0_100%] px-2"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} de ${slides.length}`}
                  >
                    <div className="card mx-auto max-w-3xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-6 md:p-8 text-center shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]">
                      {s.k && (
                        <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full border border-white/30 text-sm font-semibold">
                          {s.k}
                        </div>
                      )}
                      <h4 className="text-lg md:text-xl font-medium">
                        {s.title}
                      </h4>
                      {s.desc && (
                        <p className="mt-2 text-sm md:text-base text-white/90">
                          {s.desc}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Dots minimal */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir al slide ${i + 1}`}
                  onClick={() => scrollTo(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-opacity ${
                    i === selected
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* perf: evita layout jank del contenedor */}
      <style jsx global>{`
        .embla__container {
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
