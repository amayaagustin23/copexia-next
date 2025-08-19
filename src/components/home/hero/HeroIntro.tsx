"use client";
import { ArrowRight } from "lucide-react";

const HeroIntro = () => {
  const bg = "/images/hero-bg.jpg";

  return (
    <div className="relative w-full overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
        <h1
          className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl"
          data-animate
        >
          Impulsá tu organización con soluciones claras, humanas y tecnológicas
        </h1>
        <p
          className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl"
          data-animate
        >
          Diagnóstico honesto, implementación simple y resultados sostenibles.
          Sin humo.
        </p>
        <div className="mt-8 flex items-center gap-3" data-animate>
          <a
            href="#servicios"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm md:text-base font-medium shadow hover:shadow-md transition border bg-primary text-primary-foreground"
          >
            Ver servicios <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#learning"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm md:text-base font-medium border"
          >
            Programas de formación
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroIntro;
