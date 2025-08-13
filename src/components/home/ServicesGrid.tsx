"use client";

import TiltCard from "@/components/anim/TiltCard";
import { flipInX, stagger } from "@/components/anim/motion";
import type { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";

type Rutas = ReturnType<
  typeof import("@/lib/hooks/useLocalizedPaths").useLocalizedPaths
>;

type Props = { rutas: Rutas };

type ServiceKey =
  | "transformacion"
  | "adopcion"
  | "optimizacion"
  | "investigaciones";

const SERVICES: { id: string; key: ServiceKey }[] = [
  { id: "servicios-transformacion", key: "transformacion" },
  { id: "servicios-adopcion", key: "adopcion" },
  { id: "servicios-optimizacion", key: "optimizacion" },
  { id: "servicios-investigaciones", key: "investigaciones" },
];

const baseOptions: EmblaOptionsType = {
  loop: true,
  align: "start",
  dragFree: false,
  skipSnaps: false,
};

const ServicesCarousel = ({ rutas }: Props) => {
  const t = useTranslations("Services");
  const autoplayRef = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: false })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(baseOptions, [
    autoplayRef.current,
  ]);

  // Reinicia autoplay al soltar el arrastre manual
  const onPointerUp = useCallback(() => {
    autoplayRef.current.reset();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("pointerUp", onPointerUp);
    return () => {
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi, onPointerUp]);

  return (
    <motion.div variants={stagger(0.06)} initial="hidden" animate="show">
      {/* Wrapper del carrusel */}
      <div className="embla" ref={emblaRef}>
        {/* Viewport */}
        <div className="embla__viewport overflow-hidden">
          {/* Track */}
          <div className="embla__container flex touch-pan-y select-none">
            {SERVICES.map((s, idx) => {
              const title = t(`items.${s.key}.title`);
              const desc = t(`items.${s.key}.desc`);
              const href = (rutas.sub.servicios as any)?.[s.key] ?? `#${s.id}`;

              return (
                <div
                  key={s.id}
                  className="embla__slide basis-full sm:basis-1/2 lg:basis-1/3 min-w-0 pr-4"
                  aria-roledescription="slide"
                >
                  <TiltCard className="p-6 h-full" glow>
                    <motion.article
                      id={s.id}
                      aria-label={title}
                      variants={flipInX}
                      transition={{ delay: idx * 0.03 }}
                      className="h-full flex flex-col"
                    >
                      <h3 className="text-xl font-semibold mb-2">{title}</h3>
                      <p className="text-muted-foreground flex-1">{desc}</p>
                      <a
                        href={href}
                        className="mt-4 inline-flex text-primary hover:opacity-80"
                      >
                        {t("cta")}
                      </a>
                    </motion.article>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Estilos mínimos para spacing del carrusel */}
      <style jsx>{`
        .embla__container {
          will-change: transform;
        }
      `}</style>
    </motion.div>
  );
};

export default ServicesCarousel;
